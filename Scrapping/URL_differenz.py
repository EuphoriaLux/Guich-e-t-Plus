import json

def load_json_data(file_path):
    """ Loads JSON data from a given file path. """
    with open(file_path, 'r') as file:
        data = json.load(file)
    return data

def normalize_url(url):
    """ Normalizes the URL by replacing the language path with a placeholder. """
    for lang in ['en', 'fr', 'de']:
        if f"/{lang}/" in url:
            return url.replace(f"/{lang}/", "/{lang}/")
    return url

def extract_and_normalize_urls(json_data):
    """ Extracts and normalizes URLs from the json data. """
    return [normalize_url(item['Link']) for item in json_data['json_data']]

def compare_urls(urls1, urls2):
    """ Compares two sets of URLs and returns the differences. """
    return set(urls1).difference(urls2)

# File paths for the JSON files
file_path_en = 'output/EN/true_elements/true_elements_EN.json'
file_path_fr = 'output/FR/true_elements/true_elements_FR.json'
file_path_de = 'output/DE/true_elements/true_elements_DE.json'

# Loading the data
data_en = load_json_data(file_path_en)
data_fr = load_json_data(file_path_fr)
data_de = load_json_data(file_path_de)

# Extracting and normalizing URLs
urls_en = extract_and_normalize_urls(data_en)
urls_fr = extract_and_normalize_urls(data_fr)
urls_de = extract_and_normalize_urls(data_de)

# Comparing URLs
diff_en_fr = compare_urls(urls_en, urls_fr)
diff_en_de = compare_urls(urls_en, urls_de)
diff_fr_de = compare_urls(urls_fr, urls_de)

# Printing the differences
print("Differences between EN and FR URLs:", diff_en_fr)
print("Differences between EN and DE URLs:", diff_en_de)
print("Differences between FR and DE URLs:", diff_fr_de)
