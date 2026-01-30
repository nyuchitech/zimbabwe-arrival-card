/**
 * Centralized Constants
 * Single source of truth for all application constants
 */

// =============================================================================
// USER TYPES - Anyone passing through a port of entry
// =============================================================================

export const USER_TYPES = {
  VISITOR: "VISITOR",
  CITIZEN: "CITIZEN",
  PERMANENT_RESIDENT: "PERMANENT_RESIDENT",
  RESIDENT_PERMIT: "RESIDENT_PERMIT",
  WORK_PERMIT: "WORK_PERMIT",
  STUDY_PERMIT: "STUDY_PERMIT",
  DIPLOMATIC: "DIPLOMATIC",
  TRANSIT: "TRANSIT",
} as const;

export type UserType = (typeof USER_TYPES)[keyof typeof USER_TYPES];

export const USER_TYPE_LABELS: Record<UserType, string> = {
  VISITOR: "Foreign Visitor",
  CITIZEN: "Zimbabwean Citizen",
  PERMANENT_RESIDENT: "Permanent Resident",
  RESIDENT_PERMIT: "Resident Permit Holder",
  WORK_PERMIT: "Work Permit Holder",
  STUDY_PERMIT: "Study Permit Holder",
  DIPLOMATIC: "Diplomatic / Official",
  TRANSIT: "Transit Passenger",
};

// =============================================================================
// TRIP/SUBMISSION STATUS
// =============================================================================

export const TRIP_STATUS = {
  DRAFT: "DRAFT",
  SUBMITTED: "SUBMITTED",
  UNDER_REVIEW: "UNDER_REVIEW",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  EXPIRED: "EXPIRED",
} as const;

export type TripStatus = (typeof TRIP_STATUS)[keyof typeof TRIP_STATUS];

export const TRIP_STATUS_CONFIG: Record<
  TripStatus,
  { label: string; color: string; bgColor: string; description: string }
> = {
  DRAFT: {
    label: "Draft",
    color: "text-gray-600",
    bgColor: "bg-gray-100",
    description: "Incomplete submission - continue editing",
  },
  SUBMITTED: {
    label: "Submitted",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    description: "Awaiting review by immigration",
  },
  UNDER_REVIEW: {
    label: "Under Review",
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
    description: "Being reviewed by an officer",
  },
  APPROVED: {
    label: "Approved",
    color: "text-green-600",
    bgColor: "bg-green-100",
    description: "Cleared for entry - present QR code at checkpoint",
  },
  REJECTED: {
    label: "Rejected",
    color: "text-red-600",
    bgColor: "bg-red-100",
    description: "Entry denied - contact immigration for details",
  },
  EXPIRED: {
    label: "Expired",
    color: "text-gray-500",
    bgColor: "bg-gray-50",
    description: "Trip date has passed",
  },
};

// =============================================================================
// PURPOSE OF VISIT
// =============================================================================

export const PURPOSE_OF_VISIT = {
  TOURISM: "TOURISM",
  BUSINESS: "BUSINESS",
  EMPLOYMENT: "EMPLOYMENT",
  STUDY: "STUDY",
  MEDICAL: "MEDICAL",
  TRANSIT: "TRANSIT",
  RETURNING_RESIDENT: "RETURNING_RESIDENT",
  FAMILY_VISIT: "FAMILY_VISIT",
  CONFERENCE: "CONFERENCE",
  OFFICIAL: "OFFICIAL",
  OTHER: "OTHER",
} as const;

export type PurposeOfVisit = (typeof PURPOSE_OF_VISIT)[keyof typeof PURPOSE_OF_VISIT];

export const PURPOSE_OF_VISIT_LABELS: Record<PurposeOfVisit, string> = {
  TOURISM: "Tourism / Holiday",
  BUSINESS: "Business",
  EMPLOYMENT: "Employment",
  STUDY: "Education / Study",
  MEDICAL: "Medical Treatment",
  TRANSIT: "Transit",
  RETURNING_RESIDENT: "Returning Resident",
  FAMILY_VISIT: "Family Visit",
  CONFERENCE: "Conference / Event",
  OFFICIAL: "Official / Diplomatic",
  OTHER: "Other",
};

// =============================================================================
// GENDER
// =============================================================================

export const GENDER = {
  MALE: "MALE",
  FEMALE: "FEMALE",
  OTHER: "OTHER",
} as const;

export type Gender = (typeof GENDER)[keyof typeof GENDER];

export const GENDER_LABELS: Record<Gender, string> = {
  MALE: "Male",
  FEMALE: "Female",
  OTHER: "Other",
};

// =============================================================================
// ACCOMMODATION TYPES
// =============================================================================

export const ACCOMMODATION_TYPE = {
  HOTEL: "HOTEL",
  LODGE: "LODGE",
  GUESTHOUSE: "GUESTHOUSE",
  AIRBNB: "AIRBNB",
  RESIDENCE: "RESIDENCE",
  HOSTEL: "HOSTEL",
  CAMPING: "CAMPING",
  TRANSIT: "TRANSIT",
  OTHER: "OTHER",
} as const;

