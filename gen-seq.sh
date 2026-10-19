#!/bin/bash
# Sequential image generation with 429 retry - reliable
cd /home/z/my-project
LOG=image-gen.log
echo "=== Seq gen $(date) ===" >> "$LOG"

run() {
  local name="$1" prompt="$2" size="$3" dir="$4"
  local path="public/$dir/$name.png"
  if [ -f "$path" ] && [ -s "$path" ]; then
    echo "[skip] $dir/$name" >> "$LOG"; return 0
  fi
  for attempt in 1 2 3 4 5; do
    z-ai image -p "$prompt" -o "$path" -s "$size" >> "$LOG" 2>&1
    if [ -f "$path" ] && [ -s "$path" ]; then
      echo "[ok] $dir/$name (try $attempt)" >> "$LOG"
      return 0
    fi
    echo "[retry $attempt] $dir/$name - waiting 12s" >> "$LOG"
    sleep 12
  done
  echo "[FAIL] $dir/$name" >> "$LOG"
}

run "red-dress" "Professional product photography of elegant red evening dress on invisible mannequin, studio lighting, clean light gray background, high fashion, e-commerce style" "864x1152" "products"
sleep 2
run "men-tshirt" "Professional product photography of olive green men cotton t-shirt on invisible mannequin, studio lighting, clean light gray background, casual fashion, e-commerce style" "864x1152" "products"
sleep 2
run "men-jacket" "Professional product photography of brown leather jacket for men on invisible mannequin, studio lighting, clean light gray background, premium fashion, e-commerce style" "864x1152" "products"
sleep 2
run "men-jeans" "Professional product photography of dark blue denim jeans for men folded neatly, studio lighting, clean light gray background, premium fashion, e-commerce style" "864x1152" "products"
sleep 2
run "kids-dress" "Professional product photography of pink floral girls dress on small invisible mannequin, studio lighting, clean light gray background, cute kids fashion, e-commerce style" "864x1152" "products"
sleep 2
run "kids-tshirt" "Professional product photography of yellow boys cotton t-shirt folded neatly, studio lighting, clean light gray background, kids fashion, e-commerce style" "864x1152" "products"
sleep 2
run "handbag" "Professional product photography of tan brown leather handbag, studio lighting, clean light gray background, premium accessory, e-commerce style" "1024x1024" "products"
sleep 2
run "scarf" "Professional product photography of colorful silk scarf elegantly draped, studio lighting, clean light gray background, premium accessory, e-commerce style" "1024x1024" "products"
sleep 2
run "sunglasses" "Professional product photography of stylish black sunglasses, studio lighting, clean light gray background, premium accessory, e-commerce style" "1024x1024" "products"
sleep 2
run "watch" "Professional product photography of elegant minimalist wristwatch with brown leather strap, studio lighting, clean light gray background, premium accessory, e-commerce style" "1024x1024" "products"
sleep 2
run "women" "Fashion category banner, elegant woman in stylish beige outfit posing, warm tones, minimalist studio, fashion editorial photography" "864x1152" "categories"
sleep 2
run "men" "Fashion category banner, stylish man in modern casual outfit, neutral tones, minimalist studio, fashion editorial photography" "864x1152" "categories"
sleep 2
run "kids" "Fashion category banner, happy kids in colorful stylish clothes, bright cheerful tones, studio photography" "864x1152" "categories"
sleep 2
run "accessories" "Fashion accessories flat lay, leather bag sunglasses watch scarf, elegant warm tones, top view studio photography" "864x1152" "categories"

echo "=== ALL DONE $(date) total=$(ls public/products/*.png public/categories/*.png public/hero.png 2>/dev/null | wc -l) ===" >> "$LOG"
