from __future__ import annotations

import json
import re
from pathlib import Path

from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "index.html"
MAIN_JS = ROOT / "js" / "main.js"
MAIN_CSS = ROOT / "css" / "main.css"


def fragment(html: str):
    return BeautifulSoup(html, "html.parser")


def replace_inner(tag, html: str) -> None:
    tag.clear()
    frag = fragment(html)
    for child in list(frag.contents):
        tag.append(child)


def set_meta(soup: BeautifulSoup, *, name: str | None = None, prop: str | None = None, content: str) -> None:
    selector = {"name": name} if name else {"property": prop}
    tag = soup.head.find("meta", attrs=selector)
    if tag is None:
        tag = soup.new_tag("meta")
        if name:
            tag["name"] = name
        else:
            tag["property"] = prop
        soup.head.append(tag)
    tag["content"] = content


def set_link(soup: BeautifulSoup, rel: str, href: str) -> None:
    tag = soup.head.find("link", rel=rel)
    if tag is None:
        tag = soup.new_tag("link", rel=rel)
        soup.head.append(tag)
    tag["href"] = href


def class_has(*wanted: str):
    wanted_set = set(wanted)

    def matcher(value):
        if not value:
            return False
        values = value if isinstance(value, list) else str(value).split()
        return wanted_set.issubset(set(values))

    return matcher


