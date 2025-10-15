# Quote Form Architecture

**Modular, Type-Safe, Framework-Aligned Implementation**

## 📁 Directory Structure

```
src/
├── components/quote/
│   ├── QuoteForm.astro           # Main orchestrator
│   ├── QuoteFormStep1.astro      # Property details
│   ├── QuoteFormStep2.astro      # Add-ons
│   ├── QuoteFormStep3.astro      # Contact info
│   ├── QuoteFormStep4.astro      # Review
│   ├── QuoteSummary.astro        # Live sidebar
│   └── QuoteProgress.astro       # Progress indicator
│
├── config/quote/
│   ├── serviceDefinitions.ts    # Business rules (SSOT)
│   └── validationRules.ts       # Validation logic (SSOT)
│
├── styles/quote/
│   ├── design-tokens.css        # Design system variables
│   └── components.css           # UI component patterns
│
└── scripts/quote/
    ├── index.ts                 # Main controller
    ├── quoteFormLogic.ts        # State & navigation
    ├── quoteSubmission.ts       # Netlify integration
    └── quoteCalendar.ts         # Date picker

```

## 🎯 Usage

### Import in Astro Page

```astro
---
import QuoteForm from '@/components/quote/QuoteForm.astro';
---

<QuoteForm />
```

### Import Styles

```astro
<link rel="stylesheet" href="/src/styles/quote/design-tokens.css">
<link rel="stylesheet" href="/src/styles/quote/components.css">
```

## 🔧 Configuration

### Update Services

Edit `src/config/quote/serviceDefinitions.ts`:

```typescript
export const addOnServices: AddOnService[] = [
  {
    id: 'new-service',
    name: 'New Service',
    description: 'Service description',
    value: 'New Service',
    recommendedFor: {
      hasPets: true  // Auto-recommend when pets selected
    }
  }
];
```

### Update Validation

Edit `src/config/quote/validationRules.ts`:

```typescript
export const validationRules = {
  'new-field': {
    required: true,
    pattern: /regex/,
    errorMessage: 'Error message'
  }
};
```

### Update Design

Edit `src/styles/quote/design-tokens.css`:

```css
:root {
  --q-sky-600: #0284c7;  /* Change brand color */
}
```

## ✅ Framework Principles Applied

**Upstream Thinking:**
- Single sources of truth for business logic
- Failure classes eliminated (not just symptoms fixed)
- Revenue proximity considered (critical conversion path)

**Resourceful Innovation:**
- Zero new dependencies
- Leveraged existing Astro/TypeScript capabilities
- Enhanced existing patterns

## 📚 Documentation

- [Framework Case Study](../Nexus-4.5/QUOTEFORM_FRAMEWORK_CASE_STUDY.md)
- [Implementation Plan](../Nexus-4.5/QUOTEFORM_IMPLEMENTATION_PLAN.md)
- [Final Summary](../Nexus-4.5/QUOTEFORM_FINAL_SUMMARY.md)
