from random import sample
import json

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

if __name__ == "__main__":
    # Example usage:
    file_path = 'Scrapping/1.URLS/exports_urls/04_11_guichet_links_citoyen.json'
    number_of_links = 100  # or any number you'd like to extract

    # This will return the desired number of random links
    random_links = get_random_links(file_path, number_of_links)
    print(random_links)  # or handle the random links as needed
