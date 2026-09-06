export function getPropertyImages(property) {
  if (!property) return [];

  if (Array.isArray(property.images) && property.images.length) {
    return property.images
      .map((image, index) => ({
        imageUrl: image.imageUrl || image.image_url || image.url || image,
        displayOrder: image.displayOrder ?? image.display_order ?? index,
        isPrimary: image.isPrimary ?? image.is_primary ?? index === 0,
        imageLabel: image.imageLabel || image.image_label || image.label || `Photo ${index + 1}`,
        imageSize: image.imageSize || image.image_size || image.size || '',
      }))
      .filter((image) => image.imageUrl)
      .sort((first, second) => first.displayOrder - second.displayOrder);
  }

  return property.image ? [{ imageUrl: property.image, displayOrder: 0, isPrimary: true }] : [];
}

export function getPrimaryPropertyImage(property) {
  const images = getPropertyImages(property);
  return images.find((image) => image.isPrimary)?.imageUrl || images[0]?.imageUrl || property?.image || '';
}
