export const defaultPropertyReferenceForm = {
  title: '',
  description: '',
  apartmentName: '',
  location: '',
  price: '',
  propertyType: '1 BHK',
  listingType: 'Sale',
  area: '',
  bedrooms: '',
  bathrooms: '',
  floor: '',
  totalFloors: '',
  furnishing: '',
  status: 'Fresh',
  score: '90',
  commission: '',
  walkTime: 'Added from Swagat admin panel',
  latitude: '',
  longitude: '',
  tags: 'Admin Added',
  amenities: 'Admin Added',
  isActive: true,
  images: [],
};

export const propertyStatuses = ['Fresh', 'Visit Today', 'Negotiable', 'Hot', 'Prime Frontage', 'Owner Direct'];
export const propertyTypes = ['1 RK', '1 BHK', '2 BHK', '3 BHK', 'Shop', 'Office', 'Plot'];
export const listingTypes = ['Sale', 'Rent'];
export const imageLabels = ['Hall', 'Bedroom', 'Kitchen', 'Bathroom', 'Balcony', 'Building', 'Exterior', 'Floor Plan', 'Other'];
export const maxPropertyImages = 8;

export function formatFileSize(bytes) {
  if (!bytes) return '';
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function numberValue(value) {
  const cleaned = String(value).replace(/[^0-9.]/g, '');
  return cleaned ? Number(cleaned) : 0;
}

export function optionalNumber(value) {
  const cleaned = String(value ?? '').replace(/[^0-9.-]/g, '');
  return cleaned ? Number(cleaned) : null;
}

export function listValue(value) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}
