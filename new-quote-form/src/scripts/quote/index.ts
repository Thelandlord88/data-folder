/**
 * Quote Form Main Controller - ORCHESTRATION
 * 
 * Framework Application:
 * - Upstream Thinking: Single entry point eliminates "initialization chaos" failure class
 * - Resourceful Innovation: Composes extracted modules into working system
 * 
 * Main controller that coordinates all quote form modules.
 * This is what gets imported into the Astro component.
 */

import {
  createInitialState,
  navigateToStep,
  updateStateFromInput,
  updateToggle,
  updateAddOns,
  renderSummary,
  renderReview,
  updateRecommendedBadges,
  validateCurrentStep,
  saveStateToStorage,
  loadStateFromStorage,
  getPendingSubmission,
  trackEvent,
  type FormState,
  type FormElements
} from './quoteFormLogic';

import {
  submitQuoteForm,
  setupOfflineRecovery,
  resetForm,
  setupHoneypot,
  type SubmissionUIElements
} from './quoteSubmission';

import { initCalendar } from './quoteCalendar';

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Main initialization function
 * Call this when the form is ready to be initialized
 */
export function initQuoteForm(): void {
  const root = document.querySelector('[data-quote]');
  if (!root) {
    console.warn('Quote form root not found');
    return;
  }
  
  // Prevent double initialization
  if (root.getAttribute('data-init') === '1') {
    return;
  }
  root.setAttribute('data-init', '1');
  
  // Get DOM elements
  const elements = getFormElements();
  if (!elements) {
    console.error('Required form elements not found');
    return;
  }
  
  // Initialize state
  let state = loadStateFromStorage() || createInitialState();
  
  // Setup Netlify honeypot
  setupHoneypot();
  
  // Initialize calendar
  initCalendar();
  
  // Setup offline recovery
  setupOfflineRecovery(elements);
  
  // Check for pending submission
  const pending = getPendingSubmission();
  if (pending && navigator.onLine) {
    // Restore state and attempt resubmission
    state = pending;
    submitQuoteForm(state, elements);
  }
  
  // Attach event listeners
  attachEventListeners(elements, state);
  
  // Setup toggles (included/additional details)
  setupToggles();
  
  // Initial render
  render(state);
  navigateToStep(1, state, elements);
  
  console.log('✅ Quote form initialized');
}

// ============================================================================
// DOM ELEMENT COLLECTION
// ============================================================================

function getFormElements(): (FormElements & SubmissionUIElements) | null {
  const form = document.getElementById('q-form') as HTMLFormElement;
  const steps = document.querySelectorAll<HTMLElement>('.q-step');
  const submitBtn = document.getElementById('q-submit') as HTMLButtonElement;
  const errorBanner = document.getElementById('q-error');
  const errorMsg = document.getElementById('q-error-msg');
  const formArea = document.querySelector('.md\\:col-span-7') as HTMLElement;
  const summary = document.getElementById('q-summary') as HTMLElement;
  const mobilebar = document.getElementById('q-mobilebar') as HTMLElement;
  const success = document.getElementById('q-success') as HTMLElement;
  const progressBar = document.getElementById('q-progress') as HTMLElement;
  const submitText = submitBtn?.querySelector('.q-submit-text') as HTMLElement;
  const spinner = submitBtn?.querySelector('.q-spinner') as HTMLElement;
  
  if (!form || !steps.length || !submitBtn || !errorBanner || !errorMsg ||
      !formArea || !summary || !mobilebar || !success || !progressBar ||
      !submitText || !spinner) {
    return null;
  }
  
  return {
    form,
    steps,
    submitBtn,
    errorBanner,
    errorMsg,
    formArea,
    summary,
    mobilebar,
    success,
    progressBar,
    submitText,
    spinner
  };
}

// ============================================================================
// EVENT LISTENERS
// ============================================================================

function attachEventListeners(
  elements: FormElements & SubmissionUIElements,
  initialState: FormState
): void {
  let state = initialState;
  
  // Input events (update state)
  elements.form.addEventListener('input', (e) => {
    const target = e.target as HTMLInputElement;
    const name = target.name;
    
    if (name === 'addons') {
      // Handle checkboxes
      state.addons = updateAddOns(elements.form);
    } else {
      // Handle other inputs
      state = updateStateFromInput(state, name, target.value);
    }
    
    // Save state
    saveStateToStorage(state);
    
    // Render updates
    render(state);
  });
  
  // Change events (checkboxes/toggles)
  elements.form.addEventListener('change', (e) => {
    const target = e.target as HTMLInputElement;
    const id = target.id;
    
    // Handle property toggles
    if (id.startsWith('has-') || id === 'ext-reachable' || id === 'two-storey') {
      state = updateToggle(state, id, target.checked);
      saveStateToStorage(state);
      render(state);
    }
  });
  
  // Click events (navigation buttons)
  elements.form.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const button = target.closest('button');
    if (!button) return;
    
    // Next button
    if (button.classList.contains('q-next')) {
      handleNext(state, elements);
    }
    
    // Previous button
    if (button.classList.contains('q-prev')) {
      handlePrevious(state, elements);
    }
  });
  
  // Form submission
  elements.form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await handleSubmit(state, elements);
  });
  
  // New quote button
  const newQuoteBtn = document.getElementById('q-new');
  if (newQuoteBtn) {
    newQuoteBtn.addEventListener('click', () => {
      state = createInitialState();
      resetForm(elements.form, elements);
      render(state);
      navigateToStep(1, state, elements);
      saveStateToStorage(state);
    });
  }
}

