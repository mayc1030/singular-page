import numpy as np
from PIL import Image

img = Image.open(r'C:\Users\SEREMPRE\.gemini\antigravity-ide\brain\faa1364c-c669-45fc-b119-bce88c5e7c37\.user_uploaded\media_1787180391794.png').convert('RGBA')
arr = np.array(img)
r, g, b, a = arr[:,:,0], arr[:,:,1], arr[:,:,2], arr[:,:,3]

# The 'S' is orange (high R, low B):
s_mask = (a > 50) & (r > 180) & (b < 100)
# 'INGULAR' is dark charcoal (low R, G, B, high A):
ing_mask = (a > 50) & (r < 100) & (g < 100) & (b < 100)

print("S pixels:", np.sum(s_mask), "INGULAR pixels:", np.sum(ing_mask))
print("S bounding box:")
y_indices, x_indices = np.where(s_mask)
print(f"X: {x_indices.min()} to {x_indices.max()}, Y: {y_indices.min()} to {y_indices.max()}")

y_ing, x_ing = np.where(ing_mask)
print(f"INGULAR X: {x_ing.min()} to {x_ing.max()}, Y: {y_ing.min()} to {y_ing.max()}")
