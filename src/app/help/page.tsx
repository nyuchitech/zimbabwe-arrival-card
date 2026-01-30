import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PublicHeader } from "@/components/public-header";
import {
  FileText,
  QrCode,
  Clock,
  Shield,
  HelpCircle,
  Mail,
  Phone,
  Globe,
  AlertCircle,
  CheckCircle2,
  Users,
  Plane,
} from "lucide-react";

const FAQ_CATEGORIES = [
  {
    title: "Getting Started",
    icon: FileText,
    faqs: [
      {
        question: "What is the Zimbabwe e-Arrival Card?",
        answer:
          "The Zimbabwe e-Arrival Card is a digital immigration form that all visitors must complete before entering Zimbabwe. It replaces the traditional paper arrival card and allows for faster processing at border posts.",
      },
      {
        question: "Who needs to complete an arrival card?",
        answer:
          "All foreign nationals entering Zimbabwe must complete an arrival card. This includes tourists, business travelers, students, and anyone entering for employment or medical purposes. Zimbabwean citizens returning home are exempt.",
      },
      {
        question: "When should I complete the arrival card?",
        answer:
          "We recommend completing your arrival card at least 72 hours before your planned entry into Zimbabwe. However, you can submit it up to 12 months in advance. Cards submitted less than 24 hours before arrival may experience processing delays.",
      },
      {
        question: "Do I need an account to submit an arrival card?",
        answer:
          "Yes, you need to create a free account to submit an arrival card. This allows you to track your submission status, receive updates via email, and access your QR code for presentation at the border.",
      },
    ],
  },
  {
    title: "Submission Process",
    icon: CheckCircle2,
    faqs: [
      {
        question: "How do I submit an arrival card?",
        answer:
          'Click "Start New Arrival Card" on the homepage, then follow the step-by-step form. You\'ll need to provide personal information, passport details, travel information, accommodation details, and customs/health declarations. Review your information before submitting.',
      },
      {
        question: "What documents do I need to complete the form?",
        answer:
          "You will need: Your valid passport, your travel itinerary (flight numbers, dates), accommodation booking details (hotel name, address, phone number), and emergency contact information. Have these ready before starting.",
      },
      {
        question: "Can I save my progress and continue later?",
        answer:
          "Currently, you must complete the form in one session. Make sure you have all required information ready before starting. The form typically takes 10-15 minutes to complete.",
      },
      {
        question: "What happens after I submit?",
        answer:
          "After submission, your card will be reviewed by immigration officials. You'll receive a confirmation email with your reference number and QR code. Most cards are processed within 24-48 hours. You can check your status on the dashboard.",
      },
    ],
  },
  {
    title: "QR Code & Border Entry",
    icon: QrCode,
    faqs: [
      {
        question: "What is the QR code for?",
        answer:
          "The QR code contains your arrival card reference number. Immigration officers at the border will scan this code to quickly retrieve your pre-submitted information, speeding up the entry process.",
      },
      {
        question: "How do I present my QR code at the border?",
        answer:
          "You can show the QR code on your phone screen, or print it out. Make sure your phone is charged, or bring a printed copy as backup. Officers will scan the code using their verification devices.",
      },
      {
        question: "What if my QR code doesn't scan?",
        answer:
          "If the QR code doesn't scan, provide your reference number (format: ZW followed by numbers and letters) to the officer. They can look up your arrival card manually. Ensure your screen brightness is high and the code is clean.",
      },
      {
        question: "Can I still enter if my card isn't approved yet?",
        answer:
          "If your card is still under review, you may experience longer processing times at the border. Immigration officers can review and approve cards on-site, but this takes additional time. We recommend submitting at least 72 hours in advance.",
      },
    ],
  },
  {
    title: "Customs & Declarations",
    icon: Shield,
    faqs: [
      {
        question: "What currency amounts must I declare?",
        answer:
          "You must declare if you are carrying currency or monetary instruments (cash, traveler's checks, money orders) exceeding USD 10,000 or equivalent in any currency. Failure to declare may result in confiscation and penalties.",
      },
      {
        question: "What goods need to be declared?",
        answer:
          "You must declare goods intended for commercial purposes, items exceeding personal allowance limits, restricted items (firearms, certain medications), and any gifts with significant value. When in doubt, declare the item.",
      },
      {
        question: "What are the duty-free allowances?",
        answer:
          "Personal effects and goods for personal use up to USD 200 are typically duty-free. Specific allowances apply to alcohol (2 liters), tobacco (400 cigarettes), and perfume (500ml). Commercial goods are subject to import duties.",
      },
      {
        question: "What happens if I make a false declaration?",
        answer:
          "Providing false information on your arrival card is a serious offense. Penalties may include denial of entry, fines, confiscation of undeclared goods, and potential prosecution. Always declare accurately.",
      },
    ],
  },
  {
    title: "Group & Family Travel",
    icon: Users,
    faqs: [
      {
        question: "Can I submit arrival cards for my family?",
        answer:
          "Each adult traveler must submit their own arrival card. For children under 18 traveling with you, a parent or guardian can complete the form on their behalf using the same account.",
      },
      {
        question: "How do I add traveling companions?",
        answer:
          "Currently, each person needs their own arrival card submission. Group leaders can create accounts for family members and submit cards on their behalf, ensuring each person has their own reference number and QR code.",
      },
      {
        question: "Do infants need arrival cards?",
        answer:
          "Yes, all travelers regardless of age need an arrival card. For infants and children, a parent or guardian should complete the form, entering the child's passport details and indicating they are traveling with an adult.",
      },
    ],
  },
  {
    title: "Troubleshooting",
    icon: AlertCircle,
    faqs: [
      {
        question: "I didn't receive my confirmation email",
        answer:
          "Check your spam/junk folder first. If you still can't find it, log into your account to view your submission status and access your QR code. You can also request a new confirmation email from your dashboard.",
      },
      {
        question: "I made a mistake on my submission. Can I correct it?",
        answer:
          "For minor corrections, contact our support team with your reference number. For significant changes (passport details, travel dates), you may need to submit a new arrival card and cancel the previous one.",
      },
      {
        question: "My arrival card was rejected. What do I do?",
        answer:
          "If your card is rejected, you'll receive an email explaining the reason. Common reasons include incomplete information, expired passport, or missing required fields. Address the issues and submit a new card.",
      },
      {
        question: "The website isn't working properly",
        answer:
          "Try refreshing the page, clearing your browser cache, or using a different browser. For best results, use Chrome, Firefox, Safari, or Edge on a desktop or mobile device. Contact support if issues persist.",
      },
    ],
  },
];