// ============================================================================
// EVENT HANDLERS
// ============================================================================

function handleNext(
  state: FormState,
  elements: FormElements & SubmissionUIElements
): void {
  // Track first interaction
  if (state.step === 1) {
    trackEvent('quote_start', { path: window.location.pathname });
  }
  
  // Validate current step
  const isValid = validateCurrentStep(state.step, state, elements.form);
  if (!isValid) {
    return; // Validation errors shown by validateCurrentStep
  }
  
  // Navigate to next step
  if (state.step < 4) {
    navigateToStep(state.step + 1, state, elements);
  }
}

function handlePrevious(
  state: FormState,
  elements: FormElements & SubmissionUIElements
): void {
  if (state.step > 1) {
    navigateToStep(state.step - 1, state, elements);
  }
}

async function handleSubmit(
  state: FormState,
  elements: FormElements & SubmissionUIElements
): Promise<void> {
  // Final validation
  const step1Valid = validateCurrentStep(1, state, elements.form);
  const step3Valid = validateCurrentStep(3, state, elements.form);
  
  if (!step1Valid || !step3Valid) {
    return; // Show validation errors
  }
  
  // Submit form
  await submitQuoteForm(state, elements);
}

// ============================================================================
// RENDERING
// ============================================================================

function render(state: FormState): void {
  // Update live summary
  renderSummary(state);
  
  // Update review if on step 4
  if (state.step === 4) {
    renderReview(state);
  }
  
  // Update recommended badges
  updateRecommendedBadges(state);
}

// ============================================================================
// TOGGLES (DETAILS/ACCORDION)
// ============================================================================

function setupToggles(): void {
  // Included services toggle
  const includedBtn = document.getElementById('q-included-btn');
  const includedDetails = document.getElementById('q-included') as HTMLDetailsElement;
  
  if (includedBtn && includedDetails) {
    includedBtn.addEventListener('click', () => {
      const isOpen = includedDetails.hasAttribute('open');
      if (isOpen) {
        includedDetails.removeAttribute('open');
      } else {
        includedDetails.setAttribute('open', '');
      }
      includedBtn.setAttribute('aria-expanded', String(!isOpen));
    });
  }
  
  // Additional details toggle
  const additionalBtn = document.getElementById('q-additional-btn');
  const additionalDetails = document.getElementById('q-additional') as HTMLDetailsElement;
  
  if (additionalBtn && additionalDetails) {
    additionalBtn.addEventListener('click', () => {
      const isOpen = additionalDetails.hasAttribute('open');
      if (isOpen) {
        additionalDetails.removeAttribute('open');
      } else {
        additionalDetails.setAttribute('open', '');
      }
      additionalBtn.setAttribute('aria-expanded', String(!isOpen));
    });
  }
}

// ============================================================================
// LAZY INITIALIZATION
// ============================================================================

/**
 * Schedule initialization when form comes into view
 * Optimizes performance by deferring initialization
 */
export function scheduleInit(): void {
  const root = document.querySelector('[data-quote]');
  if (!root) return;
  
  const start = () => {
    if (root.getAttribute('data-init') === '1') return;
    
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => initQuoteForm());
    } else {
      setTimeout(() => initQuoteForm(), 0);
    }
  };
  
  // Initialize when form enters viewport
  const observer = new IntersectionObserver(
    (entries, obs) => {
      if (entries.some(e => e.isIntersecting)) {
        obs.disconnect();
        start();
      }
    },
    { rootMargin: '300px' }
  );
  observer.observe(root);
  
  // Also initialize on first user interaction (fallback)
  const onFirstInteract = () => {
    start();
    window.removeEventListener('click', onFirstInteract, true);
  };
  window.addEventListener('click', onFirstInteract, true);
}

// ============================================================================
// AUTO-START
// ============================================================================

/**
 * Automatically schedule initialization
 * This runs when the script is loaded
 */
function autoInit(): void {
  // Listen for Astro client events (if using view transitions)
  document.addEventListener('astro:page-load', scheduleInit);
  document.addEventListener('astro:after-swap', scheduleInit);
  
  // Fallback for static pages
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleInit);
  } else {
    scheduleInit();
  }
}

// Auto-initialize
autoInit();

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  initQuoteForm,
  scheduleInit
};
