export function currency(value, intent = 'Sale') {
  if (intent === 'Rent') return `Rs. ${Number(value).toLocaleString('en-IN')}/mo`;
  if (value >= 10000000) return `Rs. ${(value / 10000000).toFixed(2)} Cr`;
  return `Rs. ${(value / 100000).toFixed(1)} L`;
}

export function whatsappUrl(phone, message = '') {
  const cleanPhone = String(phone).replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/91${cleanPhone}${encodedMessage ? `?text=${encodedMessage}` : ''}`;
}
