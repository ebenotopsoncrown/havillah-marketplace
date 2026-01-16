// Input validation and sanitization utilities

// Email validation
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// UK phone number validation
export function isValidUKPhone(phone) {
  const ukPhoneRegex = /^(?:(?:\+44\s?|0)(?:\d\s?){9,10})$/;
  return ukPhoneRegex.test(phone.replace(/\s/g, ''));
}

// UK postcode validation
export function isValidUKPostcode(postcode) {
  const postcodeRegex = /^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i;
  return postcodeRegex.test(postcode);
}

// Sanitize string input (prevent XSS)
export function sanitizeString(input) {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim()
    .slice(0, 1000); // Max length 1000 chars
}

// Sanitize object (recursive)
export function sanitizeObject(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return typeof obj === 'string' ? sanitizeString(obj) : obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }
  
  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    sanitized[key] = sanitizeObject(value);
  }
  return sanitized;
}

// Validate required fields
export function validateRequired(data, requiredFields) {
  const missing = [];
  
  for (const field of requiredFields) {
    if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
      missing.push(field);
    }
  }
  
  return {
    valid: missing.length === 0,
    missing
  };
}

// Validate numeric value
export function isValidNumber(value, min = 0, max = Infinity) {
  const num = Number(value);
  return !isNaN(num) && num >= min && num <= max;
}

// Validate order data
export function validateOrderData(orderData) {
  const errors = [];
  
  // Required fields
  const required = validateRequired(orderData, [
    'customer_name',
    'customer_email',
    'customer_phone',
    'delivery_address',
    'delivery_postcode',
    'total_amount'
  ]);
  
  if (!required.valid) {
    errors.push(`Missing required fields: ${required.missing.join(', ')}`);
  }
  
  // Email validation
  if (orderData.customer_email && !isValidEmail(orderData.customer_email)) {
    errors.push('Invalid email address');
  }
  
  // Phone validation
  if (orderData.customer_phone && !isValidUKPhone(orderData.customer_phone)) {
    errors.push('Invalid UK phone number');
  }
  
  // Postcode validation
  if (orderData.delivery_postcode && !isValidUKPostcode(orderData.delivery_postcode)) {
    errors.push('Invalid UK postcode');
  }
  
  // Amount validation
  if (orderData.total_amount && !isValidNumber(orderData.total_amount, 0)) {
    errors.push('Invalid total amount');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// Validate customer data
export function validateCustomerData(customerData) {
  const errors = [];
  
  // Email validation
  if (customerData.email && !isValidEmail(customerData.email)) {
    errors.push('Invalid email address');
  }
  
  // Phone validation
  if (customerData.phone && !isValidUKPhone(customerData.phone)) {
    errors.push('Invalid UK phone number');
  }
  
  // Postcode validation
  if (customerData.postcode && !isValidUKPostcode(customerData.postcode)) {
    errors.push('Invalid UK postcode');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// Rate limiting helper
const requestCounts = new Map();

export function checkRateLimit(identifier, maxRequests = 10, windowMs = 60000) {
  const now = Date.now();
  const key = `${identifier}`;
  
  if (!requestCounts.has(key)) {
    requestCounts.set(key, []);
  }
  
  const requests = requestCounts.get(key);
  
  // Remove old requests outside the time window
  const validRequests = requests.filter(timestamp => now - timestamp < windowMs);
  
  if (validRequests.length >= maxRequests) {
    return {
      allowed: false,
      retryAfter: Math.ceil((validRequests[0] + windowMs - now) / 1000)
    };
  }
  
  validRequests.push(now);
  requestCounts.set(key, validRequests);
  
  return {
    allowed: true,
    remaining: maxRequests - validRequests.length
  };
}

// Clean up old rate limit entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, timestamps] of requestCounts.entries()) {
    const validTimestamps = timestamps.filter(t => now - t < 60000);
    if (validTimestamps.length === 0) {
      requestCounts.delete(key);
    } else {
      requestCounts.set(key, validTimestamps);
    }
  }
}, 60000);