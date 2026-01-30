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
import { Plane, FileText, Shield, Clock, CheckCircle, ArrowRight } from "lucide-react";
import { SkipLink } from "@/components/skip-link";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <SkipLink />

      {/* Header */}
      <header className="bg-zim-green text-white" role="banner">
        <div className="container mx-auto px-4 py-4 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <Image
              src="https://www.moha.gov.zw/images/logo.png"
              alt="Government of Zimbabwe Coat of Arms"
              width={48}
              height={48}
              className="h-12 w-auto"
              priority
            />
            <div>
              <h1 className="text-lg font-bold">Zimbabwe Arrival Card</h1>
              <p className="text-xs text-white/80">Department of Immigration</p>
            </div>
          </div>
        </div>
      </header>

      <main id="main-content" role="main">
        {/* Hero Section */}
        <section
          className="bg-gradient-to-br from-zim-green to-zim-green/80 text-white py-12 md:py-20"
          aria-labelledby="hero-heading"
        >
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 id="hero-heading" className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                Welcome to Zimbabwe
              </h2>
              <p className="text-lg md:text-xl mb-8 text-white/90">
                Complete your arrival card online before entering Zimbabwe. Fast, secure, and convenient.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/arrival-card/new" className="inline-block">
                  <Button
                    size="lg"
                    className="bg-zim-yellow text-zim-black hover:bg-zim-yellow/90 min-h-[48px] min-w-[48px] text-base md:text-lg px-6 py-3 w-full sm:w-auto"
                  >
                    Start Your Arrival Card
                    <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          className="py-12 md:py-16 bg-gray-50"
          aria-labelledby="features-heading"
        >
          <div className="container mx-auto px-4">
            <h2 id="features-heading" className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">
              Why Use the Online Arrival Card?
            </h2>
            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              <Card className="border-t-4 border-t-zim-green">
                <CardHeader>
                  <Clock className="h-10 w-10 md:h-12 md:w-12 text-zim-green mb-4" aria-hidden="true" />
                  <CardTitle className="text-lg md:text-xl">Save Time</CardTitle>
                  <CardDescription className="text-sm md:text-base">
                    Complete your arrival card before you travel and breeze through immigration
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-t-4 border-t-zim-yellow">
                <CardHeader>
                  <Shield className="h-10 w-10 md:h-12 md:w-12 text-zim-yellow mb-4" aria-hidden="true" />
                  <CardTitle className="text-lg md:text-xl">Secure & Safe</CardTitle>
                  <CardDescription className="text-sm md:text-base">
                    Your information is encrypted and securely stored in compliance with data protection laws
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-t-4 border-t-zim-green">
                <CardHeader>
                  <CheckCircle className="h-10 w-10 md:h-12 md:w-12 text-zim-green mb-4" aria-hidden="true" />
                  <CardTitle className="text-lg md:text-xl">Easy Process</CardTitle>
                  <CardDescription className="text-sm md:text-base">
                    Simple step-by-step form that guides you through all required information
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section
          className="py-12 md:py-16"
          aria-labelledby="how-it-works-heading"
        >
          <div className="container mx-auto px-4">
            <h2 id="how-it-works-heading" className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">
              How It Works
            </h2>
            <ol className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8" role="list">
              {[
                { step: 1, icon: FileText, title: "Start", description: "Click 'Start Your Arrival Card' to begin" },
                { step: 2, icon: FileText, title: "Fill Form", description: "Complete all required information" },
                { step: 3, icon: CheckCircle, title: "Submit", description: "Review and submit your arrival card" },
                { step: 4, icon: Plane, title: "Travel", description: "Present your reference number at immigration" },
              ].map((item) => (
                <li key={item.step} className="text-center">
                  <div
                    className="w-14 h-14 md:w-16 md:h-16 bg-zim-green/10 rounded-full flex items-center justify-center mx-auto mb-4"
                    aria-hidden="true"
                  >
                    <span className="text-xl md:text-2xl font-bold text-zim-green">{item.step}</span>
                  </div>
                  <h3 className="font-semibold mb-2 text-base md:text-lg">{item.title}</h3>
                  <p className="text-xs md:text-sm text-muted-foreground">{item.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Requirements Section */}
        <section
          className="py-12 md:py-16 bg-zim-black text-white"
          aria-labelledby="requirements-heading"
        >
          <div className="container mx-auto px-4">
            <h2 id="requirements-heading" className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">
              What You&apos;ll Need
            </h2>
            <ul className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto" role="list">
              {["Valid passport", "Travel itinerary", "Accommodation details", "Contact information"].map(
                (item) => (
                  <li key={item}>
                    <Card className="bg-white/10 border-white/20 h-full">
                      <CardContent className="p-4 flex items-center gap-3 min-h-[48px]">
                        <CheckCircle className="h-5 w-5 text-zim-yellow flex-shrink-0" aria-hidden="true" />
                        <span className="text-sm md:text-base">{item}</span>
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
      <footer className="bg-gray-100 py-8 md:py-12" role="contentinfo">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <Image
                  src="https://www.moha.gov.zw/images/logo.png"
                  alt="Government of Zimbabwe Coat of Arms"
                  width={32}
                  height={32}
                  className="h-8 w-auto"
                />
                <span className="font-bold text-sm md:text-base">Zimbabwe Arrival Card</span>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground">
                Official Zimbabwe Immigration Arrival Card System
              </p>
            </div>
            <nav aria-label="Quick links">
              <h3 className="font-semibold mb-4 text-sm md:text-base">Quick Links</h3>
              <ul className="space-y-3 text-xs md:text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/arrival-card/new"
                    className="hover:text-zim-green focus:text-zim-green focus:outline-none focus:underline min-h-[44px] inline-flex items-center"
                  >
                    Start Arrival Card
                  </Link>
                </li>
                <li>
                  <Link
                    href="/accessibility"
                    className="hover:text-zim-green focus:text-zim-green focus:outline-none focus:underline min-h-[44px] inline-flex items-center"
                  >
                    Accessibility
                  </Link>
                </li>
              </ul>
            </nav>
            <div>
              <h3 className="font-semibold mb-4 text-sm md:text-base">Contact</h3>
              <address className="not-italic space-y-1 text-xs md:text-sm text-muted-foreground">
                <p>Department of Immigration</p>
                <p>Harare, Zimbabwe</p>
                <p>
                  <a
                    href="mailto:info@immigration.gov.zw"
                    className="hover:text-zim-green focus:text-zim-green focus:outline-none focus:underline"
                  >
                    info@immigration.gov.zw
                  </a>
                </p>
              </address>
            </div>
            <nav aria-label="Legal links">
              <h3 className="font-semibold mb-4 text-sm md:text-base">Legal</h3>
              <ul className="space-y-3 text-xs md:text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/privacy-policy"
                    className="hover:text-zim-green focus:text-zim-green focus:outline-none focus:underline min-h-[44px] inline-flex items-center"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="hover:text-zim-green focus:text-zim-green focus:outline-none focus:underline min-h-[44px] inline-flex items-center"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-xs md:text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Republic of Zimbabwe. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
