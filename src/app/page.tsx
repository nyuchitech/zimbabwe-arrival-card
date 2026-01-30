import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plane, FileText, Shield, Clock, CheckCircle, ArrowRight, Search, QrCode, Globe, AlertCircle } from "lucide-react";
import { SkipLink } from "@/components/skip-link";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <SkipLink />

      {/* Header */}
      <header className="bg-zim-green text-white" role="banner">
        <div className="container mx-auto px-4 py-5 flex items-center justify-center">
          <div className="flex items-center gap-4">
            <Image
              src="https://www.moha.gov.zw/images/logo.png"
              alt="Government of Zimbabwe Coat of Arms"
              width={56}
              height={56}
              className="h-14 w-auto"
              priority
            />
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Zimbabwe Arrival Card</h1>
              <p className="text-sm text-white/90">Department of Immigration</p>
            </div>
          </div>
        </div>
      </header>

      <main id="main-content" role="main">
        {/* Hero Section */}
        <section
          className="bg-gradient-to-br from-zim-green to-zim-green/80 text-white py-14 md:py-20"
          aria-labelledby="hero-heading"
        >
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 id="hero-heading" className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                Welcome to Zimbabwe
              </h2>
              <p className="text-xl md:text-2xl mb-10 text-white">
                Complete your arrival card online before entering Zimbabwe.
              </p>
              <div className="flex flex-col gap-4 max-w-md mx-auto">
                <Link href="/arrival-card/new" className="inline-block w-full">
                  <Button
                    size="lg"
                    className="bg-zim-yellow text-zim-black hover:bg-zim-yellow/90 min-h-[56px] text-lg md:text-xl px-8 py-4 w-full font-semibold shadow-lg"
                  >
                    Start Your Arrival Card
                    <ArrowRight className="ml-3 h-6 w-6" aria-hidden="true" />
                  </Button>
                </Link>
                <Link href="/arrival-card/lookup" className="inline-block w-full">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-white text-zim-green border-white hover:bg-white/90 min-h-[56px] text-lg md:text-xl px-8 py-4 w-full font-semibold"
                  >
                    <Search className="mr-3 h-6 w-6" aria-hidden="true" />
                    Check Status
                  </Button>
                </Link>
              </div>
              <p className="mt-8 text-base text-white/90 font-medium">
                Submit within 3 days before your arrival date
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          className="py-12 md:py-16 bg-gray-50"
          aria-labelledby="features-heading"
        >
          <div className="container mx-auto px-4">
            <h2 id="features-heading" className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 text-gray-900">
              Why Use the Online Arrival Card?
            </h2>
            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              <Card className="border-0 shadow-lg bg-white">
                <CardHeader className="p-6">
                  <div className="w-14 h-14 bg-zim-green rounded-full flex items-center justify-center mb-4">
                    <Clock className="h-7 w-7 text-white" aria-hidden="true" />
                  </div>
                  <CardTitle className="text-xl md:text-2xl text-gray-900">Save Time</CardTitle>
                  <CardDescription className="text-base md:text-lg text-gray-600 mt-2">
                    Complete your arrival card before you travel and breeze through immigration
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-0 shadow-lg bg-white">
                <CardHeader className="p-6">
                  <div className="w-14 h-14 bg-zim-yellow rounded-full flex items-center justify-center mb-4">
                    <Shield className="h-7 w-7 text-zim-black" aria-hidden="true" />
                  </div>
                  <CardTitle className="text-xl md:text-2xl text-gray-900">Secure & Safe</CardTitle>
                  <CardDescription className="text-base md:text-lg text-gray-600 mt-2">
                    Your information is encrypted and securely stored in compliance with data protection laws
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-0 shadow-lg bg-white">
                <CardHeader className="p-6">
                  <div className="w-14 h-14 bg-zim-green rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="h-7 w-7 text-white" aria-hidden="true" />
                  </div>
                  <CardTitle className="text-xl md:text-2xl text-gray-900">Easy Process</CardTitle>
                  <CardDescription className="text-base md:text-lg text-gray-600 mt-2">
                    Simple step-by-step form that guides you through all required information
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Important Notice - Singapore/Malaysia Style */}
        <section className="py-6 md:py-8 bg-amber-50 border-y-2 border-amber-300" aria-labelledby="notice-heading">
          <div className="container mx-auto px-4">
            <div className="flex items-start gap-4 max-w-4xl mx-auto">
              <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div>
                <h2 id="notice-heading" className="font-bold text-lg md:text-xl text-amber-900 mb-3">Important Information</h2>
                <ul className="text-base md:text-lg text-amber-800 space-y-2">
                  <li>• The Zimbabwe e-Arrival Card is <strong>free of charge</strong>. Beware of unofficial websites charging fees.</li>
                  <li>• Submit your arrival card within <strong>3 days before your arrival date</strong>.</li>
                  <li>• This e-Arrival Card is <strong>not a visa</strong>. Ensure you have the required visa if applicable.</li>
                  <li>• Present your QR code or reference number at immigration upon arrival.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section
          className="py-12 md:py-16 bg-white"
          aria-labelledby="how-it-works-heading"
        >
          <div className="container mx-auto px-4">
            <h2 id="how-it-works-heading" className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 text-gray-900">
              How It Works
            </h2>
            <ol className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8" role="list">
              {[
                { step: 1, icon: FileText, title: "Start", description: "Click 'Start Your Arrival Card' to begin" },
                { step: 2, icon: FileText, title: "Fill Form", description: "Complete all required information" },
                { step: 3, icon: QrCode, title: "Get QR Code", description: "Receive your e-Pass with QR code" },
                { step: 4, icon: Plane, title: "Travel", description: "Show QR code at immigration for fast clearance" },
              ].map((item) => (
                <li key={item.step} className="text-center">
                  <div
                    className="w-16 h-16 md:w-20 md:h-20 bg-zim-green rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                    aria-hidden="true"
                  >
                    <span className="text-2xl md:text-3xl font-bold text-white">{item.step}</span>
                  </div>
                  <h3 className="font-bold mb-2 text-lg md:text-xl text-gray-900">{item.title}</h3>
                  <p className="text-sm md:text-base text-gray-600">{item.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Requirements Section */}
        <section
          className="py-12 md:py-16 bg-zim-green"
          aria-labelledby="requirements-heading"
        >
          <div className="container mx-auto px-4">
            <h2 id="requirements-heading" className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 text-white">
              What You&apos;ll Need
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto" role="list">
              {["Valid passport", "Travel itinerary", "Accommodation details", "Contact information"].map(
                (item) => (
                  <li key={item}>
                    <Card className="bg-white border-0 h-full shadow-lg">
                      <CardContent className="p-5 md:p-6 flex items-center gap-4 min-h-[72px]">
                        <div className="w-10 h-10 bg-zim-green rounded-full flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="h-6 w-6 text-white" aria-hidden="true" />
                        </div>
                        <span className="text-base md:text-lg font-medium text-gray-900">{item}</span>
                      </CardContent>
                    </Card>
                  </li>
                )
              )}
            </ul>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-10 md:py-12" role="contentinfo">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div className="sm:col-span-2 md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <Image
                  src="https://www.moha.gov.zw/images/logo.png"
                  alt="Government of Zimbabwe Coat of Arms"
                  width={40}
                  height={40}
                  className="h-10 w-auto"
                />
                <span className="font-bold text-base md:text-lg text-gray-900">Zimbabwe Arrival Card</span>
              </div>
              <p className="text-base text-gray-600">
                Official Zimbabwe Immigration Arrival Card System
              </p>
            </div>
            <nav aria-label="Quick links">
              <h3 className="font-bold mb-4 text-lg text-gray-900">Quick Links</h3>
              <ul className="space-y-3 text-base text-gray-600">
                <li>
                  <Link
                    href="/arrival-card/new"
                    className="hover:text-zim-green focus:text-zim-green focus:outline-none focus:underline min-h-[48px] inline-flex items-center py-1"
                  >
                    Start Arrival Card
                  </Link>
                </li>
                <li>
                  <Link
                    href="/arrival-card/lookup"
                    className="hover:text-zim-green focus:text-zim-green focus:outline-none focus:underline min-h-[48px] inline-flex items-center py-1"
                  >
                    Check Status
                  </Link>
                </li>
                <li>
                  <Link
                    href="/accessibility"
                    className="hover:text-zim-green focus:text-zim-green focus:outline-none focus:underline min-h-[48px] inline-flex items-center py-1"
                  >
                    Accessibility
                  </Link>
                </li>
              </ul>
            </nav>
            <div>
              <h3 className="font-bold mb-4 text-lg text-gray-900">Contact</h3>
              <address className="not-italic space-y-2 text-base text-gray-600">
                <p>Department of Immigration</p>
                <p>Harare, Zimbabwe</p>
                <p>
                  <a
                    href="mailto:info@immigration.gov.zw"
                    className="hover:text-zim-green focus:text-zim-green focus:outline-none focus:underline min-h-[48px] inline-flex items-center py-1"
                  >
                    info@immigration.gov.zw
                  </a>
                </p>
              </address>
            </div>
            <nav aria-label="Legal links">
              <h3 className="font-bold mb-4 text-lg text-gray-900">Legal</h3>
              <ul className="space-y-3 text-base text-gray-600">
                <li>
                  <Link
                    href="/privacy-policy"
                    className="hover:text-zim-green focus:text-zim-green focus:outline-none focus:underline min-h-[48px] inline-flex items-center py-1"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="hover:text-zim-green focus:text-zim-green focus:outline-none focus:underline min-h-[48px] inline-flex items-center py-1"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          <div className="border-t border-gray-300 mt-8 pt-8 text-center text-base text-gray-600">
            <p>&copy; {new Date().getFullYear()} Republic of Zimbabwe. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
