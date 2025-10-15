/**
 * Validation Rules - SINGLE SOURCE OF TRUTH
 * 
 * Framework Application:
 * - Upstream Thinking: Eliminates "scattered validation logic" failure class
 * - Resourceful Innovation: Leverages existing validation patterns, enhances with types
 * 
 * All form validation rules centralized here.
 * Changes propagate automatically to validation functions and error messages.
 */

// ============================================================================
// TYPES
// ============================================================================

export interface ValidationRule {
  required?: boolean;
  pattern?: RegExp;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  custom?: (value: any) => boolean;
  errorMessage: string;
}

export interface FieldValidationRules {
  [fieldName: string]: ValidationRule;
}

// ============================================================================
// VALIDATION PATTERNS
// ============================================================================

export const patterns = {
  // Australian mobile: 04XX XXX XXX (10 digits starting with 04)
  auMobile: /^04\d{8}$/,
  
  // Email: Basic RFC 5322 compliant pattern
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  
  // Date: dd/mm/yyyy format
  dateFormat: /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
  
  // Australian phone (landline or mobile)
  auPhone: /^(?:\+?61|0)[2-478](?:[ -]?[0-9]){8}$/,
};

// ============================================================================
// FIELD VALIDATION RULES
// ============================================================================

export const validationRules: FieldValidationRules = {
  // STEP 1: Property Details
  'property-type': {
    required: true,
    errorMessage: 'Please select a property type.'
  },
  
  'bedrooms': {
    required: true,
    min: 1,
    max: 5,
    errorMessage: 'Please select number of bedrooms.'
  },
  
  'bathrooms': {
    required: true,
    min: 1,
    max: 3,
    errorMessage: 'Please select number of bathrooms.'
  },

  // STEP 2: Add-ons
  // No required validation - all add-ons are optional
  
  // STEP 3: Contact Information
  'full-name': {
    required: true,
    minLength: 2,
    maxLength: 100,
    errorMessage: 'Please enter your full name.'
  },
  
  'phone': {
    required: true,
    pattern: patterns.auMobile,
    errorMessage: 'Please enter a valid Australian mobile (04XX XXX XXX).'
  },
  
  'email': {
    required: true,
    pattern: patterns.email,
    maxLength: 255,
    errorMessage: 'Please enter a valid email address.'
  },
  
  'property-address': {
    required: true,
    minLength: 5,
    maxLength: 255,
    errorMessage: 'Please enter the property address.'
  },
  
  'service-date': {
    required: true,
    custom: (value: string) => {
      // Must be today or future date
      if (!value) return false;
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    },
    errorMessage: 'Please select a valid date (today or later).'
  },
  
  'special-requests': {
    required: false,
    maxLength: 1000,
    errorMessage: 'Special requests cannot exceed 1000 characters.'
  },
  
  // Optional fields
  'exit-date': {
    required: false,
    pattern: patterns.dateFormat,
    errorMessage: 'Please enter a valid date (dd/mm/yyyy).'
  },
  
  'pm-contact': {
    required: false,
    maxLength: 255,
    errorMessage: 'Real estate contact cannot exceed 255 characters.'
  }
};

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validate a single field value
 * 
 * @param fieldName - Name of the field to validate
 * @param value - Value to validate
 * @returns Object with isValid boolean and error message
 */
export function validateField(fieldName: string, value: any): {
  isValid: boolean;
  error?: string;
} {
  const rules = validationRules[fieldName];
  
  if (!rules) {
    return { isValid: true }; // No rules = valid
  }
  
  // Check required
  if (rules.required && (!value || value.toString().trim() === '')) {
    return {
      isValid: false,
      error: rules.errorMessage
    };
  }
  
  // If not required and empty, it's valid
  if (!rules.required && (!value || value.toString().trim() === '')) {
    return { isValid: true };
  }
  
  // Check pattern
  if (rules.pattern && !rules.pattern.test(value.toString())) {
    return {
      isValid: false,
      error: rules.errorMessage
    };
  }
  
  // Check min length
  if (rules.minLength && value.toString().length < rules.minLength) {
    return {
      isValid: false,
      error: rules.errorMessage
    };
  }
  
  // Check max length
  if (rules.maxLength && value.toString().length > rules.maxLength) {
    return {
      isValid: false,
      error: rules.errorMessage
    };
  }
  
  // Check min value
  if (rules.min !== undefined && Number(value) < rules.min) {
    return {
      isValid: false,
      error: rules.errorMessage
    };
  }
  
  // Check max value
  if (rules.max !== undefined && Number(value) > rules.max) {
    return {
      isValid: false,
      error: rules.errorMessage
    };
  }
  
  // Check custom validation
  if (rules.custom && !rules.custom(value)) {
    return {
      isValid: false,
      error: rules.errorMessage
    };
  }
  
  return { isValid: true };
}

/**
 * Validate multiple fields at once
 * 
 * @param formData - Object with field names as keys and values
 * @returns Object with overall validity and field errors
 */
export function validateForm(formData: { [key: string]: any }): {
  isValid: boolean;
  errors: { [key: string]: string };
} {
  const errors: { [key: string]: string } = {};
  let isValid = true;
  
  Object.entries(formData).forEach(([fieldName, value]) => {
    const result = validateField(fieldName, value);
    
    if (!result.isValid && result.error) {
      errors[fieldName] = result.error;
      isValid = false;
    }
  });
  
  return { isValid, errors };
}

/**
 * Get validation rule for a field
 */
export function getValidationRule(fieldName: string): ValidationRule | undefined {
  return validationRules[fieldName];
}

/**
 * Check if field is required
 */
export function isFieldRequired(fieldName: string): boolean {
  return validationRules[fieldName]?.required ?? false;
}

/**
 * Format phone number for display (04XX XXX XXX)
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10 && cleaned.startsWith('04')) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }
  return phone;
}

/**
 * Format date for display (dd/mm/yyyy)
 */
export function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Parse date from dd/mm/yyyy format
 */
export function parseDate(dateString: string): Date | null {
  if (!patterns.dateFormat.test(dateString)) {
    return null;
  }
  
  const [day, month, year] = dateString.split('/').map(Number);
  return new Date(year, month - 1, day);
}

// ============================================================================
// STEP VALIDATION GROUPS
// ============================================================================

export const stepValidationGroups = {
  step1: ['property-type', 'bedrooms', 'bathrooms'],
  step2: [], // No required fields in step 2
  step3: ['full-name', 'phone', 'email', 'property-address', 'service-date'],
  step4: [] // Review step - no validation needed
};

/**
 * Validate all fields in a specific step
 */
export function validateStep(stepNumber: number, formData: { [key: string]: any }): {
  isValid: boolean;
  errors: { [key: string]: string };
} {
  const stepKey = `step${stepNumber}` as keyof typeof stepValidationGroups;
  const fieldsToValidate = stepValidationGroups[stepKey] || [];
  
  const errors: { [key: string]: string } = {};
  let isValid = true;
  
  fieldsToValidate.forEach(fieldName => {
    const value = formData[fieldName];
    const result = validateField(fieldName, value);
    
    if (!result.isValid && result.error) {
      errors[fieldName] = result.error;
      isValid = false;
    }
  });
  
  return { isValid, errors };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  patterns,
  validationRules,
  validateField,
  validateForm,
  validateStep,
  getValidationRule,
  isFieldRequired,
  formatPhoneNumber,
  formatDate,
  parseDate,
  stepValidationGroups
};
