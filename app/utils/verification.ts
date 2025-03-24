export function generateVerificationCode(): string {
  // Generate a 6-digit verification code
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function formatPhoneNumber(phone: string): string {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Check if it's a valid length
  if (cleaned.length < 10) {
    return cleaned;
  }

  // Format as (XXX) XXX-XXXX if US/Canada number
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }

  // If international number, keep the + and format rest
  if (cleaned.length > 10) {
    return `+${cleaned}`;
  }

  return cleaned;
} 