export type AccommodationType = (typeof ACCOMMODATION_TYPE)[keyof typeof ACCOMMODATION_TYPE];

export const ACCOMMODATION_TYPE_LABELS: Record<AccommodationType, string> = {
  HOTEL: "Hotel",
  LODGE: "Safari Lodge",
  GUESTHOUSE: "Guest House",
  AIRBNB: "Airbnb / Vacation Rental",
  RESIDENCE: "Private Residence",
  HOSTEL: "Hostel / Backpackers",
  CAMPING: "Camping / Caravan",
  TRANSIT: "Transit Only (No Accommodation)",
  OTHER: "Other",
};

// =============================================================================
// COUNTRIES (Common for Zimbabwe arrivals)
// =============================================================================

export const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Angola", "Argentina", "Australia",
  "Austria", "Bangladesh", "Belgium", "Botswana", "Brazil", "Canada",
  "China", "Democratic Republic of Congo", "Denmark", "Egypt", "Ethiopia",
  "Finland", "France", "Germany", "Ghana", "Greece", "India", "Indonesia",
  "Iran", "Ireland", "Israel", "Italy", "Japan", "Kenya", "Lesotho",
  "Malawi", "Malaysia", "Mexico", "Morocco", "Mozambique", "Namibia",
  "Netherlands", "New Zealand", "Nigeria", "Norway", "Pakistan", "Philippines",
  "Poland", "Portugal", "Russia", "Rwanda", "Saudi Arabia", "Singapore",
  "South Africa", "South Korea", "Spain", "Sudan", "Swaziland", "Sweden",
  "Switzerland", "Tanzania", "Thailand", "Turkey", "Uganda", "Ukraine",
  "United Arab Emirates", "United Kingdom", "United States", "Vietnam",
  "Zambia", "Zimbabwe",
] as const;

// SADC Countries (for special processing)
export const SADC_COUNTRIES = [
  "Angola", "Botswana", "Democratic Republic of Congo", "Lesotho", "Malawi",
  "Mauritius", "Mozambique", "Namibia", "Seychelles", "South Africa",
  "Swaziland", "Tanzania", "Zambia", "Zimbabwe",
] as const;

// =============================================================================
// BORDER POSTS
// =============================================================================

export const BORDER_POSTS = {
  // Land borders
  BEITBRIDGE: { name: "Beitbridge Border Post", type: "LAND", country: "South Africa" },
  CHIRUNDU: { name: "Chirundu Border Post", type: "LAND", country: "Zambia" },
  VICTORIA_FALLS: { name: "Victoria Falls Border Post", type: "LAND", country: "Zambia" },
  KAZUNGULA: { name: "Kazungula Border Post", type: "LAND", country: "Botswana" },
  PLUMTREE: { name: "Plumtree Border Post", type: "LAND", country: "Botswana" },
  NYAMAPANDA: { name: "Nyamapanda Border Post", type: "LAND", country: "Mozambique" },
  FORBES: { name: "Forbes Border Post", type: "LAND", country: "Mozambique" },
  MUKUMBURA: { name: "Mukumbura Border Post", type: "LAND", country: "Mozambique" },
  // Airports
  HARARE_AIRPORT: { name: "Robert Gabriel Mugabe International Airport", type: "AIR", country: null },
  BULAWAYO_AIRPORT: { name: "Joshua Mqabuko Nkomo International Airport", type: "AIR", country: null },
  VICTORIA_FALLS_AIRPORT: { name: "Victoria Falls International Airport", type: "AIR", country: null },
} as const;

export type BorderPostCode = keyof typeof BORDER_POSTS;

// =============================================================================
// HEALTH DECLARATION - Questions for health screening
// =============================================================================

export const HEALTH_QUESTIONS = {
  SYMPTOMS: {
    id: "hasSymptoms",
    question: "Do you currently have fever, cough, shortness of breath, headache, vomiting or rash?",
    type: "boolean",
  },
  YELLOW_FEVER_COUNTRIES: {
    id: "visitedYellowFeverCountry",
    question: "Have you visited any country with risk of yellow fever transmission in the past 6 days?",
    type: "boolean",
    helpText: "Refer to WHO website for countries with yellow fever risk",
    helpUrl: "https://www.who.int/health-topics/yellow-fever",
  },
  CONTACT_WITH_INFECTIOUS: {
    id: "contactWithInfectious",
    question: "Have you been in contact with anyone diagnosed with an infectious disease in the past 14 days?",
    type: "boolean",
  },
  MEDICAL_TREATMENT: {
    id: "seekingMedicalTreatment",
    question: "Are you traveling to Zimbabwe for medical treatment?",
    type: "boolean",
  },
} as const;