const QUICK_LINKS = [
  {
    title: "Start New Arrival Card",
    description: "Begin your arrival card submission",
    href: "/arrival-card/new",
    icon: FileText,
  },
  {
    title: "Look Up Your Card",
    description: "Check your submission status",
    href: "/arrival-card/lookup",
    icon: QrCode,
  },
  {
    title: "Processing Times",
    description: "View current processing times",
    href: "#processing",
    icon: Clock,
  },
  {
    title: "Contact Support",
    description: "Get help from our team",
    href: "#contact",
    icon: HelpCircle,
  },
];

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PublicHeader />

      <main className="container mx-auto px-4 py-8">
        {/* Hero section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Help Center
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about the Zimbabwe e-Arrival Card system.
            Can&apos;t find what you need? Contact our support team.
          </p>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {QUICK_LINKS.map((link) => (
            <Link key={link.title} href={link.href}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer hover:border-zim-green">
                <CardContent className="pt-6">
                  <link.icon className="h-8 w-8 text-zim-green mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-1">{link.title}</h3>
                  <p className="text-sm text-gray-600">{link.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Processing times info */}
        <Card className="mb-12" id="processing">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-zim-green" />
              Current Processing Times
            </CardTitle>
            <CardDescription>
              Average time for arrival card review and approval
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-zim-green">24h</div>
                <div className="text-sm text-gray-600 mt-1">Standard Processing</div>
                <div className="text-xs text-gray-500 mt-2">
                  Submit 72+ hours before arrival
                </div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-3xl font-bold text-amber-600">48h</div>
                <div className="text-sm text-gray-600 mt-1">Peak Season</div>
                <div className="text-xs text-gray-500 mt-2">
                  During holidays and events
                </div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">72h</div>
                <div className="text-sm text-gray-600 mt-1">Complex Cases</div>
                <div className="text-xs text-gray-500 mt-2">
                  Additional documentation needed
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ sections */}
        <div className="space-y-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900">
            Frequently Asked Questions
          </h2>

          {FAQ_CATEGORIES.map((category) => (
            <Card key={category.title}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <category.icon className="h-5 w-5 text-zim-green" />
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {category.faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`${category.title}-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact section */}
        <Card id="contact">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-zim-green" />
              Need More Help?
            </CardTitle>
            <CardDescription>
              Our support team is available to assist you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-zim-green mt-1" />
                <div>
                  <h4 className="font-medium text-gray-900">Email Support</h4>
                  <p className="text-sm text-gray-600">support@immigration.gov.zw</p>
                  <p className="text-xs text-gray-500 mt-1">Response within 24 hours</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-zim-green mt-1" />
                <div>
                  <h4 className="font-medium text-gray-900">Phone Support</h4>
                  <p className="text-sm text-gray-600">+263 242 701 981</p>
                  <p className="text-xs text-gray-500 mt-1">Mon-Fri, 8AM-5PM CAT</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Globe className="h-5 w-5 text-zim-green mt-1" />
                <div>
                  <h4 className="font-medium text-gray-900">Immigration Department</h4>
                  <p className="text-sm text-gray-600">www.moha.gov.zw</p>
                  <p className="text-xs text-gray-500 mt-1">Official government portal</p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Plane className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-900">At the Airport or Border?</h4>
                  <p className="text-sm text-amber-800">
                    If you&apos;re already at a Zimbabwe port of entry and need assistance,
                    please speak to an immigration officer directly. They can help with
                    urgent processing needs.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to action */}
        <div className="text-center mt-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Ready to Complete Your Arrival Card?
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/arrival-card/new">
              <Button size="lg" className="bg-zim-green hover:bg-zim-green/90">
                <FileText className="h-5 w-5 mr-2" />
                Start New Arrival Card
              </Button>
            </Link>
            <Link href="/arrival-card/lookup">
              <Button size="lg" variant="outline">
                <QrCode className="h-5 w-5 mr-2" />
                Look Up Existing Card
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">
              &copy; {new Date().getFullYear()} Department of Immigration, Government of Zimbabwe
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy-policy" className="text-gray-600 hover:text-zim-green">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="text-gray-600 hover:text-zim-green">
                Terms of Service
              </Link>
              <Link href="/accessibility" className="text-gray-600 hover:text-zim-green">
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
