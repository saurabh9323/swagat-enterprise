export function toCamelProperty(row) {
  if (!row) return null;

  const primaryImage = row.image_url || row.image || null;
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    apartmentName: row.apartment_name,
    location: row.location,
    price: Number(row.price ?? 0),
    type: row.property_type,
    propertyType: row.property_type,
    area: row.area === null || row.area === undefined ? null : Number(row.area),
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    floor: row.floor,
    totalFloors: row.total_floors,
    furnishing: row.furnishing,
    status: row.status,
    intent: row.listing_type,
    listingType: row.listing_type,
    score: row.score,
    commission: row.commission === null || row.commission === undefined ? null : Number(row.commission),
    walkTime: row.walk_time,
    tags: row.amenities || row.tags || [],
    amenities: row.amenities || [],
    latitude: row.latitude === null || row.latitude === undefined ? null : Number(row.latitude),
    longitude: row.longitude === null || row.longitude === undefined ? null : Number(row.longitude),
    image: primaryImage,
    images: row.images || [],
    isActive: row.is_active,
    createdBy: row.created_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function toCamelLead(row) {
  if (!row) return null;

  return {
    id: row.id,
    propertyId: row.property_id,
    customerName: row.customer_name,
    name: row.customer_name,
    phone: row.phone,
    email: row.email,
    message: row.message,
    need: row.need,
    budget: row.budget,
    source: row.source,
    status: row.status,
    stage: row.status,
    priority: row.priority,
    leadType: row.lead_type,
    propertyType: row.property_type,
    preferredLocation: row.preferred_location,
    timeline: row.timeline,
    assignedTo: row.assigned_to,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function toCamelUser(row) {
  if (!row) return null;

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    username: row.username,
    alternatePhone: row.alternate_phone,
    jobTitle: row.job_title,
    branch: row.branch,
    avatarUrl: row.avatar_url,
    role: row.role,
    roleName: row.role_name,
    permissions: row.effective_permissions || row.permissions || {},
    mfaEnabled: row.mfa_enabled,
    mfaMethod: row.mfa_method,
    otpChannel: row.otp_channel,
    isActive: row.is_active,
    lastLoginAt: row.last_login_at,
    passwordChangedAt: row.password_changed_at,
    invitedBy: row.invited_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function normalizePropertyPayload(payload, userId) {
  return {
    id: payload.id,
    title: payload.title,
    description: payload.description || null,
    apartment_name: payload.apartmentName || payload.apartment_name || null,
    property_type: payload.propertyType || payload.type,
    listing_type: payload.listingType || payload.intent,
    price: payload.price,
    location: payload.location,
    area: payload.area ?? null,
    bedrooms: payload.bedrooms ?? null,
    bathrooms: payload.bathrooms ?? null,
    floor: payload.floor ?? null,
    total_floors: payload.totalFloors ?? payload.total_floors ?? null,
    furnishing: payload.furnishing ?? null,
    status: payload.status || 'Fresh',
    amenities: payload.amenities || payload.tags || [],
    latitude: payload.latitude ?? null,
    longitude: payload.longitude ?? null,
    score: payload.score ?? null,
    commission: payload.commission ?? null,
    walk_time: payload.walkTime ?? null,
    legacy_image: payload.image ?? null,
    is_active: payload.isActive,
    created_by: userId,
  };
}

export function normalizeLeadPayload(payload) {
  return {
    property_id: payload.propertyId || payload.property_id || null,
    customer_name: payload.customerName || payload.name,
    phone: payload.phone || null,
    email: payload.email || null,
    message: payload.message || null,
    need: payload.need || null,
    budget: payload.budget || null,
    source: payload.source || 'Website',
    status: payload.status || payload.stage || 'New',
    priority: payload.priority || 'Warm',
    lead_type: payload.leadType || payload.lead_type || 'Buyer',
    property_type: payload.propertyType || payload.property_type || null,
    preferred_location: payload.preferredLocation || payload.preferred_location || null,
    timeline: payload.timeline || null,
  };
}
