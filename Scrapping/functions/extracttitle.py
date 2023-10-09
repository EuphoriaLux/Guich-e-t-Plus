import requests
from bs4 import BeautifulSoup
from functions.extract_functions import extract_text_from, extract_html_from
import urllib.parse
import csv


with open('youtube.html', 'r') as f:
    html = f.read()
soup = BeautifulSoup(html, features="html.parser")

titles = soup.find_all('a', title=True)

for title in titles:
    print(title['title'])
"""

with open('yt_title.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(['Link', 'Title'])

    for link, title in zip(links, links_title):
        href = link.get('href')
        if href:
            if not href.startswith('http://') and not href.startswith('https://'):
                href = urllib.parse.urljoin(url, href)
            title_text = title.get('title')
            writer.writerow([href, title_text])

"""