import numpy as np
from PIL import Image
from skimage.measure import find_contours
from shapely.geometry import Polygon
import json

img = Image.open(r'C:\Users\SEREMPRE\.gemini\antigravity-ide\brain\faa1364c-c669-45fc-b119-bce88c5e7c37\.user_uploaded\media_1787180391794.png').convert('RGBA')
arr = np.array(img)
r, g, b, a = arr[:,:,0], arr[:,:,1], arr[:,:,2], arr[:,:,3]

# The 'S' is orange
s_mask = (a > 100) & (r > 180) & (b < 100)
# 'INGULAR' is dark charcoal
ing_mask = (a > 100) & (r < 100) & (g < 100) & (b < 100)

def contours_to_svg_paths(mask, tolerance=0.7):
    # Pad mask to avoid boundary clipping
    padded = np.pad(mask.astype(float), pad_width=2, mode='constant', constant_values=0)
    contours = find_contours(padded, level=0.5)
    
    paths = []
    for c in contours:
        # adjust for padding (y, x) -> (x, y)
        pts = np.column_stack([c[:, 1] - 2, c[:, 0] - 2])
        if len(pts) < 4:
            continue
        poly = Polygon(pts)
        if poly.area < 10:
            continue
        simplified = poly.simplify(tolerance, preserve_topology=True)
        
        # Build SVG path
        ext = np.array(simplified.exterior.coords)
        d = f"M {ext[0,0]:.2f} {ext[0,1]:.2f} " + " ".join([f"L {p[0]:.2f} {p[1]:.2f}" for p in ext[1:]]) + " Z"
        
        for interior in simplified.interiors:
            int_pts = np.array(interior.coords)
            d += f" M {int_pts[0,0]:.2f} {int_pts[0,1]:.2f} " + " ".join([f"L {p[0]:.2f} {p[1]:.2f}" for p in int_pts[1:]]) + " Z"
        
        paths.append(d)
    return paths

s_paths = contours_to_svg_paths(s_mask, tolerance=0.4)
ing_paths = contours_to_svg_paths(ing_mask, tolerance=0.4)

print(f"Found {len(s_paths)} S paths and {len(ing_paths)} INGULAR paths")

data = {
    "width": img.width,
    "height": img.height,
    "s_paths": s_paths,
    "ing_paths": ing_paths
}

with open(r'g:\sites\CAMISETAS\scripts\logo_paths.json', 'w') as f:
    json.dump(data, f, indent=2)

print("Saved logo_paths.json successfully!")
