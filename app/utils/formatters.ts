/**
 * Utility functions for formatting various data types
 */

// Format a date to a readable string, accepts both Date objects and Firestore Timestamps
export function formatDate(date: Date | { seconds: number; nanoseconds: number } | null | undefined, options: Intl.DateTimeFormatOptions = {}): string {
  if (!date) return 'N/A';
  
  try {
    // Handle Firestore Timestamp
    if ('seconds' in date && 'nanoseconds' in date) {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        ...options
      }).format(new Date(date.seconds * 1000));
    }
    
    // Handle regular Date object
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      ...options
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
}

// Format a price with currency symbol
export function formatPrice(price: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
}

// Format a number with commas for better readability
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

// Truncate text with ellipsis if it exceeds the max length
export function truncateText(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

// Format a phone number to (XXX) XXX-XXXX format
export function formatPhoneNumber(phoneNumber: string): string {
  // Strip all non-numeric characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Format based on length
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
  } else if (cleaned.length === 11 && cleaned[0] === '1') {
    return `(${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 11)}`;
  }
  
  // Return original if we can't format it
  return phoneNumber;
}

// Format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + units[i];
}

// Format order status with the appropriate color
export function formatOrderStatus(status: string): { label: string; color: string } {
  switch (status.toLowerCase()) {
    case 'pending':
      return { label: 'Pending', color: 'text-yellow-500' };
    case 'processing':
      return { label: 'Processing', color: 'text-blue-500' };
    case 'shipped':
      return { label: 'Shipped', color: 'text-purple-500' };
    case 'delivered':
      return { label: 'Delivered', color: 'text-green-500' };
    case 'cancelled':
      return { label: 'Cancelled', color: 'text-red-500' };
    default:
      return { label: status, color: 'text-gray-500' };
  }
}

// Format credit card number with masking (e.g., **** **** **** 1234)
export function formatCreditCardNumber(cardNumber: string): string {
  // Strip all non-numeric characters
  const cleaned = cardNumber.replace(/\D/g, '');
  
  // Only show last 4 digits
  if (cleaned.length >= 4) {
    return `**** **** **** ${cleaned.slice(-4)}`;
  }
  
  return cardNumber;
}

// Format a crypto address to show only part of it (e.g., 0x1234...5678)
export function formatCryptoAddress(address: string, visibleStart: number = 6, visibleEnd: number = 4): string {
  if (!address) return '';
  if (address.length <= visibleStart + visibleEnd) return address;
  
  const start = address.substring(0, visibleStart);
  const end = address.substring(address.length - visibleEnd);
  
  return `${start}...${end}`;
} 