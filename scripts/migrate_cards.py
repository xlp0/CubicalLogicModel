import json
import sqlite3
import os

# Read JSON file
json_path = os.path.join('src', 'data', 'SelectedCards.json')
with open(json_path, 'r') as f:
    data = json.load(f)

# Connect to SQLite database
db_path = os.path.join('src', 'data', 'CardRepository.db')
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Get existing cards to avoid duplicates
cursor.execute('SELECT importPath, title, componentProps FROM cards')
existing_cards = set()
for row in cursor.fetchall():
    import_path = row[0]
    title = row[1]
    props = row[2]
    # Create a unique key for each card
    card_key = f"{import_path}:{title}:{props}"
    existing_cards.add(card_key)

# Process each card
for card in data['cards']:
    import_path = card['importPath']
    title = card.get('title') or card['componentProps'].get('title')
    height = card.get('height', '400px')
    component_props = json.dumps(card['componentProps'])
    
    # Create a unique key for this card
    card_key = f"{import_path}:{title}:{component_props}"
    
    # Skip if this card already exists
    if card_key in existing_cards:
        print(f"Skipping duplicate card: {title}")
        continue
    
    # Insert new card
    cursor.execute('''
        INSERT INTO cards (importPath, title, height, componentProps)
        VALUES (?, ?, ?, ?)
    ''', (import_path, title, height, component_props))
    print(f"Added card: {title}")

# Commit changes and close connection
conn.commit()
conn.close()

print("Migration completed successfully!")
