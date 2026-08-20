import json

with open(r'g:\sites\CAMISETAS\scripts\smooth_logo_paths.json', 'r') as f:
    data = json.load(f)

w = data['width']
h = data['height']
s_path = data['s_path']
ing_path = data['ing_path']

# Standalone SVG for full logo (dark text for white/light shirts)
svg_full_dark = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="400" height="100">
  <defs>
    <linearGradient id="flameGradFull" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FF3D00" />
      <stop offset="35%" stop-color="#FF6A00" />
      <stop offset="70%" stop-color="#FF8800" />
      <stop offset="100%" stop-color="#FFA800" />
    </linearGradient>
  </defs>
  <g fill="url(#flameGradFull)">
    <path d="{s_path}" fill-rule="evenodd" />
  </g>
  <g fill="#1E232A">
    <path d="{ing_path}" fill-rule="evenodd" />
  </g>
</svg>'''

# Standalone SVG for isolated flame S
# The S bounds are X: 11 to 103, Y: 14 to 172 (width ~92, height ~158)
svg_icon_flame = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="5 10 100 165" width="200" height="300">
  <defs>
    <linearGradient id="flameGradIcon" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FF3D00" />
      <stop offset="35%" stop-color="#FF6A00" />
      <stop offset="70%" stop-color="#FF8800" />
      <stop offset="100%" stop-color="#FFA800" />
    </linearGradient>
  </defs>
  <g fill="url(#flameGradIcon)">
    <path d="{s_path}" fill-rule="evenodd" />
  </g>
</svg>'''

# Save these to public folder too
with open(r'g:\sites\CAMISETAS\public\singular-full-dark.svg', 'w', encoding='utf-8') as f:
    f.write(svg_full_dark)

with open(r'g:\sites\CAMISETAS\public\singular-flame-emblem.svg', 'w', encoding='utf-8') as f:
    f.write(svg_icon_flame)

print("Saved public/singular-full-dark.svg and public/singular-flame-emblem.svg")
