import json

# Load the JSON data from the file
def load_json(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)
    return data

# Write the data to a JSON file
def write_json_to_file(file_path, data):
    with open(file_path, 'w', encoding='utf-8') as file:
        json.dump(data, file, ensure_ascii=False, indent=2)

# Split the JSON file into separate files for each language
def split_json_by_language(input_file_path):
    # Load the data from the input file
    data = load_json(input_file_path)

    # Define the language keys and the corresponding file names
    languages = ['fr', 'de', 'en']
    file_paths = {
        'fr': 'fr_links_entreprise.json',
        'de': 'de_links_entreprise.json',
        'en': 'en_links_entreprise.json'
    }

    # Split the data and write to separate files
    for lang in languages:
        lang_data = data.get(lang, {})
        write_json_to_file(file_paths[lang], lang_data)
        print(f"File for {lang} language has been saved to {file_paths[lang]}")

# Usage
input_file_path = '13_11_guichet_links_entreprise.json'
split_json_by_language(input_file_path)
