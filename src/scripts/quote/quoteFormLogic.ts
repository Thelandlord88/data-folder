/**
 * Quote Form Logic - STATE MANAGEMENT & NAVIGATION
 * 
 * Framework Application:
 * - Upstream Thinking: Eliminates "scattered state management" failure class
 * - Resourceful Innovation: Extracts existing patterns, enhances with TypeScript
 * 
 * Manages form state, step navigation, and UI updates.
 * Pure functions for testability.
 */

import { validateStep, type FieldValidationRules } from '../../config/quote/validationRules';
import { getRecommendedAddOns } from '../../config/quote/serviceDefinitions';

// ============================================================================
// TYPES
// ============================================================================

export interface FormState {
  step: number;
  propertyType: string;
  bedrooms: string;
  bathrooms: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  date: string;
  notes: string;
  exitDate: string;
  pmContact: string;
  addons: string[];
  toggles: {
    pets: boolean;
    carpet: boolean;
    balcony: boolean;
    reachable: boolean;
    twoStorey: boolean;
  };
}

export interface FormElements {
  form: HTMLFormElement;
  steps: NodeListOf<HTMLElement>;
  submitBtn: HTMLButtonElement;
  errorBanner: HTMLElement;
  errorMsg: HTMLElement;
  formArea: HTMLElement;
  summary: HTMLElement;
  mobilebar: HTMLElement;
  success: HTMLElement;
  progressBar: HTMLElement;
}

// ============================================================================
// INITIAL STATE
// ============================================================================

export function createInitialState(): FormState {
  return {
    step: 1,
    propertyType: '',
    bedrooms: '3',
    bathrooms: '2',
    addons: [],
    fullName: '',
    phone: '',
    email: '',
    address: '',
    date: '',
    notes: '',
    exitDate: '',
    pmContact: '',
    toggles: {
      pets: false,
      carpet: false,
      balcony: false,
      reachable: false,
      twoStorey: false
    }
  };
}

// ============================================================================
// STEP NAVIGATION
// ============================================================================

/**
 * Calculate progress percentage based on current step
 */
export function calculateProgress(step: number): number {
  const totalSteps = 4;
  return Math.round((step / totalSteps) * 100);
}

/**
 * Check if we can navigate to next step
 */
export function canNavigateNext(step: number): boolean {
  return step < 4;
}

/**
 * Check if we can navigate to previous step
 */
export function canNavigatePrevious(step: number): boolean {
  return step > 1;
}

/**
 * Navigate to a specific step
 * Updates UI elements and manages visibility
 */
export function navigateToStep(
  newStep: number,
  state: FormState,
  elements: FormElements
): FormState {
  const updatedState = { ...state, step: newStep };
  
  // Update step visibility
  elements.steps.forEach((stepEl, idx) => {
    if (idx + 1 === newStep) {
      stepEl.classList.add('active');
      stepEl.classList.remove('hidden');
    } else {
      stepEl.classList.remove('active');
      stepEl.classList.add('hidden');
    }
  });
  
  // Update progress bar
  const progress = calculateProgress(newStep);
  elements.progressBar.style.width = `${progress}%`;
  
  // Update stepper UI
  updateStepperUI(newStep);
  
  // Hide mobile bar on final step
  if (newStep === 4) {
    elements.mobilebar.classList.add('hidden');
  } else {
    elements.mobilebar.classList.remove('hidden');
  }
  
  // Manage back button visibility
  const backButtons = document.querySelectorAll('.q-prev');
  backButtons.forEach(btn => {
    if (newStep === 1) {
      (btn as HTMLElement).classList.add('hidden');
    } else {
      (btn as HTMLElement).classList.remove('hidden');
    }
  });
  
  // Scroll to top smoothly
  window.scrollTo({ top: 0, behavior: 'smooth' });
  
  // Focus first interactive element
  focusFirstElement(newStep, elements.form);
  
  return updatedState;
}

