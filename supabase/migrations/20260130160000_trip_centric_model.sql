-- Migration: Trip-Centric Model with Health Declaration
-- This migration updates the schema to:
-- 1. Rename TRAVELER role to USER
-- 2. Add TravelerType enum for different port-of-entry users
-- 3. Add TravelerProfile for stored user information
-- 4. Rename ArrivalCard to Trip
-- 5. Add comprehensive health declaration fields
-- 6. Add DocumentType enum

-- ============================================================================
-- ENUMS
-- ============================================================================

-- Update Role enum: rename TRAVELER to USER
ALTER TYPE "Role" RENAME VALUE 'TRAVELER' TO 'USER';

-- Create TravelerType enum
DO $$ BEGIN
  CREATE TYPE "TravelerType" AS ENUM (
    'VISITOR',
    'CITIZEN',
    'PERMANENT_RESIDENT',
    'RESIDENT_PERMIT',
    'WORK_PERMIT',
    'STUDY_PERMIT',
    'DIPLOMATIC',
    'TRANSIT'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create DocumentType enum
DO $$ BEGIN
  CREATE TYPE "DocumentType" AS ENUM (
    'PASSPORT',
    'DIPLOMATIC_PASSPORT',
    'OFFICIAL_PASSPORT',
    'TRAVEL_DOCUMENT',
    'EMERGENCY_TRAVEL_DOCUMENT',
    'NATIONAL_ID'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Rename ArrivalCardStatus to TripStatus
ALTER TYPE "ArrivalCardStatus" RENAME TO "TripStatus";

-- Add new VisitPurpose values
ALTER TYPE "VisitPurpose" ADD VALUE IF NOT EXISTS 'FAMILY_VISIT';
ALTER TYPE "VisitPurpose" ADD VALUE IF NOT EXISTS 'CONFERENCE';
ALTER TYPE "VisitPurpose" ADD VALUE IF NOT EXISTS 'OFFICIAL';

-- ============================================================================
-- TRAVELER PROFILE TABLE (for stored profiles)
-- ============================================================================

CREATE TABLE IF NOT EXISTS "TravelerProfile" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "defaultTravelerType" "TravelerType" NOT NULL DEFAULT 'VISITOR',

  -- Personal Information
  "firstName" TEXT NOT NULL,
  "middleName" TEXT,
  "lastName" TEXT NOT NULL,
  "dateOfBirth" TIMESTAMP(3) NOT NULL,
  "gender" "Gender" NOT NULL,
  "nationality" TEXT NOT NULL,
  "countryOfResidence" TEXT NOT NULL,
  "occupation" TEXT,

  -- Document Information
  "documentType" "DocumentType" NOT NULL DEFAULT 'PASSPORT',
  "documentNumber" TEXT NOT NULL,
  "documentIssueDate" TIMESTAMP(3) NOT NULL,
  "documentExpiryDate" TIMESTAMP(3) NOT NULL,
  "documentIssuingCountry" TEXT NOT NULL,

  -- Contact Information
  "phoneNumber" TEXT,
  "emergencyContactName" TEXT,
  "emergencyContactPhone" TEXT,

  -- Home Address
  "homeAddress" TEXT,
  "homeCity" TEXT,
  "homeCountry" TEXT,
  "homePostalCode" TEXT,

  -- Zimbabwe Address (for residents)
  "zimbabweAddress" TEXT,
  "zimbabweCity" TEXT,
  "zimbabwePostalCode" TEXT,

  -- Permit details
  "permitNumber" TEXT,
  "permitExpiryDate" TIMESTAMP(3),

  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "TravelerProfile_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "TravelerProfile_userId_key" UNIQUE ("userId"),
  CONSTRAINT "TravelerProfile_userId_fkey" FOREIGN KEY ("userId")
    REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "TravelerProfile_documentNumber_idx" ON "TravelerProfile"("documentNumber");

-- ============================================================================
-- RENAME ARRIVAL CARD TABLE TO TRIP
-- ============================================================================

-- Rename the table
ALTER TABLE IF EXISTS "ArrivalCard" RENAME TO "Trip";

-- Rename foreign key columns
ALTER TABLE "Trip" RENAME COLUMN "travelerId" TO "userId";

-- Rename passport columns to document columns
ALTER TABLE "Trip" RENAME COLUMN "passportNumber" TO "documentNumber";
ALTER TABLE "Trip" RENAME COLUMN "passportIssueDate" TO "documentIssueDate";
ALTER TABLE "Trip" RENAME COLUMN "passportExpiryDate" TO "documentExpiryDate";
ALTER TABLE "Trip" RENAME COLUMN "passportIssuingCountry" TO "documentIssuingCountry";

-- Add new columns
ALTER TABLE "Trip" ADD COLUMN IF NOT EXISTS "travelerType" "TravelerType" NOT NULL DEFAULT 'VISITOR';
ALTER TABLE "Trip" ADD COLUMN IF NOT EXISTS "documentType" "DocumentType" NOT NULL DEFAULT 'PASSPORT';
ALTER TABLE "Trip" ADD COLUMN IF NOT EXISTS "permitNumber" TEXT;
ALTER TABLE "Trip" ADD COLUMN IF NOT EXISTS "permitExpiryDate" TIMESTAMP(3);

-- Health Declaration fields
ALTER TABLE "Trip" ADD COLUMN IF NOT EXISTS "hasSymptoms" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Trip" ADD COLUMN IF NOT EXISTS "symptomsDescription" TEXT;
ALTER TABLE "Trip" ADD COLUMN IF NOT EXISTS "visitedYellowFeverCountry" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Trip" ADD COLUMN IF NOT EXISTS "yellowFeverCountries" TEXT;
ALTER TABLE "Trip" ADD COLUMN IF NOT EXISTS "yellowFeverCertificate" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Trip" ADD COLUMN IF NOT EXISTS "contactWithInfectious" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Trip" ADD COLUMN IF NOT EXISTS "infectiousContactDetails" TEXT;
ALTER TABLE "Trip" ADD COLUMN IF NOT EXISTS "seekingMedicalTreatment" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Trip" ADD COLUMN IF NOT EXISTS "medicalFacilityName" TEXT;
ALTER TABLE "Trip" ADD COLUMN IF NOT EXISTS "currentMedications" TEXT;
ALTER TABLE "Trip" ADD COLUMN IF NOT EXISTS "healthDeclarationAccepted" BOOLEAN NOT NULL DEFAULT false;

-- Customs Declaration additional fields
ALTER TABLE "Trip" ADD COLUMN IF NOT EXISTS "carryingProhibitedItems" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Trip" ADD COLUMN IF NOT EXISTS "prohibitedItemsDescription" TEXT;

-- Drop old health columns if they exist
ALTER TABLE "Trip" DROP COLUMN IF EXISTS "healthDeclaration";
ALTER TABLE "Trip" DROP COLUMN IF EXISTS "recentIllness";
ALTER TABLE "Trip" DROP COLUMN IF EXISTS "illnessDescription";

-- Rename status column type
ALTER TABLE "Trip" ALTER COLUMN "status" TYPE "TripStatus" USING "status"::text::"TripStatus";

-- Update indexes
DROP INDEX IF EXISTS "ArrivalCard_referenceNumber_key";
DROP INDEX IF EXISTS "ArrivalCard_referenceNumber_idx";
DROP INDEX IF EXISTS "ArrivalCard_passportNumber_idx";
DROP INDEX IF EXISTS "ArrivalCard_status_idx";
DROP INDEX IF EXISTS "ArrivalCard_travelerId_idx";
DROP INDEX IF EXISTS "ArrivalCard_arrivalDate_idx";

CREATE UNIQUE INDEX IF NOT EXISTS "Trip_referenceNumber_key" ON "Trip"("referenceNumber");
CREATE INDEX IF NOT EXISTS "Trip_referenceNumber_idx" ON "Trip"("referenceNumber");
CREATE INDEX IF NOT EXISTS "Trip_documentNumber_idx" ON "Trip"("documentNumber");
CREATE INDEX IF NOT EXISTS "Trip_status_idx" ON "Trip"("status");
CREATE INDEX IF NOT EXISTS "Trip_userId_idx" ON "Trip"("userId");
CREATE INDEX IF NOT EXISTS "Trip_arrivalDate_idx" ON "Trip"("arrivalDate");

-- ============================================================================
-- UPDATE COMPANION TABLE
-- ============================================================================

-- Rename foreign key column
ALTER TABLE "Companion" RENAME COLUMN "arrivalCardId" TO "tripId";
ALTER TABLE "Companion" RENAME COLUMN "passportNumber" TO "documentNumber";

-- Add document type
ALTER TABLE "Companion" ADD COLUMN IF NOT EXISTS "documentType" "DocumentType" NOT NULL DEFAULT 'PASSPORT';

-- Update indexes
DROP INDEX IF EXISTS "Companion_arrivalCardId_idx";
CREATE INDEX IF NOT EXISTS "Companion_tripId_idx" ON "Companion"("tripId");

-- ============================================================================
-- UPDATE BORDER POST TABLE
-- ============================================================================

ALTER TABLE "BorderPost" ADD COLUMN IF NOT EXISTS "country" TEXT;

-- ============================================================================
-- UPDATE FOREIGN KEY CONSTRAINTS
-- ============================================================================

-- Drop old constraint and create new one for Trip
ALTER TABLE "Trip" DROP CONSTRAINT IF EXISTS "ArrivalCard_travelerId_fkey";
ALTER TABLE "Trip" DROP CONSTRAINT IF EXISTS "Trip_userId_fkey";
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Update Companion foreign key
ALTER TABLE "Companion" DROP CONSTRAINT IF EXISTS "Companion_arrivalCardId_fkey";
ALTER TABLE "Companion" DROP CONSTRAINT IF EXISTS "Companion_tripId_fkey";
ALTER TABLE "Companion" ADD CONSTRAINT "Companion_tripId_fkey"
  FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ============================================================================
-- CREATE TRIGGER FOR UPDATED_AT
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger to TravelerProfile
DROP TRIGGER IF EXISTS update_traveler_profile_updated_at ON "TravelerProfile";
CREATE TRIGGER update_traveler_profile_updated_at
  BEFORE UPDATE ON "TravelerProfile"
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
