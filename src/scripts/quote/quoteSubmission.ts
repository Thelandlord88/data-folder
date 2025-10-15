/**
 * Quote Form Submission - NETLIFY INTEGRATION
 * 
 * Framework Application:
 * - Upstream Thinking: Eliminates "inconsistent submission handling" failure class
 * - Resourceful Innovation: Leverages existing Netlify Forms, enhances with offline recovery
 * 
 * Handles form submission to Netlify with error recovery and offline support.
 */

import type { FormState } from './quoteFormLogic';
import { savePendingSubmission, trackEvent } from './quoteFormLogic';

// ============================================================================
// TYPES
// ============================================================================

export interface SubmissionResult {
  success: boolean;
  error?: string;
}

export interface SubmissionUIElements {
  submitBtn: HTMLButtonElement;
  submitText: HTMLElement;
  spinner: HTMLElement;
  errorBanner: HTMLElement;
  errorMsg: HTMLElement;
  formArea: HTMLElement;
  summary: HTMLElement;
  mobilebar: HTMLElement;
  success: HTMLElement;
}

// ============================================================================
// FORM SUBMISSION
// ============================================================================

/**
 * Submit form data to Netlify
 */
export async function submitQuoteForm(
  state: FormState,
  elements: SubmissionUIElements
): Promise<SubmissionResult> {
  // Show loading state
  showLoadingState(elements);
  
  try {
    // Build form data for Netlify
    const formData = buildNetlifyFormData(state);
    
    // Submit to Netlify
    const response = await fetch('/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    });
    
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }
    
    // Success!
    handleSubmissionSuccess(elements);
    trackEvent('quote_submit_success', { path: window.location.pathname });
    
    // Clear any pending submission
    try {
      localStorage.removeItem('pendingQuoteSubmission');
    } catch {}
    
    return { success: true };
    
  } catch (error) {
    // Handle error
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    handleSubmissionError(error, state, elements);
    trackEvent('quote_submit_error', {
      message: errorMessage,
      path: window.location.pathname
    });
    
    return {
      success: false,
      error: errorMessage
    };
  } finally {
    // Always hide loading state
    hideLoadingState(elements);
  }
}

/**
 * Build URLSearchParams for Netlify form submission
 */
function buildNetlifyFormData(state: FormState): URLSearchParams {
  const params = new URLSearchParams();
  
  // Netlify form identifier
  params.append('form-name', 'quote-request');
  
  // Property details
  params.append('propertyType', state.propertyType);
  params.append('bedrooms', state.bedrooms);
  params.append('bathrooms', state.bathrooms);
  
  // Contact information
  params.append('fullName', state.fullName);
  params.append('phone', state.phone);
  params.append('email', state.email);
  params.append('propertyAddress', state.address);
  params.append('serviceDate', state.date);
  
  // Additional details
  params.append('specialRequests', state.notes);
  
  if (state.exitDate) {
    params.append('exitDate', state.exitDate);
  }
  
  if (state.pmContact) {
    params.append('pmContact', state.pmContact);
  }
  
  // Add-ons (array)
  state.addons.forEach(addon => {
    params.append('addons[]', addon);
  });
  
  // Property characteristics (for internal tracking)
  if (state.toggles.pets) params.append('hasPets', 'true');
  if (state.toggles.carpet) params.append('hasCarpet', 'true');
  if (state.toggles.balcony) params.append('hasBalcony', 'true');
  if (state.toggles.reachable) params.append('extWindows', 'true');
  if (state.toggles.twoStorey) params.append('multiStorey', 'true');
  
  return params;
}

// ============================================================================
// UI STATE MANAGEMENT
// ============================================================================

/**
 * Show loading state during submission
 */
function showLoadingState(elements: SubmissionUIElements): void {
  elements.submitBtn.disabled = true;
  elements.submitText.classList.add('hidden');
  elements.spinner.classList.remove('hidden');
  elements.errorBanner.classList.add('hidden');
}

/**
 * Hide loading state after submission
 */
function hideLoadingState(elements: SubmissionUIElements): void {
  elements.submitBtn.disabled = false;
  elements.submitText.classList.remove('hidden');
  elements.spinner.classList.add('hidden');
}

/**
 * Handle successful submission
 */
