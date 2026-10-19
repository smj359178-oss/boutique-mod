#!/bin/bash
# Generate all images in parallel batches for speed
cd /home/z/my-project
LOG=/home/z/my-project/image-gen.log
echo "Parallel image gen started $(date)" > "$LOG"
OUT=/home/z/my-project/public

gen() {
  local name="$1"; local prompt="$2"; local size="$3"; local dir="$4"
  local path="$OUT/$dir/$name.png"
  if [ -f "$path" ] && [ -s "$path" ]; then
    echo "[skip] $name" >> "$LOG"; return 0
  fi
  z-ai image -p "$prompt" -o "$path" -s "$size" >> "$LOG" 2>&1
  if [ -f "$path" ] && [ -s "$path" ]; then
    echo "[ok] $dir/$name ($(stat -c%s "$path")b)" >> "$LOG"
  else
    echo "[fail] $dir/$name" >> "$LOG"
  fi
}

P() { gen "$@" & }

# Batch 1 (hero + women) - 5 parallel
P "hero" "Elegant fashion boutique hero banner, stylish woman wearing modern autumn outfit, soft warm beige and terracotta tones, minimalist studio background, professional fashion photography, high fashion editorial, soft cinematic lighting, premium clothing store aesthetic" "1344x768" ""
P "red-dress" "Professional product photography of elegant red evening dress on invisible mannequin, studio lighting, clean light gray background, high fashion, premium fabric, e-commerce style" "864x1152" "products"
P "cream-blouse" "Professional product photography of cream colored women silk blouse on invisible mannequin, studio lighting, clean light gray background, elegant minimalist fashion, e-commerce style" "864x1152" "products"
P "black-coat" "Professional product photography of black wool winter coat for women on invisible mannequin, studio lighting, clean light gray background, premium fashion, e-commerce style" "864x1152" "products"
P "midi-skirt" "Professional product photography of pleated beige midi skirt for women on invisible mannequin, studio lighting, clean light gray background, elegant fashion, e-commerce style" "864x1152" "products"
wait
echo "Batch 1 done" >> "$LOG"

# Batch 2 (men) - 4 parallel
P "men-shirt" "Professional product photography of white men long sleeve cotton shirt on invisible mannequin, studio lighting, clean light gray background, premium fashion, e-commerce style" "864x1152" "products"
P "men-tshirt" "Professional product photography of olive green men cotton t-shirt on invisible mannequin, studio lighting, clean light gray background, casual fashion, e-commerce style" "864x1152" "products"
P "men-jacket" "Professional product photography of brown leather jacket for men on invisible mannequin, studio lighting, clean light gray background, premium fashion, e-commerce style" "864x1152" "products"
P "men-jeans" "Professional product photography of dark blue denim jeans for men folded neatly, studio lighting, clean light gray background, premium fashion, e-commerce style" "864x1152" "products"
wait
echo "Batch 2 done" >> "$LOG"

# Batch 3 (kids + accessories) - 6 parallel
P "kids-dress" "Professional product photography of pink floral girls dress on small invisible mannequin, studio lighting, clean light gray background, cute kids fashion, e-commerce style" "864x1152" "products"
P "kids-tshirt" "Professional product photography of yellow boys cotton t-shirt folded neatly, studio lighting, clean light gray background, kids fashion, e-commerce style" "864x1152" "products"
P "handbag" "Professional product photography of tan brown leather handbag, studio lighting, clean light gray background, premium accessory, e-commerce style" "1024x1024" "products"
P "scarf" "Professional product photography of colorful silk scarf elegantly draped, studio lighting, clean light gray background, premium accessory, e-commerce style" "1024x1024" "products"
P "sunglasses" "Professional product photography of stylish black sunglasses, studio lighting, clean light gray background, premium accessory, e-commerce style" "1024x1024" "products"
P "watch" "Professional product photography of elegant minimalist wristwatch with brown leather strap, studio lighting, clean light gray background, premium accessory, e-commerce style" "1024x1024" "products"
wait
echo "Batch 3 done" >> "$LOG"

# Batch 4 (categories) - 4 parallel
P "women" "Fashion category banner, elegant woman in stylish beige outfit posing, warm tones, minimalist studio, fashion editorial photography" "864x1152" "categories"
P "men" "Fashion category banner, stylish man in modern casual outfit, neutral tones, minimalist studio, fashion editorial photography" "864x1152" "categories"
P "kids" "Fashion category banner, happy kids in colorful stylish clothes, bright cheerful tones, studio photography" "864x1152" "categories"
P "accessories" "Fashion accessories flat lay, leather bag sunglasses watch scarf, elegant warm tones, top view studio photography" "864x1152" "categories"
wait
echo "Batch 4 done" >> "$LOG"

echo "ALL DONE $(date)" >> "$LOG"
