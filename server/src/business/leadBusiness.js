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
