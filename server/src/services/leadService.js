import { query } from '../db/pool.js';
import { toCamelLead } from '../utils/normalize.js';

export async function createLead(payload) {
  const result = await query('select * from create_lead($1::jsonb)', [JSON.stringify(payload)]);
  return toCamelLead(result.rows[0]);
}

export async function getLeads() {
  const result = await query('select * from get_leads()', []);
  return result.rows.map(toCamelLead);
}

export async function getLeadById(id) {
  const result = await query('select * from get_lead_by_id($1)', [id]);
  return toCamelLead(result.rows[0]);
}

export async function updateLeadStatus(id, status) {
  const result = await query('select * from update_lead_status($1, $2)', [id, status]);
  return toCamelLead(result.rows[0]);
}

export async function assignLead(id, assignedTo) {
  const result = await query('select * from assign_lead($1, $2)', [id, assignedTo]);
  return toCamelLead(result.rows[0]);
}

export async function archiveLead(id) {
  const result = await query('select * from archive_lead($1)', [id]);
  return toCamelLead(result.rows[0]);
}
