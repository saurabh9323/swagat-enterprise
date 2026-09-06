import { query, withTransaction } from '../db/pool.js';
import { toCamelProperty } from '../utils/normalize.js';

export async function getProperties(filters = {}) {
  const result = await query(
    'select * from get_properties($1, $2, $3, $4, $5, $6, $7, $8)',
    [
      filters.q || null,
      filters.status || null,
      filters.propertyType || null,
      filters.listingType || null,
      filters.location || null,
      filters.minPrice ?? null,
      filters.maxPrice ?? null,
      filters.bedrooms ?? null,
    ]
  );
  return result.rows.map(toCamelProperty);
}

export async function getPropertyById(id) {
  const result = await query('select * from get_property_by_id($1)', [id]);
  return toCamelProperty(result.rows[0]);
}

export async function createProperty(payload, images = []) {
  return withTransaction(async (client) => {
    const result = await client.query(
      'select * from create_property($1::jsonb)',
      [JSON.stringify(payload)]
    );
    const property = toCamelProperty(result.rows[0]);

    for (const [index, image] of images.entries()) {
      await client.query(
        'select * from add_property_image($1, $2, $3, $4, $5, $6, $7)',
        [
          property.id,
          image.storagePath || image.imageUrl,
          image.imageUrl,
          image.imageLabel || null,
          image.imageSize || null,
          image.displayOrder ?? index,
          image.isPrimary ?? index === 0,
        ]
      );
    }

    const refreshed = await client.query('select * from get_property_by_id($1)', [property.id]);
    return toCamelProperty(refreshed.rows[0]);
  });
}

export async function updateProperty(id, payload) {
  return withTransaction(async (client) => {
    const result = await client.query('select * from update_property($1, $2::jsonb)', [id, JSON.stringify(payload)]);

    if (Array.isArray(payload.images)) {
      await client.query('delete from property_images where property_id = $1', [id]);

      for (const [index, image] of payload.images.entries()) {
        await client.query(
          'select * from add_property_image($1, $2, $3, $4, $5, $6, $7)',
          [
            id,
            image.storagePath || image.imageUrl,
            image.imageUrl,
            image.imageLabel || null,
            image.imageSize || null,
            image.displayOrder ?? index,
            image.isPrimary ?? index === 0,
          ]
        );
      }
    }

    const refreshed = await client.query('select * from get_property_by_id($1)', [id]);
    return toCamelProperty(refreshed.rows[0] || result.rows[0]);
  });
}

export async function updatePropertyStatus(id, status) {
  const result = await query('select * from update_property_status($1, $2)', [id, status]);
  return toCamelProperty(result.rows[0]);
}

export async function deactivateProperty(id) {
  const result = await query('select * from deactivate_property($1)', [id]);
  return toCamelProperty(result.rows[0]);
}

export async function addPropertyImage(propertyId, image) {
  const result = await query(
    'select * from add_property_image($1, $2, $3, $4, $5, $6, $7)',
    [
      propertyId,
      image.storagePath || image.imageUrl,
      image.imageUrl,
      image.imageLabel || null,
      image.imageSize || null,
      image.displayOrder ?? 0,
      image.isPrimary ?? false,
    ]
  );
  return result.rows[0];
}

export async function getPropertyImages(propertyId) {
  const result = await query('select * from get_property_images($1)', [propertyId]);
  return result.rows;
}

export async function updatePropertyImageOrder(propertyId, images) {
  const result = await query('select * from update_property_image_order($1, $2::jsonb)', [propertyId, JSON.stringify(images)]);
  return result.rows;
}

export async function setPrimaryPropertyImage(propertyId, imageId) {
  const result = await query('select * from set_primary_property_image($1, $2)', [propertyId, imageId]);
  return result.rows[0];
}

export async function deletePropertyImage(propertyId, imageId) {
  const result = await query('select * from delete_property_image($1, $2)', [propertyId, imageId]);
  return result.rows[0];
}
