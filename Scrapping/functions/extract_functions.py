import requests
from bs4 import BeautifulSoup

import urllib.parse

base_url = 'https://guichet.public.lu/'
relative_url = '/fr/organismes/organismes_citoyens/ministere-education-nationale/service-reconnaissance-diplomes.html'

full_url = urllib.parse.urljoin(base_url, relative_url)


# load the URL and output an txt file with title and page text
def extract_text_from(url):
    html = requests.get(url).text
    soup = BeautifulSoup(html, features="html.parser")
    page_text = soup.find('div', class_='page-text')
    text = page_text.get_text()

    lines = (line.strip() for line in text.splitlines())
    return '\n'.join(line for line in lines if line)


# load the URL and output an HTML file with title and page text
def extract_html_from(url):
    html = requests.get(url).text
    soup = BeautifulSoup(html, features="html.parser")
    page_text = soup.find('div', class_='page-text')
    html_code = str(page_text)
    page_title = soup.find('title').get_text().strip()

    # replace any invalid characters in the page title with underscores
    filename = page_title.replace('/', '_').replace('\\', '_').replace(':', '_').replace('*', '_').replace('?', '_').replace('"', '_').replace('<', '_').replace('>', '_').replace('|', '_') + '.html'

    # replace all relative URLs with full URLs that include the domain name
    base_url = 'https://guichet.public.lu'
    links = soup.find_all('a')
    for link in links:
        href = link.get('href')
        if href and not href.startswith('http://') and not href.startswith('https://'):
            full_url = urllib.parse.urljoin(base_url, href)
            html_code = html_code.replace('"' + href + '"', '"' + full_url + '"')

    # save the HTML code into a file with the page title as the filename
    with open(filename, 'w') as f:
        f.write(html_code)

    return html_code