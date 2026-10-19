#!/bin/bash
# Generate all product and hero images for the clothing store
set -u
cd /home/z/my-project

OUT=/home/z/my-project/public
LOG=/home/z/my-project/image-gen.log
echo "Starting image generation at $(date)" > "$LOG"

gen() {
  local name="$1"; local prompt="$2"; local size="${3:-1024x1024}"
  local path="$OUT/products/$name.png"
  if [ -f "$path" ] && [ -s "$path" ]; then
    echo "[skip] $name already exists" >> "$LOG"
    return 0
  fi
  echo "[gen ] $name ($size)" >> "$LOG"
  z-ai image -p "$prompt" -o "$path" -s "$size" >> "$LOG" 2>&1
  if [ -f "$path" ] && [ -s "$path" ]; then
    echo "[ok  ] $name ($(stat -c%s "$path") bytes)" >> "$LOG"
  else
    echo "[fail] $name" >> "$LOG"
  fi
}

gen_hero() {
  local name="$1"; local prompt="$2"; local size="${3:-1344x768}"
  local path="$OUT/$name.png"
  if [ -f "$path" ] && [ -s "$path" ]; then
    echo "[skip] $name already exists" >> "$LOG"
    return 0
  fi
  echo "[gen ] $name ($size)" >> "$LOG"
  z-ai image -p "$prompt" -o "$path" -s "$size" >> "$LOG" 2>&1
  if [ -f "$path" ] && [ -s "$path" ]; then
    echo "[ok  ] $name ($(stat -c%s "$path") bytes)" >> "$LOG"
  else
    echo "[fail] $name" >> "$LOG"
  fi
}

# Hero banner
gen_hero "hero" "Elegant fashion boutique hero banner, stylish woman wearing modern autumn outfit, soft warm beige and terracotta tones, minimalist studio background, professional fashion photography, high fashion editorial, soft cinematic lighting, full body, premium clothing store aesthetic" "1344x768"

# Women
gen "red-dress" "Professional product photography of elegant red evening dress on invisible mannequin, studio lighting, clean light gray background, high fashion, premium fabric, full garment visible, e-commerce style" "864x1152"
gen "cream-blouse" "Professional product photography of cream colored women silk blouse on invisible mannequin, studio lighting, clean light gray background, elegant minimalist fashion, e-commerce style" "864x1152"
gen "black-coat" "Professional product photography of black wool winter coat for women on invisible mannequin, studio lighting, clean light gray background, premium fashion, e-commerce style" "864x1152"
gen "midi-skirt" "Professional product photography of pleated beige midi skirt for women on invisible mannequin, studio lighting, clean light gray background, elegant fashion, e-commerce style" "864x1152"

# Men
gen "men-shirt" "Professional product photography of white men long sleeve cotton shirt on invisible mannequin, studio lighting, clean light gray background, premium fashion, e-commerce style" "864x1152"
gen "men-tshirt" "Professional product photography of olive green men cotton t-shirt on invisible mannequin, studio lighting, clean light gray background, casual fashion, e-commerce style" "864x1152"
gen "men-jacket" "Professional product photography of brown leather jacket for men on invisible mannequin, studio lighting, clean light gray background, premium fashion, e-commerce style" "864x1152"
gen "men-jeans" "Professional product photography of dark blue denim jeans for men folded neatly, studio lighting, clean light gray background, premium fashion, e-commerce style" "864x1152"

# Kids
gen "kids-dress" "Professional product photography of pink floral girls dress on small invisible mannequin, studio lighting, clean light gray background, cute kids fashion, e-commerce style" "864x1152"
gen "kids-tshirt" "Professional product photography of yellow boys cotton t-shirt folded neatly, studio lighting, clean light gray background, kids fashion, e-commerce style" "864x1152"

# Accessories
gen "handbag" "Professional product photography of tan brown leather handbag, studio lighting, clean light gray background, premium accessory, e-commerce style" "1024x1024"
gen "scarf" "Professional product photography of colorful silk scarf elegantly draped, studio lighting, clean light gray background, premium accessory, e-commerce style" "1024x1024"
gen "sunglasses" "Professional product photography of stylish black sunglasses, studio lighting, clean light gray background, premium accessory, e-commerce style" "1024x1024"
gen "watch" "Professional product photography of elegant minimalist wristwatch with brown leather strap, studio lighting, clean light gray background, premium accessory, e-commerce style" "1024x1024"

# Category images
gen_cat() {
  local name="$1"; local prompt="$2"
  local path="$OUT/categories/$name.png"
  if [ -f "$path" ] && [ -s "$path" ]; then echo "[skip] cat $name"; return 0; fi
  z-ai image -p "$prompt" -o "$path" -s "864x1152" >> "$LOG" 2>&1
  echo "[ok  ] cat $name" >> "$LOG"
}
gen_cat "women" "Fashion category banner, elegant woman in stylish beige outfit posing, warm tones, minimalist studio, fashion editorial photography"
gen_cat "men" "Fashion category banner, stylish man in modern casual outfit, neutral tones, minimalist studio, fashion editorial photography"
gen_cat "kids" "Fashion category banner, happy kids in colorful stylish clothes, bright cheerful tones, studio photography"
gen_cat "accessories" "Fashion accessories flat lay, leather bag sunglasses watch scarf, elegant warm tones, top view studio photography"

echo "Finished image generation at $(date)" >> "$LOG"
