import requests
from bs4 import BeautifulSoup

url = 'https://fdemeer.pro/'
response = requests.get(url)
soup = BeautifulSoup(response.text, 'html.parser')

# Alle CSS-Links finden
css_links = [link['href'] for link in soup.find_all('link', rel='stylesheet')]

for css_link in css_links:
    if css_link.startswith('http'):
        css_url = css_link
    else:
        css_url = url + css_link  # Falls relative URL

    css_response = requests.get(css_url)
    css_content = css_response.text

    print(f'CSS from {css_url}:\n')
    print(css_content)
