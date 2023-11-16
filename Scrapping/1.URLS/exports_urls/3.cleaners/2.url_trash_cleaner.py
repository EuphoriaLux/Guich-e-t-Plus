import json
import os

def process_language_file(file_path, language_code):
    # Load the JSON data from the file
    with open(file_path, 'r') as file:
        data = json.load(file)

    # Initialize dictionaries for true and false elements
    true_elements = {}
    false_elements = {}

    # Define subcategories to exclude
    false_subcategories = ["actualites", "publications", "myguichet", "organismes", "outils","support", "recherche" "contact"]

    # Iterate over each key-value pair in the dictionary
    for key, value in data.items():
        # Check if the value is a list and process accordingly
        if isinstance(value, list):
            # Include items in true_elements if 'SpecificElementExists' is True and not in false subcategories
            true_elements[key] = [item for item in value if item.get("SpecificElementExists") and item.get("Subcategory") not in false_subcategories]
            
            # Include items in false_elements if 'SpecificElementExists' is False or in false subcategories
            false_elements[key] = [item for item in value if not item.get("SpecificElementExists") or item.get("Subcategory") in false_subcategories]

    # Define folder paths
    output_folder_path = os.path.join('output', language_code)

    
    true_folder_path = os.path.join(output_folder_path, 'true_elements')
    false_folder_path = os.path.join(output_folder_path, 'false_elements')

    # Create folders
    os.makedirs(true_folder_path, exist_ok=True)
    os.makedirs(false_folder_path, exist_ok=True)

    true_elements_file_path = os.path.join(true_folder_path, f'true_elements_{language_code}.json')
    false_elements_file_path = os.path.join(false_folder_path, f'false_elements_{language_code}.json')


    # Saving true elements
    with open(true_elements_file_path, 'w') as file:
        json.dump(true_elements, file)

    # Saving false elements
    with open(false_elements_file_path, 'w') as file:
        json.dump(false_elements, file)

    return true_elements_file_path, false_elements_file_path, sum(len(lst) for lst in true_elements.values()), sum(len(lst) for lst in false_elements.values())

# Call the function for each language
#de_results = process_language_file('state_de_links_citoyen.json', 'DE')
fr_results = process_language_file('state_fr_links_entreprise.json', 'FR')
#en_results = process_language_file('state_en_links_citoyen.json', 'EN')

# Output results for each language
#de_results, fr_results, en_results

fr_results