function handleSubmissionSuccess(elements: SubmissionUIElements): void {
  // Hide form and summary
  elements.formArea.classList.add('hidden');
  elements.summary.classList.add('hidden');
  elements.mobilebar.classList.add('hidden');
  
  // Show success message
  elements.success.classList.remove('hidden');
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Handle submission error
 */
function handleSubmissionError(
  error: unknown,
  state: FormState,
  elements: SubmissionUIElements
): void {
  // Save for offline recovery
  savePendingSubmission(state);
  
  // Show error message
  elements.errorMsg.textContent = 
    `We saved your progress. We'll retry automatically when you're back online.`;
  elements.errorBanner.classList.remove('hidden');
  
  // Scroll to error
  elements.errorBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ============================================================================
// OFFLINE RECOVERY
// ============================================================================

/**
 * Check for pending submission and retry if online
 */
export function checkAndRetryPendingSubmission(
  elements: SubmissionUIElements
): void {
  if (!navigator.onLine) {
    return; // Still offline, don't retry
  }
  
  try {
    const pendingStr = localStorage.getItem('pendingQuoteSubmission');
    if (!pendingStr) {
      return; // No pending submission
    }
    
    const pendingState: FormState = JSON.parse(pendingStr);
    
    // Show notification
    console.log('Retrying pending quote submission...');
    
    // Retry submission
    submitQuoteForm(pendingState, elements).then(result => {
      if (result.success) {
        console.log('Pending submission succeeded!');
      }
    });
    
  } catch (error) {
    console.warn('Failed to retry pending submission:', error);
    // Clear corrupted data
    localStorage.removeItem('pendingQuoteSubmission');
  }
}

/**
 * Listen for online event to retry submissions
 */
export function setupOfflineRecovery(elements: SubmissionUIElements): void {
  window.addEventListener('online', () => {
    checkAndRetryPendingSubmission(elements);
  });
  
  // Also check immediately if already online
  if (navigator.onLine) {
    checkAndRetryPendingSubmission(elements);
  }
}

// ============================================================================
// VALIDATION BEFORE SUBMISSION
// ============================================================================

/**
 * Final validation before submission
 * Validates both step 1 and step 3 (required steps)
 */
export function validateBeforeSubmission(state: FormState): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  // Step 1: Property details
  if (!state.propertyType) {
    errors.push('Property type is required');
  }
  
  // Step 3: Contact information
  if (!state.fullName || state.fullName.trim().length < 2) {
    errors.push('Full name is required');
  }
  
  // Australian mobile validation
  const phonePattern = /^04\d{8}$/;
  if (!phonePattern.test(state.phone.replace(/\s/g, ''))) {
    errors.push('Valid Australian mobile number is required');
  }
  
  // Email validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(state.email)) {
    errors.push('Valid email address is required');
  }
  
  if (!state.address || state.address.trim().length < 5) {
    errors.push('Property address is required');
  }
  
  // Date validation (must be today or future)
  if (!state.date) {
    errors.push('Service date is required');
  } else {
    const selectedDate = new Date(state.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      errors.push('Service date must be today or in the future');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// ============================================================================
// FORM RESET
// ============================================================================

/**
 * Reset form to initial state (for "Start New Quote" button)
 */
export function resetForm(
  form: HTMLFormElement,
  elements: SubmissionUIElements
): void {
  // Reset HTML form
  form.reset();
  
  // Hide success, show form
  elements.success.classList.add('hidden');
  elements.formArea.classList.remove('hidden');
  elements.summary.classList.remove('hidden');
  elements.mobilebar.classList.remove('hidden');
  
  // Clear any errors
  elements.errorBanner.classList.add('hidden');
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================================================
// NETLIFY FORMS SETUP
// ============================================================================

/**
 * Ensure Netlify honeypot field is properly hidden
 * This prevents spam submissions
 */
export function setupHoneypot(): void {
  const honeypotContainer = document.querySelector('[data-netlify-honeypot]');
  if (honeypotContainer) {
    (honeypotContainer as HTMLElement).style.display = 'none';
  }
}

/**
 * Get submission analytics data
 */
export function getSubmissionAnalytics(state: FormState): Record<string, any> {
  return {
    propertyType: state.propertyType,
    bedrooms: state.bedrooms,
    bathrooms: state.bathrooms,
    addonsCount: state.addons.length,
    hasSpecialRequests: !!state.notes,
    hasExitDate: !!state.exitDate,
    hasPMContact: !!state.pmContact,
    toggles: state.toggles
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  submitQuoteForm,
  buildNetlifyFormData,
  checkAndRetryPendingSubmission,
  setupOfflineRecovery,
  validateBeforeSubmission,
  resetForm,
  setupHoneypot,
  getSubmissionAnalytics
};