/**
 * Update stepper visual indicators
 */
function updateStepperUI(currentStep: number): void {
  const stepperItems = document.querySelectorAll('#q-steps [data-step-label]');
  
  stepperItems.forEach((item) => {
    const stepLabel = item.getAttribute('data-step-label');
    
    if (stepLabel === String(currentStep)) {
      item.setAttribute('aria-current', 'step');
    } else {
      item.removeAttribute('aria-current');
    }
  });
}

/**
 * Focus first interactive element in current step
 */
function focusFirstElement(step: number, form: HTMLFormElement): void {
  const stepEl = form.querySelector(`#q-step-${step}`);
  if (!stepEl) return;
  
  const firstInteractive = stepEl.querySelector<HTMLElement>(
    'input, select, textarea, button.q-next, button.q-prev'
  );
  
  if (firstInteractive) {
    firstInteractive.focus({ preventScroll: true });
  }
}

// ============================================================================
// STATE UPDATES
// ============================================================================

/**
 * Update form state from input event
 */
export function updateStateFromInput(
  state: FormState,
  inputName: string,
  value: any
): FormState {
  const updatedState = { ...state };
  
  switch (inputName) {
    case 'property-type':
      updatedState.propertyType = value;
      break;
    case 'bedrooms':
      updatedState.bedrooms = value;
      break;
    case 'bathrooms':
      updatedState.bathrooms = value;
      break;
    case 'full-name':
      updatedState.fullName = value;
      break;
    case 'phone':
      updatedState.phone = value;
      break;
    case 'email':
      updatedState.email = value;
      break;
    case 'property-address':
      updatedState.address = value;
      break;
    case 'service-date':
      updatedState.date = value;
      break;
    case 'special-requests':
      updatedState.notes = value;
      break;
    case 'exit-date':
      updatedState.exitDate = value;
      break;
    case 'pm-contact':
      updatedState.pmContact = value;
      break;
    case 'addons':
      // Handled separately - checkboxes need special logic
      break;
  }
  
  return updatedState;
}

/**
 * Update toggle state from checkbox
 */
export function updateToggle(
  state: FormState,
  toggleId: string,
  checked: boolean
): FormState {
  const updatedState = { ...state };
  
  switch (toggleId) {
    case 'has-pets':
      updatedState.toggles.pets = checked;
      break;
    case 'has-carpet':
      updatedState.toggles.carpet = checked;
      break;
    case 'has-balcony':
      updatedState.toggles.balcony = checked;
      break;
    case 'ext-reachable':
      updatedState.toggles.reachable = checked;
      break;
    case 'two-storey':
      updatedState.toggles.twoStorey = checked;
      break;
  }
  
  return updatedState;
}

/**
 * Update selected add-ons
 */
export function updateAddOns(form: HTMLFormElement): string[] {
  const checkedBoxes = form.querySelectorAll<HTMLInputElement>(
    '#addons input[name="addons"]:checked'
  );
  
  return Array.from(checkedBoxes).map(checkbox => checkbox.value);
}

// ============================================================================
// UI RENDERING
// ============================================================================

/**
 * Render live summary sidebar
 */
export function renderSummary(state: FormState): void {
  // Property info
  const propText = `${state.bedrooms} Bed, ${state.bathrooms} Bath ${state.propertyType || 'Property'}`;
  const smProp = document.getElementById('sm-prop');
  if (smProp) smProp.textContent = propText;
  
  // Address
  const smAddr = document.getElementById('sm-addr');
  if (smAddr) smAddr.textContent = state.address || '—';
  
  // Date
  const smDate = document.getElementById('sm-date');
  if (smDate) {
    smDate.textContent = state.date
      ? state.date.split('-').reverse().join('/')
      : '—';
  }
  
  // Services
  const smSvcs = document.getElementById('sm-svcs');
  if (smSvcs) {
    smSvcs.innerHTML = '';
    addServiceChip(smSvcs, 'Standard Bond Clean', true, true);
    state.addons.forEach(addon => {
      addServiceChip(smSvcs, addon, false, true);
    });
  }
}

