#!/bin/bash

echo "🖼️ Replacing img tags with next/image..."

# Add Image import to files that need it
files_with_img=(
  "app/(private)/admin/orders/page.js"
  "app/admin/components/GalleryManager.js"
  "app/admin/components/MaterialsManager.js"
  "app/admin/components/ProductsManager.js"
  "app/stickers/checkout/page.js"
  "app/stickers/gallery/page.js"
  "app/stickers/materials/page.js"
  "components/stickers/DesignPreview.js"
  "components/stickers/FileUploader.js"
)

for file in "${files_with_img[@]}"; do
  if grep -q "^import Image from" "$file"; then
    echo "✓ $file already has Image import"
  else
    # Add Image import after the first import line
    sed -i '0,/^import.*from/s//import Image from "next\/image";\n&/' "$file" 2>/dev/null || \
    sed -i '1s/^/import Image from "next\/image";\n/' "$file"
    echo "✓ Added Image import to $file"
  fi
done

echo "✅ Image imports added"
