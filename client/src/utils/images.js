export const PROPERTY_IMAGE_MAX_BYTES = 1.4 * 1024 * 1024;
export const PROPERTY_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function validatePropertyImage(file) {
  if (!file) return null;

  if (!PROPERTY_IMAGE_TYPES.includes(file.type)) {
    throw new Error('Use JPG, PNG, or WebP image only.');
  }

  if (file.size > PROPERTY_IMAGE_MAX_BYTES) {
    throw new Error('Image is too large. Keep it below 1.4 MB for now.');
  }

  return file;
}

export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Could not read image file.'));
    reader.readAsDataURL(file);
  });
}
