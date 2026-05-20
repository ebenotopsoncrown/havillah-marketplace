// Client-side validation rules

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateUKPhone = (phone) => {
  const ukPhoneRegex = /^(?:(?:\+44\s?|0)(?:\d\s?){9,10})$/;
  return ukPhoneRegex.test(phone.replace(/\s/g, ''));
};

export const validateUKPostcode = (postcode) => {
  const postcodeRegex = /^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i;
  return postcodeRegex.test(postcode);
};

export const validateRequired = (value) => {
  return value && value.trim() !== '';
};

export const validateMinLength = (min) => (value) => {
  return value && value.length >= min;
};

export const validateMaxLength = (max) => (value) => {
  return value && value.length <= max;
};

export const validateNumber = (value, min = 0, max = Infinity) => {
  const num = Number(value);
  return !isNaN(num) && num >= min && num <= max;
};

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
};