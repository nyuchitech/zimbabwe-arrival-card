import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const referenceNumber = searchParams.get("ref");
    const passportNumber = searchParams.get("passport");

    if (!referenceNumber || !passportNumber) {
      return NextResponse.json(
        { error: "Reference number and passport number are required" },
        { status: 400 }
      );
    }

    const arrivalCard = await db.arrivalCard.findFirst({
      where: {
        referenceNumber: referenceNumber.toUpperCase(),
        passportNumber: passportNumber.toUpperCase(),
      },
      select: {
        id: true,
        referenceNumber: true,
        status: true,
        firstName: true,
        lastName: true,
        nationality: true,
        arrivalDate: true,
        purposeOfVisit: true,
        createdAt: true,
        submittedAt: true,
      },
    });

    if (!arrivalCard) {
      return NextResponse.json(
        { error: "Arrival card not found. Please check your reference and passport numbers." },
        { status: 404 }
      );
    }

    return NextResponse.json(arrivalCard);
  } catch (error) {
    console.error("Lookup error:", error);
    return NextResponse.json(
      { error: "An error occurred while looking up the arrival card" },
      { status: 500 }
    );
  }
}
