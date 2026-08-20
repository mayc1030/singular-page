export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

const ALLOWED_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/svg+xml',
  'image/webp'
];

const MAX_FILE_SIZE_BYTES = 12 * 1024 * 1024; // 12MB limit

export const validateImageFile = (file: File): ValidationResult => {
  if (!file) {
    return { isValid: false, errorMessage: 'No se seleccionó ningún archivo.' };
  }

  const isAllowedType =
    ALLOWED_MIME_TYPES.includes(file.type.toLowerCase()) ||
    /\.(png|jpe?g|svg|webp)$/i.test(file.name);

  if (!isAllowedType) {
    return {
      isValid: false,
      errorMessage: 'Formato no soportado. Permite únicamente PNG, JPG, JPEG, SVG y WEBP.'
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      isValid: false,
      errorMessage: `El archivo supera el tamaño máximo de 12 MB (Tamaño actual: ${(file.size / (1024 * 1024)).toFixed(1)} MB).`
    };
  }

  return { isValid: true };
};
