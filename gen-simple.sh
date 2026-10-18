#!/bin/bash
# Simple reliable image generation - batches of 3
cd /home/z/my-project
LOG=image-gen.log
echo "=== Simple gen $(date) ===" >> "$LOG"

run() {
  local name="$1" prompt="$2" size="$3" dir="$4"
  local path="public/$dir/$name.png"
  [ -f "$path" ] && [ -s "$path" ] && { echo "[skip] $dir/$name" >> "$LOG"; return; }
  z-ai image -p "$prompt" -o "$path" -s "$size" >> "$LOG" 2>&1
  [ -f "$path" ] && [ -s "$path" ] && echo "[ok] $dir/$name" >> "$LOG" || echo "[FAIL] $dir/$name" >> "$LOG"
}

# Batch A
run "red-dress" "Professional product photography of elegant red evening dress on invisible mannequin, studio lighting, clean light gray background, high fashion, e-commerce style" "864x1152" "products" &
run "midi-skirt" "Professional product photography of pleated beige midi skirt on invisible mannequin, studio lighting, clean light gray background, elegant fashion, e-commerce style" "864x1152" "products" &
run "men-shirt" "Professional product photography of white men long sleeve cotton shirt on invisible mannequin, studio lighting, clean light gray background, premium fashion, e-commerce style" "864x1152" "products" &
wait
echo "[A done]" >> "$LOG"

# Batch B
run "men-tshirt" "Professional product photography of olive green men cotton t-shirt on invisible mannequin, studio lighting, clean light gray background, casual fashion, e-commerce style" "864x1152" "products" &
run "men-jacket" "Professional product photography of brown leather jacket for men on invisible mannequin, studio lighting, clean light gray background, premium fashion, e-commerce style" "864x1152" "products" &
run "men-jeans" "Professional product photography of dark blue denim jeans for men folded neatly, studio lighting, clean light gray background, premium fashion, e-commerce style" "864x1152" "products" &
wait
echo "[B done]" >> "$LOG"

# Batch C
run "kids-dress" "Professional product photography of pink floral girls dress on small invisible mannequin, studio lighting, clean light gray background, cute kids fashion, e-commerce style" "864x1152" "products" &
run "kids-tshirt" "Professional product photography of yellow boys cotton t-shirt folded neatly, studio lighting, clean light gray background, kids fashion, e-commerce style" "864x1152" "products" &
run "handbag" "Professional product photography of tan brown leather handbag, studio lighting, clean light gray background, premium accessory, e-commerce style" "1024x1024" "products" &
wait
echo "[C done]" >> "$LOG"

# Batch D
run "scarf" "Professional product photography of colorful silk scarf elegantly draped, studio lighting, clean light gray background, premium accessory, e-commerce style" "1024x1024" "products" &
run "sunglasses" "Professional product photography of stylish black sunglasses, studio lighting, clean light gray background, premium accessory, e-commerce style" "1024x1024" "products" &
run "watch" "Professional product photography of elegant minimalist wristwatch with brown leather strap, studio lighting, clean light gray background, premium accessory, e-commerce style" "1024x1024" "products" &
wait
echo "[D done]" >> "$LOG"

# Batch E (categories)
run "women" "Fashion category banner, elegant woman in stylish beige outfit posing, warm tones, minimalist studio, fashion editorial photography" "864x1152" "categories" &
run "men" "Fashion category banner, stylish man in modern casual outfit, neutral tones, minimalist studio, fashion editorial photography" "864x1152" "categories" &
run "kids" "Fashion category banner, happy kids in colorful stylish clothes, bright cheerful tones, studio photography" "864x1152" "categories" &
wait
echo "[E done]" >> "$LOG"

# Batch F
run "accessories" "Fashion accessories flat lay, leather bag sunglasses watch scarf, elegant warm tones, top view studio photography" "864x1152" "categories" &
wait
echo "[F done]" >> "$LOG"

echo "=== ALL DONE $(date) total=$(ls public/products/*.png public/categories/*.png public/hero.png 2>/dev/null | wc -l) ===" >> "$LOG"
