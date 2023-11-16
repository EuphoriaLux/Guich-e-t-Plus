import os
import json
import re
from collections import defaultdict

# Regular expression pattern for finding URLs
url_pattern = re.compile(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+')

def count_urls_in_json(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)
        # Flatten the JSON structure and extract all strings
        all_strings = flatten_json(data)
        # Filter strings that match URL pattern
        urls = [string for string in all_strings if url_pattern.match(string)]
        return len(urls)

def flatten_json(data):
    elements = []

    if isinstance(data, dict):
        for value in data.values():
            elements.extend(flatten_json(value))
    elif isinstance(data, list):
        for item in data:
            elements.extend(flatten_json(item))
    elif isinstance(data, str):
        elements.append(data)
    
    return elements

def main():
    directories = ['DE', 'EN', 'FR']
    base_path = 'C:/Users/User/OneDrive/Dokumente/GitHub/Guichet-Plus/output'

    # A dictionary to store the URL counts for each language
    url_counts = defaultdict(lambda: defaultdict(int))

    # Collect URL counts
    for directory in directories:
        dir_path = os.path.join(base_path, directory)
        if os.path.exists(dir_path):
            for file_name in os.listdir(dir_path):
                if file_name.endswith('.json'):
                    file_path = os.path.join(dir_path, file_name)
                    count = count_urls_in_json(file_path)
                    url_counts[file_name][directory] = count
        else:
            print(f"Directory not found: {dir_path}")

    # Print URL counts in a tabulated format
    print("{:<30} {:<10} {:<10} {:<10}".format("File", *directories))
    for file_name, counts in url_counts.items():
        print("{:<30} {:<10} {:<10} {:<10}".format(
            file_name, 
            counts['DE'],
            counts['EN'],
            counts['FR']
        ))

if __name__ == '__main__':
    main()
