import { z } from "zod";

export const personalInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"], {
    error: "Gender is required",
  }),
  nationality: z.string().min(1, "Nationality is required"),
  countryOfResidence: z.string().min(1, "Country of residence is required"),
  occupation: z.string().optional(),
});

export const passportInfoSchema = z.object({
  passportNumber: z.string().min(1, "Passport number is required"),
  passportIssueDate: z.string().min(1, "Issue date is required"),
  passportExpiryDate: z.string().min(1, "Expiry date is required"),
  passportIssuingCountry: z.string().min(1, "Issuing country is required"),
});

export const contactInfoSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
});

export const travelInfoSchema = z.object({
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
  purposeOther: z.string().optional(),
  intendedStayDuration: z.number().min(1, "Duration must be at least 1 day"),
  arrivalDate: z.string().min(1, "Arrival date is required"),
  departureDate: z.string().optional(),
  flightNumber: z.string().optional(),
  vesselName: z.string().optional(),
  previousCountry: z.string().min(1, "Previous country is required"),
});

export const accommodationSchema = z.object({
  accommodationType: z.string().min(1, "Accommodation type is required"),
  accommodationName: z.string().min(1, "Accommodation name is required"),
  accommodationAddress: z.string().min(1, "Address is required"),
  accommodationCity: z.string().min(1, "City is required"),
  accommodationPhone: z.string().optional(),
});

export const customsDeclarationSchema = z.object({
  carryingCurrency: z.boolean(),
  currencyAmount: z.number().optional(),
  currencyType: z.string().optional(),
  carryingGoods: z.boolean(),
  goodsDescription: z.string().optional(),
  goodsValue: z.number().optional(),
});

export const healthDeclarationSchema = z.object({
  healthDeclaration: z.boolean(),
  recentIllness: z.boolean(),
  illnessDescription: z.string().optional(),
});

export const declarationSchema = z.object({
  declarationAccepted: z
    .boolean()
    .refine((val) => val === true, "You must accept the declaration"),
});

export const arrivalCardSchema = z.object({
  ...personalInfoSchema.shape,
  ...passportInfoSchema.shape,
  ...contactInfoSchema.shape,
  ...travelInfoSchema.shape,
  ...accommodationSchema.shape,
  ...customsDeclarationSchema.shape,
  ...healthDeclarationSchema.shape,
  ...declarationSchema.shape,
});

export type ArrivalCardInput = z.infer<typeof arrivalCardSchema>;
export type PersonalInfoInput = z.infer<typeof personalInfoSchema>;
export type PassportInfoInput = z.infer<typeof passportInfoSchema>;
export type ContactInfoInput = z.infer<typeof contactInfoSchema>;
export type TravelInfoInput = z.infer<typeof travelInfoSchema>;
export type AccommodationInput = z.infer<typeof accommodationSchema>;
export type CustomsDeclarationInput = z.infer<typeof customsDeclarationSchema>;
export type HealthDeclarationInput = z.infer<typeof healthDeclarationSchema>;
