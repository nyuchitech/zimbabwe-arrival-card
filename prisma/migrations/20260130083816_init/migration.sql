-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "role" TEXT NOT NULL DEFAULT 'TRAVELER',
    "emailVerified" DATETIME,
    "image" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "borderPostId" TEXT,
    CONSTRAINT "User_borderPostId_fkey" FOREIGN KEY ("borderPostId") REFERENCES "BorderPost" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "BorderPost" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "location" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ArrivalCard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "referenceNumber" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "firstName" TEXT NOT NULL,
    "middleName" TEXT,
    "lastName" TEXT NOT NULL,
    "dateOfBirth" DATETIME NOT NULL,
    "gender" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "countryOfResidence" TEXT NOT NULL,
    "occupation" TEXT,
    "passportNumber" TEXT NOT NULL,
    "passportIssueDate" DATETIME NOT NULL,
    "passportExpiryDate" DATETIME NOT NULL,
    "passportIssuingCountry" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "emergencyContactName" TEXT,
    "emergencyContactPhone" TEXT,
    "purposeOfVisit" TEXT NOT NULL,
    "purposeOther" TEXT,
    "intendedStayDuration" INTEGER NOT NULL,
    "arrivalDate" DATETIME NOT NULL,
    "departureDate" DATETIME,
    "flightNumber" TEXT,
    "vesselName" TEXT,
    "previousCountry" TEXT NOT NULL,
    "accommodationType" TEXT NOT NULL,
    "accommodationName" TEXT NOT NULL,
    "accommodationAddress" TEXT NOT NULL,
    "accommodationCity" TEXT NOT NULL,
    "accommodationPhone" TEXT,
    "carryingCurrency" BOOLEAN NOT NULL DEFAULT false,
    "currencyAmount" REAL,
    "currencyType" TEXT,
    "carryingGoods" BOOLEAN NOT NULL DEFAULT false,
    "goodsDescription" TEXT,
    "goodsValue" REAL,
    "healthDeclaration" BOOLEAN NOT NULL DEFAULT false,
    "recentIllness" BOOLEAN NOT NULL DEFAULT false,
    "illnessDescription" TEXT,
    "declarationAccepted" BOOLEAN NOT NULL DEFAULT false,
    "declarationDate" DATETIME,
    "signature" TEXT,
    "travelerId" TEXT NOT NULL,
    "reviewerId" TEXT,
    "borderPostId" TEXT,
    "reviewNotes" TEXT,
    "reviewedAt" DATETIME,
    "rejectionReason" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "submittedAt" DATETIME,
    CONSTRAINT "ArrivalCard_travelerId_fkey" FOREIGN KEY ("travelerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ArrivalCard_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ArrivalCard_borderPostId_fkey" FOREIGN KEY ("borderPostId") REFERENCES "BorderPost" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Companion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "dateOfBirth" DATETIME NOT NULL,
    "gender" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "passportNumber" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "arrivalCardId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Companion_arrivalCardId_fkey" FOREIGN KEY ("arrivalCardId") REFERENCES "ArrivalCard" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "oldData" TEXT,
    "newData" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SystemSetting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "BorderPost_code_key" ON "BorderPost"("code");

-- CreateIndex
CREATE INDEX "BorderPost_code_idx" ON "BorderPost"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ArrivalCard_referenceNumber_key" ON "ArrivalCard"("referenceNumber");

-- CreateIndex
CREATE INDEX "ArrivalCard_referenceNumber_idx" ON "ArrivalCard"("referenceNumber");

-- CreateIndex
CREATE INDEX "ArrivalCard_passportNumber_idx" ON "ArrivalCard"("passportNumber");

-- CreateIndex
CREATE INDEX "ArrivalCard_status_idx" ON "ArrivalCard"("status");

-- CreateIndex
CREATE INDEX "ArrivalCard_travelerId_idx" ON "ArrivalCard"("travelerId");

-- CreateIndex
CREATE INDEX "ArrivalCard_arrivalDate_idx" ON "ArrivalCard"("arrivalDate");

-- CreateIndex
CREATE INDEX "Companion_arrivalCardId_idx" ON "Companion"("arrivalCardId");

-- CreateIndex
CREATE INDEX "AuditLog_entityType_entityId_idx" ON "AuditLog"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "SystemSetting_key_key" ON "SystemSetting"("key");
