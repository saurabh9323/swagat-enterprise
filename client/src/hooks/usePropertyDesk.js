import { useEffect, useMemo, useState } from 'react';
import { initialProperties, seedLeads } from '../data/demoData.js';
import { api } from '../services/api.js';
import { currency } from '../utils/format.js';
import { getPortfolioStats } from '../utils/property.js';
import { getPrimaryPropertyImage, getPropertyImages } from '../utils/propertyImages.js';

function initialLeadStatus(lead) {
  if (['New', 'Contacted', 'Visit Booked', 'Negotiation', 'Won', 'Lost'].includes(lead.status)) return lead.status;
  if (lead.priority === 'Hot') return 'Visit Booked';
  if (lead.priority === 'Warm') return 'Contacted';
  return 'New';
}

function normalizeSeedLeads() {
  return seedLeads.map((lead, index) => ({
    ...lead,
    id: lead.id || `seed-lead-${index + 1}`,
    status: initialLeadStatus(lead),
  }));
}

export function usePropertyDesk() {
  const [properties, setProperties] = useState(initialProperties);
  const [leads, setLeads] = useState(() => normalizeSeedLeads());

  useEffect(() => {
    let cancelled = false;

    api.getProperties()
      .then((apiProperties) => {
        if (!cancelled && Array.isArray(apiProperties) && apiProperties.length > 0) {
          setProperties(apiProperties);
        }
      })
      .catch(() => {
        if (!cancelled) setProperties(initialProperties);
      });

    api.getLeads()
      .then((apiLeads) => {
        if (!cancelled && Array.isArray(apiLeads) && apiLeads.length > 0) {
          setLeads(apiLeads);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLeads(normalizeSeedLeads());
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const stats = useMemo(() => getPortfolioStats(properties, leads), [properties, leads]);

  function addLead(property, name = 'New Swagat inquiry') {
    const lead = {
      name,
      customerName: name,
      propertyId: property.id,
      need: `${property.type} in ${property.location}`,
      budget: currency(property.price, property.intent),
      stage: 'Call within 30 minutes',
      priority: property.score > 93 ? 'Hot' : 'Warm',
      source: 'Website',
    };

    setLeads((current) => [lead, ...current]);
    api.createLead(lead).catch(() => {});
  }

  async function addLeadFromForm(payload) {
    const localLead = {
      ...payload,
      id: payload.id || `lead-${Date.now()}`,
      name: payload.customerName || payload.name,
      customerName: payload.customerName || payload.name,
      stage: payload.status || payload.stage || 'New',
      status: payload.status || payload.stage || 'New',
      priority: payload.priority || 'Warm',
    };

    setLeads((current) => [localLead, ...current]);

    try {
      const savedLead = await api.createLead(payload);
      if (savedLead?.id) {
        const normalized = {
          ...savedLead,
          stage: savedLead.status || localLead.stage,
          priority: localLead.priority,
        };
        setLeads((current) => current.map((lead) => (lead.id === localLead.id ? normalized : lead)));
        return normalized;
      }
      return localLead;
    } catch (error) {
      setLeads((current) => current.filter((lead) => lead.id !== localLead.id));
      throw error;
    }
  }

  async function updateLeadStage(leadId, status) {
    if (!leadId) return;

    setLeads((current) => current.map((lead) => (
      lead.id === leadId ? { ...lead, status, stage: status } : lead
    )));

    if (!String(leadId).startsWith('lead-')) {
      api.updateLeadStatus(leadId, status).catch(() => {});
    }
  }

  async function updateLead(leadId, payload) {
    const normalizedPayload = {
      ...payload,
      name: payload.customerName || payload.name,
      customerName: payload.customerName || payload.name,
      stage: payload.status || payload.stage,
      status: payload.status || payload.stage,
    };

    setLeads((current) => current.map((lead) => (
      lead.id === leadId ? { ...lead, ...normalizedPayload } : lead
    )));

    const savedLead = await api.updateLead(leadId, payload);
    if (savedLead?.id) {
      setLeads((current) => current.map((lead) => (lead.id === leadId ? savedLead : lead)));
    }
    return savedLead;
  }

  async function deleteLead(leadId) {
    const previousLeads = leads;
    setLeads((current) => current.filter((lead) => lead.id !== leadId));

    try {
      if (!String(leadId).startsWith('lead-') && !String(leadId).startsWith('seed-lead-')) {
        await api.deleteLead(leadId);
      }
    } catch (error) {
      setLeads(previousLeads);
      throw error;
    }
  }

  async function addProperty(payload) {
    const localProperty = {
      ...payload,
      id: payload.id || `SE-NAL-${Date.now()}`,
      type: payload.propertyType || payload.type,
      propertyType: payload.propertyType || payload.type,
      intent: payload.listingType || payload.intent,
      listingType: payload.listingType || payload.intent,
      tags: payload.tags || payload.amenities || [],
      amenities: payload.amenities || payload.tags || [],
      images: getPropertyImages(payload),
      image: getPrimaryPropertyImage(payload) || 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1200&q=80',
    };

    setProperties((current) => [localProperty, ...current]);

    try {
      const savedProperty = await api.createProperty(payload);
      if (savedProperty?.id) {
        setProperties((current) => current.map((property) => (
          property.id === localProperty.id ? savedProperty : property
        )));
      }
      return savedProperty || localProperty;
    } catch (error) {
      setProperties((current) => current.filter((property) => property.id !== localProperty.id));
      throw error;
    }
  }

  async function updateProperty(id, payload) {
    setProperties((current) => current.map((property) => (
      property.id === id
        ? {
            ...property,
            ...payload,
            type: payload.propertyType || payload.type || property.type,
            propertyType: payload.propertyType || payload.type || property.propertyType,
            intent: payload.listingType || payload.intent || property.intent,
            listingType: payload.listingType || payload.intent || property.listingType,
            images: payload.images ? getPropertyImages(payload) : property.images,
            image: payload.images ? getPrimaryPropertyImage(payload) : payload.image || property.image,
          }
        : property
    )));

    const savedProperty = await api.updateProperty(id, payload);
    if (savedProperty?.id) {
      setProperties((current) => current.map((property) => (property.id === id ? savedProperty : property)));
    }
    return savedProperty;
  }

  async function deleteProperty(id) {
    const previousProperties = properties;
    setProperties((current) => current.filter((property) => property.id !== id));

    try {
      if (!String(id).startsWith('SE-NAL-17')) {
        await api.deleteProperty(id);
      }
    } catch (error) {
      setProperties(previousProperties);
      throw error;
    }
  }

  return {
    properties,
    leads,
    stats,
    addLead,
    addLeadFromForm,
    updateLead,
    deleteLead,
    updateLeadStage,
    addProperty,
    updateProperty,
    deleteProperty,
  };
}
