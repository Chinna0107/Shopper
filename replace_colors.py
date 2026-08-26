import os
import re

directories = ['src/pages', 'src/components']

replacements = [
    (r'from-brand-orange to-yellow-500', 'from-brand-navy to-blue-500'),
    (r'brand-orange', 'brand-navy'),
    (r'#fe6603', '#012980'),
    (r'#FE6603', '#012980'),
    (r'#022A21', '#012980'),
    (r'#022a21', '#012980'),
    (r'#054335', '#001d5a'),
    (r'orange-50\b', 'blue-50'),
    (r'orange-100\b', 'blue-100'),
    (r'orange-200\b', 'blue-200'),
    (r'orange-300\b', 'blue-300'),
    (r'orange-400\b', 'blue-400'),
    (r'orange-500\b', 'blue-500'),
    (r'orange-600\b', 'blue-600'),
    (r'orange-700\b', 'blue-700'),
    (r'orange-800\b', 'blue-800'),
    (r'orange-900\b', 'blue-900'),
]

for directory in directories:
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.jsx') or file.endswith('.js'):
                filepath = os.path.join(root, file)
                with open(filepath, 'r') as f:
                    content = f.read()
                
                original_content = content
                for old, new in replacements:
                    content = re.sub(old, new, content)
                
                if content != original_content:
                    with open(filepath, 'w') as f:
                        f.write(content)
                    print(f"Updated {filepath}")

print("Done!")
