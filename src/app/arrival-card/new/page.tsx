"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ChevronLeft, ChevronRight, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { arrivalCardSchema, type ArrivalCardInput } from "@/lib/validations/arrival-card";
import { NavHeader } from "@/components/dashboard/nav-header";

const STEPS = [
  { id: 1, title: "Personal Information", description: "Your personal details" },
  { id: 2, title: "Passport Information", description: "Your passport details" },
  { id: 3, title: "Contact Information", description: "How to reach you" },
  { id: 4, title: "Travel Information", description: "Your travel plans" },
  { id: 5, title: "Accommodation", description: "Where you'll stay" },
  { id: 6, title: "Declarations", description: "Customs and health" },
  { id: 7, title: "Review & Submit", description: "Confirm your details" },
];

const COUNTRIES = [
  "South Africa", "Botswana", "Zambia", "Mozambique", "Malawi", "Tanzania",
  "Kenya", "Uganda", "Rwanda", "Ethiopia", "Egypt", "Morocco", "Nigeria",
  "Ghana", "United Kingdom", "United States", "Canada", "Australia",
  "Germany", "France", "China", "India", "Japan", "Brazil", "Other",
];

const NATIONALITIES = COUNTRIES;

const ACCOMMODATION_TYPES = [
  { value: "HOTEL", label: "Hotel" },
  { value: "LODGE", label: "Lodge" },
  { value: "GUESTHOUSE", label: "Guest House" },
  { value: "AIRBNB", label: "Airbnb / Vacation Rental" },
  { value: "RESIDENCE", label: "Private Residence" },
  { value: "HOSTEL", label: "Hostel" },
  { value: "CAMPING", label: "Camping" },
  { value: "OTHER", label: "Other" },
];

