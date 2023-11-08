import json

# Load the JSON data
with open('de_links_citoyen.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Display the total number of links per language
print("Total number of links per language:")
for language, links in data.items():
    print(f"{language}: {len(links)} links")


print("\nAnalysis complete.")
