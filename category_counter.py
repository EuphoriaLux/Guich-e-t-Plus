import json
from collections import defaultdict

# Function to load JSON data from a file
def load_json(file_path):
    with open(file_path, 'r') as file:
        return json.load(file)

# Function to build a nested dictionary from the categories
def build_tree(data):
    tree = defaultdict(list)  # Now `tree[sub1]` will be a list by default
    for item in data['json_data']:
        sub1 = item.get('Subcategory', 'None')
        # No need to consider other subcategories if there's only one level
        tree[sub1].append(item['Link'])

    return tree


# Function to count items and print the nested dictionary in a tree format
def print_tree(tree, indent=0):
    total_count = 0  # Initialize a counter for the total number of items
    for key, value in tree.items():
        if isinstance(value, dict):
            # Recursively count items in subtrees and print them
            subtree_count = print_tree(value, indent+1)
            print('  ' * indent + f"{key} ({subtree_count} items)")
            total_count += subtree_count  # Add the count from the subtrees to the total count
        else:
            # If the value is not a dict, it's a list of items. Print the count of items.
            count = len(value)
            print('  ' * (indent+1) + f"{key} ({count} items)")
            total_count += count  # Add the count of items to the total count

    return total_count  # Return the total count of items

# Load the JSON file
json_fr = load_json('Scrapping/4.exports/needs/en_true_elements.json')

# Build the tree from the JSON data
tree = build_tree(json_fr)

# Print the tree with item counts
print_tree(tree)
