/**
 * Service Definitions - SINGLE SOURCE OF TRUTH
 * 
 * Framework Application:
 * - Upstream Thinking: Eliminates "business logic in HTML" failure class
 * - Resourceful Innovation: Leverages TypeScript for type-safe configuration
 * 
 * This file defines all business rules for the quote form.
 * Changes here automatically propagate to all UI components.
 */

// ============================================================================
// TYPES
// ============================================================================

export interface AddOnService {
  id: string;
  name: string;
  description: string;
  value: string; // For form submission
  recommendedFor?: {
    hasPets?: boolean;
    hasCarpet?: boolean;
    hasBalcony?: boolean;
    extWindows?: boolean;
    multiStorey?: boolean;
  };
}

export interface PropertyQuickToggle {
  id: string;
  name: string;
  icon: string;
  label: string;
  formField: string;
}

// ============================================================================
// PROPERTY CONFIGURATION
// ============================================================================

export const propertyTypes = [
  'House',
  'Apartment',
  'Townhouse'
] as const;

export type PropertyType = typeof propertyTypes[number];

export const bedroomOptions = [1, 2, 3, 4, 5] as const;
export const bathroomOptions = [1, 2, 3] as const;

// ============================================================================
// QUICK TOGGLES (Drive Recommendations)
// ============================================================================

export const quickToggles: PropertyQuickToggle[] = [
  {
    id: 'has-pets',
    name: 'has-pets',
    icon: 'fa-paw',
    label: 'Pets at property',
    formField: 'has-pets'
  },
  {
    id: 'has-carpet',
    name: 'has-carpet',
    icon: 'fa-border-all',
    label: 'Has carpeted rooms',
    formField: 'has-carpet'
  },
  {
    id: 'has-balcony',
    name: 'has-balcony',
    icon: 'fa-seedling',
    label: 'Balcony/Patio',
    formField: 'has-balcony'
  },
  {
    id: 'ext-reachable',
    name: 'ext-reachable',
    icon: 'fa-window-restore',
    label: 'External windows reachable',
    formField: 'ext-reachable'
  },
  {
    id: 'two-storey',
    name: 'storeys',
    icon: 'fa-building',
    label: '2+ storeys',
    formField: 'storeys'
  }
];

// ============================================================================
// STANDARD BOND CLEAN (Included Services)
// ============================================================================

export const includedServices = [
  'Kitchen: cooktop, rangehood filters, splashbacks, cupboards (in/out)',
  'Oven interior and door glass',
  'Bathrooms: showers, screens, grout touch-up, silicone joins',
  'Internal windows, sills, and tracks',
  'Skirtings, switches, door frames, reachable vents and fans',
  'Floors vacuumed and mopped throughout'
];

export const standardBondClean = {
  id: 'standard-bond-clean',
  name: 'Standard Bond Clean',
  badge: 'Included',
  description: 'REIA-aligned clean with 7-Day Reclean guarantee',
  services: includedServices
};

// ============================================================================
// ADD-ON SERVICES
// ============================================================================

export const addOnServices: AddOnService[] = [
  {
    id: 'full-wall-wash',
    name: 'Full Wall Wash',
    description: 'Entire interior walls. Labour-intensive.',
    value: 'Full Wall Wash',
    recommendedFor: {
      multiStorey: false // Not auto-recommended
    }
  },
  {
    id: 'carpet-steam',
    name: 'Carpet Steam Clean',
    description: 'Hot-water extraction. Invoice supplied.',
    value: 'Carpet Steam Clean',
    recommendedFor: {
      hasCarpet: true // Recommended when carpets present
    }
  },
  {
    id: 'blinds-detailing',
    name: 'Blinds Detailing',
    description: 'Slats dusted/wiped (fragile types noted).',
    value: 'Blinds Detailing'
  },
  {
    id: 'external-windows',
    name: 'External Windows (Reachable)',
    description: 'Ground-level/accessible only.',
    value: 'External Windows (Reachable)',
    recommendedFor: {
      extWindows: true // Recommended when external windows accessible
    }
  },
  {
    id: 'balcony-patio',
    name: 'Balcony/Patio Wash',
    description: 'Sweep, mop, railings wiped.',
    value: 'Balcony/Patio Wash',
    recommendedFor: {
      hasBalcony: true // Recommended when balcony/patio present
    }
  },
  {
    id: 'garage-sweep',
    name: 'Garage Sweep & Cobwebs',
    description: 'Floor, edges, spider webs.',
    value: 'Garage Sweep & Cobwebs'
  },
  {
    id: 'flea-treatment',
    name: 'Flea Treatment (Licensed Partner)',
    description: 'Required by many pet clauses.',
    value: 'Flea Treatment (Licensed Partner)',
    recommendedFor: {
      hasPets: true // Recommended when pets present
    }
  }
];

// ============================================================================
// TRUST INDICATORS
// ============================================================================

export const trustBadges = [
  {
    icon: 'fa-shield-check',
    text: '7-Day Reclean'
  },
  {
    icon: 'fa-clipboard-check',
    text: 'REIA-aligned scope'
  },
  {
    icon: 'fa-eye',
    text: 'Transparent pricing'
  }
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get recommended add-ons based on property characteristics
 * 
 * @param toggles - Object with property characteristic flags
 * @returns Array of recommended add-on service IDs
 */
export function getRecommendedAddOns(toggles: {
  hasPets?: boolean;
  hasCarpet?: boolean;
  hasBalcony?: boolean;
  extWindows?: boolean;
  multiStorey?: boolean;
}): string[] {
  const recommended: string[] = [];

  addOnServices.forEach(service => {
    if (!service.recommendedFor) return;

    const matches = Object.entries(service.recommendedFor).every(
      ([key, value]) => toggles[key as keyof typeof toggles] === value
    );

    if (matches) {
      recommended.push(service.id);
    }
  });

  return recommended;
}

/**
 * Get add-on service by ID
 */
export function getAddOnById(id: string): AddOnService | undefined {
  return addOnServices.find(service => service.id === id);
}

/**
 * Get add-on service by value (for form submission)
 */
export function getAddOnByValue(value: string): AddOnService | undefined {
  return addOnServices.find(service => service.value === value);
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  propertyTypes,
  bedroomOptions,
  bathroomOptions,
  quickToggles,
  standardBondClean,
  includedServices,
  addOnServices,
  trustBadges,
  getRecommendedAddOns,
  getAddOnById,
  getAddOnByValue
};
