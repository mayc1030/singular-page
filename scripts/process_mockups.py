import os
from PIL import Image
import numpy as np

def remove_green_screen(input_path: str, output_path: str):
    img = Image.open(input_path).convert('RGBA')
    arr = np.array(img, dtype=np.float32)

    r = arr[:, :, 0]
    g = arr[:, :, 1]
    b = arr[:, :, 2]

    # Green screen detection
    # In pure bright green, g is very high and significantly higher than r and b
    # For white shirt: r, g, b are all high (~200-255) and close to each other.
    # Green metric: g - max(r, b)
    greenness = g - np.maximum(r, b)

    # Clean thresholding
    # greenness > 30 is definitely green background
    # greenness < 5 is definitely the white shirt
    # between 5 and 30 is the smooth transition edge
    
    alpha = np.ones_like(r) * 255.0
    
    # Fully transparent where greenness >= 25
    alpha[greenness >= 25] = 0.0
    
    # Smooth alpha transition
    edge_mask = (greenness > 5) & (greenness < 25)
    alpha[edge_mask] = 255.0 * (1.0 - (greenness[edge_mask] - 5.0) / 20.0)

    # De-spill green on the edge: replace green channel on edge pixels with average of red and blue
    spill_mask = greenness > 0
    arr[spill_mask, 1] = np.maximum(r[spill_mask], b[spill_mask])

    # Assign new alpha
    arr[:, :, 3] = alpha

    # Clip values and convert back to uint8
    arr = np.clip(arr, 0, 255).astype(np.uint8)
    out_img = Image.fromarray(arr, 'RGBA')

    # Save PNG
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    out_img.save(output_path, 'PNG')
    print(f"Successfully processed {input_path} -> {output_path}")

if __name__ == '__main__':
    mockups = [
        (
            r"C:\Users\SEREMPRE\.gemini\antigravity-ide\brain\9eb0585c-defb-43f0-971e-47110a015981\tshirt_front_mockup_1787066857950.jpg",
            r"g:\sites\CAMISETAS\public\mockups\tshirt-front.png"
        ),
        (
            r"C:\Users\SEREMPRE\.gemini\antigravity-ide\brain\9eb0585c-defb-43f0-971e-47110a015981\tshirt_back_mockup_1787066880624.jpg",
            r"g:\sites\CAMISETAS\public\mockups\tshirt-back.png"
        ),
        (
            r"C:\Users\SEREMPRE\.gemini\antigravity-ide\brain\9eb0585c-defb-43f0-971e-47110a015981\polo_front_mockup_1787067177363.jpg",
            r"g:\sites\CAMISETAS\public\mockups\polo-front.png"
        ),
        (
            r"C:\Users\SEREMPRE\.gemini\antigravity-ide\brain\9eb0585c-defb-43f0-971e-47110a015981\polo_back_mockup_1787067215044.jpg",
            r"g:\sites\CAMISETAS\public\mockups\polo-back.png"
        ),
        (
            r"C:\Users\SEREMPRE\.gemini\antigravity-ide\brain\9eb0585c-defb-43f0-971e-47110a015981\hoodie_front_mockup_1787067645259.jpg",
            r"g:\sites\CAMISETAS\public\mockups\hoodie-front.png"
        ),
        (
            r"C:\Users\SEREMPRE\.gemini\antigravity-ide\brain\9eb0585c-defb-43f0-971e-47110a015981\hoodie_back_mockup_1787067665215.jpg",
            r"g:\sites\CAMISETAS\public\mockups\hoodie-back.png"
        ),
        (
            r"C:\Users\SEREMPRE\.gemini\antigravity-ide\brain\9eb0585c-defb-43f0-971e-47110a015981\longsleeve_front_mockup_1787068185986.jpg",
            r"g:\sites\CAMISETAS\public\mockups\longsleeve-front.png"
        ),
        (
            r"C:\Users\SEREMPRE\.gemini\antigravity-ide\brain\9eb0585c-defb-43f0-971e-47110a015981\longsleeve_back_mockup_1787068211310.jpg",
            r"g:\sites\CAMISETAS\public\mockups\longsleeve-back.png"
        ),
        (
            r"C:\Users\SEREMPRE\.gemini\antigravity-ide\brain\9eb0585c-defb-43f0-971e-47110a015981\sweatshirt_front_mockup_1787069735280.jpg",
            r"g:\sites\CAMISETAS\public\mockups\sweatshirt-front.png"
        ),
        (
            r"C:\Users\SEREMPRE\.gemini\antigravity-ide\brain\9eb0585c-defb-43f0-971e-47110a015981\sweatshirt_back_mockup_1787069761779.jpg",
            r"g:\sites\CAMISETAS\public\mockups\sweatshirt-back.png"
        )
    ]

    for in_path, out_path in mockups:
        if os.path.exists(in_path):
            remove_green_screen(in_path, out_path)
        else:
            print(f"Skipping {in_path} (not found)")

