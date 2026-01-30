"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Search, ArrowLeft, CheckCircle, Clock, AlertCircle, XCircle, FileText } from "lucide-react";

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
import { SkipLink } from "@/components/skip-link";

const lookupSchema = z.object({
  referenceNumber: z.string().min(1, "Reference number is required"),
  passportNumber: z.string().min(1, "Passport number is required"),
});

type LookupInput = z.infer<typeof lookupSchema>;

interface ArrivalCardResult {
  id: string;
  referenceNumber: string;
  status: string;
  firstName: string;
  lastName: string;
  nationality: string;
  arrivalDate: string;
  purposeOfVisit: string;
  createdAt: string;
  submittedAt: string | null;
}

const statusConfig = {
  DRAFT: {
    label: "Draft",
    color: "bg-gray-100 text-gray-800",
    icon: FileText,
    description: "Your arrival card is saved but not submitted."
  },
  SUBMITTED: {
    label: "Submitted",
    color: "bg-blue-100 text-blue-800",
    icon: Clock,
    description: "Your arrival card has been submitted and is pending review."
  },
  UNDER_REVIEW: {
    label: "Under Review",
    color: "bg-yellow-100 text-yellow-800",
    icon: AlertCircle,
    description: "Your arrival card is currently being reviewed by immigration."
  },
  APPROVED: {
    label: "Approved",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
    description: "Your arrival card has been approved. Present your QR code at immigration."
  },
  REJECTED: {
    label: "Rejected",
    color: "bg-red-100 text-red-800",
    icon: XCircle,
    description: "Your arrival card has been rejected. Please submit a new one or contact immigration."
  },
  EXPIRED: {
    label: "Expired",
    color: "bg-gray-100 text-gray-600",
    icon: Clock,
    description: "Your arrival card has expired. Please submit a new one."
  },
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

export default function ArrivalCardLookupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ArrivalCardResult | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LookupInput>({
    resolver: zodResolver(lookupSchema),
  });

  const onSubmit = async (data: LookupInput) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(
        `/api/arrival-card/lookup?ref=${encodeURIComponent(data.referenceNumber)}&passport=${encodeURIComponent(data.passportNumber)}`
      );

      const json = await response.json();

      if (!response.ok) {
        setError(json.error || "Arrival card not found");
        return;
      }

      setResult(json);
    } catch {
      setError("An error occurred. Please try again.");
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-zim-green/5 to-zim-yellow/5">
      <SkipLink />

      {/* Header */}
      <header className="bg-zim-green text-white py-5" role="banner">
        <div className="container mx-auto px-4 flex items-center justify-center">
          <div className="flex items-center gap-4">
            <Image
              src="https://www.moha.gov.zw/images/logo.png"
              alt="Government of Zimbabwe Coat of Arms"
              width={56}
              height={56}
              className="h-14 w-auto"
            />
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Zimbabwe e-Arrival Card</h1>
              <p className="text-sm text-white/90">Check Status</p>
            </div>
          </div>
        </div>
      </header>

      <main id="main-content" className="container mx-auto px-4 py-6 md:py-8 max-w-lg" role="main">
        <Link
          href="/"
          className="inline-flex items-center text-base text-gray-600 hover:text-zim-green mb-6 min-h-[48px] font-medium"
        >
          <ArrowLeft className="h-5 w-5 mr-2" aria-hidden="true" />
          Back to Home
        </Link>

        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl md:text-2xl text-gray-900">
              <Search className="h-6 w-6" aria-hidden="true" />
              Check Arrival Card Status
            </CardTitle>
            <CardDescription className="text-base text-gray-600">
              Enter your reference number and passport number to check the status of your arrival card.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="referenceNumber" className="text-base font-semibold text-gray-900">Reference Number</Label>
                <Input
                  id="referenceNumber"
                  placeholder="e.g., ZW-2026-XXXXXX"
                  className="h-14 text-base font-mono"
                  {...register("referenceNumber")}
                  disabled={isLoading}
                />
                {errors.referenceNumber && (
                  <p className="text-base text-red-600 font-medium" role="alert">
                    {errors.referenceNumber.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="passportNumber" className="text-base font-semibold text-gray-900">Passport Number</Label>
                <Input
                  id="passportNumber"
                  placeholder="Your passport number"
                  className="h-14 text-base font-mono"
                  {...register("passportNumber")}
                  disabled={isLoading}
                />
                {errors.passportNumber && (
                  <p className="text-base text-red-600 font-medium" role="alert">
                    {errors.passportNumber.message}
                  </p>
                )}
              </div>

              {error && (
                <div
                  className="p-4 text-base text-red-700 bg-red-50 border-2 border-red-300 rounded-lg font-medium"
                  role="alert"
                >
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-zim-green hover:bg-zim-green/90 h-14 text-lg font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-5 w-5" aria-hidden="true" />
                    Check Status
                  </>
                )}
              </Button>
            </form>

            {/* Result */}
            {result && (
              <div className="mt-8">
                <Separator className="mb-6" />

                <div className="space-y-5">
                  {/* Status Banner */}
                  {(() => {
                    const status = statusConfig[result.status as keyof typeof statusConfig];
                    const StatusIcon = status?.icon || FileText;
                    return (
                      <div className={`p-5 rounded-lg ${status?.color || "bg-gray-100"}`}>
                        <div className="flex items-start gap-4">
                          <StatusIcon className="h-7 w-7 mt-0.5 flex-shrink-0" aria-hidden="true" />
                          <div>
                            <p className="text-lg font-bold">{status?.label || result.status}</p>
                            <p className="text-base mt-1">{status?.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Card Details */}
                  <div className="bg-gray-50 rounded-lg p-5 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-base text-gray-600">Reference</span>
                      <span className="font-mono font-bold text-gray-900">{result.referenceNumber}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-base text-gray-600">Name</span>
                      <span className="font-bold text-gray-900">{result.firstName} {result.lastName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-base text-gray-600">Nationality</span>
                      <span className="text-gray-900">{result.nationality}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-base text-gray-600">Purpose</span>
                      <span className="text-gray-900">{purposeLabels[result.purposeOfVisit] || result.purposeOfVisit}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-base text-gray-600">Arrival Date</span>
                      <span className="text-gray-900">{formatDate(result.arrivalDate)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-base text-gray-600">Submitted</span>
                      <span className="text-gray-900">
                        {result.submittedAt ? formatDate(result.submittedAt) : "Not yet"}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  {(result.status === "SUBMITTED" || result.status === "APPROVED") && (
                    <Link href={`/arrival-card/${result.id}/success`}>
                      <Button className="w-full bg-zim-green hover:bg-zim-green/90 h-14 text-lg font-semibold">
                        View e-Pass & QR Code
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Help Section */}
        <div className="mt-8 text-center text-base text-gray-600 space-y-3">
          <p>
            Can&apos;t find your arrival card?{" "}
            <Link href="/arrival-card/new" className="text-zim-green hover:underline font-semibold">
              Submit a new one
            </Link>
          </p>
          <p>
            Need help?{" "}
            <a href="mailto:immigration@moha.gov.zw" className="text-zim-green hover:underline font-semibold">
              Contact Immigration
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
