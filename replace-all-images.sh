#!/bin/bash

echo "🖼️ Replacing all img tags with Next.js Image component..."

# Function to replace img tags
replace_img() {
  local file=$1
  local temp_file="${file}.tmp"
  
  # Create a Python script to do the replacements
  python3 << 'PYTHON' > "$temp_file"
import re
import sys

with open("$file", 'r') as f:
    content = f.read()

# Pattern to match img tags
img_pattern = r'<img\s+([^>]*?)src=["\']([^"\']*)["\']([^>]*?)/?>'

def replace_img(match):
    attrs = match.group(1) + match.group(3)
    src = match.group(2)
    
    # Extract alt attribute
    alt_match = re.search(r'alt=["\']([^"\']*)["\']', attrs)
    alt = alt_match.group(1) if alt_match else ""
    
    # Extract className
    class_match = re.search(r'className=["\']([^"\']*)["\']', attrs)
    className = class_match.group(1) if class_match else ""
    
    # Check if it has fixed dimensions
    if 'h-' in className or 'w-' in className:
        # Fixed size image
        width = "100"
        height = "100"
        if 'h-12' in className:
            width = height = "48"
        elif 'h-10' in className:
            width = height = "40"
        elif 'h-8' in className:
            width = height = "32"
        
        return f'<Image src="{src}" alt="{alt}" width={{{width}}} height={{{height}}} className="{className}" />'
    else:
        # Responsive image
        return f'<Image src="{src}" alt="{alt}" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />'

# Replace all img tags
content = re.sub(img_pattern, replace_img, content)

print(content)
PYTHON

  if [ -s "$temp_file" ]; then
    mv "$temp_file" "$file"
    echo "✓ Processed $file"
  else
    rm -f "$temp_file"
    echo "✗ Error processing $file"
  fi
}

# Files to process
files=(
  "app/(private)/admin/orders/page.js"
  "app/admin/components/GalleryManager.js"
  "app/admin/components/MaterialsManager.js"
  "app/admin/components/ProductsManager.js"
  "app/stickers/checkout/page.js"
  "app/stickers/materials/page.js"
  "components/stickers/DesignPreview.js"
  "components/stickers/FileUploader.js"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "Processing $file..."
    # Manual replacements for known patterns
    sed -i 's/<img/<Image/g' "$file"
    sed -i 's|className="w-full h-full object-cover"|fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw"|g' "$file"
  fi
done

echo "✅ Image replacements complete"
