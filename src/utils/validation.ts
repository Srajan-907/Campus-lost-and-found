export function isEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function isPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s-()]/g, '');
  return /^\+?\d{10,15}$/.test(cleaned);
}

export function isImageUrl(url: string): boolean {
  if (!url.trim()) return true;
  try {
    const u = new URL(url.trim());
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

export function isNotFutureDate(date: string): boolean {
  if (!date) return false;
  const d = new Date(date);
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return d <= today;
}

export function minStringLength(s: string, min: number): boolean {
  return s.trim().length >= min;
}

export interface FormErrors {
  [key: string]: string | undefined;
}

export function validateItemForm(data: Record<string, string>): FormErrors {
  const errors: FormErrors = {};

  if (!data.name?.trim()) {
    errors.name = 'Please enter the item name.';
  } else if (data.name.trim().length < 3) {
    errors.name = 'Item name must be at least 3 characters.';
  }

  if (!data.category) {
    errors.category = 'Please select a category.';
  }

  if (!data.location) {
    errors.location = 'Please select a location.';
  }

  if (!data.date) {
    errors.date = 'Please select a date.';
  } else if (!isNotFutureDate(data.date)) {
    errors.date = 'Date cannot be in the future.';
  }

  if (!data.description?.trim()) {
    errors.description = 'Please enter a description.';
  } else if (data.description.trim().length < 10) {
    errors.description = 'Description should be at least 10 characters.';
  }

  if (!data.contactName?.trim()) {
    errors.contactName = 'Please enter the contact name.';
  }

  if (!data.contactEmail?.trim()) {
    errors.contactEmail = 'Please enter the contact email.';
  } else if (!isEmail(data.contactEmail)) {
    errors.contactEmail = 'Please enter a valid email address.';
  }

  if (data.contactPhone && !isPhone(data.contactPhone)) {
    errors.contactPhone = 'Please enter a valid phone number.';
  }

  if (data.image && !isImageUrl(data.image)) {
    errors.image = 'Please enter a valid image URL.';
  }

  return errors;
}
