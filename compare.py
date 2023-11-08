import json

def load_json(file_path):
    with open(file_path, 'r') as file:
        return json.load(file)

def normalize_link(link, lang_code):
    parts = link.split('/', 3)
    if len(parts) > 3:
        parts[3] = parts[3].lstrip('/')
        return '/'.join(parts[:3] + [lang_code, parts[3]])
    return link

def extract_path_after_language(link):
    parts = link.split('/', 4)
    if len(parts) > 4:
        return parts[4]
    return ""

def compare_json_links(json1, json2):
    differences = []

    paths_to_items1 = {extract_path_after_language(item['Link']): item for item in json1['json_data']}
    paths_to_items2 = {extract_path_after_language(item['Link']): item for item in json2['json_data']}

    for path, item1 in paths_to_items1.items():
        item2 = paths_to_items2.get(path)
        if not item2:
            differences.append({'missing_in_json2': item1['Link'], 'details_from_json1': item1})
        elif item1['Link'] != item2['Link']:
            differences.append({'path': path, 'json1_link': item1['Link'], 'json2_link': item2['Link'],
                                'details_from_json1': item1, 'details_from_json2': item2})

    for path, item2 in paths_to_items2.items():
        if path not in paths_to_items1:
            differences.append({'missing_in_json1': item2['Link'], 'details_from_json2': item2})

    return differences


def print_differences(differences, json1_label, json2_label):
    missing_in_json1 = [d for d in differences if 'missing_in_json1' in d]
    missing_in_json2 = [d for d in differences if 'missing_in_json2' in d]
    different_links = [d for d in differences if 'json1_link' in d and 'json2_link' in d]

    if not differences:
        print(f"No differences found between {json1_label} and {json2_label}.")
    else:
        print(f"Differences between {json1_label} and {json2_label}:")

        if missing_in_json1:
            print(f"\nLinks missing in {json1_label}:")
            for diff in missing_in_json1:
                print(json.dumps(diff, indent=4))

        if missing_in_json2:
            print(f"\nLinks missing in {json2_label}:")
            for diff in missing_in_json2:
                print(json.dumps(diff, indent=4))

        if different_links:
            print(f"\nLinks that differ between {json1_label} and {json2_label}:")
            for diff in different_links:
                print(json.dumps(diff, indent=4))

        print(f"\nSummary of differences between {json1_label} and {json2_label}:")
        print(f"  Missing in {json1_label}: {len(missing_in_json1)}")
        print(f"  Missing in {json2_label}: {len(missing_in_json2)}")
        print(f"  Different links: {len(different_links)}")


def find_missing_links(languages_data):
    all_paths = set()  # Set to store all unique paths from all JSON files
    data_by_language = {}  # Dictionary to store paths by language

    # Combine all paths and organize them by language
    for lang_code, data in languages_data.items():
        paths = {extract_path_after_language(item['Link']): item for item in data['json_data']}
        data_by_language[lang_code] = paths
        all_paths.update(paths.keys())

    # Check each path in the combined set against each language
    missing_links = {lang_code: [] for lang_code in languages_data}
    for path in all_paths:
        for lang_code, paths in data_by_language.items():
            if path not in paths:
                # If the path is not present in the language-specific paths, it's missing
                missing_links[lang_code].append(path)

    return missing_links

# Load JSON files for each language
json_fr = load_json('Scrapping/4.exports/needs/fr_true_elements.json')
json_de = load_json('Scrapping/4.exports/needs/de_true_elements.json')
json_en = load_json('Scrapping/4.exports/needs/en_true_elements.json')

# Combine all language data into a dictionary
languages_data = {
    'FR': json_fr,
    'DE': json_de,
    'EN': json_en
}

# Find missing links
missing_links = find_missing_links(languages_data)

# Function to print the missing links
def print_missing_links(missing_links):
    for lang_code, links in missing_links.items():
        if links:
            print(f"Links not present in {lang_code}:")
            for link in links:
                print(link)
        else:
            print(f"All links are present in {lang_code}.")

# Print the missing links for each language
print_missing_links(missing_links)