import { z } from "zod";

// Common validation helpers
const nameField = (fieldName: string) =>
  z
    .string()
    .min(1, `${fieldName} is required`)
    .max(100, `${fieldName} must be less than 100 characters`)
    .trim()
    .refine(
      (val) => /^[a-zA-Z\s\-'\.]+$/.test(val),
      `${fieldName} contains invalid characters`
    );

const optionalNameField = () =>
  z
    .string()
    .max(100, "Must be less than 100 characters")
    .trim()
    .optional()
    .or(z.literal(""));

const countryField = (fieldName: string) =>
  z
    .string()
    .min(2, `${fieldName} is required`)
    .max(100, `${fieldName} must be less than 100 characters`)
    .trim();

// Date validation helper - checks format and reasonable range
const dateField = (fieldName: string) =>
  z
    .string()
    .min(1, `${fieldName} is required`)
    .refine(
      (val) => {
        const date = new Date(val);
        return !isNaN(date.getTime());
      },
      { message: "Invalid date format" }
    );

// Phone number validation
const phoneField = (fieldName: string, required: boolean = true) => {
  if (required) {
    return z
      .string()
      .min(5, `${fieldName} is required`)
      .max(30, "Phone number is too long")
      .refine(
        (val) => /^[\d\s\+\-\(\)]+$/.test(val),
        "Invalid phone number format"
      );
  }

  return z
    .string()
    .max(30, "Phone number is too long")
    .refine(
      (val) => !val || /^[\d\s\+\-\(\)]+$/.test(val),
      "Invalid phone number format"
    )
    .optional()
    .or(z.literal(""));
};

// Email validation
const emailField = () =>
  z
    .string()
    .email("Please enter a valid email")
    .min(5, "Email is too short")
    .max(320, "Email is too long")
    .toLowerCase()
    .trim();

// Passport number validation - alphanumeric, 6-20 characters
const passportField = () =>
  z
    .string()
    .min(6, "Passport number must be at least 6 characters")
    .max(20, "Passport number must be less than 20 characters")
    .toUpperCase()
    .trim()
    .refine(
      (val) => /^[A-Z0-9]+$/.test(val),
      "Passport number can only contain letters and numbers"
    );

// Reference number validation
export const referenceNumberSchema = z
  .string()
  .min(10, "Invalid reference number")
  .max(20, "Invalid reference number")
  .toUpperCase()
  .trim()
  .refine(
    (val) => /^ZW\d{6}[A-Z0-9]{6,}$/.test(val),
    "Invalid reference number format"
  );

export const personalInfoSchema = z.object({
  firstName: nameField("First name"),
  middleName: optionalNameField(),
  lastName: nameField("Last name"),
  dateOfBirth: dateField("Date of birth").refine(
    (val) => {
      const date = new Date(val);
      const today = new Date();
      const minDate = new Date();
      minDate.setFullYear(minDate.getFullYear() - 150); // Max 150 years old
      return date <= today && date >= minDate;
    },
    { message: "Date of birth must be a valid past date" }
  ),
  gender: z.enum(["MALE", "FEMALE", "OTHER"], {
    error: "Gender is required",
  }),
  nationality: countryField("Nationality"),
  countryOfResidence: countryField("Country of residence"),
  occupation: z
    .string()
    .max(100, "Occupation must be less than 100 characters")
    .trim()
    .optional()
    .or(z.literal("")),
});

export const passportInfoSchema = z
  .object({
    passportNumber: passportField(),
    passportIssueDate: dateField("Issue date"),
    passportExpiryDate: dateField("Expiry date"),
    passportIssuingCountry: countryField("Issuing country"),
  })
  .refine(
    (data) => {
      const issue = new Date(data.passportIssueDate);
      const expiry = new Date(data.passportExpiryDate);
      return expiry > issue;
    },
    {
      message: "Passport expiry date must be after issue date",
      path: ["passportExpiryDate"],
    }
  )
  .refine(
    (data) => {
      const expiry = new Date(data.passportExpiryDate);
      const today = new Date();
      return expiry > today;
    },
    {
      message: "Passport must not be expired",
      path: ["passportExpiryDate"],
    }
  );

export const contactInfoSchema = z.object({
  email: emailField(),
  phoneNumber: phoneField("Phone number", true),
  emergencyContactName: optionalNameField(),
  emergencyContactPhone: phoneField("Emergency contact phone", false),
});

export const travelInfoSchema = z
  .object({
    purposeOfVisit: z.enum(
      [
        "TOURISM",
        "BUSINESS",
        "EMPLOYMENT",
        "STUDY",
        "MEDICAL",
        "TRANSIT",
        "RETURNING_RESIDENT",
        "OTHER",
      ],
      { error: "Purpose of visit is required" }
    ),
    purposeOther: z
      .string()
      .max(500, "Description must be less than 500 characters")
      .trim()
      .optional()
      .or(z.literal("")),
    intendedStayDuration: z
      .number()
      .int("Duration must be a whole number")
      .min(1, "Duration must be at least 1 day")
      .max(365, "Duration cannot exceed 365 days"),
    arrivalDate: dateField("Arrival date").refine(
      (val) => {
        const date = new Date(val);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 12); // Max 1 year in advance
        return date >= today && date <= maxDate;
      },
      { message: "Arrival date must be today or a future date within 1 year" }
    ),
    departureDate: z.string().optional().or(z.literal("")),
    flightNumber: z
      .string()
      .max(20, "Flight number is too long")
      .trim()
      .optional()
      .or(z.literal("")),
    vesselName: z
      .string()
      .max(100, "Vessel name is too long")
      .trim()
      .optional()
      .or(z.literal("")),
    previousCountry: countryField("Previous country"),
  })
  .refine(
    (data) => {
      if (!data.departureDate) return true;
      const arrival = new Date(data.arrivalDate);
      const departure = new Date(data.departureDate);
      return departure >= arrival;
    },
    {
      message: "Departure date must be on or after arrival date",
      path: ["departureDate"],
    }
  );

