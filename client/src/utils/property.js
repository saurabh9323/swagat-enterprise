export function getPortfolioStats(properties, leads) {
  const saleInventory = properties.filter((property) => property.intent === 'Sale');
  const avgScore = properties.length
    ? Math.round(properties.reduce((sum, property) => sum + Number(property.score || 0), 0) / properties.length)
    : 0;

  return {
    properties: properties.length,
    leads: leads.length,
    value: saleInventory.reduce((sum, property) => sum + Number(property.price || 0), 0),
    brokerage: properties.reduce((sum, property) => sum + Number(property.commission || 0), 0),
    hot: properties.filter((property) => Number(property.score || 0) >= 94 || property.status === 'Hot').length,
    avgScore,
  };
}

export function getAdminAnalytics(properties, leads) {
  const byListing = properties.reduce((acc, property) => {
    const key = property.intent || property.listingType || 'Sale';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const byStage = leads.reduce((acc, lead) => {
    const key = lead.status || lead.stage || 'New';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const byLeadType = leads.reduce((acc, lead) => {
    const key = lead.leadType || 'Buyer';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const byArea = properties.reduce((acc, property) => {
    const key = property.location || 'Unknown';
    acc[key] = acc[key] || { count: 0, value: 0 };
    acc[key].count += 1;
    acc[key].value += Number(property.price || 0);
    return acc;
  }, {});

  return {
    byListing,
    byStage,
    byLeadType,
    topAreas: Object.entries(byArea)
      .map(([name, value]) => ({ name, ...value }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5),
    rentCount: byListing.Rent || 0,
    saleCount: byListing.Sale || 0,
    activeFollowUps: leads.filter((lead) => !['Won', 'Lost', 'Archived'].includes(lead.status || lead.stage)).length,
  };
}

export function filterProperties(properties, query, budget) {
  const normalizedQuery = query.trim().toLowerCase();

  return properties.filter((property) => {
    const haystack = `${property.title} ${property.location} ${property.type} ${property.intent}`.toLowerCase();
    const matchesSearch = haystack.includes(normalizedQuery);
    const matchesBudget =
      budget === 'all' ||
      (budget === 'rent' && property.intent === 'Rent') ||
      (budget === 'under45' && property.price < 4500000 && property.intent === 'Sale') ||
      (budget === 'family' && property.type.includes('2'));

    return matchesSearch && matchesBudget;
  });
}
