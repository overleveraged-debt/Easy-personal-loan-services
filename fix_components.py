#!/usr/bin/env python3
import os
import re

def update_html_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Add component loader script to head section
    component_script = '    <!-- Components Loader Script -->\n    <script src="../js/components-loader.js"></script>'
    content = re.sub(r'    <!-- Font Awesome CDN for icons -->\s*<link rel="stylesheet" href="[^"]*">\s*</head>', r'\g<0>' + component_script + '\n</head>', content, flags=re.DOTALL)

    # Replace header with placeholder
    header_placeholder = '    <!-- Header Component Placeholder -->\n    <div id="header-placeholder"></div>'
    content = re.sub(r'    <!-- Header -->\s*<header[^>]*>.*?</header>', header_placeholder, content, flags=re.DOTALL)

    # Replace footer with placeholder
    footer_placeholder = '    <!-- Footer Component Placeholder -->\n    <div id="footer-placeholder"></div>'
    content = re.sub(r'    <!-- Footer -->\s*<footer[^>]*>.*?</footer>', footer_placeholder, content, flags=re.DOTALL)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"Updated {file_path}")

def main():
    pages_dir = 'pages'
    target_files = [
        'terms.html',
        'overdraft-loan.html',
        'home-renovation.html',
        'emergency-loan.html',
        'wedding-loan.html'
    ]

    for filename in target_files:
        file_path = os.path.join(pages_dir, filename)
        if os.path.exists(file_path):
            update_html_file(file_path)
        else:
            print(f"File not found: {file_path}")

if __name__ == '__main__':
    main()
