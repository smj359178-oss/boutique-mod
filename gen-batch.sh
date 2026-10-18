#!/bin/bash
cd /home/z/my-project
LOG=image-gen.log
echo "Batch gen $(date)" >> "$LOG"
gen() {
  local name="$1"; local prompt="$2"; local size="$3"; local dir="$4"
  local path="public/$dir/$name.png"
  [ -f "$path" ] && [ -s "$path" ] && { echo "[skip] $name" >> "$LOG"; return; }
  z-ai image -p "$prompt" -o "$path" -s "$size" >> "$LOG" 2>&1
  [ -f "$path" ] && [ -s "$path" ] && echo "[ok] $dir/$name" >> "$LOG" || echo "[fail] $dir/$name" >> "$LOG"
}
# batch of 3
gen "$1" "$5" "$6" products &
gen "$2" "$7" "$8" products &
gen "$3" "$9" "${10}" products &
wait
