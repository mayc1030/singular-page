import json

with open(r'g:\sites\CAMISETAS\scripts\smooth_logo_paths.json', 'r') as f:
    data = json.load(f)

w = data['width']
h = data['height']
s_path = data['s_path']
ing_path = data['ing_path']

singular_designs = f'''  // --- 0. SINGULAR Official Brand Designs ---
  {{
    id: 'des-singular-icon',
    name: 'SINGULAR Llama Emblem',
    category: 'Minimalista',
    tags: ['singular', 'logo', 'emblema', 'fuego', 'icono'],
    featured: true,
    imageUrl: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="5 10 100 165" width="300" height="300">
        <defs>
          <linearGradient id="flameGradIconDesign" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#FF3D00" />
            <stop offset="35%" stop-color="#FF6A00" />
            <stop offset="70%" stop-color="#FF8800" />
            <stop offset="100%" stop-color="#FFA800" />
          </linearGradient>
        </defs>
        <g fill="url(#flameGradIconDesign)">
          <path d="{s_path}" fill-rule="evenodd" />
        </g>
      </svg>
    `)
  }},
  {{
    id: 'des-singular-full',
    name: 'SINGULAR Logo Oficial',
    category: 'Empresarial',
    tags: ['singular', 'logo', 'oficial', 'marca', 'premium'],
    featured: true,
    imageUrl: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="400" height="100">
        <defs>
          <linearGradient id="flameGradFullDesign" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#FF3D00" />
            <stop offset="35%" stop-color="#FF6A00" />
            <stop offset="70%" stop-color="#FF8800" />
            <stop offset="100%" stop-color="#FFA800" />
          </linearGradient>
        </defs>
        <g fill="url(#flameGradFullDesign)">
          <path d="{s_path}" fill-rule="evenodd" />
        </g>
        <g fill="#1E232A">
          <path d="{ing_path}" fill-rule="evenodd" />
        </g>
      </svg>
    `)
  }},
'''

with open(r'g:\sites\CAMISETAS\src\data\designs.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Insert before '// 1. Frases'
target = "export const DESIGNS: Design[] = [\n"
idx = content.find(target)
if idx != -1:
    new_content = content[:idx + len(target)] + singular_designs + content[idx + len(target):]
    with open(r'g:\sites\CAMISETAS\src\data\designs.ts', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Updated designs.ts successfully!")
else:
    print("Target not found in designs.ts")
