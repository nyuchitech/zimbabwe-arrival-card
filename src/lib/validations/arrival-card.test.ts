import { describe, it, expect } from "vitest";
import {
  personalInfoSchema,
  passportInfoSchema,
  contactInfoSchema,
  travelInfoSchema,
  accommodationSchema,
  customsDeclarationSchema,
  healthDeclarationSchema,
  declarationSchema,
} from "./arrival-card";

describe("Personal Info Schema", () => {
  it("should validate valid personal info", () => {
    const validData = {
      firstName: "John",
      lastName: "Doe",
      dateOfBirth: "1990-01-15",
      gender: "MALE" as const,
      nationality: "USA",
      countryOfResidence: "USA",
    };

    const result = personalInfoSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should accept optional middleName and occupation", () => {
    const validData = {
      firstName: "John",
      middleName: "William",
      lastName: "Doe",
      dateOfBirth: "1990-01-15",
      gender: "MALE" as const,
      nationality: "USA",
      countryOfResidence: "USA",
      occupation: "Engineer",
    };

    const result = personalInfoSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should reject empty first name", () => {
    const invalidData = {
      firstName: "",
      lastName: "Doe",
      dateOfBirth: "1990-01-15",
      gender: "MALE" as const,
      nationality: "USA",
      countryOfResidence: "USA",
    };

    const result = personalInfoSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("should reject invalid gender", () => {
    const invalidData = {
      firstName: "John",
      lastName: "Doe",
      dateOfBirth: "1990-01-15",
      gender: "INVALID",
      nationality: "USA",
      countryOfResidence: "USA",
    };

    const result = personalInfoSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("should accept all valid gender values", () => {
    const genders = ["MALE", "FEMALE", "OTHER"] as const;

    genders.forEach((gender) => {
      const data = {
        firstName: "John",
        lastName: "Doe",
        dateOfBirth: "1990-01-15",
        gender,
        nationality: "USA",
        countryOfResidence: "USA",
      };

      const result = personalInfoSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });
});

describe("Passport Info Schema", () => {
  it("should validate valid passport info", () => {
    const validData = {
      passportNumber: "AB123456",
      passportIssueDate: "2020-01-01",
      passportExpiryDate: "2030-01-01",
      passportIssuingCountry: "USA",
    };

    const result = passportInfoSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should reject empty passport number", () => {
    const invalidData = {
      passportNumber: "",
      passportIssueDate: "2020-01-01",
      passportExpiryDate: "2030-01-01",
      passportIssuingCountry: "USA",
    };

    const result = passportInfoSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});

describe("Contact Info Schema", () => {
  it("should validate valid contact info", () => {
    const validData = {
      email: "john@example.com",
      phoneNumber: "+1234567890",
    };

    const result = contactInfoSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should reject invalid email", () => {
    const invalidData = {
      email: "invalid-email",
      phoneNumber: "+1234567890",
    };

    const result = contactInfoSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("should accept optional emergency contact fields", () => {
    const validData = {
      email: "john@example.com",
      phoneNumber: "+1234567890",
      emergencyContactName: "Jane Doe",
      emergencyContactPhone: "+0987654321",
    };

    const result = contactInfoSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });
});

describe("Travel Info Schema", () => {
  // Helper to get a future date string
  const getFutureDate = (daysAhead: number = 30) => {
    const date = new Date();
    date.setDate(date.getDate() + daysAhead);
    return date.toISOString().split("T")[0];
  };

  it("should validate valid travel info", () => {
    const validData = {
      purposeOfVisit: "TOURISM" as const,
      intendedStayDuration: 14,
      arrivalDate: getFutureDate(30),
      previousCountry: "South Africa",
    };

    const result = travelInfoSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should reject stay duration less than 1 day", () => {
    const invalidData = {
      purposeOfVisit: "TOURISM" as const,
      intendedStayDuration: 0,
      arrivalDate: getFutureDate(30),
      previousCountry: "South Africa",
    };

    const result = travelInfoSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("should accept all valid visit purposes", () => {
    const purposes = [
      "TOURISM",
      "BUSINESS",
      "EMPLOYMENT",
      "STUDY",
      "MEDICAL",
      "TRANSIT",
      "RETURNING_RESIDENT",
      "OTHER",
    ] as const;

    purposes.forEach((purpose) => {
      const data = {
        purposeOfVisit: purpose,
        intendedStayDuration: 7,
        arrivalDate: getFutureDate(30),
        previousCountry: "South Africa",
      };

      const result = travelInfoSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });
});

describe("Accommodation Schema", () => {
  it("should validate valid accommodation info", () => {
    const validData = {
      accommodationType: "HOTEL",
      accommodationName: "Hilton Harare",
      accommodationAddress: "123 Main Street",
      accommodationCity: "Harare",
    };

    const result = accommodationSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should reject empty accommodation name", () => {
    const invalidData = {
      accommodationType: "HOTEL",
      accommodationName: "",
      accommodationAddress: "123 Main Street",
      accommodationCity: "Harare",
    };

    const result = accommodationSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});

describe("Customs Declaration Schema", () => {
  it("should validate customs declaration with no items", () => {
    const validData = {
      carryingCurrency: false,
      carryingGoods: false,
    };

    const result = customsDeclarationSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should accept currency details when carrying currency", () => {
    const validData = {
      carryingCurrency: true,
      currencyAmount: 5000,
      currencyType: "USD",
      carryingGoods: false,
    };

    const result = customsDeclarationSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should accept goods details when carrying goods", () => {
    const validData = {
      carryingCurrency: false,
      carryingGoods: true,
      goodsDescription: "Electronics",
      goodsValue: 1500,
    };

    const result = customsDeclarationSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });
});

describe("Health Declaration Schema", () => {
  it("should validate health declaration", () => {
    const validData = {
      healthDeclaration: true,
      recentIllness: false,
    };

    const result = healthDeclarationSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should accept illness description when recent illness is true", () => {
    const validData = {
      healthDeclaration: true,
      recentIllness: true,
      illnessDescription: "Common cold, fully recovered",
    };

    const result = healthDeclarationSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });
});

describe("Declaration Schema", () => {
  it("should require declaration to be accepted", () => {
    const invalidData = {
      declarationAccepted: false,
    };

    const result = declarationSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("should validate when declaration is accepted", () => {
    const validData = {
      declarationAccepted: true,
    };

    const result = declarationSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });
});
