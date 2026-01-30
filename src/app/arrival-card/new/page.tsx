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
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input id="firstName" {...register("firstName")} />
                {errors.firstName && (
                  <p className="text-sm text-red-500">{errors.firstName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="middleName">Middle Name</Label>
                <Input id="middleName" {...register("middleName")} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input id="lastName" {...register("lastName")} />
              {errors.lastName && (
                <p className="text-sm text-red-500">{errors.lastName.message}</p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input id="dateOfBirth" type="date" {...register("dateOfBirth")} />
                {errors.dateOfBirth && (
                  <p className="text-sm text-red-500">{errors.dateOfBirth.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <Select onValueChange={(value) => setValue("gender", value as "MALE" | "FEMALE" | "OTHER")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <p className="text-sm text-red-500">{errors.gender.message}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nationality">Nationality *</Label>
                <Select onValueChange={(value) => setValue("nationality", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select nationality" />
                  </SelectTrigger>
                  <SelectContent>
                    {NATIONALITIES.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.nationality && (
                  <p className="text-sm text-red-500">{errors.nationality.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="countryOfResidence">Country of Residence *</Label>
                <Select onValueChange={(value) => setValue("countryOfResidence", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.countryOfResidence && (
                  <p className="text-sm text-red-500">{errors.countryOfResidence.message}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="occupation">Occupation</Label>
              <Input id="occupation" {...register("occupation")} />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="passportNumber">Passport Number *</Label>
              <Input id="passportNumber" {...register("passportNumber")} />
              {errors.passportNumber && (
                <p className="text-sm text-red-500">{errors.passportNumber.message}</p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="passportIssueDate">Issue Date *</Label>
                <Input id="passportIssueDate" type="date" {...register("passportIssueDate")} />
                {errors.passportIssueDate && (
                  <p className="text-sm text-red-500">{errors.passportIssueDate.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="passportExpiryDate">Expiry Date *</Label>
                <Input id="passportExpiryDate" type="date" {...register("passportExpiryDate")} />
                {errors.passportExpiryDate && (
                  <p className="text-sm text-red-500">{errors.passportExpiryDate.message}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="passportIssuingCountry">Issuing Country *</Label>
              <Select onValueChange={(value) => setValue("passportIssuingCountry", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.passportIssuingCountry && (
                <p className="text-sm text-red-500">{errors.passportIssuingCountry.message}</p>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number *</Label>
              <Input id="phoneNumber" type="tel" {...register("phoneNumber")} />
              {errors.phoneNumber && (
                <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>
              )}
            </div>
            <Separator className="my-4" />
            <p className="text-sm text-muted-foreground">Emergency Contact (Optional)</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyContactName">Emergency Contact Name</Label>
                <Input id="emergencyContactName" {...register("emergencyContactName")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyContactPhone">Emergency Contact Phone</Label>
                <Input id="emergencyContactPhone" type="tel" {...register("emergencyContactPhone")} />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="purposeOfVisit">Purpose of Visit *</Label>
              <Select onValueChange={(value) => setValue("purposeOfVisit", value as ArrivalCardInput["purposeOfVisit"])}>
                <SelectTrigger>
                  <SelectValue placeholder="Select purpose" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TOURISM">Tourism</SelectItem>
                  <SelectItem value="BUSINESS">Business</SelectItem>
                  <SelectItem value="EMPLOYMENT">Employment</SelectItem>
                  <SelectItem value="STUDY">Study</SelectItem>
                  <SelectItem value="MEDICAL">Medical</SelectItem>
                  <SelectItem value="TRANSIT">Transit</SelectItem>
                  <SelectItem value="RETURNING_RESIDENT">Returning Resident</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.purposeOfVisit && (
                <p className="text-sm text-red-500">{errors.purposeOfVisit.message}</p>
              )}
            </div>
            {watchPurposeOfVisit === "OTHER" && (
              <div className="space-y-2">
                <Label htmlFor="purposeOther">Please specify *</Label>
                <Input id="purposeOther" {...register("purposeOther")} />
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="arrivalDate">Arrival Date *</Label>
                <Input id="arrivalDate" type="date" {...register("arrivalDate")} />
                {errors.arrivalDate && (
                  <p className="text-sm text-red-500">{errors.arrivalDate.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="departureDate">Departure Date</Label>
                <Input id="departureDate" type="date" {...register("departureDate")} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="intendedStayDuration">Intended Stay Duration (Days) *</Label>
              <Input
                id="intendedStayDuration"
                type="number"
                min="1"
                {...register("intendedStayDuration", { valueAsNumber: true })}
              />
              {errors.intendedStayDuration && (
                <p className="text-sm text-red-500">{errors.intendedStayDuration.message}</p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="flightNumber">Flight Number</Label>
                <Input id="flightNumber" {...register("flightNumber")} placeholder="e.g., SA123" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vesselName">Vessel/Vehicle Name</Label>
                <Input id="vesselName" {...register("vesselName")} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="previousCountry">Last Country Before Zimbabwe *</Label>
              <Select onValueChange={(value) => setValue("previousCountry", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.previousCountry && (
                <p className="text-sm text-red-500">{errors.previousCountry.message}</p>
              )}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="accommodationType">Accommodation Type *</Label>
              <Select onValueChange={(value) => setValue("accommodationType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {ACCOMMODATION_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.accommodationType && (
                <p className="text-sm text-red-500">{errors.accommodationType.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="accommodationName">Accommodation Name *</Label>
              <Input id="accommodationName" {...register("accommodationName")} placeholder="e.g., Victoria Falls Hotel" />
              {errors.accommodationName && (
                <p className="text-sm text-red-500">{errors.accommodationName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="accommodationAddress">Address *</Label>
              <Textarea id="accommodationAddress" {...register("accommodationAddress")} />
              {errors.accommodationAddress && (
                <p className="text-sm text-red-500">{errors.accommodationAddress.message}</p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="accommodationCity">City *</Label>
                <Input id="accommodationCity" {...register("accommodationCity")} />
                {errors.accommodationCity && (
                  <p className="text-sm text-red-500">{errors.accommodationCity.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="accommodationPhone">Phone Number</Label>
                <Input id="accommodationPhone" type="tel" {...register("accommodationPhone")} />
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Customs Declaration</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="carryingCurrency"
                    {...register("carryingCurrency")}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="carryingCurrency">
                    I am carrying currency or monetary instruments exceeding USD 10,000
                  </Label>
                </div>
                {watchCarryingCurrency && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
                    <div className="space-y-2">
                      <Label htmlFor="currencyAmount">Amount</Label>
                      <Input
                        id="currencyAmount"
                        type="number"
                        {...register("currencyAmount", { valueAsNumber: true })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currencyType">Currency Type</Label>
                      <Input id="currencyType" {...register("currencyType")} placeholder="e.g., USD" />
                    </div>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="carryingGoods"
                    {...register("carryingGoods")}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="carryingGoods">
                    I am carrying goods for commercial purposes or exceeding personal allowance
                  </Label>
                </div>
                {watchCarryingGoods && (
                  <div className="space-y-4 ml-6">
                    <div className="space-y-2">
                      <Label htmlFor="goodsDescription">Description of Goods</Label>
                      <Textarea id="goodsDescription" {...register("goodsDescription")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="goodsValue">Estimated Value (USD)</Label>
                      <Input
                        id="goodsValue"
                        type="number"
                        {...register("goodsValue", { valueAsNumber: true })}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-semibold">Health Declaration</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="healthDeclaration"
                    {...register("healthDeclaration")}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="healthDeclaration">
                    I confirm I am in good health and fit to travel
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="recentIllness"
                    {...register("recentIllness")}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="recentIllness">
                    I have experienced illness symptoms in the past 14 days
                  </Label>
                </div>
                {watchRecentIllness && (
                  <div className="space-y-2 ml-6">
                    <Label htmlFor="illnessDescription">Please describe your symptoms</Label>
                    <Textarea id="illnessDescription" {...register("illnessDescription")} />
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-2">Declaration</h3>
              <p className="text-sm text-yellow-700">
                I declare that all information provided is true and correct to the best of my
                knowledge. I understand that providing false information may result in denial of
                entry, prosecution, or other legal consequences.
              </p>
            </div>

            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="declarationAccepted"
                {...register("declarationAccepted")}
                className="h-4 w-4 rounded border-gray-300 mt-1"
              />
              <Label htmlFor="declarationAccepted" className="text-sm">
                I have read and understood the above declaration. I certify that the information
                provided is accurate and complete. I understand that any false or misleading
                information may result in refusal of entry into Zimbabwe.
              </Label>
            </div>
            {errors.declarationAccepted && (
              <p className="text-sm text-red-500">{errors.declarationAccepted.message}</p>
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
      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Zimbabwe Arrival Card</CardTitle>
            <CardDescription>
              Complete all sections to submit your arrival card
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex justify-between">
                {STEPS.map((step) => (
                  <div
                    key={step.id}
                    className={`flex flex-col items-center ${
                      step.id <= currentStep ? "text-zim-green" : "text-gray-400"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        step.id < currentStep
                          ? "bg-zim-green text-white"
                          : step.id === currentStep
                          ? "bg-zim-green text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {step.id < currentStep ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        step.id
                      )}
                    </div>
                    <span className="text-xs mt-1 hidden md:block">{step.title}</span>
                  </div>
                ))}
              </div>
              <div className="mt-2 h-2 bg-gray-200 rounded-full">
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
              <h2 className="text-xl font-semibold">{STEPS[currentStep - 1].title}</h2>
              <p className="text-sm text-muted-foreground">
                {STEPS[currentStep - 1].description}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}

            {/* Form Content */}
            <form onSubmit={handleSubmit(onSubmit)}>
              {renderStepContent()}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>

                {currentStep < STEPS.length ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="bg-zim-green hover:bg-zim-green/90"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="bg-zim-green hover:bg-zim-green/90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
