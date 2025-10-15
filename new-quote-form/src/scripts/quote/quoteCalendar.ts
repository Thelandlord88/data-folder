/**
 * Calendar Component - DATE PICKER LOGIC
 * 
 * Framework Application:
 * - Upstream Thinking: Eliminates "inconsistent date input" failure class
 * - Resourceful Innovation: Zero-dependency calendar (no date library needed!)
 * 
 * Lightweight, accessible calendar picker with keyboard navigation.
 * No external dependencies - pure TypeScript.
 */

// ============================================================================
// TYPES
// ============================================================================

interface CalendarElements {
  root: HTMLElement;
  isoInput: HTMLInputElement;
  displayInput: HTMLInputElement;
  trigger: HTMLElement;
}

// ============================================================================
// DATE UTILITIES
// ============================================================================

/**
 * Get start of day (midnight) for date comparison
 */
function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * Check if two dates are the same day
 */
function isSameDay(date1: Date, date2: Date): boolean {
  return startOfDay(date1).getTime() === startOfDay(date2).getTime();
}

/**
 * Add months to a date
 */
function addMonths(date: Date, months: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

/**
 * Format date as dd/mm/yyyy
 */
function formatDateDisplay(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Format date as ISO string (yyyy-mm-dd)
 */
function formatDateISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// ============================================================================
// CALENDAR CLASS
// ============================================================================

export class Calendar {
  private root: HTMLElement;
  private isoInput: HTMLInputElement;
  private displayInput: HTMLInputElement;
  private trigger: HTMLElement;
  
  private popup: HTMLElement | null = null;
  private prevBtn: HTMLButtonElement | null = null;
  private nextBtn: HTMLButtonElement | null = null;
  private label: HTMLElement | null = null;
  private grid: HTMLElement | null = null;
  private dayButtons: HTMLButtonElement[] = [];
  
  private minDate: Date;
  private viewDate: Date;
  private selectedDate: Date | null = null;
  
  private outsideClickHandler: ((e: MouseEvent) => void) | null = null;
  
  constructor(elements: CalendarElements) {
    this.root = elements.root;
    this.isoInput = elements.isoInput;
    this.displayInput = elements.displayInput;
    this.trigger = elements.trigger;
    
    // Set minimum date to today
    this.minDate = startOfDay(new Date());
    
    // Start viewing current month
    this.viewDate = new Date();
    
    // Check if there's already a selected date
    if (this.isoInput.value) {
      try {
        this.selectedDate = new Date(this.isoInput.value);
      } catch {}
    }
    
    this.build();
    this.attachListeners();
  }
  
  // ==========================================================================
  // BUILD UI
  // ==========================================================================
  
  private build(): void {
    // Create popup container
    this.popup = document.createElement('div');
    this.popup.className = 'q-cal hidden';
    this.popup.setAttribute('role', 'dialog');
    this.popup.setAttribute('aria-label', 'Date picker');
    this.root.appendChild(this.popup);
    
    // Header with month/year label and navigation
    const head = document.createElement('div');
    head.className = 'q-cal-head';
    this.popup.appendChild(head);
    
    this.prevBtn = this.createButton(
      '<i class="fas fa-chevron-left"></i>',
      'Previous month',
      () => this.navigateMonth(-1)
    );
    
    this.nextBtn = this.createButton(
      '<i class="fas fa-chevron-right"></i>',
      'Next month',
      () => this.navigateMonth(1)
    );
    
    this.label = document.createElement('span');
    this.label.className = 'font-semibold text-slate-900';
    this.label.setAttribute('aria-live', 'polite');
    
    head.append(this.prevBtn, this.label, this.nextBtn);
    
    // Grid for days
    this.grid = document.createElement('div');
    this.grid.className = 'grid grid-cols-7 gap-1 p-1';
    this.grid.setAttribute('role', 'grid');
    this.popup.appendChild(this.grid);
    
    // Create 42 day buttons (6 weeks max)
    for (let i = 0; i < 42; i++) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'q-cal-day';
      btn.setAttribute('role', 'gridcell');
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const date = (btn as any)._date as Date;
        if (date) {
          this.selectDate(date);
        }
      });
      this.dayButtons.push(btn);
      this.grid.appendChild(btn);
    }
  }
  
  private createButton(
    html: string,
    label: string,
    onClick: () => void
  ): HTMLButtonElement {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.innerHTML = html;
    btn.className = 'px-2 py-1 text-sky-600 hover:text-sky-800 focus:outline-none';
    btn.setAttribute('aria-label', label);
    btn.addEventListener('click', onClick);
    return btn;
  }
  
  // ==========================================================================
  // CALENDAR LOGIC
  // ==========================================================================
  
  private render(): void {
    if (!this.label || !this.grid) return;
    
    // Update month/year label
    this.label.textContent = this.viewDate.toLocaleString('default', {
      month: 'long',
      year: 'numeric'
    });
    
    // Calculate first day of month
    const firstDay = new Date(
      this.viewDate.getFullYear(),
      this.viewDate.getMonth(),
      1
    );
    
    // Calculate offset (Monday as first day of week)
    const dayOfWeek = firstDay.getDay();
    const offset = (dayOfWeek + 6) % 7; // Convert Sunday=0 to Monday=0
    
    // Calculate start date (might be in previous month)
    const startDate = new Date(firstDay);
    startDate.setDate(firstDay.getDate() - offset);
    
    // Render each day button
    for (let i = 0; i < 42; i++) {
      const btn = this.dayButtons[i];
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      // Store date on button
      (btn as any)._date = date;
      
      // Update button content
      btn.textContent = String(date.getDate());
      
      // Calculate state
      const isCurrentMonth = date.getMonth() === this.viewDate.getMonth();
      const isDisabled = date < this.minDate;
      const isSelected = this.selectedDate && isSameDay(date, this.selectedDate);
      const isToday = isSameDay(date, new Date());
      
      // Reset classes
      btn.className = 'q-cal-day';
      
      // Apply state classes
      if (!isCurrentMonth) {
        btn.classList.add('text-slate-400');
      }
      
      if (isDisabled) {
        btn.classList.add('text-slate-300', 'cursor-not-allowed');
        btn.disabled = true;
      } else {
        btn.disabled = false;
      }
      
      if (isToday) {
        btn.classList.add('ring-2');
      }
      
      if (isSelected) {
        btn.classList.add('bg-sky');
      }
      
      // Set ARIA attributes
      btn.setAttribute('aria-label', formatDateDisplay(date));
      if (isSelected) {
        btn.setAttribute('aria-selected', 'true');
      } else {
        btn.removeAttribute('aria-selected');
      }
    }
  }
  
  private navigateMonth(delta: number): void {
    this.viewDate = addMonths(this.viewDate, delta);
    this.render();
  }
  
  private selectDate(date: Date): void {
    if (date < this.minDate) {
      return; // Can't select past dates
    }
    
    this.selectedDate = date;
    this.render();
    
    // Update inputs
    const isoDate = formatDateISO(date);
    const displayDate = formatDateDisplay(date);
    
    this.isoInput.value = isoDate;
    this.displayInput.value = displayDate;
    
    // Trigger input event for form state update
    this.isoInput.dispatchEvent(new Event('input', { bubbles: true }));
    
    // Focus display input and close
    this.displayInput.focus();
    this.close();
  }
  
  // ==========================================================================
  // OPEN/CLOSE
  // ==========================================================================
  
  open(): void {
    if (!this.popup) return;
    
    // Show popup
    this.popup.classList.remove('hidden');
    
    // Render current state
    this.render();
    
    // Setup outside click listener
    this.outsideClickHandler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        this.popup &&
        !this.popup.contains(target) &&
        target !== this.trigger
      ) {
        this.close();
      }
    };
    document.addEventListener('mousedown', this.outsideClickHandler);
    
    // Focus first enabled day
    const firstEnabled = this.dayButtons.find(btn => !btn.disabled);
    if (firstEnabled) {
      firstEnabled.focus();
    }
    
    // Announce to screen readers
    if (this.label) {
      this.label.setAttribute('aria-live', 'polite');
    }
  }
  
  close(): void {
    if (!this.popup) return;
    
    // Hide popup
    this.popup.classList.add('hidden');
    
    // Remove outside click listener
    if (this.outsideClickHandler) {
      document.removeEventListener('mousedown', this.outsideClickHandler);
      this.outsideClickHandler = null;
    }
  }
  
  // ==========================================================================
  // EVENT LISTENERS
  // ==========================================================================
  
  private attachListeners(): void {
    // Trigger button opens calendar
    this.trigger.addEventListener('mousedown', (e) => {
      e.preventDefault();
      this.open();
    });
    
    this.trigger.addEventListener('click', (e) => {
      e.preventDefault();
    });
    
    // Display input opens calendar
    this.displayInput.addEventListener('focus', () => {
      this.open();
    });
    
    // Keyboard navigation
    this.displayInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.close();
      }
    });
  }
  
  // ==========================================================================
  // PUBLIC API
  // ==========================================================================
  
  /**
   * Programmatically set selected date
   */
  setDate(date: Date | string): void {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    this.selectDate(dateObj);
  }
  
  /**
   * Get currently selected date
   */
  getDate(): Date | null {
    return this.selectedDate;
  }
  
  /**
   * Destroy calendar and cleanup
   */
  destroy(): void {
    if (this.popup && this.popup.parentNode) {
      this.popup.parentNode.removeChild(this.popup);
    }
    
    if (this.outsideClickHandler) {
      document.removeEventListener('mousedown', this.outsideClickHandler);
    }
  }
}

// ============================================================================
// INITIALIZATION HELPER
// ============================================================================

/**
 * Initialize calendar for a form
 */
export function initCalendar(): Calendar | null {
  const root = document.getElementById('cal-root');
  const isoInput = document.getElementById('service-date') as HTMLInputElement;
  const displayInput = document.getElementById('service-date-display') as HTMLInputElement;
  const trigger = document.getElementById('cal-trigger') as HTMLElement;
  
  if (!root || !isoInput || !displayInput || !trigger) {
    console.warn('Calendar elements not found');
    return null;
  }
  
  return new Calendar({
    root,
    isoInput,
    displayInput,
    trigger
  });
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  Calendar,
  initCalendar
};
