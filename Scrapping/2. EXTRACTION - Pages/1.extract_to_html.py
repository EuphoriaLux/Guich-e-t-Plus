import json
import requests
from bs4 import BeautifulSoup
import re
import hashlib
import sqlite3

# Define the function to create a table in the SQLite database
def create_table(cursor):
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS webpages (
            id INTEGER PRIMARY KEY,
            url TEXT NOT NULL,
            title TEXT,
            content TEXT,
            language TEXT,
            subcategory TEXT,
            subcategory2 TEXT,
            subcategory3 TEXT,
            subcategory4 TEXT,
            subcategory5 TEXT,
            subcategory6 TEXT,
            specific_element_exists BOOLEAN,
            scraped_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')



def store_page(cursor, url, title, content, language, subcategory, subcategory2, subcategory3, subcategory4, subcategory5, subcategory6, specific_element_exists):
    # Check if the URL already exists in the database
    cursor.execute('SELECT id FROM webpages WHERE url = ?', (url,))
    result = cursor.fetchone()

    # If the URL does not exist, insert the new record
    if result is None:
        cursor.execute('''
            INSERT INTO webpages (url, title, content, language, subcategory, subcategory2, subcategory3, subcategory4, subcategory5, subcategory6, specific_element_exists)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (url, title, content, language, subcategory, subcategory2, subcategory3, subcategory4, subcategory5, subcategory6, specific_element_exists))
        print(f'New content for URL {url} saved to database!')
    else:
        # If the URL exists, update the existing record
        cursor.execute('''
            UPDATE webpages
            SET title = ?, content = ?, language = ?, subcategory = ?, subcategory2 = ?, subcategory3 = ?, subcategory4 = ?, subcategory5 = ?, subcategory6 = ?, specific_element_exists = ?
            WHERE url = ?
        ''', (title, content, language, subcategory, subcategory2, subcategory3, subcategory4, subcategory5, subcategory6, specific_element_exists, url))
        print(f'Content for URL {url} updated in database.')
    conn.commit()



# Load data from JSON file
def load_data(file_path):
    with open(file_path, 'r') as file:
        data = json.load(file)
    return data.get('json_data')


# Extract links from the loaded JSON data structure
def extract_links(data_structure):
    links = []
    for entry in data_structure:
        if 'Link' in entry:
            links.append(entry['Link'])
    return links

# Create a safe filename from a URL and title
def create_safe_filename(url, title=None):
    if title:
        filename = re.sub(r'[^\w\s-]', '', title)
        filename = re.sub(r'\s+', '_', filename).strip()
    else:
        url_hash = hashlib.md5(url.encode('utf-8')).hexdigest()
        parts = url.split('/')
        filename_part = parts[-1] or parts[-2]
        filename = f"{filename_part}_{url_hash[:10]}"
    return filename[:50]

# Main script execution
# Main script execution
if __name__ == '__main__':
    # Adjust the file path according to your JSON file location
    file_path = 'output/fr/Travail_Emploi.json'

    # Load data
    data_structure = load_data(file_path)

    # Connect to the SQLite database
    conn = sqlite3.connect('scraped_content.db')
    cursor = conn.cursor()

    # Create the table
    create_table(cursor)

    for entry in data_structure:
        url = entry['Link']
        response = requests.get(url)
        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'html.parser')

            # Extract title and remove the unwanted part
            if soup.title:
                page_title = soup.title.string
                unwanted_part = "— Citoyens — Guichet.lu - Guide administratif - Luxembourg"
                if unwanted_part in page_title:
                    page_title = page_title.replace(unwanted_part, "").strip()
                else:
                    page_title = page_title.split("— ")[0].strip()
            else:
                page_title = None

            # Initialize page_text_html
            page_text_html = None

            # Process the page text
            page_text_div = soup.find('div', class_='page-text')
            if page_text_div:
                page_text_html = str(page_text_div)

            # Simple language detection based on URL
            if "/fr/" in url:
                language = "French"
            elif "/en/" in url:
                language = "English"
            else:
                language = "German"

            if page_text_html is not None:
                try:
                    store_page(cursor, url, page_title, page_text_html, language, 
                               entry.get('Subcategory'), entry.get('Subcategory2'), 
                               entry.get('Subcategory3'), entry.get('Subcategory4'), 
                               entry.get('Subcategory5'), entry.get('Subcategory6'), 
                               entry.get('SpecificElementExists'))
                    print(f'Content for URL {url} saved to database!')
                except sqlite3.Error as e:
                    print(f'An error occurred while inserting into the database: {e}')
        else:
            print(f'Failed to retrieve the webpage {url}. Status code: {response.status_code}')

    # Close the database connection
    conn.close()
