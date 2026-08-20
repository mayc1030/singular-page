"""
Script mejorado: remoción de fondo usando flood fill desde esquinas.
Detecta el color desde las esquinas y conecta regionalmente los píxeles de fondo,
evitando remover accidentalmente píxeles de la prenda.
"""
from PIL import Image
import numpy as np
from collections import deque
import os

def remove_background_flood_fill(input_path: str, output_path: str, tolerance: int = 40):
    img = Image.open(input_path).convert('RGBA')
    arr = np.array(img, dtype=np.uint8)
    h, w = arr.shape[:2]

    visited = np.zeros((h, w), dtype=bool)
    bg_mask = np.zeros((h, w), dtype=bool)

    def color_dist(c1, c2):
        return np.sqrt(np.sum((c1.astype(np.int32) - c2.astype(np.int32))**2))

    def flood_fill(start_y, start_x, ref_color, tol):
        queue = deque()
        queue.append((start_y, start_x))
        while queue:
            y, x = queue.popleft()
            if y < 0 or y >= h or x < 0 or x >= w:
                continue
            if visited[y, x]:
                continue
            visited[y, x] = True
            px = arr[y, x, :3]
            if color_dist(px.astype(np.float32), ref_color.astype(np.float32)) <= tol:
                bg_mask[y, x] = True
                queue.append((y+1, x))
                queue.append((y-1, x))
                queue.append((y, x+1))
                queue.append((y, x-1))

    # Tomar referencias de los 4 bordes (múltiples puntos)
    seed_points = []
    step = 50
    for sx in range(0, w, step):
        seed_points.append((0, sx))
        seed_points.append((h-1, sx))
    for sy in range(0, h, step):
        seed_points.append((sy, 0))
        seed_points.append((sy, w-1))

    # Para cada punto semilla, si no visitado, hacer flood fill
    for (sy, sx) in seed_points:
        if not visited[sy, sx]:
            ref = arr[sy, sx, :3].astype(np.float32)
            flood_fill(sy, sx, ref, tolerance)

    # Hacer transparentes los píxeles de fondo
    result = arr.copy()
    result[bg_mask, 3] = 0

    # Suavizar bordes (anti-aliasing): píxeles de borde con alpha parcial
    from scipy.ndimage import binary_erosion
    inner_shirt = ~bg_mask
    eroded = binary_erosion(inner_shirt, iterations=2)
    edge = inner_shirt & ~eroded
    result[edge, 3] = np.minimum(result[edge, 3], 180)  # semi-transparente en bordes

    out_img = Image.fromarray(result, 'RGBA')
    out_img.save(output_path, 'PNG')

    removed = int(np.sum(bg_mask))
    total = h * w
    print(f"  OK Removidos: {removed:,} pixels ({100*removed/total:.1f}%) -> {output_path}")
    return True


if __name__ == '__main__':
    mockups_dir = r'g:\sites\CAMISETAS\public\mockups'
    files = [
        'tshirt-front.png',
        'tshirt-back.png',
        'hoodie-front.png',
        'polo-front.png',
        'longsleeve-front.png',
        'sweatshirt-front.png',
    ]
    for f in files:
        path = os.path.join(mockups_dir, f)
        if os.path.exists(path):
            print(f"Procesando: {f}")
            remove_background_flood_fill(path, path, tolerance=40)
        else:
            print(f"No encontrado: {f}")
    print("\nProceso completado.")
