import { demoLeads } from '../data/demoData.js';
import * as leadService from '../services/leadService.js';
import { ApiError } from '../utils/ApiError.js';
import { normalizeLeadPayload } from '../utils/normalize.js';

const allowedStatuses = [
  'New',
  'Contacted',
  'Visit Booked',
  'Negotiation',
  'Won',
  'Lost',
  'Call within 30 minutes',
  'Shortlist sent',
  'Visit booked',
  'Document review',
  'Closed',
  'Archived',
];

let memoryLeads = [...demoLeads];

function databaseEnabled(request) {
  return Boolean(request.app.locals.databaseReady);
}

function assertStatus(status) {
  if (!allowedStatuses.includes(status)) {
    throw new ApiError(400, 'Invalid lead status');
  }
}

export async function createLead(payload, request) {
  const normalized = normalizeLeadPayload(payload);

  if (!databaseEnabled(request)) {
    const lead = {
      id: `lead-${Date.now()}`,
      ...payload,
      propertyId: normalized.property_id,
      customerName: normalized.customer_name,
      name: normalized.customer_name,
      source: normalized.source,
      status: normalized.status,
      stage: normalized.status,
      priority: normalized.priority,
      leadType: normalized.lead_type,
      propertyType: normalized.property_type,
      preferredLocation: normalized.preferred_location,
      timeline: normalized.timeline,
      createdAt: new Date().toISOString(),
    };
    memoryLeads = [lead, ...memoryLeads];
    return lead;
  }

  return leadService.createLead(normalized);
}

export async function listLeads(request) {
  if (!databaseEnabled(request)) return memoryLeads;
  return leadService.getLeads();
}

export async function getLead(id, request) {
  const lead = databaseEnabled(request)
    ? await leadService.getLeadById(id)
    : memoryLeads.find((item) => item.id === id);

  if (!lead) {
    throw new ApiError(404, 'Lead not found');
  }

  return lead;
}

export async function updateStatus(id, status, request) {
  assertStatus(status);
  await getLead(id, request);

  if (!databaseEnabled(request)) {
    let updated;
    memoryLeads = memoryLeads.map((lead) => {
      if (lead.id !== id) return lead;
      updated = { ...lead, status, stage: status };
      return updated;
    });
    return updated;
  }

  return leadService.updateLeadStatus(id, status);
}

export async function updateLead(id, payload, request) {
  const currentLead = await getLead(id, request);
  if (payload.status) assertStatus(payload.status);
  const normalized = normalizeLeadPayload({
    ...currentLead,
    ...payload,
    customerName: payload.customerName || payload.name || currentLead.customerName || currentLead.name,
    leadType: payload.leadType || payload.lead_type || currentLead.leadType,
    propertyType: payload.propertyType || payload.property_type || currentLead.propertyType,
    preferredLocation: payload.preferredLocation || payload.preferred_location || currentLead.preferredLocation,
    propertyId: payload.propertyId || payload.property_id || currentLead.propertyId,
  });

  if (!databaseEnabled(request)) {
    let updated;
    memoryLeads = memoryLeads.map((lead) => {
      if (lead.id !== id) return lead;
      updated = {
        ...lead,
        ...payload,
        propertyId: normalized.property_id ?? lead.propertyId,
        customerName: normalized.customer_name || lead.customerName,
        name: normalized.customer_name || lead.name,
        phone: normalized.phone ?? lead.phone,
        email: normalized.email ?? lead.email,
        message: normalized.message ?? lead.message,
        need: normalized.need ?? lead.need,
        budget: normalized.budget ?? lead.budget,
        source: normalized.source || lead.source,
        status: normalized.status || lead.status,
        stage: normalized.status || lead.stage,
        priority: normalized.priority || lead.priority,
        leadType: normalized.lead_type || lead.leadType,
        propertyType: normalized.property_type ?? lead.propertyType,
        preferredLocation: normalized.preferred_location ?? lead.preferredLocation,
        timeline: normalized.timeline ?? lead.timeline,
      };
      return updated;
    });
    return updated;
  }

  return leadService.updateLead(id, normalized);
}

export async function assignLead(id, assignedTo, request) {
  await getLead(id, request);
  if (!databaseEnabled(request)) {
    let updated;
    memoryLeads = memoryLeads.map((lead) => {
      if (lead.id !== id) return lead;
      updated = { ...lead, assignedTo };
      return updated;
    });
    return updated;
  }

  return leadService.assignLead(id, assignedTo);
}

export async function archiveLead(id, request) {
  await getLead(id, request);
  if (!databaseEnabled(request)) {
    let updated;
    memoryLeads = memoryLeads.map((lead) => {
      if (lead.id !== id) return lead;
      updated = { ...lead, status: 'Archived', stage: 'Archived' };
      return updated;
    });
    return updated;
  }

  return leadService.archiveLead(id);
}
