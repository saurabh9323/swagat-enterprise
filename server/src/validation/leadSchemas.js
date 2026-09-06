import { z } from 'zod';

const leadId = z.string().uuid();

export const leadParamsSchema = z.object({
  params: z.object({
    id: leadId,
  }),
});

export const leadCreateSchema = z.object({
  body: z.object({
    propertyId: z.string().trim().max(80).optional().nullable(),
    property_id: z.string().trim().max(80).optional().nullable(),
    customerName: z.string().trim().min(2).max(120).optional(),
    name: z.string().trim().min(2).max(120).optional(),
    phone: z.string().trim().min(7).max(20).optional().nullable(),
    email: z.string().email().optional().nullable(),
    message: z.string().trim().max(1200).optional().nullable(),
    need: z.string().trim().max(300).optional().nullable(),
    budget: z.string().trim().max(100).optional().nullable(),
    source: z.string().trim().max(80).default('Website'),
    status: z.string().trim().max(80).default('New'),
    priority: z.enum(['Hot', 'Warm', 'New']).default('Warm'),
    leadType: z.enum(['Buyer', 'Seller', 'Rental', 'Commercial', 'Investor']).default('Buyer'),
    lead_type: z.enum(['Buyer', 'Seller', 'Rental', 'Commercial', 'Investor']).optional(),
    propertyType: z.string().trim().max(80).optional().nullable(),
    property_type: z.string().trim().max(80).optional().nullable(),
    preferredLocation: z.string().trim().max(180).optional().nullable(),
    preferred_location: z.string().trim().max(180).optional().nullable(),
    timeline: z.string().trim().max(120).optional().nullable(),
  }).refine((value) => value.customerName || value.name, {
    message: 'customerName or name is required',
    path: ['customerName'],
  }),
});

export const leadStatusSchema = z.object({
  params: z.object({
    id: leadId,
  }),
  body: z.object({
    status: z.string().trim().min(1).max(80),
  }),
});

export const leadAssignSchema = z.object({
  params: z.object({
    id: leadId,
  }),
  body: z.object({
    assignedTo: z.string().uuid().nullable(),
  }),
});
