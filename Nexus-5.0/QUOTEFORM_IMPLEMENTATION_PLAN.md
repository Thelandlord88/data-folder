# 🏗️ QuoteForm Refactoring Implementation Plan
## Systematic Extraction Using Framework Principles

**Based On:** QUOTEFORM_FRAMEWORK_CASE_STUDY.md  
**Approach:** Upstream Thinking + Resourceful Innovation  
**Timeline:** 17 hours over 3-4 days  
**Risk Level:** Low (enhancement, not replacement)

---

## 📋 IMPLEMENTATION PHASES

### **Phase 1: Foundation** ✅ (This Document)
- [x] Case study completed
- [x] Framework analysis done
- [x] Architecture designed
- [ ] Structure created
- [ ] Configuration extracted

### **Phase 2: Extraction** (Next)
- [ ] Styles separated
- [ ] Logic modularized
- [ ] Components created

### **Phase 3: Integration** (After)
- [ ] Components connected
- [ ] Testing completed
- [ ] Documentation updated

### **Phase 4: Validation** (Final)
- [ ] Quality checks passed
- [ ] Performance verified
- [ ] Deployment ready

---

## 🎯 IMMEDIATE ACTIONS

### **Action 1: Create Directory Structure**

```bash
# Create organized structure
mkdir -p src/components/quote
mkdir -p src/styles/quote
mkdir -p src/scripts/quote
mkdir -p src/config/quote
```

**Why First?** Establishes the pattern - this is our single source of truth structure

### **Action 2: Extract Service Definitions**

**Target:** `/src/config/quote/serviceDefinitions.ts`

This is the business logic - the single source of truth for what we offer.

### **Action 3: Extract Design Tokens**

**Target:** `/src/styles/quote/design-tokens.css`

Design system becomes reusable across all forms.

---

## 📝 DETAILED EXTRACTION GUIDE

### **Step 1: Service Definitions (2 hours)**

**From:** QuoteFormneedsfixing.astro line ~100-300  
**To:** src/config/quote/serviceDefinitions.ts

**What to Extract:**
- Property types
- Room configurations
- Add-on services
- Included services
- Recommended badges

**Format:**
```typescript
export const propertyTypes = ['House', 'Apartment', 'Townhouse'];

export const addOnServices = [
  {
    id: 'carpet-steam',
    name: 'Carpet Steam Cleaning',
    price: 50,
    unit: 'per room',
    recommended: true,
    description: 'Professional steam cleaning...'
  },
  // ...
];

export const includedServices = [
  'All rooms deep cleaned',
  'Kitchen appliances',
  'Bathroom sanitization',
  // ...
];
```

---

### **Step 2: Validation Rules (1 hour)**

**From:** QuoteFormneedsfixing.astro line ~800-900 (JavaScript section)  
**To:** src/config/quote/validationRules.ts

**What to Extract:**
```typescript
export const validationRules = {
  propertyType: {
    required: true,
    errorMessage: 'Please select a property type.'
  },
  phone: {
    required: true,
    pattern: /^04\d{8}$/,
    errorMessage: 'Please enter a valid AU mobile (04XX XXX XXX)'
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    errorMessage: 'Please enter a valid email address'
  },
  // ...
};
```

---

### **Step 3: Design Tokens (1 hour)**

**From:** QuoteFormneedsfixing.astro line ~400-600 (CSS section)  
**To:** src/styles/quote/design-tokens.css

**What to Extract:**
```css
/* Design Tokens - Single Source of Truth */
:root {
  /* Colors */
  --q-sky-600: #0284c7;
  --q-navy: #0c2f5a;
  --q-silver: #eef2f7;
  --q-green: #059669;
  --q-error: #dc2626;
  
  /* Spacing */
  --q-space-xs: 0.25rem;
  --q-space-sm: 0.5rem;
  --q-space-md: 1rem;
  --q-space-lg: 1.5rem;
  --q-space-xl: 2rem;
  
  /* Typography */
  --q-font-body: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto;
  --q-text-sm: 0.875rem;
  --q-text-base: 1rem;
  --q-text-lg: 1.125rem;
  --q-text-xl: 1.25rem;
  
  /* Borders */
  --q-radius-sm: 0.375rem;
  --q-radius-md: 0.5rem;
  --q-radius-lg: 0.75rem;
  --q-radius-xl: 1rem;
  
  /* Shadows */
  --q-shadow-sm: 0 1px 2px rgba(12, 47, 90, 0.05);
  --q-shadow-md: 0 4px 6px rgba(12, 47, 90, 0.07);
  --q-shadow-lg: 0 10px 15px rgba(12, 47, 90, 0.1);
  
  /* Effects */
  --q-transition-fast: 150ms ease;
  --q-transition-base: 200ms ease;
  --q-transition-slow: 300ms ease;
}
```

