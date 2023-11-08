from random import sample
import json
import requests
from bs4 import BeautifulSoup
import os
import re

def load_data(file_path):
    with open(file_path, 'r') as file:
        data = json.load(file)
    return data

def extract_links(data_structure):
    links = []
    for entry in data_structure:
        if 'Link' in entry:
            links.append(entry['Link'])
    return links

def get_random_links(file_path, number_of_links):
    # Load the JSON data from the file
    data = load_data(file_path)

    # Extract all links from each language category
    all_links = []
    for key in data.keys():
        all_links.extend(extract_links(data[key]))

    # Remove any potential duplicates
    unique_links = list(set(all_links))

    # Now we select the specified number of random links
    random_links = sample(unique_links, min(number_of_links, len(unique_links)))
    return random_links


# Define a function to create a safe filename from a title
def create_safe_filename(title):
    # Remove any character that is not alphanumeric, a space, a hyphen, or an underscore
    safe_title = re.sub(r'[^\w\s-]', '', title)
    # Replace spaces with underscores
    safe_title = re.sub(r'\s+', '_', safe_title).strip()
    # Truncate to 50 characters to avoid very long filenames
    return safe_title[:50]

# Specify the file path and the number of links you want to extract
file_path = 'Scrapping/4.exports/needs/en_true_elements.json'
number_of_links = 10  # You can specify any number you need

# Then you can use get_random_links directly

random_links = get_random_links(file_path, number_of_links)

output_dir = 'extracted_pages'
other_dir = 'extracted_pages/other'  # Folder for pages without titles
os.makedirs(output_dir, exist_ok=True)
os.makedirs(other_dir, exist_ok=True)

for url in random_links:
    response = requests.get(url)

    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser')
        header = soup.find('header', class_='page-title')

        if header and header.h1:
            title = header.h1.text
            safe_filename = create_safe_filename(title)
            filename = f'{output_dir}/{safe_filename}.html'
        else:
            # If no title is found, use a default naming scheme and save to the other directory
            title = 'No_Title_Found'
            safe_url = ''.join(char for char in url if char.isalnum() or char in '-_.')
            safe_filename = f'page_{random_links.index(url)}_{safe_url[:15]}'
            filename = f'{other_dir}/{safe_filename}.html'

        page_text_div = soup.find('div', class_='page-text')

        if page_text_div:
            page_text_html = str(page_text_div)

            try:
                with open(filename, 'w', encoding='utf-8') as f:
                    f.write(f"<!-- URL: {url} -->\n{page_text_html}")
                print(f'Content saved successfully as {safe_filename}.html for URL {url}!')
            except IOError as e:
                print(f'An error occurred while writing to file {filename}: {e}')
        else:
            print(f'The specified div was not found in the webpage for URL {url}.')
    else:
        print(f'Failed to retrieve the webpage {url}. Status code: {response.status_code}')