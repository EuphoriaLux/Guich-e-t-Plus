import json

# Load the JSON data from the file
file_path = 'state_fr_links_citoyen.json'

with open(file_path, 'r') as file:
    data = json.load(file)



# Since the data is a dictionary of lists, we will iterate through the dictionary items
true_elements = {}
false_elements = {}

# Iterate over each key-value pair in the dictionary
for key, value in data.items():
    # Check if the value is a list and process accordingly
    if isinstance(value, list):
        # Split the list based on 'SpecificElementExists' being True or False
        true_elements[key] = [item for item in value if item.get("SpecificElementExists") == True]
        false_elements[key] = [item for item in value if item.get("SpecificElementExists") == False]

# Save the split data into separate JSON files
true_elements_file_path = 'true_elements.json'
false_elements_file_path = 'false_elements.json'

# Saving true elements
with open(true_elements_file_path, 'w') as file:
    json.dump(true_elements, file)

# Saving false elements
with open(false_elements_file_path, 'w') as file:
    json.dump(false_elements, file)

true_elements_file_path, false_elements_file_path, sum(len(lst) for lst in true_elements.values()), sum(len(lst) for lst in false_elements.values())
