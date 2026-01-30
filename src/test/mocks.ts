import { vi } from "vitest";

// Mock user data for testing
export const mockUsers = {
  user: {
    id: "user-1",
    email: "user@example.com",
    name: "Test User",
    role: "USER" as const,
    password: "$2a$12$hashedpassword",
  },
  immigration: {
    id: "user-2",
    email: "officer@immigration.gov.zw",
    name: "Immigration Officer",
    role: "IMMIGRATION" as const,
    password: "$2a$12$hashedpassword",
  },
  government: {
    id: "user-3",
    email: "official@government.gov.zw",
    name: "Government Official",
    role: "GOVERNMENT" as const,
    password: "$2a$12$hashedpassword",
  },
  admin: {
    id: "user-4",
    email: "admin@zimbabwe.gov.zw",
    name: "System Admin",
    role: "ADMIN" as const,
    password: "$2a$12$hashedpassword",
  },
};

// Mock trip data
export const mockTrip = {
  id: "trip-1",
  referenceNumber: "ZW-2024-ABC123",
  status: "SUBMITTED" as const,
  travelerType: "VISITOR" as const,
  firstName: "John",
  lastName: "Doe",
  dateOfBirth: new Date("1990-01-15"),
  gender: "MALE" as const,
  nationality: "USA",
  countryOfResidence: "USA",
  documentType: "PASSPORT" as const,
  documentNumber: "AB123456",
  documentIssueDate: new Date("2020-01-01"),
  documentExpiryDate: new Date("2030-01-01"),
  documentIssuingCountry: "USA",
  email: "john@example.com",
  phoneNumber: "+1234567890",
  purposeOfVisit: "TOURISM" as const,
  intendedStayDuration: 14,
  arrivalDate: new Date("2024-06-01"),
  previousCountry: "South Africa",
  accommodationType: "HOTEL",
  accommodationName: "Hilton Harare",
  accommodationAddress: "123 Main Street",
  accommodationCity: "Harare",
  // Health declaration
  hasSymptoms: false,
  visitedYellowFeverCountry: false,
  contactWithInfectious: false,
  seekingMedicalTreatment: false,
  healthDeclarationAccepted: true,
  // Customs declaration
  carryingCurrency: false,
  carryingGoods: false,
  carryingProhibitedItems: false,
  declarationAccepted: true,
  userId: "user-1",
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Mock session for testing
export const createMockSession = (user: (typeof mockUsers)[keyof typeof mockUsers]) => ({
  user: {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  },
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
});

// Mock database client
export const createMockDb = () => ({
  user: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  trip: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
  },
  travelerProfile: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    upsert: vi.fn(),
  },
  borderPost: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
  },
});

// Mock NextRequest for API testing
export const createMockRequest = (
  url: string,
  options?: {
    method?: string;
    body?: object;
    headers?: Record<string, string>;
  }
) => {
  const request = new Request(url, {
    method: options?.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    body: options?.body ? JSON.stringify(options.body) : undefined,
  });

  return request as Request;
};

// Helper to parse JSON response
export const parseJsonResponse = async (response: Response) => {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};