/**
 * Render review step (Step 4)
 */
export function renderReview(state: FormState): void {
  const propText = `${state.bedrooms} Bed, ${state.bathrooms} Bath ${state.propertyType || 'Property'}`;
  
  // Property
  const rvProp = document.getElementById('rv-prop');
  if (rvProp) rvProp.textContent = propText;
  
  // Address
  const rvAddr = document.getElementById('rv-addr');
  if (rvAddr) rvAddr.textContent = state.address || '—';
  
  // Date
  const rvDate = document.getElementById('rv-date');
  if (rvDate) {
    rvDate.textContent = state.date
      ? state.date.split('-').reverse().join('/')
      : '—';
  }
  
  // Exit date (optional)
  const rvKey = document.getElementById('rv-key');
  const rvKeyRow = document.getElementById('rv-key-row');
  if (rvKey && rvKeyRow) {
    const exitValue = state.exitDate.trim();
    rvKey.textContent = exitValue || '—';
    rvKeyRow.classList.toggle('hidden', !exitValue);
  }
  
  // PM contact (optional)
  const rvPm = document.getElementById('rv-pm');
  const rvPmRow = document.getElementById('rv-pm-row');
  if (rvPm && rvPmRow) {
    const pmValue = state.pmContact.trim();
    rvPm.textContent = pmValue || '—';
    rvPmRow.classList.toggle('hidden', !pmValue);
  }
  
  // Notes
  const rvNotes = document.getElementById('rv-notes');
  if (rvNotes) rvNotes.textContent = state.notes || '—';
  
  // Services
  const rvSvcs = document.getElementById('rv-svcs');
  if (rvSvcs) {
    rvSvcs.innerHTML = '';
    addServiceChip(rvSvcs, 'Standard Bond Clean', true, true);
    state.addons.forEach(addon => {
      addServiceChip(rvSvcs, addon, false, true);
    });
  }
}

/**
 * Update recommended badges based on toggles
 */
export function updateRecommendedBadges(state: FormState): void {
  const recommendedAddOns = getRecommendedAddOns({
    hasPets: state.toggles.pets,
    hasCarpet: state.toggles.carpet,
    hasBalcony: state.toggles.balcony,
    extWindows: state.toggles.reachable,
    multiStorey: state.toggles.twoStorey
  });
  
  // Map of add-on labels to IDs
  const labelToId: { [key: string]: string } = {
    'Carpet Steam Clean': 'carpet-steam',
    'Flea Treatment (Licensed Partner)': 'flea-treatment',
    'Balcony/Patio Wash': 'balcony-patio',
    'External Windows (Reachable)': 'external-windows'
  };
  
  // Update pills
  const addonCards = document.querySelectorAll('#addons .q-addon');
  addonCards.forEach(card => {
    const titleEl = card.querySelector('.q-title');
    const pillEl = card.querySelector('.q-pill');
    
    if (titleEl && pillEl) {
      const title = titleEl.textContent?.trim() || '';
      const addonId = labelToId[title];
      const shouldShow = addonId && recommendedAddOns.includes(addonId);
      
      pillEl.classList.toggle('hidden', !shouldShow);
    }
  });
}

/**
 * Helper: Add service chip to container
 */
function addServiceChip(
  container: HTMLElement,
  text: string,
  isBase: boolean = false,
  isCompact: boolean = false
): void {
  const el = document.createElement('li');
  const classes = ['q-tag'];
  
  if (isCompact) classes.push('q-tag-sm');
  if (isBase) classes.push('q-tag-base');
  
  el.className = classes.join(' ');
  
  const iconClass = isBase
    ? 'fas fa-check text-emerald-600'
    : 'fas fa-plus text-sky-600';
  
  el.innerHTML = `<i class="${iconClass}"></i><span>${text}</span>`;
  container.appendChild(el);
}