export const accommodationSchema = z.object({
  accommodationType: z
    .string()
    .min(1, "Accommodation type is required")
    .max(50, "Accommodation type is too long")
    .trim(),
  accommodationName: z
    .string()
    .min(1, "Accommodation name is required")
    .max(200, "Accommodation name is too long")
    .trim(),
  accommodationAddress: z
    .string()
    .min(5, "Address is required")
    .max(500, "Address is too long")
    .trim(),
  accommodationCity: z
    .string()
    .min(1, "City is required")
    .max(100, "City name is too long")
    .trim(),
  accommodationPhone: phoneField("Accommodation phone", false),
});

export const customsDeclarationSchema = z
  .object({
    carryingCurrency: z.boolean(),
    currencyAmount: z
      .number()
      .min(0, "Amount cannot be negative")
      .max(10000000, "Amount seems unrealistic")
      .optional()
      .nullable(),
    currencyType: z
      .string()
      .max(10, "Currency code is too long")
      .toUpperCase()
      .trim()
      .optional()
      .or(z.literal("")),
    carryingGoods: z.boolean(),
    goodsDescription: z
      .string()
      .max(2000, "Description is too long")
      .trim()
      .optional()
      .or(z.literal("")),
    goodsValue: z
      .number()
      .min(0, "Value cannot be negative")
      .max(10000000, "Value seems unrealistic")
      .optional()
      .nullable(),
  })
  .refine(
    (data) => {
      if (data.carryingCurrency) {
        return data.currencyAmount && data.currencyAmount > 0 && data.currencyType;
      }
      return true;
    },
    {
      message: "Please specify currency amount and type",
      path: ["currencyAmount"],
    }
  )
  .refine(
    (data) => {
      if (data.carryingGoods) {
        return data.goodsDescription && data.goodsDescription.length > 0;
      }
      return true;
    },
    {
      message: "Please describe the goods you are carrying",
      path: ["goodsDescription"],
    }
  );

export const healthDeclarationSchema = z.object({
  healthDeclaration: z.boolean(),
  recentIllness: z.boolean(),
  illnessDescription: z
    .string()
    .max(2000, "Description is too long")
    .trim()
    .optional()
    .or(z.literal("")),
});

export const declarationSchema = z.object({
  declarationAccepted: z
    .boolean()
    .refine((val) => val === true, "You must accept the declaration"),
});