def update_index() -> None:
    soup = BeautifulSoup(INDEX.read_text(encoding="utf-8"), "html.parser")

    # SEO and accessibility baseline.
    soup.html["lang"] = "en"
    viewport = soup.head.find("meta", attrs={"name": "viewport"})
    if viewport:
        viewport["content"] = "width=device-width, initial-scale=1"

    soup.title.string = "Sandro Breu | Digital Transformation, Data Engineering & AI"
    description = (
        "Portfolio of Sandro Breu, Digital Transformation & Data Engineer focused on "
        "data engineering, data platforms, AI, MLOps and financial technology."
    )
    set_meta(soup, name="description", content=description)
    set_meta(
        soup,
        name="keywords",
        content="Sandro Breu, Data Engineer, Digital Transformation, Data Engineering, Data Science, AI, MLOps, Data Platforms, Finance, Switzerland, Liechtenstein",
    )
    set_meta(soup, name="author", content="Sandro Breu")
    set_meta(soup, name="robots", content="index, follow, max-image-preview:large")
    set_meta(soup, name="theme-color", content="#222222")
    set_meta(soup, prop="og:type", content="website")
    set_meta(soup, prop="og:url", content="https://sandrobreu.github.io/")
    set_meta(soup, prop="og:title", content="Sandro Breu | Digital Transformation, Data Engineering & AI")
    set_meta(soup, prop="og:description", content=description)
    set_meta(soup, prop="og:image", content="https://sandrobreu.github.io/img/main_photo.webp")
    set_meta(soup, prop="og:image:alt", content="Sandro Breu")
    set_meta(soup, prop="og:locale", content="en_GB")
    set_meta(soup, name="twitter:card", content="summary_large_image")
    set_meta(soup, name="twitter:title", content="Sandro Breu | Digital Transformation, Data Engineering & AI")
    set_meta(soup, name="twitter:description", content=description)
    set_meta(soup, name="twitter:image", content="https://sandrobreu.github.io/img/main_photo.webp")
    set_link(soup, "canonical", "https://sandrobreu.github.io/")

    # Structured data.
    for old in soup.head.find_all("script", attrs={"type": "application/ld+json"}):
        old.decompose()
    structured = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Sandro Breu",
        "url": "https://sandrobreu.github.io/",
        "image": "https://sandrobreu.github.io/img/main_photo.webp",
        "jobTitle": "Digital Transformation & Data Engineer",
        "sameAs": [
            "https://www.linkedin.com/in/breusandro/",
            "https://github.com/sandrobreu",
        ],
        "alumniOf": {
            "@type": "CollegeOrUniversity",
            "name": "ZHAW School of Engineering",
        },
        "knowsAbout": [
            "Data Engineering",
            "Data Platforms",
            "Digital Transformation",
            "Artificial Intelligence",
            "MLOps",
            "Machine Learning",
            "Financial Technology",
        ],
    }
    ld = soup.new_tag("script", type="application/ld+json")
    ld.string = json.dumps(structured, ensure_ascii=False)
    soup.head.append(ld)

    # Header profile and positioning.
    photo = soup.select_one(".header-photo")
    if photo:
        replace_inner(
            photo,
            '<picture><source srcset="img/main_photo.webp" type="image/webp"><img src="img/main_photo.png" alt="Sandro Breu" width="180" height="180"></picture>',
        )

    header_titles = soup.select_one(".header-titles")
    if header_titles:
        replace_inner(
            header_titles,
            '<h2>Sandro Breu</h2><h4>Digital Transformation &amp; Data Engineer</h4><h4>Data Engineering · AI · MLOps</h4>',
        )

    for buttons in soup.select(".header-buttons"):
        buttons.decompose()

    social = soup.select_one(".social-links")
    if social and not soup.select_one(".language-toggle"):
        toggle = fragment(
            '<div class="language-toggle" aria-label="Language / Sprache">'
            '<button type="button" data-lang="de" aria-pressed="false">DE</button>'
            '<span aria-hidden="true">/</span>'
            '<button type="button" data-lang="en" aria-pressed="true">EN</button>'
            '</div>'
        ).div
        social.insert_after(toggle)

    # Home copy and optimized media source.
    home = soup.select_one('section[data-id="home"]')
    if home:
        rotation = home.select_one(".text-rotation")
        if rotation:
            replace_inner(
                rotation,
                '<div class="item"><div class="sp-subtitle">Digital Transformation</div></div>'
                '<div class="item"><div class="sp-subtitle">Data Engineering</div></div>'
                '<div class="item"><div class="sp-subtitle">AI &amp; MLOps</div></div>',
            )
        video = home.find("video")
        if video:
            video["preload"] = "metadata"
            video["poster"] = "img/main_bg.png"
            video.clear()
            source = soup.new_tag("source", src="img/background_video.webm", type="video/webm")
            video.append(source)

    # About Me.
    about = soup.select_one('section[data-id="about-me"]')
    if about:
        paragraph = about.select_one(".col-xs-12.col-sm-7 > p")
        if paragraph:
            paragraph["id"] = "about-summary"
            paragraph.string = (
                "I work at the intersection of digital transformation, data engineering and applied AI, "
                "with a strong background in banking and finance. I focus on turning business requirements "
                "into pragmatic data products, automation and AI-enabled solutions. In 2026, I completed the "
                "MAS in Data Science at ZHAW School of Engineering, strengthening my expertise in data platforms, "
                "MLOps, machine learning and generative AI."
            )

        for li in about.select(".info-list li"):
            title = li.select_one(".title")
            value = li.select_one(".value")
            if not title or not value:
                continue
            key = title.get_text(" ", strip=True).lower()
            if key == "age":
                title["id"] = "label-age"
            elif key == "residence":
                title["id"] = "label-residence"
            elif key == "languages":
                title["id"] = "label-languages"
                value["id"] = "value-languages"

        services_start = about.find(string=lambda s: isinstance(s, str) and "Services" in s and "End" not in s)
        services_end = about.find(string=lambda s: isinstance(s, str) and "End of Services" in s)
        if services_start and services_end:
            start_comment = services_start.parent if getattr(services_start, "parent", None) else services_start
            # Remove siblings between the comments, preserving the comments themselves.
            current = services_start.next_element
            while current and current is not services_end:
                nxt = current.next_element
                current = nxt

        # Replace the complete service area by locating its first/last row around the block title.
        what_h3 = next((h for h in about.find_all("h3") if "What" in h.get_text()), None)
        if what_h3:
            first_row = what_h3.find_parent("div", class_="row")
            rows = []
            if first_row:
                rows.append(first_row)
                nxt = first_row.find_next_sibling()
                while nxt:
                    if getattr(nxt, "name", None) == "div" and "row" in (nxt.get("class") or []):
                        rows.append(nxt)
                        break
                    nxt = nxt.find_next_sibling()
            if rows:
                replacement = fragment(
                    '<div class="row"><div class="col-xs-12 col-sm-12"><div class="block-title">'
                    '<h3 id="what-i-do-title">What <span>I Do</span></h3></div></div></div>'
                    '<div class="row">'
                    '<div class="col-xs-12 col-sm-6"><div class="col-inner"><div class="info-list-w-icon">'
                    '<div class="info-block-w-icon"><div class="ci-icon"><i class="lnr lnr-database"></i></div>'
                    '<div class="ci-text"><h4 id="transformation-title">Digital Transformation &amp; Data Engineering</h4>'
                    '<p id="transformation-text">I design and build reliable data pipelines, models and automation solutions that connect business requirements with modern data platforms and scalable engineering practices.</p></div></div>'
                    '<div class="info-block-w-icon"><div class="ci-icon"><i class="lnr lnr-chart-bars"></i></div>'
                    '<div class="ci-text"><h4 id="ai-title">Data Science, AI &amp; MLOps</h4>'
                    '<p id="ai-text">I develop pragmatic machine learning and AI solutions, with a focus on reproducibility, MLOps, generative AI, RAG and the operational integration of models into real-world processes.</p></div></div>'
                    '</div></div></div>'
                    '<div class="col-xs-12 col-sm-6"><div class="col-inner"><div class="info-list-w-icon">'
                    '<div class="info-block-w-icon"><div class="ci-icon"><i class="lnr lnr-pencil"></i></div>'
                    '<div class="ci-text"><h4 id="leisure-title">Leisure</h4>'
                    '<p id="leisure-text">In my free time, I enjoy being outdoors, hiking in the mountains and swimming in the lake. I also like reading technical books on data engineering, AI, MLOps and technology.</p></div></div>'
                    '</div></div></div></div>'
                )
                first_row.insert_before(*list(replacement.contents))
                for row in rows:
                    row.decompose()

    # Resume content.
    resume = soup.select_one('section[data-id="resume"]')
    if resume:
        block_titles = resume.select(".block-title h3")
        for title in block_titles:
            text = title.get_text(" ", strip=True)
            if text == "Education":
                title["id"] = "education-title"
            elif text == "Experience":
                title["id"] = "experience-title"

        timelines = resume.select(".timeline.timeline-second-style")
        if timelines:
            education = timelines[0]
            first_item = education.select_one(".timeline-item")
            if first_item:
                period = first_item.select_one(".item-period")
                desc = first_item.select_one(".right-part p")
                if period:
                    period.string = "Sep 2023 – May 2026"
                if desc:
                    desc["id"] = "mas-description"
                    desc.string = "Advanced studies in data engineering, data science, machine learning and MLOps."
        if len(timelines) > 1:
            experience = timelines[1]
            replace_inner(
                experience,
                '''
<div class="timeline-item clearfix">
  <div class="left-part"><h5 class="item-period">Sep 2026 – Present</h5><span class="item-company"><a href="https://www.unifinanz.li/de/" target="_blank" rel="noopener noreferrer">Unifinanz Trust reg.</a></span><span class="item-company">Schaan, Liechtenstein</span></div>
  <div class="divider"></div><div class="right-part"><h4 class="item-title">Digital Transformation &amp; Data Engineer</h4><p id="unifinanz-description">Working on digital transformation and data engineering initiatives, connecting business requirements with modern data, automation and AI solutions.</p></div>
</div>
<div class="timeline-item clearfix">
  <div class="left-part"><h5 class="item-period">Jan 2020 – Aug 2026</h5><span class="item-company"><a href="https://www.oekk.ch/de/privatkunden">ÖKK</a></span><span class="item-company">Landquart, Switzerland</span></div>
  <div class="divider"></div><div class="right-part"><h4 class="item-title">Data Engineer</h4><p id="oekk-description">Development of data pipelines, stable operation of the data warehouse and delivery of data products to business departments.</p></div>
</div>
<div class="timeline-item clearfix">
  <div class="left-part"><h5 class="item-period">Aug 2017 – Dec 2020</h5><span class="item-company"><a href="https://www.gkb.ch/de">Graubündner Kantonalbank</a></span><span class="item-company">Chur, Switzerland</span></div>
  <div class="divider"></div><div class="right-part"><h4 class="item-title">Assistant Corporate Clients, Syndicated Loans</h4><p id="gkb-description">Supporting the corporate clients team in the processing and administration of syndicated loans.</p></div>
</div>
<div class="timeline-item clearfix">
  <div class="left-part"><h5 class="item-period">Feb 2015 – Aug 2017</h5><span class="item-company"><a href="https://www.raiffeisen.ch/buendner-rheintal/de.html#bankselector-focus-regular">Raiffeisenbank Bündner Rheintal</a></span><span class="item-company">Chur, Switzerland</span></div>
  <div class="divider"></div><div class="right-part"><h4 class="item-title">Private Clients Advisor</h4><p id="raiffeisen-advisor-description">Advising private clients on banking products, accounts, investments and loans.</p></div>
</div>
<div class="timeline-item clearfix">
  <div class="left-part"><h5 class="item-period">Aug 2011 – Feb 2015</h5><span class="item-company"><a href="https://www.raiffeisen.ch/mittelrheintal/de.html#bankselector-focus-regular">Raiffeisenbank Mittelrheintal</a></span><span class="item-company">Widnau, Switzerland</span></div>
  <div class="divider"></div><div class="right-part"><h4 class="item-title">Apprenticeship in Banking, Private Clients Advisor</h4><p id="apprenticeship-description">Banking apprenticeship with practical training in retail banking and client services.</p></div>
</div>
''',
            )

        coding_title = next((h for h in resume.find_all("h3") if "Coding" in h.get_text()), None)
        if coding_title:
            skills_col = coding_title.find_parent("div", class_=class_has("col-xs-12", "col-sm-5"))
            if skills_col:
                replace_inner(
                    skills_col,
                    '''
<div class="skill-domain"><div class="block-title"><h3 id="skills-data-title">Data Engineering &amp; Platforms</h3></div><ul class="knowledges skill-tags"><li>Python</li><li>SQL</li><li>dbt</li><li>Snowflake</li><li>Oracle</li><li>Data Modeling</li><li>Data Pipelines</li></ul></div>
<div class="skill-domain"><div class="block-title"><h3 id="skills-ai-title">AI &amp; MLOps</h3></div><ul class="knowledges skill-tags"><li>Machine Learning</li><li>MLflow</li><li>LLM APIs</li><li>RAG</li><li>Vector Databases</li><li>Generative AI</li></ul></div>
<div class="skill-domain"><div class="block-title"><h3 id="skills-engineering-title">Engineering &amp; DevOps</h3></div><ul class="knowledges skill-tags"><li>Git</li><li>Docker</li><li>Azure</li><li>Workflow Orchestration</li><li>CI/CD</li><li>APIs</li></ul></div>
<div class="skill-domain"><div class="block-title"><h3 id="skills-business-title">Business &amp; Finance</h3></div><ul class="knowledges skill-tags"><li>Banking</li><li>Asset Management</li><li>Digital Assets</li><li>Quantitative Finance</li><li>Requirements Engineering</li><li>Process Automation</li></ul></div>
''',
                )

    # Blog and project sections remain intentionally neutral, not branded as hero content.
    blog = soup.select_one('section[data-id="blog"]')
    if blog:
        title = blog.select_one(".page-title h2")
        if title:
            title.string = "Blog"
        intro = blog.select_one(".col-xs-12.col-sm-12 > p")
        if intro:
            intro["id"] = "blog-intro"
            intro.string = "Latest articles from my LinkedIn newsletter on data, AI and technology."
        button = blog.select_one("a.btn.btn-primary")
        if button:
            button["id"] = "blog-all-link"
            button.string = "View all editions on LinkedIn"

    projects = soup.select_one('section[data-id="projects"]')
    if projects:
        intro = projects.select_one(".col-xs-12.col-sm-12 > p")
        if intro:
            intro["id"] = "projects-intro"
            intro.string = "A selection of my latest public GitHub repositories across data engineering, machine learning and technology projects."
        status = projects.select_one("#github-projects-status")
        if status:
            status.string = "Loading GitHub repositories ..."
        button = projects.select_one("a.btn.btn-primary")
        if button:
            button["id"] = "projects-all-link"
            button.string = "View all public GitHub repositories"

    # Contact translation hooks.
    contact = soup.select_one('section[data-id="contact"]')
    if contact:
        info_blocks = contact.select(".lm-info-block h4")
        for h4 in info_blocks:
            if "Freelance" in h4.get_text():
                h4["id"] = "availability-text"
                h4.string = "Freelance / Consulting Available"
        help_title = next((h for h in contact.find_all("h3") if "How Can I" in h.get_text()), None)
        if help_title:
            help_title["id"] = "contact-help-title"
        form = contact.find("form")
        if form:
            label_specs = [
                ("email", "label-email", "Your email:"),
                ("name", "label-name", "Your name:"),
                ("subject", "label-subject", "Subject:"),
                ("message", "label-message", "Message:"),
            ]
            for field_name, label_id, label_text in label_specs:
                field = form.find(attrs={"name": field_name})
                if field and field.parent and field.parent.name == "label":
                    label = field.parent
                    # Preserve field while replacing the text node.
                    for child in list(label.contents):
                        if isinstance(child, str) and child.strip():
                            child.replace_with(label_text + " ")
                            break
                    marker = soup.new_tag("span", id=label_id)
                    marker.string = label_text
                    # Avoid duplicate visible text by making the old text empty.
                    for child in list(label.contents):
                        if isinstance(child, str) and child.strip():
                            child.replace_with(" ")
                    label.insert(0, marker)
            submit = form.find("button", attrs={"type": "submit"})
            if submit:
                submit["id"] = "contact-submit"
                submit.string = "Send"

    # Remove obsolete inline date script that referenced the old ongoing ÖKK entry.
    for script in list(soup.find_all("script")):
        if script.string and "currentMonthYear" in script.string:
            script.decompose()

    # Ensure i18n is loaded before main.js.
    main_script = soup.find("script", attrs={"src": "js/main.js"})
    if main_script and not soup.find("script", attrs={"src": "js/i18n.js"}):
        i18n = soup.new_tag("script", src="js/i18n.js")
        main_script.insert_before(i18n)

    INDEX.write_text(str(soup), encoding="utf-8")


