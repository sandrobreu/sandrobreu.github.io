from __future__ import annotations

import hashlib
import json
import os
import re
from pathlib import Path
from typing import Any
from urllib.parse import urljoin, urlparse

import requests
from dateutil import parser as date_parser
from playwright.sync_api import BrowserContext, Page, sync_playwright

NEWSLETTER_URL = os.getenv(
    "LINKEDIN_NEWSLETTER_URL",
    "https://www.linkedin.com/newsletters/7113976045355048961/",
)
MAX_POSTS = 6
MAX_CANDIDATES = 18
DATA_FILE = Path("data/newsletter.json")
COVERS_DIR = Path("img/blog")
USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/131.0.0.0 Safari/537.36"
)


def normalize_article_url(href: str | None) -> str | None:
    if not href:
        return None

    absolute = urljoin("https://www.linkedin.com", href.replace("\\/", "/"))
    parsed = urlparse(absolute)
    if "linkedin.com" not in parsed.netloc.lower() or "/pulse/" not in parsed.path:
        return None

    path = parsed.path.rstrip("/")
    return f"https://www.linkedin.com{path}"


def load_previous() -> dict[str, dict[str, Any]]:
    if not DATA_FILE.exists():
        return {}

    try:
        posts = json.loads(DATA_FILE.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return {}

    previous: dict[str, dict[str, Any]] = {}
    for post in posts if isinstance(posts, list) else []:
        if not isinstance(post, dict):
            continue
        url = normalize_article_url(str(post.get("url", "")))
        if url:
            previous[url] = post
    return previous


def discover_article_urls(page: Page) -> list[str]:
    print(f"Opening newsletter page: {NEWSLETTER_URL}")
    response = page.goto(NEWSLETTER_URL, wait_until="domcontentloaded", timeout=60_000)
    if response:
        print(f"Newsletter HTTP status: {response.status}")

    page.wait_for_timeout(3_000)

    for _ in range(5):
        page.evaluate("window.scrollBy(0, Math.max(window.innerHeight * 1.5, 1200))")
        page.wait_for_timeout(900)

    hrefs = page.eval_on_selector_all(
        "a[href]",
        "els => els.map(a => a.href).filter(Boolean)",
    )

    html = page.content().replace("\\u002F", "/").replace("\\/", "/")
    embedded = re.findall(
        r"https?://(?:www\.)?linkedin\.com/pulse/[^\"'<>\\s]+",
        html,
        flags=re.IGNORECASE,
    )

    seen: set[str] = set()
    result: list[str] = []
    for href in [*hrefs, *embedded]:
        url = normalize_article_url(href)
        if not url or url in seen:
            continue
        seen.add(url)
        result.append(url)
        if len(result) >= MAX_CANDIDATES:
            break

    print(f"Discovered {len(result)} LinkedIn article candidates")
    return result


def first_meta(page: Page, selectors: list[str]) -> str | None:
    for selector in selectors:
        locator = page.locator(selector).first
        try:
            if locator.count() == 0:
                continue
            value = locator.get_attribute("content")
            if value and value.strip():
                return value.strip()
        except Exception:
            continue
    return None


def walk_json_for_key(value: Any, key: str) -> str | None:
    if isinstance(value, dict):
        candidate = value.get(key)
        if isinstance(candidate, str) and candidate.strip():
            return candidate.strip()
        if isinstance(candidate, list) and candidate:
            first = candidate[0]
            if isinstance(first, str) and first.strip():
                return first.strip()
        for nested in value.values():
            found = walk_json_for_key(nested, key)
            if found:
                return found
    elif isinstance(value, list):
        for nested in value:
            found = walk_json_for_key(nested, key)
            if found:
                return found
    return None


def json_ld_value(page: Page, key: str) -> str | None:
    try:
        blocks = page.locator('script[type="application/ld+json"]').all_text_contents()
    except Exception:
        return None

    for block in blocks:
        try:
            payload = json.loads(block)
        except json.JSONDecodeError:
            continue
        found = walk_json_for_key(payload, key)
        if found:
            return found
    return None


def parse_date(value: str | None) -> str | None:
    if not value:
        return None
    try:
        parsed = date_parser.parse(value, fuzzy=True)
        return parsed.date().isoformat()
    except (ValueError, TypeError, OverflowError):
        return None


def published_date(page: Page, previous: dict[str, Any] | None) -> str | None:
    candidate = first_meta(
        page,
        [
            'meta[property="article:published_time"]',
            'meta[name="article:published_time"]',
            'meta[itemprop="datePublished"]',
            'meta[name="date"]',
            'meta[name="publish-date"]',
        ],
    )
    result = parse_date(candidate)
    if result:
        return result

    result = parse_date(json_ld_value(page, "datePublished"))
    if result:
        return result

    try:
        for value in page.locator("time[datetime]").evaluate_all(
            "els => els.map(el => el.getAttribute('datetime')).filter(Boolean)"
        ):
            result = parse_date(value)
            if result:
                return result
    except Exception:
        pass

    try:
        body_text = page.locator("body").inner_text(timeout=5_000)
        match = re.search(
            r"Published\s+([A-Za-z]{3,9}\s+\d{1,2},\s+\d{4})",
            body_text,
            flags=re.IGNORECASE,
        )
        if match:
            result = parse_date(match.group(1))
            if result:
                return result
    except Exception:
        pass

    if previous:
        return parse_date(str(previous.get("published", "")))
    return None


def clean_title(title: str | None) -> str | None:
    if not title:
        return None
    value = re.sub(r"\s+\|\s+LinkedIn\s*$", "", title.strip(), flags=re.IGNORECASE)
    return value or None


def extension_for_content_type(content_type: str) -> str:
    content_type = content_type.lower().split(";", 1)[0].strip()
    return {
        "image/jpeg": ".jpg",
        "image/jpg": ".jpg",
        "image/png": ".png",
        "image/webp": ".webp",
        "image/gif": ".gif",
    }.get(content_type, ".jpg")


def local_cover_path(article_url: str, image_url: str, previous_image: str | None) -> str:
    if previous_image and previous_image.startswith("img/blog/"):
        existing = Path(previous_image)
        if existing.exists():
            return previous_image

    digest = hashlib.sha1(article_url.encode("utf-8")).hexdigest()[:14]
    headers = {
        "User-Agent": USER_AGENT,
        "Referer": "https://www.linkedin.com/",
        "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
    }

    try:
        response = requests.get(image_url, headers=headers, timeout=30)
        response.raise_for_status()
        content_type = response.headers.get("content-type", "")
        if not content_type.lower().startswith("image/"):
            raise ValueError(f"Unexpected content type: {content_type}")

        COVERS_DIR.mkdir(parents=True, exist_ok=True)
        destination = COVERS_DIR / f"linkedin-{digest}{extension_for_content_type(content_type)}"
        destination.write_bytes(response.content)
        print(f"Saved cover: {destination}")
        return destination.as_posix()
    except Exception as exc:
        print(f"Could not cache cover for {article_url}: {exc}")
        return image_url


def previous_post_fallback(article_url: str, previous: dict[str, Any] | None) -> dict[str, str] | None:
    if not previous:
        return None

    title = clean_title(str(previous.get("title", "")))
    published = parse_date(str(previous.get("published", "")))
    image = str(previous.get("image", "")).strip()
    if not title or not published or not image:
        return None

    print(f"Using cached metadata for rate-limited article: {article_url}")
    return {
        "title": title,
        "published": published,
        "url": article_url,
        "image": image,
    }


def scrape_article(
    context: BrowserContext,
    article_url: str,
    previous: dict[str, Any] | None,
) -> dict[str, str] | None:
    page = context.new_page()
    try:
        response = page.goto(article_url, wait_until="domcontentloaded", timeout=60_000)
        if response:
            print(f"Article HTTP {response.status}: {article_url}")
            if response.status == 429:
                return previous_post_fallback(article_url, previous)
        page.wait_for_timeout(1_500)

        title = clean_title(
            first_meta(
                page,
                [
                    'meta[property="og:title"]',
                    'meta[name="twitter:title"]',
                ],
            )
        )
        if not title:
            try:
                title = clean_title(page.locator("h1").first.inner_text(timeout=5_000))
            except Exception:
                title = None

        image_url = first_meta(
            page,
            [
                'meta[property="og:image"]',
                'meta[name="twitter:image"]',
            ],
        ) or json_ld_value(page, "image")
        published = published_date(page, previous)

        if not title or not image_url or not published:
            fallback = previous_post_fallback(article_url, previous)
            if fallback:
                return fallback
            print(
                "Skipping incomplete article metadata:",
                {"url": article_url, "title": bool(title), "image": bool(image_url), "published": published},
            )
            return None

        previous_image = str(previous.get("image", "")) if previous else None
        image = local_cover_path(article_url, image_url, previous_image)
        return {
            "title": title,
            "published": published,
            "url": article_url,
            "image": image,
        }
    except Exception as exc:
        fallback = previous_post_fallback(article_url, previous)
        if fallback:
            return fallback
        print(f"Failed to scrape article {article_url}: {exc}")
        return None
    finally:
        page.close()


def remove_unused_cached_covers(posts: list[dict[str, str]]) -> None:
    if not COVERS_DIR.exists():
        return
    used = {post["image"] for post in posts if post.get("image", "").startswith("img/blog/")}
    for path in COVERS_DIR.glob("linkedin-*"):
        if path.as_posix() not in used:
            path.unlink(missing_ok=True)
            print(f"Removed old cached cover: {path}")


def main() -> None:
    previous = load_previous()

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(
            headless=True,
            args=["--disable-blink-features=AutomationControlled"],
        )
        context = browser.new_context(
            user_agent=USER_AGENT,
            viewport={"width": 1440, "height": 1200},
            locale="en-US",
            timezone_id="Europe/Zurich",
        )
        context.set_extra_http_headers({"Accept-Language": "en-US,en;q=0.9,de;q=0.8"})

        discovery_page = context.new_page()
        candidates = discover_article_urls(discovery_page)
        discovery_page.close()

        if len(candidates) < MAX_POSTS:
            browser.close()
            raise RuntimeError(
                f"LinkedIn returned only {len(candidates)} article URLs; refusing to overwrite existing newsletter data."
            )

        posts: list[dict[str, str]] = []
        for article_url in candidates:
            post = scrape_article(context, article_url, previous.get(article_url))
            if post:
                posts.append(post)
            if len(posts) >= MAX_POSTS:
                break

        browser.close()

    if len(posts) < MAX_POSTS:
        raise RuntimeError(
            f"Only {len(posts)} complete newsletter articles could be scraped; existing data remains untouched."
        )

    posts.sort(key=lambda post: post["published"], reverse=True)
    posts = posts[:MAX_POSTS]

    DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
    DATA_FILE.write_text(
        json.dumps(posts, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    remove_unused_cached_covers(posts)

    print("Latest newsletter editions:")
    for post in posts:
        print(f"- {post['published']} | {post['title']} | {post['url']}")


if __name__ == "__main__":
    main()
