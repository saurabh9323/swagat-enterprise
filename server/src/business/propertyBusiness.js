import { demoProperties } from '../data/demoData.js';
import * as propertyService from '../services/propertyService.js';
import { ApiError } from '../utils/ApiError.js';
import { normalizePropertyPayload } from '../utils/normalize.js';

const allowedListingTypes = ['Sale', 'Rent'];
const allowedStatuses = ['Fresh', 'Visit Today', 'Negotiable', 'Hot', 'Prime Frontage', 'Owner Direct', 'Inactive'];

let memoryProperties = [...demoProperties];

function databaseEnabled(request) {
  return Boolean(request.app.locals.databaseReady);
}

function assertListingType(listingType) {
  if (!allowedListingTypes.includes(listingType)) {
    throw new ApiError(400, 'Invalid listing type');
  }
}

function assertStatus(status) {
  if (!allowedStatuses.includes(status)) {
    throw new ApiError(400, 'Invalid property status');
  }
}

export async function listProperties(filters, request) {
  if (!databaseEnabled(request)) {
    const q = filters.q?.toLowerCase();
    return memoryProperties.filter((property) => {
      const matchesText = !q || `${property.title} ${property.location} ${property.type} ${property.intent}`.toLowerCase().includes(q);
      const matchesStatus = !filters.status || property.status === filters.status;
      const matchesType = !filters.propertyType || property.type === filters.propertyType;
      const matchesListing = !filters.listingType || property.intent === filters.listingType;
      const matchesLocation = !filters.location || property.location.toLowerCase().includes(filters.location.toLowerCase());
      const matchesMin = filters.minPrice === undefined || property.price >= filters.minPrice;
      const matchesMax = filters.maxPrice === undefined || property.price <= filters.maxPrice;
      return matchesText && matchesStatus && matchesType && matchesListing && matchesLocation && matchesMin && matchesMax;
    });
  }

  return propertyService.getProperties(filters);
}

export async function getProperty(id, request) {
  const property = databaseEnabled(request)
    ? await propertyService.getPropertyById(id)
    : memoryProperties.find((item) => item.id === id);

  if (!property) {
    throw new ApiError(404, 'Property not found');
  }

  return property;
}

export async function createProperty(payload, user, request) {
  const listingType = payload.listingType || payload.intent;
  assertListingType(listingType);
  assertStatus(payload.status || 'Fresh');

  if (!databaseEnabled(request)) {
    const property = {
      ...payload,
      id: payload.id || `SE-NAL-${Date.now()}`,
      type: payload.propertyType || payload.type,
      propertyType: payload.propertyType || payload.type,
      intent: listingType,
      listingType,
      tags: payload.tags || payload.amenities || [],
      amenities: payload.amenities || payload.tags || [],
      image: payload.image || payload.images?.[0]?.imageUrl || null,
      images: payload.images || [],
      createdBy: user.id,
    };
    memoryProperties = [property, ...memoryProperties];
    return property;
  }

  const normalized = normalizePropertyPayload(payload, user.id);
  return propertyService.createProperty(normalized, payload.images || []);
}

export async function updateProperty(id, payload, request) {
  await getProperty(id, request);
  const listingType = payload.listingType || payload.intent;
  if (listingType) assertListingType(listingType);
  if (payload.status) assertStatus(payload.status);

  if (!databaseEnabled(request)) {
    let updated;
    memoryProperties = memoryProperties.map((property) => {
      if (property.id !== id) return property;
      updated = {
        ...property,
        ...payload,
        type: payload.propertyType || payload.type || property.type,
        propertyType: payload.propertyType || payload.type || property.propertyType,
        intent: listingType || property.intent,
        listingType: listingType || property.listingType,
        tags: payload.tags || payload.amenities || property.tags,
        amenities: payload.amenities || payload.tags || property.amenities,
      };
      return updated;
    });
    return updated;
  }

  return propertyService.updateProperty(id, normalizePropertyPayload(payload, undefined));
}

export async function updateStatus(id, status, request) {
  assertStatus(status);
  await getProperty(id, request);

  if (!databaseEnabled(request)) {
    let updated;
    memoryProperties = memoryProperties.map((property) => {
      if (property.id !== id) return property;
      updated = { ...property, status };
      return updated;
    });
    return updated;
  }

  return propertyService.updatePropertyStatus(id, status);
}

export async function deactivateProperty(id, request) {
  await getProperty(id, request);

  if (!databaseEnabled(request)) {
    let updated;
    memoryProperties = memoryProperties.map((property) => {
      if (property.id !== id) return property;
      updated = { ...property, status: 'Inactive', isActive: false };
      return updated;
    });
    return updated;
  }

  return propertyService.deactivateProperty(id);
}

export async function addImage(propertyId, payload, request) {
  await getProperty(propertyId, request);
  if (!databaseEnabled(request)) {
    throw new ApiError(503, 'Image metadata storage requires PostgreSQL');
  }
  return propertyService.addPropertyImage(propertyId, payload);
}

export async function listImages(propertyId, request) {
  await getProperty(propertyId, request);
  if (!databaseEnabled(request)) return [];
  return propertyService.getPropertyImages(propertyId);
}

export async function updateImageOrder(propertyId, images, request) {
  await getProperty(propertyId, request);
  if (!databaseEnabled(request)) {
    throw new ApiError(503, 'Image metadata storage requires PostgreSQL');
  }
  return propertyService.updatePropertyImageOrder(propertyId, images);
}

export async function setPrimaryImage(propertyId, imageId, request) {
  await getProperty(propertyId, request);
  if (!databaseEnabled(request)) {
    throw new ApiError(503, 'Image metadata storage requires PostgreSQL');
  }
  return propertyService.setPrimaryPropertyImage(propertyId, imageId);
}

export async function deleteImage(propertyId, imageId, request) {
  await getProperty(propertyId, request);
  if (!databaseEnabled(request)) {
    throw new ApiError(503, 'Image metadata storage requires PostgreSQL');
  }
  return propertyService.deletePropertyImage(propertyId, imageId);
}
