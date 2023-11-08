import urllib.parse
import json
from bs4 import BeautifulSoup
import requests

urls = [
    'https://guichet.public.lu/fr/citoyens.html',
    'https://guichet.public.lu/en/citoyens.html',
    'https://guichet.public.lu/de/citoyens.html'
]

patterns = {
    'citoyennete': 'Citoyennete',
    'enseignement-formation': 'Enseignement / Formation',
    'famille': 'Famille',
    'impots-taxes': 'Impots / Taxes',
    'logement': 'Logement',
    'loisirs-benevolat': 'Loisirs / Benevolat',
    'sante-social': 'Sante / Social',
    'transports-mobilite': 'Transports / Mobilite',
    'travail-emploi': 'Travail / Emploi',
    'brexit': 'Brexit',
    'immigration': 'Immigration'
}

data = {}

for url in urls:
    request = requests.get(url)
    html = request.text
    soup = BeautifulSoup(html, features="html.parser")
    links = soup.find_all('a')

    written_urls = set()

    for link in links:
        href = link.get('href')
        if href:
            if not href.startswith('http://') and not href.startswith('https://'):
                href = urllib.parse.urljoin(url, href)
            if href not in written_urls:
                written_urls.add(href)
                language = None
                subcategory = None
                subcategory2 = None
                subcategory3 = None
                subcategory4 = None
                subcategory5 = None
                subcategory6 = None
                segments = urllib.parse.urlparse(href).path.split('/')
                if len(segments) > 1:
                    language = segments[1]
                    if language.endswith('.html'):
                        language = language[:-5]
                if len(segments) > 2:
                    subcategory = segments[2]
                    if subcategory.endswith('.html'):
                        subcategory = subcategory[:-5]
                    if subcategory in patterns:
                        subcategory = patterns[subcategory]
                if len(segments) > 3:
                    subcategory2 = segments[3]
                    if subcategory2.endswith('.html'):
                        subcategory2 = subcategory2[:-5]
                    if subcategory2 in patterns:
                        subcategory2 = patterns[subcategory2]
                if len(segments) > 4:
                    subcategory3 = segments[4]
                    if subcategory3.endswith('.html'):
                        subcategory3 = subcategory3[:-5]
                    if subcategory3 in patterns:
                        subcategory3 = patterns[subcategory3]
                if len(segments) > 5:
                    subcategory4 = segments[5]
                    if subcategory4.endswith('.html'):
                        subcategory4 = subcategory4[:-5]
                    if subcategory4 in patterns:
                        subcategory4 = patterns[subcategory4]
                                

                if language not in data:
                    data[language] = []

                data[language].append({
                    'Link': href, 
                    'Subcategory': subcategory, 
                    'Subcategory2': subcategory2, 
                    'Subcategory3': subcategory3, 
                    'Subcategory4': subcategory4, 
                    'Subcategory5': subcategory5, 
                    'Subcategory6': subcategory6
                })

with open('04_11_guichet_links_citoyen.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)
