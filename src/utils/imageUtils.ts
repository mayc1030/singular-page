export const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

/**
 * Universal asset URL resolver for Vite development, production and GitHub Pages
 */
export const getAssetUrl = (path: string): string => {
  if (!path) return '';
  if (
    path.startsWith('data:') ||
    path.startsWith('blob:') ||
    path.startsWith('http://') ||
    path.startsWith('https://')
  ) {
    return path;
  }
  // Strip leading ./ or /
  const cleanPath = path.replace(/^\.?\//, '');
  
  // In dev mode, always serve from absolute root /
  if (import.meta.env.DEV) {
    return `/${cleanPath}`;
  }

  const base = import.meta.env.BASE_URL || '/';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  return `${cleanBase}${cleanPath}`;
};

/**
 * Handles SVG template color replacement or returns direct image URLs (PNG/JPG) safely
 */
export const applyColorToSvgTemplate = (templateString: string, hexColor: string): string => {
  if (!templateString) return '';
  
  // If it's a direct image file path (PNG, JPG, WebP) or external URL, return it directly
  if (
    templateString.endsWith('.png') ||
    templateString.endsWith('.jpg') ||
    templateString.endsWith('.jpeg') ||
    templateString.endsWith('.webp') ||
    templateString.startsWith('http') ||
    templateString.startsWith('/') ||
    templateString.startsWith('./')
  ) {
    return getAssetUrl(templateString);
  }

  try {
    let rawSvg = templateString;
    if (rawSvg.startsWith('data:image/svg+xml;charset=utf-8,')) {
      rawSvg = decodeURIComponent(rawSvg.replace('data:image/svg+xml;charset=utf-8,', ''));
    }
    const updatedSvg = rawSvg.replace(/#COLOR_PLACEHOLDER#/g, hexColor);
    
    // Robust browser-universal Base64 encoding
    const base64 = btoa(unescape(encodeURIComponent(updatedSvg)));
    return `data:image/svg+xml;base64,${base64}`;
  } catch (err) {
    console.error('Error applying SVG color', err);
    return templateString;
  }
};
