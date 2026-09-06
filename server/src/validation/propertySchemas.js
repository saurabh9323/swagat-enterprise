import { z } from 'zod';

const propertyId = z.string().min(1).max(80);
const optionalString = z.string().trim().max(500).optional().nullable();
const imagePayloadSchema = z.object({
  imageUrl: z.string().url(),
  storagePath: z.string().trim().min(1).max(500).optional().nullable(),
  displayOrder: z.coerce.number().int().nonnegative().optional(),
  isPrimary: z.boolean().optional(),
});
const propertyBodySchema = z.object({
  id: propertyId.optional(),
  title: z.string().trim().min(3).max(180),
  description: z.string().trim().max(2000).optional().nullable(),
  propertyType: z.string().trim().min(1).max(80).optional(),
  type: z.string().trim().min(1).max(80).optional(),
  listingType: z.enum(['Sale', 'Rent']).optional(),
  intent: z.enum(['Sale', 'Rent']).optional(),
  price: z.coerce.number().nonnegative(),
  location: z.string().trim().min(2).max(180),
  area: z.coerce.number().nonnegative().optional().nullable(),
  bedrooms: z.coerce.number().int().nonnegative().optional().nullable(),
  bathrooms: z.coerce.number().int().nonnegative().optional().nullable(),
  floor: optionalString,
  totalFloors: z.coerce.number().int().nonnegative().optional().nullable(),
  total_floors: z.coerce.number().int().nonnegative().optional().nullable(),
  furnishing: optionalString,
  status: z.string().trim().min(1).max(80).default('Fresh'),
  amenities: z.array(z.string().trim().min(1).max(80)).optional(),
  tags: z.array(z.string().trim().min(1).max(80)).optional(),
  latitude: z.coerce.number().optional().nullable(),
  longitude: z.coerce.number().optional().nullable(),
  score: z.coerce.number().int().min(0).max(100).optional().nullable(),
  commission: z.coerce.number().nonnegative().optional().nullable(),
  walkTime: optionalString,
  image: z.string().trim().max(2000000).optional().nullable(),
  images: z.array(imagePayloadSchema).optional(),
});

export const propertyParamsSchema = z.object({
  params: z.object({
    id: propertyId,
  }),
});

export const propertyQuerySchema = z.object({
  query: z.object({
    q: z.string().trim().max(120).optional(),
    status: z.string().trim().max(80).optional(),
    propertyType: z.string().trim().max(80).optional(),
    listingType: z.string().trim().max(80).optional(),
    location: z.string().trim().max(160).optional(),
    minPrice: z.coerce.number().nonnegative().optional(),
    maxPrice: z.coerce.number().nonnegative().optional(),
    bedrooms: z.coerce.number().int().nonnegative().optional(),
  }),
});

export const propertyCreateSchema = z.object({
  body: propertyBodySchema.refine((value) => value.propertyType || value.type, {
    message: 'propertyType or type is required',
    path: ['propertyType'],
  }).refine((value) => value.listingType || value.intent, {
    message: 'listingType or intent is required',
    path: ['listingType'],
  }),
});

export const propertyUpdateSchema = z.object({
  params: z.object({
    id: propertyId,
  }),
  body: propertyBodySchema.partial().refine((value) => Object.keys(value).length > 0, {
    message: 'At least one property field is required',
  }),
});

export const propertyStatusSchema = z.object({
  params: z.object({
    id: propertyId,
  }),
  body: z.object({
    status: z.string().trim().min(1).max(80),
  }),
});

export const imageParamsSchema = z.object({
  params: z.object({
    propertyId,
    imageId: z.string().uuid().optional(),
  }),
});

export const imageCreateSchema = z.object({
  params: z.object({
    propertyId,
  }),
  body: z.object({
    imageUrl: z.string().url(),
    storagePath: z.string().trim().min(1).max(500),
    displayOrder: z.coerce.number().int().nonnegative().optional(),
    isPrimary: z.boolean().optional(),
  }),
});

export const imageOrderSchema = z.object({
  params: z.object({
    propertyId,
  }),
  body: z.object({
    images: z.array(z.object({
      id: z.string().uuid(),
      displayOrder: z.coerce.number().int().nonnegative(),
    })).min(1),
  }),
});
