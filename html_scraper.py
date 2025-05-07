import requests
from bs4 import BeautifulSoup

url = 'https://fdemeer.pro/'
response = requests.get(url)
soup = BeautifulSoup(response.text, 'html.parser')

print(soup.prettify())