// ============================================================================
// VALIDATION UI
// ============================================================================

/**
 * Toggle validation error display for an input
 */
export function toggleValidationError(
  input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement,
  isValid: boolean
): void {
  // Show/hide error message
  const errorId = input.getAttribute('aria-describedby');
  if (errorId) {
    const errorEl = document.getElementById(errorId);
    if (errorEl) {
      errorEl.hidden = isValid;
    }
  }
  
  // Toggle invalid class and aria attribute
  input.classList.toggle('q-invalid', !isValid);
  input.setAttribute('aria-invalid', String(!isValid));
}

/**
 * Validate current step and show errors
 */
export function validateCurrentStep(
  step: number,
  state: FormState,
  form: HTMLFormElement
): boolean {
  // Get form data for validation
  const formData: { [key: string]: any } = {
    'property-type': state.propertyType,
    'bedrooms': state.bedrooms,
    'bathrooms': state.bathrooms,
    'full-name': state.fullName,
    'phone': state.phone,
    'email': state.email,
    'property-address': state.address,
    'service-date': state.date
  };
  
  const validation = validateStep(step, formData);
  
  // Update UI for each field
  Object.keys(validation.errors).forEach(fieldName => {
    const input = form.querySelector<HTMLInputElement>(`[name="${fieldName}"], #${fieldName}`);
    if (input) {
      toggleValidationError(input, false);
    }
  });
  
  // If invalid, scroll to first error
  if (!validation.isValid) {
    const firstInvalid = form.querySelector('.q-invalid');
    if (firstInvalid) {
      firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
  
  return validation.isValid;
}

// ============================================================================
// PERSISTENCE
// ============================================================================

const STORAGE_KEY = 'quoteFormState';
const PENDING_SUBMISSION_KEY = 'pendingQuoteSubmission';

/**
 * Save state to localStorage
 */
export function saveStateToStorage(state: FormState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('Failed to save state to localStorage:', error);
  }
}

/**
 * Load state from localStorage
 */
export function loadStateFromStorage(): FormState | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.warn('Failed to load state from localStorage:', error);
    return null;
  }
}

/**
 * Clear saved state
 */
export function clearSavedState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(PENDING_SUBMISSION_KEY);
  } catch (error) {
    console.warn('Failed to clear localStorage:', error);
  }
}

/**
 * Check for pending submission (offline recovery)
 */
export function getPendingSubmission(): FormState | null {
  try {
    const pending = localStorage.getItem(PENDING_SUBMISSION_KEY);
    return pending ? JSON.parse(pending) : null;
  } catch (error) {
    console.warn('Failed to get pending submission:', error);
    return null;
  }
}

/**
 * Save pending submission (offline recovery)
 */
export function savePendingSubmission(state: FormState): void {
  try {
    localStorage.setItem(PENDING_SUBMISSION_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('Failed to save pending submission:', error);
  }
}

// ============================================================================
// ANALYTICS HELPERS
// ============================================================================

/**
 * Track analytics event (safely)
 */
export function trackEvent(eventName: string, params: Record<string, any> = {}): void {
  try {
    if (typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', eventName, {
        ...params,
        transport_type: 'beacon'
      });
    } else if (Array.isArray((window as any).dataLayer)) {
      (window as any).dataLayer.push({ event: eventName, ...params });
    }
  } catch (error) {
    // Silently fail - analytics should never break functionality
    console.debug('Analytics tracking failed:', error);
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  createInitialState,
  calculateProgress,
  canNavigateNext,
  canNavigatePrevious,
  navigateToStep,
  updateStateFromInput,
  updateToggle,
  updateAddOns,
  renderSummary,
  renderReview,
  updateRecommendedBadges,
  toggleValidationError,
  validateCurrentStep,
  saveStateToStorage,
  loadStateFromStorage,
  clearSavedState,
  getPendingSubmission,
  savePendingSubmission,
  trackEvent
};