---

### **Step 4: Component Styles (2 hours)**

**From:** QuoteFormneedsfixing.astro line ~600-1000  
**To:** src/styles/quote/components.css

**What to Extract:**
```css
/* Reusable Component Patterns */

/* Card */
.q-card {
  background: linear-gradient(180deg, #fbfcff, #ffffff);
  border: 1px solid transparent;
  background-clip: padding-box, border-box;
  border-radius: var(--q-radius-xl);
  padding: var(--q-space-lg);
  box-shadow: var(--q-shadow-lg);
}

/* Button */
.q-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--q-space-sm);
  padding: 0.75rem 1.25rem;
  border-radius: var(--q-radius-md);
  font-weight: 600;
  transition: var(--q-transition-base);
  cursor: pointer;
}

.q-btn-primary {
  background: var(--q-sky-600);
  color: white;
}

.q-btn-primary:hover {
  background: #0369a1;
}

/* Input */
.q-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--q-silver);
  border-radius: var(--q-radius-md);
  font-size: var(--q-text-base);
  transition: var(--q-transition-fast);
}

.q-input:focus {
  outline: none;
  border-color: var(--q-sky-600);
  box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.1);
}

/* ... more component patterns ... */
```

---

## 🔄 ITERATIVE APPROACH

### **Philosophy: Small, Verifiable Steps**

Don't try to do everything at once. Each step should:
1. ✅ Extract one concept
2. ✅ Create single source of truth
3. ✅ Verify nothing breaks
4. ✅ Commit with clear message
5. ✅ Document what was done

### **Commit Message Pattern**

```
refactor(quote): [Framework] - [What was extracted]

Upstream: [What failure class this helps eliminate]
Resourceful: [What existing capability was leveraged]

Example:
refactor(quote): Extract service definitions to config

Upstream: Eliminates "business logic in HTML" failure class
Resourceful: Leveraged TypeScript for type-safe configuration
```

---

## 🧪 TESTING STRATEGY

### **After Each Extraction:**

1. **Visual Test:** Does it still look the same?
2. **Functional Test:** Does the form still work?
3. **Validation Test:** Does validation still work?
4. **Mobile Test:** Does mobile view still work?

### **Final Integration Tests:**

```bash
# Run hunters
./hunters/code_quality.sh src/components/quote
./hunters/accessibility.sh src/components/quote
./hunters/performance.sh src/components/quote
```

---

## 📊 PROGRESS TRACKING

### **Extraction Checklist:**

**Configuration Layer:**
- [ ] serviceDefinitions.ts
- [ ] validationRules.ts
- [ ] pricingRules.ts

**Style Layer:**
- [ ] design-tokens.css
- [ ] components.css
- [ ] utilities.css

**Logic Layer:**
- [ ] quoteFormLogic.ts
- [ ] quoteValidation.ts
- [ ] quoteSubmission.ts
- [ ] quotePricing.ts

**Component Layer:**
- [ ] QuoteForm.astro (orchestrator)
- [ ] QuoteFormStep1.astro
- [ ] QuoteFormStep2.astro
- [ ] QuoteFormStep3.astro
- [ ] QuoteFormStep4.astro
- [ ] QuoteSummary.astro
- [ ] QuoteProgress.astro

**Documentation:**
- [ ] Architecture.md
- [ ] Components.md
- [ ] API.md
- [ ] Testing.md

---

## 🎯 SUCCESS CRITERIA

### **Must Have:**
✅ All functionality preserved  
✅ Visual design unchanged  
✅ Mobile responsive maintained  
✅ Netlify integration working  
✅ Validation functioning  

### **Should Have:**
✅ Code split into logical modules  
✅ Styles reusable  
✅ Logic testable  
✅ Documentation complete  

### **Nice to Have:**
✅ Unit tests for logic  
✅ Visual regression tests  
✅ Performance improvements  
✅ Accessibility enhancements  

---

## 🚀 READY TO START

**Next Command:**
```bash
# Start implementation
cd /workspaces/data-folder
mkdir -p src/{components,styles,scripts,config}/quote
```

**First File to Create:**
`src/config/quote/serviceDefinitions.ts`

**Why?** Business logic first - this is what the form is FOR.

---

**Let's do this systematically! Ready when you are.** 🎯
