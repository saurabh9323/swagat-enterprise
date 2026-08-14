export function getPortfolioStats(properties, leads) {
  const saleInventory = properties.filter((property) => property.intent === 'Sale');
  const avgScore = properties.length
    ? Math.round(properties.reduce((sum, property) => sum + property.score, 0) / properties.length)
    : 0;

  return {
    properties: properties.length,
    leads: leads.length,
    value: saleInventory.reduce((sum, property) => sum + property.price, 0),
    brokerage: properties.reduce((sum, property) => sum + property.commission, 0),
    hot: properties.filter((property) => property.score >= 94).length,
    avgScore,
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
