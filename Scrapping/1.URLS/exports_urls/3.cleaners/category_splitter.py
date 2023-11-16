import json
import os
import string
from collections import defaultdict

# Function to read the JSON file
def read_json(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        return json.load(file)

# Function to sanitize file names
def sanitize_filename(name):
    if not name:
        return "subcategory2_null"
    valid_chars = "-_.() %s%s" % (string.ascii_letters, string.digits)
    sanitized = ''.join(c for c in name if c in valid_chars)
    return sanitized if sanitized else "unnamed_subcategory2"

# Main function to split the JSON and save into multiple files
def split_json(input_file_path, output_dir):
    # Reading the JSON file
    data = read_json(input_file_path)

    # Grouping the data by 'Subcategory2'
    grouped_data = defaultdict(list)
    for item in data["json_data"]:
        subcat2 = item["Subcategory2"]
        grouped_data[subcat2].append(item)

    # Creating and saving separate JSON structures for each 'Subcategory2'
    os.makedirs(output_dir, exist_ok=True)
    for subcat2, items in grouped_data.items():
        filename = f"{sanitize_filename(subcat2)}.json"
        file_path = os.path.join(output_dir, filename)
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump({"json_data": items}, f, indent=4, ensure_ascii=False)

# Usage
input_file_path = 'output/EN/true_elements/true_elements_EN.json'  # Replace with your file path
output_dir = 'output/EN'  # Replace with your desired output directory
split_json(input_file_path, output_dir)