// Combined schema for full arrival card
export const arrivalCardSchema = z.object({
  ...personalInfoSchema.shape,
  // Can't spread refined schemas, need to include fields individually
  passportNumber: passportField(),
  passportIssueDate: dateField("Issue date"),
  passportExpiryDate: dateField("Expiry date"),
  passportIssuingCountry: countryField("Issuing country"),
  // Contact Information - defined explicitly for proper type inference
  email: emailField(),
  phoneNumber: z
    .string()
    .min(5, "Phone number is required")
    .max(30, "Phone number is too long")
    .refine(
      (val) => /^[\d\s\+\-\(\)]+$/.test(val),
      "Invalid phone number format"
    ),
  emergencyContactName: optionalNameField(),
  emergencyContactPhone: z
    .string()
    .max(30, "Phone number is too long")
    .refine(
      (val) => !val || /^[\d\s\+\-\(\)]+$/.test(val),
      "Invalid phone number format"
    )
    .optional()
    .or(z.literal("")),
  purposeOfVisit: z.enum(
    [
      "TOURISM",
      "BUSINESS",
      "EMPLOYMENT",
      "STUDY",
      "MEDICAL",
      "TRANSIT",
      "RETURNING_RESIDENT",
      "OTHER",
    ],
    { error: "Purpose of visit is required" }
  ),
  purposeOther: z.string().max(500).trim().optional().or(z.literal("")),
  intendedStayDuration: z.number().int().min(1).max(365),
  arrivalDate: dateField("Arrival date"),
  departureDate: z.string().optional().or(z.literal("")),
  flightNumber: z.string().max(20).trim().optional().or(z.literal("")),
  vesselName: z.string().max(100).trim().optional().or(z.literal("")),
  previousCountry: countryField("Previous country"),
  // Accommodation - defined explicitly for proper type inference
  accommodationType: z
    .string()
    .min(1, "Accommodation type is required")
    .max(50, "Accommodation type is too long")
    .trim(),
  accommodationName: z
    .string()
    .min(1, "Accommodation name is required")
    .max(200, "Accommodation name is too long")
    .trim(),
  accommodationAddress: z
    .string()
    .min(5, "Address is required")
    .max(500, "Address is too long")
    .trim(),
  accommodationCity: z
    .string()
    .min(1, "City is required")
    .max(100, "City name is too long")
    .trim(),
  accommodationPhone: z
    .string()
    .max(30, "Phone number is too long")
    .refine(
      (val) => !val || /^[\d\s\+\-\(\)]+$/.test(val),
      "Invalid phone number format"
    )
    .optional()
    .or(z.literal("")),
  carryingCurrency: z.boolean(),
  currencyAmount: z.number().min(0).max(10000000).optional().nullable(),
  currencyType: z.string().max(10).toUpperCase().trim().optional().or(z.literal("")),
  carryingGoods: z.boolean(),
  goodsDescription: z.string().max(2000).trim().optional().or(z.literal("")),
  goodsValue: z.number().min(0).max(10000000).optional().nullable(),
  ...healthDeclarationSchema.shape,
  ...declarationSchema.shape,
});

// Lookup schema for public card lookup
export const arrivalCardLookupSchema = z.object({
  referenceNumber: z
    .string()
    .min(1, "Reference number is required")
    .max(20, "Invalid reference number")
    .toUpperCase()
    .trim(),
  passportNumber: passportField(),
});

export type ArrivalCardInput = z.infer<typeof arrivalCardSchema>;
export type PersonalInfoInput = z.infer<typeof personalInfoSchema>;
export type PassportInfoInput = z.infer<typeof passportInfoSchema>;
export type ContactInfoInput = z.infer<typeof contactInfoSchema>;
export type TravelInfoInput = z.infer<typeof travelInfoSchema>;
export type AccommodationInput = z.infer<typeof accommodationSchema>;
export type CustomsDeclarationInput = z.infer<typeof customsDeclarationSchema>;
export type HealthDeclarationInput = z.infer<typeof healthDeclarationSchema>;
export type ArrivalCardLookupInput = z.infer<typeof arrivalCardLookupSchema>;
