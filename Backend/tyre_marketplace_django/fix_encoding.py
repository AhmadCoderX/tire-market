import json

# Read the file in binary mode
with open('db_dump.json', 'rb') as f:
    content = f.read()

# Try to decode with different encodings
try:
    # First try UTF-8
    decoded_content = content.decode('utf-8')
except UnicodeDecodeError:
    try:
        # Then try UTF-16
        decoded_content = content.decode('utf-16')
    except UnicodeDecodeError:
        # Finally try with 'latin-1' which can read any byte
        decoded_content = content.decode('latin-1')

# Parse the JSON to validate it
data = json.loads(decoded_content)

# Write back in UTF-8
with open('db_dump.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("File has been converted to UTF-8 encoding successfully!") 