// Yellow fever endemic countries (Africa & Latin America)
export const YELLOW_FEVER_COUNTRIES = [
  // Africa
  "Angola", "Benin", "Burkina Faso", "Burundi", "Cameroon", "Central African Republic",
  "Chad", "Congo", "Côte d'Ivoire", "Democratic Republic of Congo", "Equatorial Guinea",
  "Ethiopia", "Gabon", "Gambia", "Ghana", "Guinea", "Guinea-Bissau", "Kenya", "Liberia",
  "Mali", "Mauritania", "Niger", "Nigeria", "Rwanda", "Senegal", "Sierra Leone",
  "South Sudan", "Sudan", "Togo", "Uganda",
  // Latin America
  "Argentina", "Bolivia", "Brazil", "Colombia", "Ecuador", "French Guiana", "Guyana",
  "Panama", "Paraguay", "Peru", "Suriname", "Trinidad and Tobago", "Venezuela",
] as const;

// =============================================================================
// CUSTOMS DECLARATION THRESHOLDS
// =============================================================================

export const CUSTOMS_THRESHOLDS = {
  CURRENCY_DECLARATION_LIMIT_USD: 10000,
  DUTY_FREE_ALLOWANCE_USD: 300,
  TOBACCO_LIMIT_CIGARETTES: 200,
  TOBACCO_LIMIT_CIGARS: 50,
  ALCOHOL_LIMIT_SPIRITS_ML: 1000,
  ALCOHOL_LIMIT_WINE_ML: 2000,
} as const;

// =============================================================================
// DOCUMENT TYPES
// =============================================================================

export const DOCUMENT_TYPES = {
  PASSPORT: "PASSPORT",
  DIPLOMATIC_PASSPORT: "DIPLOMATIC_PASSPORT",
  OFFICIAL_PASSPORT: "OFFICIAL_PASSPORT",
  TRAVEL_DOCUMENT: "TRAVEL_DOCUMENT",
  EMERGENCY_TRAVEL_DOCUMENT: "EMERGENCY_TRAVEL_DOCUMENT",
  NATIONAL_ID: "NATIONAL_ID",
} as const;

export type DocumentType = (typeof DOCUMENT_TYPES)[keyof typeof DOCUMENT_TYPES];

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  PASSPORT: "Passport",
  DIPLOMATIC_PASSPORT: "Diplomatic Passport",
  OFFICIAL_PASSPORT: "Official / Service Passport",
  TRAVEL_DOCUMENT: "Travel Document",
  EMERGENCY_TRAVEL_DOCUMENT: "Emergency Travel Document",
  NATIONAL_ID: "National ID (SADC Citizens)",
};

// =============================================================================
// SYSTEM ROLES (Staff roles for the system)
// =============================================================================

export const SYSTEM_ROLES = {
  USER: "USER", // Regular users submitting trips
  IMMIGRATION: "IMMIGRATION",
  ZIMRA: "ZIMRA",
  GOVERNMENT: "GOVERNMENT",
  ADMIN: "ADMIN",
} as const;

export type SystemRole = (typeof SYSTEM_ROLES)[keyof typeof SYSTEM_ROLES];

export const SYSTEM_ROLE_LABELS: Record<SystemRole, string> = {
  USER: "User",
  IMMIGRATION: "Immigration Officer",
  ZIMRA: "ZIMRA Officer",
  GOVERNMENT: "Government Official",
  ADMIN: "System Administrator",
};

// Role-based access permissions
export const ROLE_PERMISSIONS = {
  USER: ["trip:create", "trip:read:own", "trip:update:own", "profile:read", "profile:update"],
  IMMIGRATION: ["trip:read:all", "trip:review", "trip:approve", "trip:reject", "scan:qr"],
  ZIMRA: ["trip:read:all", "customs:review", "customs:flag"],
  GOVERNMENT: ["trip:read:all", "analytics:view", "reports:view"],
  ADMIN: ["*"], // Full access
} as const;

// =============================================================================
// FORM STEPS
// =============================================================================

export const TRIP_FORM_STEPS = [
  { id: 1, name: "Type", description: "Select traveler type" },
  { id: 2, name: "Personal", description: "Personal information" },
  { id: 3, name: "Document", description: "Travel document details" },
  { id: 4, name: "Trip", description: "Trip information" },
  { id: 5, name: "Stay", description: "Accommodation details" },
  { id: 6, name: "Health", description: "Health declaration" },
  { id: 7, name: "Customs", description: "Customs declaration" },
  { id: 8, name: "Review", description: "Review and submit" },
] as const;

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get label for any enum value
 */
export function getEnumLabel<T extends string>(
  value: T,
  labels: Record<T, string>
): string {
  return labels[value] || value;
}

/**
 * Convert enum object to array of options for select inputs
 */
export function enumToOptions<T extends Record<string, string>>(
  enumObj: T,
  labels: Record<T[keyof T], string>
): Array<{ value: T[keyof T]; label: string }> {
  return Object.values(enumObj).map((value) => ({
    value: value as T[keyof T],
    label: labels[value as T[keyof T]],
  }));
}

/**
 * Check if a country requires yellow fever vaccination
 */
export function requiresYellowFeverCertificate(country: string): boolean {
  return YELLOW_FEVER_COUNTRIES.includes(country as typeof YELLOW_FEVER_COUNTRIES[number]);
}

/**
 * Check if a country is in SADC (special processing)
 */
export function isSADCCountry(country: string): boolean {
  return SADC_COUNTRIES.includes(country as typeof SADC_COUNTRIES[number]);
}
