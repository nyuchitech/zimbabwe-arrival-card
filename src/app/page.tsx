import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plane, FileText, Shield, Clock, CheckCircle, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-zim-green text-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-zim-green text-lg font-bold">ZW</span>
            </div>
            <div>
              <h1 className="text-lg font-bold">Zimbabwe Arrival Card</h1>
              <p className="text-xs text-white/80">Department of Immigration</p>
            </div>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost" className="text-white hover:text-white hover:bg-white/10">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button className="bg-zim-yellow text-zim-black hover:bg-zim-yellow/90">
                Register
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-zim-green to-zim-green/80 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Welcome to Zimbabwe</h2>
            <p className="text-xl mb-8 text-white/90">
              Complete your arrival card online before entering Zimbabwe. Fast, secure, and convenient.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <Button size="lg" className="bg-zim-yellow text-zim-black hover:bg-zim-yellow/90">
                  Start Your Arrival Card
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white bg-transparent hover:bg-white/10"
                >
                  Continue Existing Application
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">Why Use the Online Arrival Card?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-t-4 border-t-zim-green">
              <CardHeader>
                <Clock className="h-12 w-12 text-zim-green mb-4" />
                <CardTitle>Save Time</CardTitle>
                <CardDescription>
                  Complete your arrival card before you travel and breeze through immigration
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-t-4 border-t-zim-yellow">
              <CardHeader>
                <Shield className="h-12 w-12 text-zim-yellow mb-4" />
                <CardTitle>Secure & Safe</CardTitle>
                <CardDescription>
                  Your information is encrypted and securely stored in compliance with data protection
                  laws
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-t-4 border-t-zim-green">
              <CardHeader>
                <CheckCircle className="h-12 w-12 text-zim-green mb-4" />
                <CardTitle>Easy Process</CardTitle>
                <CardDescription>
                  Simple step-by-step form that guides you through all required information
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">How It Works</h3>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: 1, icon: FileText, title: "Register", description: "Create your account with email and password" },
              { step: 2, icon: FileText, title: "Fill Form", description: "Complete the arrival card with your details" },
              { step: 3, icon: CheckCircle, title: "Submit", description: "Review and submit your arrival card" },
              { step: 4, icon: Plane, title: "Travel", description: "Present your reference number at immigration" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-zim-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-zim-green">{item.step}</span>
                </div>
                <h4 className="font-semibold mb-2">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-16 bg-zim-black text-white">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">What You&apos;ll Need</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {["Valid passport", "Travel itinerary", "Accommodation details", "Contact information"].map(
              (item) => (
                <Card key={item} className="bg-white/10 border-white/20">
                  <CardContent className="p-4 flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-zim-yellow" />
                    <span>{item}</span>
                  </CardContent>
                </Card>
              )
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-zim-green rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">ZW</span>
                </div>
                <span className="font-bold">Zimbabwe Arrival Card</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Official Zimbabwe Immigration Arrival Card System
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/auth/login" className="hover:text-zim-green">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/auth/register" className="hover:text-zim-green">
                    Register
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-zim-green">
                    FAQs
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Department of Immigration</li>
                <li>Harare, Zimbabwe</li>
                <li>info@immigration.gov.zw</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-zim-green">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-zim-green">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Republic of Zimbabwe. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
