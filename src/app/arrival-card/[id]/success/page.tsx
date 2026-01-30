import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import Image from "next/image";
import { QRCodeDisplay } from "@/components/qr-code-display";
import { EpassActions } from "@/components/epass-actions";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  Calendar,
  MapPin,
  Plane,
  User,
  FileText,
  Clock,
  Shield,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";

interface SuccessPageProps {
  params: Promise<{ id: string }>;
}

export default async function ArrivalCardSuccessPage({ params }: SuccessPageProps) {
  const { id } = await params;

  const arrivalCard = await db.arrivalCard.findUnique({
    where: { id },
    include: {
      borderPost: true,
    },
  });

  if (!arrivalCard) {
    notFound();
  }

  // Create QR code data - URL that can be scanned at immigration
  const qrData = JSON.stringify({
    ref: arrivalCard.referenceNumber,
    name: `${arrivalCard.firstName} ${arrivalCard.lastName}`,
    passport: arrivalCard.passportNumber,
    arrival: arrivalCard.arrivalDate.toISOString().split("T")[0],
    status: arrivalCard.status,
  });

  const statusColors = {
    DRAFT: "bg-gray-100 text-gray-800",
    SUBMITTED: "bg-blue-100 text-blue-800",
    UNDER_REVIEW: "bg-yellow-100 text-yellow-800",
    APPROVED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
    EXPIRED: "bg-gray-100 text-gray-600",
  };

  const purposeLabels: Record<string, string> = {
    TOURISM: "Tourism",
    BUSINESS: "Business",
    EMPLOYMENT: "Employment",
    STUDY: "Study",
    MEDICAL: "Medical",
    TRANSIT: "Transit",
    RETURNING_RESIDENT: "Returning Resident",
    OTHER: "Other",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zim-green/5 to-zim-yellow/5">
      {/* Header */}
      <header className="bg-zim-green text-white py-4" role="banner">
        <div className="container mx-auto px-4 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <Image
              src="https://www.moha.gov.zw/images/logo.png"
              alt="Government of Zimbabwe Coat of Arms"
              width={40}
              height={40}
              className="h-10 w-auto"
            />
            <div>
              <h1 className="text-lg font-bold">Zimbabwe e-Arrival Card</h1>
              <p className="text-xs text-white/80">Department of Immigration</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl" role="main">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" aria-hidden="true" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Arrival Card Submitted Successfully
          </h2>
          <p className="text-muted-foreground">
            Your Zimbabwe e-Arrival Card has been submitted. Please save or print this confirmation.
          </p>
        </div>

        {/* e-Pass Card - Singapore Style */}
        <Card className="border-2 border-zim-green overflow-hidden print:shadow-none" id="epass-card">
          <div className="bg-zim-green text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="h-6 w-6" aria-hidden="true" />
                <div>
                  <p className="text-xs font-medium text-white/80">REPUBLIC OF ZIMBABWE</p>
                  <p className="font-bold">Electronic Arrival Card</p>
                </div>
              </div>
              <Badge className={statusColors[arrivalCard.status]}>
                {arrivalCard.status}
              </Badge>
            </div>
          </div>

          <CardContent className="p-6">
            {/* Reference Number & QR Code */}
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              <div className="flex-1 space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Reference Number</p>
                  <p className="text-2xl font-mono font-bold text-zim-green">
                    {arrivalCard.referenceNumber}
                  </p>
                </div>

                <Separator />

                {/* Traveler Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                      <User className="h-3 w-3" aria-hidden="true" /> Full Name
                    </p>
                    <p className="font-semibold">
                      {arrivalCard.firstName} {arrivalCard.middleName} {arrivalCard.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                      <FileText className="h-3 w-3" aria-hidden="true" /> Passport
                    </p>
                    <p className="font-semibold font-mono">{arrivalCard.passportNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                      <MapPin className="h-3 w-3" aria-hidden="true" /> Nationality
                    </p>
                    <p className="font-semibold">{arrivalCard.nationality}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                      <Plane className="h-3 w-3" aria-hidden="true" /> Purpose
                    </p>
                    <p className="font-semibold">{purposeLabels[arrivalCard.purposeOfVisit]}</p>
                  </div>
                </div>

                <Separator />

                {/* Travel Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                      <Calendar className="h-3 w-3" aria-hidden="true" /> Arrival Date
                    </p>
                    <p className="font-semibold">
                      {format(arrivalCard.arrivalDate, "dd MMM yyyy")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                      <Clock className="h-3 w-3" aria-hidden="true" /> Duration
                    </p>
                    <p className="font-semibold">{arrivalCard.intendedStayDuration} days</p>
                  </div>
                </div>
              </div>

              {/* QR Code */}
              <div className="flex flex-col items-center">
                <QRCodeDisplay value={qrData} size={160} />
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Scan at Immigration
                </p>
              </div>
            </div>

            {/* Important Notice */}
            <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div className="text-sm">
                  <p className="font-semibold text-amber-800">Important Information</p>
                  <ul className="mt-1 text-amber-700 space-y-1">
                    <li>Present this QR code or reference number at immigration.</li>
                    <li>This e-Arrival Card is valid for 3 days before your arrival date.</li>
                    <li>Keep your passport ready for verification.</li>
                    <li>This is not a visa. Ensure you have the correct visa if required.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submission Info */}
            <div className="mt-4 text-xs text-muted-foreground text-center">
              <p>
                Submitted on {format(arrivalCard.createdAt, "dd MMMM yyyy 'at' HH:mm")}
              </p>
              <p>Card ID: {arrivalCard.id}</p>
            </div>
          </CardContent>
        </Card>

        {/* Client-side Actions */}
        <EpassActions cardId={id} />
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-4 mt-8 print:hidden" role="contentinfo">
        <div className="container mx-auto px-4 text-center text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Republic of Zimbabwe - Department of Immigration</p>
          <p className="mt-1">
            For assistance, contact: <a href="mailto:immigration@moha.gov.zw" className="text-zim-green hover:underline">immigration@moha.gov.zw</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
