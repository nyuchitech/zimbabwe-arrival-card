import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { arrivalCardSchema } from "@/lib/validations/arrival-card";
import { nanoid } from "nanoid";
import { rateLimit, getClientIp, rateLimitHeaders } from "@/lib/rate-limit";
import { sendArrivalCardConfirmation } from "@/lib/email";

function generateReferenceNumber(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const random = nanoid(6).toUpperCase();
  return `ZW${year}${month}${day}${random}`;
}

export async function POST(request: Request) {
  try {
    // Basic rate limiting (Cloudflare handles DDoS)
    // 5 submissions per hour per IP as additional protection
    const clientIp = getClientIp(request);
    const rateLimitResult = rateLimit(`arrival-card:${clientIp}`, {
      limit: 5,
      windowInSeconds: 3600,
    });

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many submissions. Please try again later." },
        { status: 429, headers: rateLimitHeaders(rateLimitResult) }
      );
    }

    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate input
    const validationResult = arrivalCardSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const data = validationResult.data;
    const arrivalDate = new Date(data.arrivalDate);

    // Create arrival card
    const arrivalCard = await db.arrivalCard.create({
      data: {
        referenceNumber: generateReferenceNumber(),
        travelerId: session.user.id,
        status: "SUBMITTED",

        // Personal Information
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
        dateOfBirth: new Date(data.dateOfBirth),
        gender: data.gender,
        nationality: data.nationality,
        countryOfResidence: data.countryOfResidence,
        occupation: data.occupation,

        // Passport Information
        passportNumber: data.passportNumber,
        passportIssueDate: new Date(data.passportIssueDate),
        passportExpiryDate: new Date(data.passportExpiryDate),
        passportIssuingCountry: data.passportIssuingCountry,

        // Contact Information
        email: data.email,
        phoneNumber: data.phoneNumber,
        emergencyContactName: data.emergencyContactName,
        emergencyContactPhone: data.emergencyContactPhone,

        // Travel Information
        purposeOfVisit: data.purposeOfVisit,
        purposeOther: data.purposeOther,
        intendedStayDuration: data.intendedStayDuration,
        arrivalDate: arrivalDate,
        departureDate: data.departureDate ? new Date(data.departureDate) : null,
        flightNumber: data.flightNumber,
        vesselName: data.vesselName,
        previousCountry: data.previousCountry,

        // Accommodation
        accommodationType: data.accommodationType,
        accommodationName: data.accommodationName,
        accommodationAddress: data.accommodationAddress,
        accommodationCity: data.accommodationCity,
        accommodationPhone: data.accommodationPhone,

        // Customs Declaration
        carryingCurrency: data.carryingCurrency,
        currencyAmount: data.currencyAmount,
        currencyType: data.currencyType,
        carryingGoods: data.carryingGoods,
        goodsDescription: data.goodsDescription,
        goodsValue: data.goodsValue,

        // Health Declaration
        healthDeclaration: data.healthDeclaration,
        recentIllness: data.recentIllness,
        illnessDescription: data.illnessDescription,

        // Declaration
        declarationAccepted: data.declarationAccepted,
        declarationDate: new Date(),
        submittedAt: new Date(),
      },
    });

    // Send confirmation email (non-blocking)
    sendArrivalCardConfirmation({
      to: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      referenceNumber: arrivalCard.referenceNumber,
      arrivalDate: arrivalDate,
    }).catch((err) => console.error("Failed to send confirmation email:", err));

    return NextResponse.json(
      {
        message: "Arrival card submitted successfully",
        id: arrivalCard.id,
        referenceNumber: arrivalCard.referenceNumber,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Arrival card creation error:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the arrival card" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const where: Record<string, unknown> = {};

    // Role-based filtering
    if (session.user.role === "TRAVELER") {
      where.travelerId = session.user.id;
    }

    if (status) {
      where.status = status;
    }

    const [arrivalCards, total] = await Promise.all([
      db.arrivalCard.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          traveler: {
            select: { id: true, name: true, email: true },
          },
          reviewer: {
            select: { id: true, name: true },
          },
          borderPost: {
            select: { id: true, name: true, code: true },
          },
        },
      }),
      db.arrivalCard.count({ where }),
    ]);

    return NextResponse.json({
      data: arrivalCards,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Arrival cards fetch error:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching arrival cards" },
      { status: 500 }
    );
  }
}
