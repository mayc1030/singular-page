import numpy as np
from PIL import Image
from skimage.measure import find_contours
from scipy.interpolate import splprep, splev

img = Image.open(r'C:\Users\SEREMPRE\.gemini\antigravity-ide\brain\faa1364c-c669-45fc-b119-bce88c5e7c37\.user_uploaded\media_1787180391794.png').convert('RGBA')
arr = np.array(img)
r, g, b, a = arr[:,:,0], arr[:,:,1], arr[:,:,2], arr[:,:,3]

s_mask = (a > 80) & (r > 160) & (b < 120)
ing_mask = (a > 80) & (r < 100) & (g < 100) & (b < 100)

def smooth_contour_to_svg_path(contour, s_factor=2.0, num_points=None):
    # contour is (N, 2) in (y, x)
    x = contour[:, 1]
    y = contour[:, 0]
    
    # Remove duplicate consecutive points
    dx = np.diff(x)
    dy = np.diff(y)
    dist = np.hypot(dx, dy)
    keep = np.insert(dist > 0.1, 0, True)
    x = x[keep]
    y = y[keep]
    
    if len(x) < 5:
        return ""
    
    # Ensure closed loop
    if not (np.isclose(x[0], x[-1]) and np.isclose(y[0], y[-1])):
        x = np.append(x, x[0])
        y = np.append(y, y[0])
        
    try:
        tck, u = splprep([x, y], s=s_factor, per=True, k=3)
        if num_points is None:
            num_points = max(30, int(len(x) * 1.5))
        u_new = np.linspace(u.min(), u.max(), num_points)
        x_new, y_new = splev(u_new, tck)
        
        # Build SVG path with cubic bezier approximation or smooth polyline
        d = f"M {x_new[0]:.2f} {y_new[0]:.2f} "
        for i in range(1, len(x_new)):
            d += f"L {x_new[i]:.2f} {y_new[i]:.2f} "
        d += "Z"
        return d
    except Exception as e:
        # Fallback to direct path
        d = f"M {x[0]:.2f} {y[0]:.2f} "
        for i in range(1, len(x)):
            d += f"L {x[i]:.2f} {y[i]:.2f} "
        d += "Z"
        return d

def mask_to_smooth_paths(mask, s_factor=1.5):
    padded = np.pad(mask.astype(float), pad_width=3, mode='constant', constant_values=0)
    contours = find_contours(padded, level=0.5)
    paths = []
    for c in contours:
        # shift back by 3
        c_shifted = c.copy()
        c_shifted[:, 0] -= 3
        c_shifted[:, 1] -= 3
        if len(c_shifted) < 10:
            continue
        p = smooth_contour_to_svg_path(c_shifted, s_factor=s_factor)
        if p:
            paths.append(p)
    return paths

s_smooth = mask_to_smooth_paths(s_mask, s_factor=1.2)
ing_smooth = mask_to_smooth_paths(ing_mask, s_factor=1.0)

print(f"Smooth: {len(s_smooth)} S paths, {len(ing_smooth)} INGULAR paths")

s_d = " ".join(s_smooth)
ing_d = " ".join(ing_smooth)

import json
data = {
    "width": img.width,
    "height": img.height,
    "s_path": s_d,
    "ing_path": ing_d
}

with open(r'g:\sites\CAMISETAS\scripts\smooth_logo_paths.json', 'w') as f:
    json.dump(data, f, indent=2)

print("Saved smooth_logo_paths.json successfully!")
