import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { rateLimit, getClientIp, rateLimitHeaders } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  try {
    // Rate limiting: 60 verifications per minute per IP (higher for officers)
    const clientIp = getClientIp(request);
    const rateLimitResult = rateLimit(`verify:${clientIp}`, {
      limit: 60,
      windowInSeconds: 60,
    });

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: rateLimitHeaders(rateLimitResult) }
      );
    }

    // Verify user is immigration officer or admin
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!["IMMIGRATION", "ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const referenceNumber = searchParams.get("ref");
    const documentNumber = searchParams.get("passport");

    if (!referenceNumber) {
      return NextResponse.json(
        { error: "Reference number is required" },
        { status: 400 }
      );
    }

    // Build where clause - passport is optional for manual search
    const whereClause: Record<string, unknown> = {
      referenceNumber: referenceNumber.toUpperCase(),
    };

    if (documentNumber) {
      whereClause.documentNumber = documentNumber.toUpperCase();
    }

    const arrivalCard = await db.trip.findFirst({
      where: whereClause,
      select: {
        id: true,
        referenceNumber: true,
        status: true,
        firstName: true,
        middleName: true,
        lastName: true,
        dateOfBirth: true,
        gender: true,
        nationality: true,
        countryOfResidence: true,
        occupation: true,
        documentNumber: true,
        documentIssueDate: true,
        documentExpiryDate: true,
        documentIssuingCountry: true,
        email: true,
        phoneNumber: true,
        emergencyContactName: true,
        emergencyContactPhone: true,
        purposeOfVisit: true,
        purposeOther: true,
        arrivalDate: true,
        departureDate: true,
        intendedStayDuration: true,
        flightNumber: true,
        vesselName: true,
        previousCountry: true,
        accommodationType: true,
        accommodationName: true,
        accommodationAddress: true,
        accommodationCity: true,
        accommodationPhone: true,
        carryingCurrency: true,
        currencyAmount: true,
        currencyType: true,
        carryingGoods: true,
        goodsDescription: true,
        goodsValue: true,
        hasSymptoms: true,
        symptomsDescription: true,
        visitedYellowFeverCountry: true,
        yellowFeverCountries: true,
        yellowFeverCertificate: true,
        contactWithInfectious: true,
        infectiousContactDetails: true,
        seekingMedicalTreatment: true,
        medicalFacilityName: true,
        currentMedications: true,
        healthDeclarationAccepted: true,
        declarationAccepted: true,
        declarationDate: true,
        createdAt: true,
        submittedAt: true,
        reviewedAt: true,
        reviewNotes: true,
        rejectionReason: true,
        borderPost: {
          select: {
            name: true,
            code: true,
          },
        },
        companions: {
          select: {
            firstName: true,
            lastName: true,
            dateOfBirth: true,
            nationality: true,
            documentNumber: true,
            relationship: true,
          },
        },
      },
    });

    if (!arrivalCard) {
      return NextResponse.json(
        { error: "Arrival card not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(arrivalCard);
  } catch (error) {
    console.error("Verify error:", error);
    return NextResponse.json(
      { error: "An error occurred while verifying the arrival card" },
      { status: 500 }
    );
  }
}
