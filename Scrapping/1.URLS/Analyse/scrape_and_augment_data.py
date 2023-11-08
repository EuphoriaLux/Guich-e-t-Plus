import json
import requests
from bs4 import BeautifulSoup
import time
import json
import requests
from bs4 import BeautifulSoup
import time

def updated_scrape_and_augment_data(input_file, output_file):
    # Load JSON data
    with open(input_file, 'r') as f:
        data = json.load(f)
    
    augmented_data = {}

    # Open the output file and start a JSON array
    with open(output_file, 'w') as f:
        f.write('[')

    # Iterate over each category in the data
    for category, items_list in data.items():
        augmented_data[category] = []
        
        # Iterate over each dictionary (URL) in the items_list
        for i, item in enumerate(items_list):
            # Ensure the item is a dictionary
            if not isinstance(item, dict):
                print(f"Item {i} in category {category} is not a dictionary.")
                continue

            # Get the URL
            url = item.get('Link')
            if not url:
                print(f"Item {i} in category {category} does not have a 'Link' key.")
                continue

            # Make a request to the URL
            response = requests.get(url)
            print(url)
            # Parse the HTML content of the page
            soup = BeautifulSoup(response.text, features="html.parser")

            # Find the title of the page and add it to the dictionary
            title_tag = soup.find('title')
            if title_tag:
                title = title_tag.text
                item['Title'] = title
            else:
                print(f"Warning: No <title> tag found for URL: {url}")
                item['Title'] = "Unknown"

            # Find all <div> elements with the class 'geoportail' and process each of them
            geoportail_divs = soup.find_all('div', class_='geoportail')
            item['GeoportailData'] = []
            for div in geoportail_divs:
                # Find the parent-title, name, telephone, fax, and email within this div and add them to a dictionary
                div_data = {}
                parent_title = div.find('span', class_='vcard-parent-title')
                div_data['ParentTitle'] = parent_title.text.strip() if parent_title else None

                name = div.find('div', itemprop='name')
                div_data['Name'] = name.text.strip() if name else None

                telephone = div.find('span', itemprop='telephone')
                div_data['Telephone'] = telephone.text.strip() if telephone else None

                fax = div.find('span', itemprop='faxNumber')
                div_data['Fax'] = fax.text.strip() if fax else None

                email_icon = div.find('svg', {'class': 'icon', 'viewBox': '0 0 24 24'})
                if email_icon:
                    email_container = email_icon.find_parent('a', href=True)
                    if email_container and email_container['href'].startswith('mailto:'):
                        div_data['Email'] = email_container['href'][7:]
                else:
                    div_data['Email'] = None

                # Append the div data to the GeoportailData field in the item
                item['GeoportailData'].append(div_data)

            # Append the item to the output file
            with open(output_file, 'a') as f:
                if i > 0:  # not the first item, prepend a comma
                    f.write(',')
                json.dump(item, f)

    # Close the JSON array in the output file
    with open(output_file, 'a') as f:
        f.write(']')

# Usage:
# updated_scrape_and_augment_data('path_to_input_file.json', 'path_to_output_file.json')



updated_scrape_and_augment_data('../1.URLS\exports_urls\guichet_links_citoyen.json', 'augmented_data.json')