def update_main_js() -> None:
    text = MAIN_JS.read_text(encoding="utf-8")

    # Remove the old runtime patching of profile/about/resume content.
    text = re.sub(
        r"\s*// Portfolio profile updates.*?(?=\s*// Weekly Bytes:)",
        "\n",
        text,
        flags=re.DOTALL,
    )

    # Keep blog data loading, but stop rebranding/rewriting the static section copy.
    text = re.sub(r"\n\s*\$blogSection\.find\('\.page-title h2'\).*?;", "", text)
    text = re.sub(r"\n\s*\$blogSection\.find\('\.col-xs-12\.col-sm-12 > p'\).*?;", "", text)
    text = re.sub(r"\n\s*\$blogSection\.find\('a\.btn\.btn-primary'\).*?;", "", text)

    # Respect active site language when formatting dates.
    text = text.replace(
        "date.toLocaleDateString('de-CH', {",
        "date.toLocaleDateString(window.siteLanguage === 'de' ? 'de-CH' : 'en-GB', {",
    )

    MAIN_JS.write_text(text, encoding="utf-8")


def update_css() -> None:
    text = MAIN_CSS.read_text(encoding="utf-8")
    marker = "/* Portfolio modernization 2026 */"
    if marker not in text:
        text += r'''

/* Portfolio modernization 2026 */
.language-toggle {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 7px;
  margin: 14px 0 4px;
  font-size: 12px;
  letter-spacing: .06em;
}

.language-toggle button {
  border: 0;
  padding: 3px 4px;
  background: transparent;
  color: inherit;
  opacity: .55;
  cursor: pointer;
  font: inherit;
  font-weight: 600;
}

.language-toggle button:hover,
.language-toggle button:focus,
.language-toggle button.active {
  opacity: 1;
}

.language-toggle button.active {
  text-decoration: underline;
  text-underline-offset: 4px;
}

.header-photo picture,
.header-photo picture img {
  display: block;
  width: 100%;
  height: auto;
}

.skill-domain {
  margin-bottom: 28px;
}

.skill-domain .block-title {
  margin-bottom: 12px;
}

.skill-tags {
  margin-top: 0;
}

.skill-tags li {
  margin-bottom: 7px;
}

@media (prefers-reduced-motion: reduce) {
  .bg-video,
  .lm-animated-bg {
    animation: none !important;
    transition: none !important;
  }
}
'''
        MAIN_CSS.write_text(text, encoding="utf-8")


def write_seo_files() -> None:
    (ROOT / "robots.txt").write_text(
        "User-agent: *\nAllow: /\nSitemap: https://sandrobreu.github.io/sitemap.xml\n",
        encoding="utf-8",
    )
    (ROOT / "sitemap.xml").write_text(
        '''<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://sandrobreu.github.io/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
''',
        encoding="utf-8",
    )


if __name__ == "__main__":
    update_index()
    update_main_js()
    update_css()
    write_seo_files()
    print("Portfolio HTML, JS, CSS and SEO files modernized.")
