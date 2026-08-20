import json

with open(r'g:\sites\CAMISETAS\scripts\logo_paths.json', 'r') as f:
    data = json.load(f)

w = data['width']
h = data['height']

s_d = " ".join(data['s_paths'])
ing_d = " ".join(data['ing_paths'])

svg_content = f'''<svg viewBox="0 0 {w} {h}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="singularFlameGrad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FF4500" />
      <stop offset="35%" stop-color="#FF6A00" />
      <stop offset="70%" stop-color="#FF8800" />
      <stop offset="100%" stop-color="#FFA800" />
    </linearGradient>
    <style>
      @keyframes flameBreathing {{
        0%, 100% {{
          filter: drop-shadow(0 0 4px rgba(255, 102, 0, 0.5));
          transform: scale(1);
        }}
        50% {{
          filter: drop-shadow(0 0 12px rgba(255, 130, 0, 0.85)) brightness(1.12);
          transform: scale(1.025);
        }}
      }}
      .singular-s-flame {{
        transform-origin: 55px 95px;
        animation: flameBreathing 2.8s ease-in-out infinite;
      }}
    </style>
  </defs>

  <!-- Flame S -->
  <g class="singular-s-flame" fill="url(#singularFlameGrad)">
    <path d="{s_d}" fill-rule="evenodd" />
  </g>

  <!-- INGULAR Text -->
  <g fill="#FFFFFF">
    <path d="{ing_d}" fill-rule="evenodd" />
  </g>
</svg>
'''

with open(r'g:\sites\CAMISETAS\public\logo-singular-exact.svg', 'w') as f:
    f.write(svg_content)

print("Created logo-singular-exact.svg!")
