"use client";

import { useState } from "react";
import Link from "next/link";
import { QRScanner } from "@/components/qr-scanner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  QrCode,
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  User,
  FileText,
  Calendar,
  MapPin,
  Plane,
  Loader2,
  ArrowLeft,
} from "lucide-react";

interface ScannedData {
  ref: string;
  name: string;
  passport: string;
  arrival: string;
  status: string;
}

interface ArrivalCardDetails {
  id: string;
  referenceNumber: string;
  status: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  countryOfResidence: string;
  passportNumber: string;
  passportExpiryDate: string;
  email: string;
  phoneNumber: string;
  purposeOfVisit: string;
  arrivalDate: string;
  intendedStayDuration: number;
  flightNumber: string | null;
  accommodationName: string;
  accommodationCity: string;
  carryingCurrency: boolean;
  currencyAmount: number | null;
  carryingGoods: boolean;
  goodsValue: number | null;
  submittedAt: string | null;
}

const statusConfig = {
  DRAFT: { label: "Draft", color: "bg-gray-100 text-gray-800", icon: FileText },
  SUBMITTED: { label: "Submitted", color: "bg-blue-100 text-blue-800", icon: Clock },
  UNDER_REVIEW: { label: "Under Review", color: "bg-yellow-100 text-yellow-800", icon: AlertCircle },
  APPROVED: { label: "Approved", color: "bg-green-100 text-green-800", icon: CheckCircle },
  REJECTED: { label: "Rejected", color: "bg-red-100 text-red-800", icon: XCircle },
  EXPIRED: { label: "Expired", color: "bg-gray-100 text-gray-600", icon: Clock },
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

export default function ImmigrationScanPage() {
  const [scannedData, setScannedData] = useState<ScannedData | null>(null);
  const [cardDetails, setCardDetails] = useState<ArrivalCardDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualRef, setManualRef] = useState("");

  const handleScan = async (data: string) => {
    setError(null);
    setCardDetails(null);

    try {
      const parsed = JSON.parse(data) as ScannedData;
      setScannedData(parsed);
      await fetchCardDetails(parsed.ref, parsed.passport);
    } catch {
      setError("Invalid QR code format");
    }
  };

  const handleManualSearch = async () => {
    if (!manualRef.trim()) return;
    setError(null);
    setCardDetails(null);
    setScannedData(null);
    await fetchCardDetailsByRef(manualRef.trim());
  };

  const fetchCardDetails = async (ref: string, passport: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/arrival-card/verify?ref=${encodeURIComponent(ref)}&passport=${encodeURIComponent(passport)}`
      );
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Card not found");
        return;
      }

      setCardDetails(data);
    } catch {
      setError("Failed to verify arrival card");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCardDetailsByRef = async (ref: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/arrival-card/verify?ref=${encodeURIComponent(ref)}`
      );
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Card not found");
        return;
      }

      setCardDetails(data);
    } catch {
      setError("Failed to verify arrival card");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const resetScan = () => {
    setScannedData(null);
    setCardDetails(null);
    setError(null);
    setManualRef("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Scan Arrival Card</h1>
          <p className="text-muted-foreground">
            Scan QR code or enter reference number to verify traveler
          </p>
        </div>
        <Link href="/immigration">
          <Button variant="outline" className="min-h-[44px]">
            <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Scanner Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" aria-hidden="true" />
              Verify Arrival Card
            </CardTitle>
            <CardDescription>
              Scan the traveler&apos;s QR code or enter reference number manually
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="scan" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="scan" className="min-h-[44px]">
                  <QrCode className="h-4 w-4 mr-2" aria-hidden="true" />
                  Scan QR
                </TabsTrigger>
                <TabsTrigger value="manual" className="min-h-[44px]">
                  <Search className="h-4 w-4 mr-2" aria-hidden="true" />
                  Manual Entry
                </TabsTrigger>
              </TabsList>

              <TabsContent value="scan" className="mt-4">
                <QRScanner
                  onScan={handleScan}
                  onError={(err) => setError(err)}
                />
              </TabsContent>

              <TabsContent value="manual" className="mt-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="manualRef">Reference Number</Label>
                    <Input
                      id="manualRef"
                      placeholder="ZW-2026-XXXXXX"
                      className="min-h-[44px] font-mono"
                      value={manualRef}
                      onChange={(e) => setManualRef(e.target.value.toUpperCase())}
                    />
                  </div>
                  <Button
                    onClick={handleManualSearch}
                    className="w-full bg-zim-green hover:bg-zim-green/90 min-h-[44px]"
                    disabled={isLoading || !manualRef.trim()}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />
                    ) : (
                      <Search className="h-4 w-4 mr-2" aria-hidden="true" />
                    )}
                    Search
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            {error && (
              <div className="mt-4 p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card>
          <CardHeader>
            <CardTitle>Verification Result</CardTitle>
            <CardDescription>
              Traveler details and arrival card status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-zim-green" aria-hidden="true" />
                <span className="ml-2">Verifying...</span>
              </div>
            ) : cardDetails ? (
              <div className="space-y-4">
                {/* Status Banner */}
                {(() => {
                  const status = statusConfig[cardDetails.status as keyof typeof statusConfig];
                  const StatusIcon = status?.icon || FileText;
                  const isValid = cardDetails.status === "SUBMITTED" || cardDetails.status === "APPROVED";
                  return (
                    <div
                      className={`p-4 rounded-lg ${
                        isValid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {isValid ? (
                          <CheckCircle className="h-6 w-6" aria-hidden="true" />
                        ) : (
                          <XCircle className="h-6 w-6" aria-hidden="true" />
                        )}
                        <div>
                          <p className="font-bold text-lg">
                            {isValid ? "VALID" : "INVALID"}
                          </p>
                          <Badge className={status?.color}>
                            <StatusIcon className="h-3 w-3 mr-1" aria-hidden="true" />
                            {status?.label}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Reference */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">REFERENCE NUMBER</p>
                  <p className="text-xl font-mono font-bold text-zim-green">
                    {cardDetails.referenceNumber}
                  </p>
                </div>

                <Separator />

                {/* Traveler Info */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground flex items-center gap-1">
                      <User className="h-3 w-3" aria-hidden="true" /> Name
                    </p>
                    <p className="font-semibold">
                      {cardDetails.firstName} {cardDetails.middleName} {cardDetails.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground flex items-center gap-1">
                      <FileText className="h-3 w-3" aria-hidden="true" /> Passport
                    </p>
                    <p className="font-semibold font-mono">{cardDetails.passportNumber}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" aria-hidden="true" /> Nationality
                    </p>
                    <p className="font-semibold">{cardDetails.nationality}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" aria-hidden="true" /> DOB
                    </p>
                    <p className="font-semibold">{formatDate(cardDetails.dateOfBirth)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground flex items-center gap-1">
                      <Plane className="h-3 w-3" aria-hidden="true" /> Purpose
                    </p>
                    <p className="font-semibold">
                      {purposeLabels[cardDetails.purposeOfVisit]}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" aria-hidden="true" /> Arrival
                    </p>
                    <p className="font-semibold">{formatDate(cardDetails.arrivalDate)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" aria-hidden="true" /> Duration
                    </p>
                    <p className="font-semibold">{cardDetails.intendedStayDuration} days</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Passport Expiry</p>
                    <p className="font-semibold">{formatDate(cardDetails.passportExpiryDate)}</p>
                  </div>
                </div>

                {/* Customs Declaration Alerts */}
                {(cardDetails.carryingCurrency || cardDetails.carryingGoods) && (
                  <>
                    <Separator />
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <p className="font-semibold text-amber-800 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" aria-hidden="true" />
                        Customs Declaration
                      </p>
                      <ul className="mt-2 text-sm text-amber-700 space-y-1">
                        {cardDetails.carryingCurrency && (
                          <li>
                            Currency: ${cardDetails.currencyAmount?.toLocaleString() || "N/A"}
                          </li>
                        )}
                        {cardDetails.carryingGoods && (
                          <li>
                            Goods Value: ${cardDetails.goodsValue?.toLocaleString() || "N/A"}
                          </li>
                        )}
                      </ul>
                    </div>
                  </>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Link href={`/immigration/review/${cardDetails.id}`} className="flex-1">
                    <Button className="w-full bg-zim-green hover:bg-zim-green/90 min-h-[44px]">
                      Review Full Details
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="min-h-[44px]"
                    onClick={resetScan}
                  >
                    Scan Another
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <QrCode className="h-12 w-12 mx-auto mb-4 opacity-50" aria-hidden="true" />
                <p>Scan a QR code or enter a reference number</p>
                <p className="text-sm">Results will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
