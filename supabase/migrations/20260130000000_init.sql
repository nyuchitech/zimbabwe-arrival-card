-- Zimbabwe Arrival Card - Supabase PostgreSQL Migration
-- Run this in Supabase SQL Editor

-- Create Enums
CREATE TYPE "Role" AS ENUM ('TRAVELER', 'IMMIGRATION', 'GOVERNMENT', 'ZIMRA', 'ADMIN');
CREATE TYPE "ArrivalCardStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'EXPIRED');
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');
CREATE TYPE "VisitPurpose" AS ENUM ('TOURISM', 'BUSINESS', 'EMPLOYMENT', 'STUDY', 'MEDICAL', 'TRANSIT', 'RETURNING_RESIDENT', 'OTHER');

-- Create BorderPost table first (referenced by User and ArrivalCard)
CREATE TABLE "BorderPost" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "location" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BorderPost_pkey" PRIMARY KEY ("id")
);

-- Create User table
CREATE TABLE "User" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "role" "Role" NOT NULL DEFAULT 'TRAVELER',
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "borderPostId" TEXT,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "User_borderPostId_fkey" FOREIGN KEY ("borderPostId") REFERENCES "BorderPost"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Create Account table (NextAuth)
CREATE TABLE "Account" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "Account_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create Session table (NextAuth)
CREATE TABLE "Session" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Session_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create VerificationToken table (NextAuth)
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- Create ArrivalCard table
CREATE TABLE "ArrivalCard" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "referenceNumber" TEXT NOT NULL,
    "status" "ArrivalCardStatus" NOT NULL DEFAULT 'DRAFT',

    -- Personal Information
    "firstName" TEXT NOT NULL,
    "middleName" TEXT,
    "lastName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "gender" "Gender" NOT NULL,
    "nationality" TEXT NOT NULL,
    "countryOfResidence" TEXT NOT NULL,
    "occupation" TEXT,

    -- Passport Information
    "passportNumber" TEXT NOT NULL,
    "passportIssueDate" TIMESTAMP(3) NOT NULL,
    "passportExpiryDate" TIMESTAMP(3) NOT NULL,
    "passportIssuingCountry" TEXT NOT NULL,

    -- Contact Information
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "emergencyContactName" TEXT,
    "emergencyContactPhone" TEXT,

    -- Travel Information
    "purposeOfVisit" "VisitPurpose" NOT NULL,
    "purposeOther" TEXT,
    "intendedStayDuration" INTEGER NOT NULL,
    "arrivalDate" TIMESTAMP(3) NOT NULL,
    "departureDate" TIMESTAMP(3),
    "flightNumber" TEXT,
    "vesselName" TEXT,
    "previousCountry" TEXT NOT NULL,

    -- Accommodation
    "accommodationType" TEXT NOT NULL,
    "accommodationName" TEXT NOT NULL,
    "accommodationAddress" TEXT NOT NULL,
    "accommodationCity" TEXT NOT NULL,
    "accommodationPhone" TEXT,

    -- Customs Declaration
    "carryingCurrency" BOOLEAN NOT NULL DEFAULT false,
    "currencyAmount" DOUBLE PRECISION,
    "currencyType" TEXT,
    "carryingGoods" BOOLEAN NOT NULL DEFAULT false,
    "goodsDescription" TEXT,
    "goodsValue" DOUBLE PRECISION,

    -- Health Declaration
    "healthDeclaration" BOOLEAN NOT NULL DEFAULT false,
    "recentIllness" BOOLEAN NOT NULL DEFAULT false,
    "illnessDescription" TEXT,

    -- Declaration
    "declarationAccepted" BOOLEAN NOT NULL DEFAULT false,
    "declarationDate" TIMESTAMP(3),
    "signature" TEXT,

    -- Relations
    "travelerId" TEXT NOT NULL,
    "reviewerId" TEXT,
    "borderPostId" TEXT,

    -- Review Information
    "reviewNotes" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,

    -- Timestamps
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submittedAt" TIMESTAMP(3),

    CONSTRAINT "ArrivalCard_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "ArrivalCard_travelerId_fkey" FOREIGN KEY ("travelerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ArrivalCard_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ArrivalCard_borderPostId_fkey" FOREIGN KEY ("borderPostId") REFERENCES "BorderPost"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Create Companion table
CREATE TABLE "Companion" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "gender" "Gender" NOT NULL,
    "nationality" TEXT NOT NULL,
    "passportNumber" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "arrivalCardId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Companion_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Companion_arrivalCardId_fkey" FOREIGN KEY ("arrivalCardId") REFERENCES "ArrivalCard"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create AuditLog table
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "oldData" TEXT,
    "newData" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Create SystemSetting table
CREATE TABLE "SystemSetting" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SystemSetting_pkey" PRIMARY KEY ("id")
);

-- Create Unique Indexes
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");
CREATE UNIQUE INDEX "BorderPost_code_key" ON "BorderPost"("code");
CREATE UNIQUE INDEX "ArrivalCard_referenceNumber_key" ON "ArrivalCard"("referenceNumber");
CREATE UNIQUE INDEX "SystemSetting_key_key" ON "SystemSetting"("key");

-- Create Performance Indexes
CREATE INDEX "User_email_idx" ON "User"("email");
CREATE INDEX "User_role_idx" ON "User"("role");
CREATE INDEX "BorderPost_code_idx" ON "BorderPost"("code");
CREATE INDEX "ArrivalCard_referenceNumber_idx" ON "ArrivalCard"("referenceNumber");
CREATE INDEX "ArrivalCard_passportNumber_idx" ON "ArrivalCard"("passportNumber");
CREATE INDEX "ArrivalCard_status_idx" ON "ArrivalCard"("status");
CREATE INDEX "ArrivalCard_travelerId_idx" ON "ArrivalCard"("travelerId");
CREATE INDEX "ArrivalCard_arrivalDate_idx" ON "ArrivalCard"("arrivalDate");
CREATE INDEX "Companion_arrivalCardId_idx" ON "Companion"("arrivalCardId");
CREATE INDEX "AuditLog_entityType_entityId_idx" ON "AuditLog"("entityType", "entityId");
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- Create updatedAt trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updatedAt
CREATE TRIGGER update_user_updated_at BEFORE UPDATE ON "User" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_borderpost_updated_at BEFORE UPDATE ON "BorderPost" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_arrivalcard_updated_at BEFORE UPDATE ON "ArrivalCard" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_companion_updated_at BEFORE UPDATE ON "Companion" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_systemsetting_updated_at BEFORE UPDATE ON "SystemSetting" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