export default function NewArrivalCardPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<ArrivalCardInput>({
    resolver: zodResolver(arrivalCardSchema),
    defaultValues: {
      carryingCurrency: false,
      carryingGoods: false,
      healthDeclaration: false,
      recentIllness: false,
      declarationAccepted: false,
      intendedStayDuration: 1,
    },
  });

  const watchCarryingCurrency = watch("carryingCurrency");
  const watchCarryingGoods = watch("carryingGoods");
  const watchRecentIllness = watch("recentIllness");
  const watchPurposeOfVisit = watch("purposeOfVisit");

  const validateStep = async (step: number): Promise<boolean> => {
    const fieldsToValidate: Record<number, (keyof ArrivalCardInput)[]> = {
      1: ["firstName", "lastName", "dateOfBirth", "gender", "nationality", "countryOfResidence"],
      2: ["passportNumber", "passportIssueDate", "passportExpiryDate", "passportIssuingCountry"],
      3: ["email", "phoneNumber"],
      4: ["purposeOfVisit", "intendedStayDuration", "arrivalDate", "previousCountry"],
      5: ["accommodationType", "accommodationName", "accommodationAddress", "accommodationCity"],
      6: ["carryingCurrency", "carryingGoods", "healthDeclaration", "recentIllness"],
      7: ["declarationAccepted"],
    };

    const fields = fieldsToValidate[step];
    if (!fields) return true;

    const result = await trigger(fields);
    return result;
  };

  const nextStep = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid && currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: ArrivalCardInput) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/arrival-card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Failed to submit arrival card");
        return;
      }

      router.push(`/arrival-card/${result.id}/success`);
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-base font-semibold text-gray-900">First Name *</Label>
                <Input id="firstName" {...register("firstName")} className="h-12 text-base" />
                {errors.firstName && (
                  <p className="text-base text-red-600 font-medium">{errors.firstName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="middleName" className="text-base font-semibold text-gray-900">Middle Name</Label>
                <Input id="middleName" {...register("middleName")} className="h-12 text-base" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-base font-semibold text-gray-900">Last Name *</Label>
              <Input id="lastName" {...register("lastName")} className="h-12 text-base" />
              {errors.lastName && (
                <p className="text-base text-red-600 font-medium">{errors.lastName.message}</p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth" className="text-base font-semibold text-gray-900">Date of Birth *</Label>
                <Input id="dateOfBirth" type="date" {...register("dateOfBirth")} className="h-12 text-base" />
                {errors.dateOfBirth && (
                  <p className="text-base text-red-600 font-medium">{errors.dateOfBirth.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender" className="text-base font-semibold text-gray-900">Gender *</Label>
                <Select onValueChange={(value) => setValue("gender", value as "MALE" | "FEMALE" | "OTHER")}>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE" className="text-base py-3">Male</SelectItem>
                    <SelectItem value="FEMALE" className="text-base py-3">Female</SelectItem>
                    <SelectItem value="OTHER" className="text-base py-3">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <p className="text-base text-red-600 font-medium">{errors.gender.message}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="nationality" className="text-base font-semibold text-gray-900">Nationality *</Label>
                <Select onValueChange={(value) => setValue("nationality", value)}>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Select nationality" />
                  </SelectTrigger>
                  <SelectContent>
                    {NATIONALITIES.map((country) => (
                      <SelectItem key={country} value={country} className="text-base py-3">
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.nationality && (
                  <p className="text-base text-red-600 font-medium">{errors.nationality.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="countryOfResidence" className="text-base font-semibold text-gray-900">Country of Residence *</Label>
                <Select onValueChange={(value) => setValue("countryOfResidence", value)}>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((country) => (
                      <SelectItem key={country} value={country} className="text-base py-3">
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.countryOfResidence && (
                  <p className="text-base text-red-600 font-medium">{errors.countryOfResidence.message}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="occupation" className="text-base font-semibold text-gray-900">Occupation</Label>
              <Input id="occupation" {...register("occupation")} className="h-12 text-base" />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="passportNumber" className="text-base font-semibold text-gray-900">Passport Number *</Label>
              <Input id="passportNumber" {...register("passportNumber")} className="h-12 text-base" />
              {errors.passportNumber && (
                <p className="text-base text-red-600 font-medium">{errors.passportNumber.message}</p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="passportIssueDate" className="text-base font-semibold text-gray-900">Issue Date *</Label>
                <Input id="passportIssueDate" type="date" {...register("passportIssueDate")} className="h-12 text-base" />
                {errors.passportIssueDate && (
                  <p className="text-base text-red-600 font-medium">{errors.passportIssueDate.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="passportExpiryDate" className="text-base font-semibold text-gray-900">Expiry Date *</Label>
                <Input id="passportExpiryDate" type="date" {...register("passportExpiryDate")} className="h-12 text-base" />
                {errors.passportExpiryDate && (
                  <p className="text-base text-red-600 font-medium">{errors.passportExpiryDate.message}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="passportIssuingCountry" className="text-base font-semibold text-gray-900">Issuing Country *</Label>
              <Select onValueChange={(value) => setValue("passportIssuingCountry", value)}>
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((country) => (
                    <SelectItem key={country} value={country} className="text-base py-3">
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.passportIssuingCountry && (
                <p className="text-base text-red-600 font-medium">{errors.passportIssuingCountry.message}</p>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-base font-semibold text-gray-900">Email Address *</Label>
              <Input id="email" type="email" {...register("email")} className="h-12 text-base" />
              {errors.email && (
                <p className="text-base text-red-600 font-medium">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-base font-semibold text-gray-900">Phone Number *</Label>
              <Input id="phoneNumber" type="tel" {...register("phoneNumber")} className="h-12 text-base" />
              {errors.phoneNumber && (
                <p className="text-base text-red-600 font-medium">{errors.phoneNumber.message}</p>
              )}
            </div>
            <Separator className="my-6" />
            <p className="text-base font-medium text-gray-700">Emergency Contact (Optional)</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="emergencyContactName" className="text-base font-semibold text-gray-900">Emergency Contact Name</Label>
                <Input id="emergencyContactName" {...register("emergencyContactName")} className="h-12 text-base" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyContactPhone" className="text-base font-semibold text-gray-900">Emergency Contact Phone</Label>
                <Input id="emergencyContactPhone" type="tel" {...register("emergencyContactPhone")} className="h-12 text-base" />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="purposeOfVisit" className="text-base font-semibold text-gray-900">Purpose of Visit *</Label>
              <Select onValueChange={(value) => setValue("purposeOfVisit", value as ArrivalCardInput["purposeOfVisit"])}>
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder="Select purpose" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TOURISM" className="text-base py-3">Tourism</SelectItem>
                  <SelectItem value="BUSINESS" className="text-base py-3">Business</SelectItem>
                  <SelectItem value="EMPLOYMENT" className="text-base py-3">Employment</SelectItem>
                  <SelectItem value="STUDY" className="text-base py-3">Study</SelectItem>
                  <SelectItem value="MEDICAL" className="text-base py-3">Medical</SelectItem>
                  <SelectItem value="TRANSIT" className="text-base py-3">Transit</SelectItem>
                  <SelectItem value="RETURNING_RESIDENT" className="text-base py-3">Returning Resident</SelectItem>
                  <SelectItem value="OTHER" className="text-base py-3">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.purposeOfVisit && (
                <p className="text-base text-red-600 font-medium">{errors.purposeOfVisit.message}</p>
              )}
            </div>
            {watchPurposeOfVisit === "OTHER" && (
              <div className="space-y-2">
                <Label htmlFor="purposeOther" className="text-base font-semibold text-gray-900">Please specify *</Label>
                <Input id="purposeOther" {...register("purposeOther")} className="h-12 text-base" />
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="arrivalDate" className="text-base font-semibold text-gray-900">Arrival Date *</Label>
                <Input id="arrivalDate" type="date" {...register("arrivalDate")} className="h-12 text-base" />
                {errors.arrivalDate && (
                  <p className="text-base text-red-600 font-medium">{errors.arrivalDate.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="departureDate" className="text-base font-semibold text-gray-900">Departure Date</Label>
                <Input id="departureDate" type="date" {...register("departureDate")} className="h-12 text-base" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="intendedStayDuration" className="text-base font-semibold text-gray-900">Intended Stay Duration (Days) *</Label>
              <Input
                id="intendedStayDuration"
                type="number"
                min="1"
                {...register("intendedStayDuration", { valueAsNumber: true })}
                className="h-12 text-base"
              />
              {errors.intendedStayDuration && (
                <p className="text-base text-red-600 font-medium">{errors.intendedStayDuration.message}</p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="flightNumber" className="text-base font-semibold text-gray-900">Flight Number</Label>
                <Input id="flightNumber" {...register("flightNumber")} placeholder="e.g., SA123" className="h-12 text-base" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vesselName" className="text-base font-semibold text-gray-900">Vessel/Vehicle Name</Label>
                <Input id="vesselName" {...register("vesselName")} className="h-12 text-base" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="previousCountry" className="text-base font-semibold text-gray-900">Last Country Before Zimbabwe *</Label>
              <Select onValueChange={(value) => setValue("previousCountry", value)}>
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((country) => (
                    <SelectItem key={country} value={country} className="text-base py-3">
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.previousCountry && (
                <p className="text-base text-red-600 font-medium">{errors.previousCountry.message}</p>
              )}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="accommodationType" className="text-base font-semibold text-gray-900">Accommodation Type *</Label>
              <Select onValueChange={(value) => setValue("accommodationType", value)}>
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {ACCOMMODATION_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value} className="text-base py-3">
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.accommodationType && (
                <p className="text-base text-red-600 font-medium">{errors.accommodationType.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="accommodationName" className="text-base font-semibold text-gray-900">Accommodation Name *</Label>
              <Input id="accommodationName" {...register("accommodationName")} placeholder="e.g., Victoria Falls Hotel" className="h-12 text-base" />
              {errors.accommodationName && (
                <p className="text-base text-red-600 font-medium">{errors.accommodationName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="accommodationAddress" className="text-base font-semibold text-gray-900">Address *</Label>
              <Textarea id="accommodationAddress" {...register("accommodationAddress")} className="text-base min-h-[100px]" />
              {errors.accommodationAddress && (
                <p className="text-base text-red-600 font-medium">{errors.accommodationAddress.message}</p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="accommodationCity" className="text-base font-semibold text-gray-900">City *</Label>
                <Input id="accommodationCity" {...register("accommodationCity")} className="h-12 text-base" />
                {errors.accommodationCity && (
                  <p className="text-base text-red-600 font-medium">{errors.accommodationCity.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="accommodationPhone" className="text-base font-semibold text-gray-900">Phone Number</Label>
                <Input id="accommodationPhone" type="tel" {...register("accommodationPhone")} className="h-12 text-base" />
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-8">
            <div className="space-y-5">
              <h3 className="text-lg font-bold text-gray-900">Customs Declaration</h3>
              <div className="space-y-5">
                <label htmlFor="carryingCurrency" className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    id="carryingCurrency"
                    {...register("carryingCurrency")}
                    className="h-6 w-6 rounded border-2 border-gray-400 mt-0.5 flex-shrink-0"
                  />
                  <span className="text-base text-gray-900">
                    I am carrying currency or monetary instruments exceeding USD 10,000
                  </span>
                </label>
                {watchCarryingCurrency && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 ml-4 pl-6 border-l-4 border-zim-green">
                    <div className="space-y-2">
                      <Label htmlFor="currencyAmount" className="text-base font-semibold text-gray-900">Amount</Label>
                      <Input
                        id="currencyAmount"
                        type="number"
                        {...register("currencyAmount", { valueAsNumber: true })}
                        className="h-12 text-base"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currencyType" className="text-base font-semibold text-gray-900">Currency Type</Label>
                      <Input id="currencyType" {...register("currencyType")} placeholder="e.g., USD" className="h-12 text-base" />
                    </div>
                  </div>
                )}
                <label htmlFor="carryingGoods" className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    id="carryingGoods"
                    {...register("carryingGoods")}
                    className="h-6 w-6 rounded border-2 border-gray-400 mt-0.5 flex-shrink-0"
                  />
                  <span className="text-base text-gray-900">
                    I am carrying goods for commercial purposes or exceeding personal allowance
                  </span>
                </label>
                {watchCarryingGoods && (
                  <div className="space-y-5 ml-4 pl-6 border-l-4 border-zim-green">
                    <div className="space-y-2">
                      <Label htmlFor="goodsDescription" className="text-base font-semibold text-gray-900">Description of Goods</Label>
                      <Textarea id="goodsDescription" {...register("goodsDescription")} className="text-base min-h-[100px]" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="goodsValue" className="text-base font-semibold text-gray-900">Estimated Value (USD)</Label>
                      <Input
                        id="goodsValue"
                        type="number"
                        {...register("goodsValue", { valueAsNumber: true })}
                        className="h-12 text-base"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            <div className="space-y-5">
              <h3 className="text-lg font-bold text-gray-900">Health Declaration</h3>
              <div className="space-y-5">
                <label htmlFor="healthDeclaration" className="flex items-start gap-4 p-4 bg-green-50 rounded-lg cursor-pointer hover:bg-green-100 transition-colors">
                  <input
                    type="checkbox"
                    id="healthDeclaration"
                    {...register("healthDeclaration")}
                    className="h-6 w-6 rounded border-2 border-gray-400 mt-0.5 flex-shrink-0"
                  />
                  <span className="text-base text-gray-900">
                    I confirm I am in good health and fit to travel
                  </span>
                </label>
                <label htmlFor="recentIllness" className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    id="recentIllness"
                    {...register("recentIllness")}
                    className="h-6 w-6 rounded border-2 border-gray-400 mt-0.5 flex-shrink-0"
                  />
                  <span className="text-base text-gray-900">
                    I have experienced illness symptoms in the past 14 days
                  </span>
                </label>
                {watchRecentIllness && (
                  <div className="space-y-2 ml-4 pl-6 border-l-4 border-amber-500">
                    <Label htmlFor="illnessDescription" className="text-base font-semibold text-gray-900">Please describe your symptoms</Label>
                    <Textarea id="illnessDescription" {...register("illnessDescription")} className="text-base min-h-[100px]" />
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-5">
              <h3 className="text-lg font-bold text-amber-900 mb-3">Declaration</h3>
              <p className="text-base text-amber-800 leading-relaxed">
                I declare that all information provided is true and correct to the best of my
                knowledge. I understand that providing false information may result in denial of
                entry, prosecution, or other legal consequences.
              </p>
            </div>

            <label htmlFor="declarationAccepted" className="flex items-start gap-4 p-5 bg-green-50 border-2 border-green-200 rounded-lg cursor-pointer hover:bg-green-100 transition-colors">
              <input
                type="checkbox"
                id="declarationAccepted"
                {...register("declarationAccepted")}
                className="h-7 w-7 rounded border-2 border-gray-400 mt-0.5 flex-shrink-0"
              />
              <span className="text-base text-gray-900 leading-relaxed">
                I have read and understood the above declaration. I certify that the information
                provided is accurate and complete. I understand that any false or misleading
                information may result in refusal of entry into Zimbabwe.
              </span>
            </label>
            {errors.declarationAccepted && (
              <p className="text-base text-red-600 font-medium">{errors.declarationAccepted.message}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavHeader />
      <main className="container mx-auto px-4 py-6 md:py-8">
        <Card className="max-w-3xl mx-auto shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl md:text-3xl text-gray-900">Zimbabwe Arrival Card</CardTitle>
            <CardDescription className="text-base text-gray-600">
              Complete all sections to submit your arrival card
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Progress Steps - Mobile optimized */}
            <div className="mb-8">
              {/* Mobile: Show current step info */}
              <div className="md:hidden mb-4 text-center">
                <span className="text-lg font-semibold text-zim-green">
                  Step {currentStep} of {STEPS.length}
                </span>
              </div>
              {/* Desktop: Show all steps */}
              <div className="hidden md:flex justify-between">
                {STEPS.map((step) => (
                  <div
                    key={step.id}
                    className={`flex flex-col items-center ${
                      step.id <= currentStep ? "text-zim-green" : "text-gray-400"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-bold ${
                        step.id < currentStep
                          ? "bg-zim-green text-white"
                          : step.id === currentStep
                          ? "bg-zim-green text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {step.id < currentStep ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        step.id
                      )}
                    </div>
                    <span className="text-sm mt-2 font-medium">{step.title}</span>
                  </div>
                ))}
              </div>
              {/* Progress bar */}
              <div className="mt-4 h-3 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-zim-green rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Step Title */}
            <div className="mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">{STEPS[currentStep - 1].title}</h2>
              <p className="text-base text-gray-600 mt-1">
                {STEPS[currentStep - 1].description}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 text-base text-red-700 bg-red-50 border-2 border-red-300 rounded-lg font-medium">
                {error}
              </div>
            )}

            {/* Form Content */}
            <form onSubmit={handleSubmit(onSubmit)}>
              {renderStepContent()}

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row justify-between gap-4 mt-10">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="h-14 px-6 text-base font-semibold order-2 sm:order-1"
                >
                  <ChevronLeft className="h-5 w-5 mr-2" />
                  Previous
                </Button>

                {currentStep < STEPS.length ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="bg-zim-green hover:bg-zim-green/90 h-14 px-8 text-base font-semibold order-1 sm:order-2"
                  >
                    Next Step
                    <ChevronRight className="h-5 w-5 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="bg-zim-green hover:bg-zim-green/90 h-14 px-8 text-base font-semibold order-1 sm:order-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                    Submit Arrival Card
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
