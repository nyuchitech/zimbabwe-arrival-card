import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  QrCode,
  Shield,
  FileText,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Settings,
  Search,
  ClipboardList,
  Scan,
  Download,
  UserCog,
  Database,
  Activity,
  BookOpen,
} from "lucide-react";

const ROLE_GUIDES = {
  IMMIGRATION: {
    title: "Immigration Officer Guide",
    description: "How to verify and process arrival cards at border posts",
    icon: Shield,
    sections: [
      {
        title: "Scanning QR Codes",
        icon: Scan,
        content: [
          {
            question: "How do I scan a traveler's QR code?",
            answer:
              "Navigate to Immigration > Scan QR Code from the sidebar. Grant camera permission when prompted. Hold the traveler's QR code (on their phone or printed) within the camera frame. The system will automatically detect and process the code.",
          },
          {
            question: "What if the QR code doesn't scan?",
            answer:
              "Ensure good lighting and that the code is clean and undamaged. If it still doesn't scan, ask the traveler for their reference number (format: ZW followed by numbers/letters) and use the manual lookup function.",
          },
          {
            question: "What information is displayed after scanning?",
            answer:
              "You'll see the traveler's full arrival card including: personal details, passport information, travel purpose, accommodation, customs declarations, and health declarations. Verify this matches their physical documents.",
          },
        ],
      },
      {
        title: "Approving & Rejecting Cards",
        icon: CheckCircle,
        content: [
          {
            question: "When should I approve an arrival card?",
            answer:
              "Approve when: all information matches the traveler's documents, passport is valid with sufficient validity remaining, there are no red flags in declarations, and the traveler answers any follow-up questions satisfactorily.",
          },
          {
            question: "When should I reject an arrival card?",
            answer:
              "Reject when: information doesn't match documents, passport is expired or expiring soon, traveler provides false information, there are security concerns, or required documentation is missing.",
          },
          {
            question: "How do I add notes to a decision?",
            answer:
              "When approving or rejecting, you'll see a notes field. Always add notes for rejections explaining the reason. For approvals, add notes if there were any concerns or if you need to flag something for records.",
          },
        ],
      },
      {
        title: "Handling Special Cases",
        icon: AlertTriangle,
        content: [
          {
            question: "What if a traveler doesn't have an arrival card?",
            answer:
              "Travelers can complete a card on-site using their mobile device. Direct them to the official website. In exceptional cases, paper forms are still available but should be avoided as they require manual data entry.",
          },
          {
            question: "How do I handle group arrivals?",
            answer:
              "Each traveler must have their own QR code. For families, scan each person's code separately. For tour groups, work with the group leader but verify each individual's documents.",
          },
          {
            question: "What if there's a system outage?",
            answer:
              "Record reference numbers manually and process verification once systems are restored. Your supervisor should be notified of any extended outages. Paper backup forms are available for emergencies.",
          },
        ],
      },
    ],
  },
  ZIMRA: {
    title: "ZIMRA Officer Guide",
    description: "How to review customs declarations and process goods",
    icon: ClipboardList,
    sections: [
      {
        title: "Reviewing Declarations",
        icon: FileText,
        content: [
          {
            question: "How do I access customs declarations?",
            answer:
              "Navigate to ZIMRA > Customs Declarations from the sidebar. You'll see a list of all arrival cards with customs declarations. Use filters to view only cards with declared currency or goods.",
          },
          {
            question: "What should I look for in currency declarations?",
            answer:
              "Verify declared amounts over USD 10,000. Check for multiple travelers from the same address/group who might be structuring declarations. Note any discrepancies between declared and actual amounts.",
          },
          {
            question: "How do I flag suspicious declarations?",
            answer:
              "Use the 'Flag for Review' button on any declaration that needs secondary inspection. Add detailed notes explaining your concerns. The traveler will be directed to secondary inspection.",
          },
        ],
      },
      {
        title: "Processing Duties",
        icon: BarChart3,
        content: [
          {
            question: "How are duties calculated?",
            answer:
              "Duties are calculated based on the declared value and type of goods. The system will suggest applicable rates, but verify against current tariff schedules. Commercial goods have different rates than personal items.",
          },
          {
            question: "What documents do I need to collect?",
            answer:
              "For commercial goods: invoices, packing lists, import permits where required. For personal effects: receipts if claiming exemptions. All documents should be retained and linked to the arrival card.",
          },
        ],
      },
    ],
  },
  GOVERNMENT: {
    title: "Government Official Guide",
    description: "How to access reports and analytics",
    icon: BarChart3,
    sections: [
      {
        title: "Viewing Statistics",
        icon: Activity,
        content: [
          {
            question: "What statistics are available?",
            answer:
              "Dashboard shows: total arrivals by period, arrivals by nationality, purpose of visit breakdown, border post activity, processing times, approval/rejection rates, and customs declarations summary.",
          },
          {
            question: "How do I customize the date range?",
            answer:
              "Use the date picker in the top right corner to select custom ranges. Preset options include: Today, Last 7 Days, Last 30 Days, This Month, This Quarter, and This Year.",
          },
          {
            question: "Can I compare different time periods?",
            answer:
              "Yes, enable comparison mode to see year-over-year or month-over-month changes. This helps identify trends and seasonal patterns in arrivals.",
          },
        ],
      },
      {
        title: "Generating Reports",
        icon: Download,
        content: [
          {
            question: "How do I export data?",
            answer:
              "Click the Export button on any report view. Choose format: PDF for presentations, Excel for data analysis, or CSV for raw data. Reports include all visible columns and respect current filters.",
          },
          {
            question: "Can I schedule regular reports?",
            answer:
              "Contact your administrator to set up scheduled reports. Daily, weekly, or monthly reports can be automatically emailed to specified addresses.",
          },
        ],
      },
    ],
  },
  ADMIN: {
    title: "Administrator Guide",
    description: "System configuration and user management",
    icon: Settings,
    sections: [
      {
        title: "User Management",
        icon: UserCog,
        content: [
          {
            question: "How do I create new user accounts?",
            answer:
              "Navigate to Admin > Users > Create New. Enter email, name, and select role. The user will receive an email to set their password. For government officials, verify their credentials before creation.",
          },
          {
            question: "How do I change a user's role?",
            answer:
              "Find the user in Admin > Users, click Edit. Change the role dropdown and save. The user's permissions update immediately. Notify them of the change.",
          },
          {
            question: "How do I deactivate an account?",
            answer:
              "Find the user, click Edit, toggle the Active status to Off. Deactivated users cannot log in but their data is retained. For permanent removal, contact system support.",
          },
        ],
      },
      {
        title: "System Configuration",
        icon: Database,
        content: [
          {
            question: "How do I add a new border post?",
            answer:
              "Navigate to Admin > Border Posts > Create New. Enter the post name, code, location, and operating hours. Assign officers to the post for proper routing.",
          },
          {
            question: "How do I view system logs?",
            answer:
              "Admin > Audit Logs shows all system activity including logins, card processing, and configuration changes. Filter by user, action type, or date range. Export for compliance reviews.",
          },
        ],
      },
    ],
  },
};

const COMMON_FAQS = [
  {
    question: "How do I reset my password?",
    answer:
      "Click 'Forgot Password' on the login page. Enter your government email address and follow the reset link sent to your inbox. For security, links expire after 24 hours.",
  },
  {
    question: "Who do I contact for technical support?",
    answer:
      "For system issues, contact IT support at support-internal@immigration.gov.zw. For policy questions, contact your department supervisor. Include your user ID and detailed description of the issue.",
  },
  {
    question: "How do I report suspicious activity?",
    answer:
      "Use the 'Report Issue' button in the sidebar to flag any suspicious arrivals, potential fraud, or security concerns. All reports are reviewed by security within 24 hours.",
  },
  {
    question: "What browsers are supported?",
    answer:
      "Chrome, Firefox, Safari, and Edge (latest versions). For best performance, use Chrome. Mobile access is supported but desktop is recommended for processing tasks.",
  },
];

export default async function InternalHelpPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  const userRole = session.user.role as keyof typeof ROLE_GUIDES;
  const roleGuide = ROLE_GUIDES[userRole] || ROLE_GUIDES.GOVERNMENT;
  const RoleIcon = roleGuide.icon;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Internal Help Center</h1>
        <p className="text-gray-600 mt-2">
          Guides and documentation for government staff using the Zimbabwe Arrival Card system
        </p>
      </div>

      {/* Role badge */}
      <Card className="mb-8 border-zim-green/30 bg-zim-green/5">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-zim-green rounded-lg">
              <RoleIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {roleGuide.title}
              </h2>
              <p className="text-gray-600">{roleGuide.description}</p>
              <Badge className="mt-2 bg-zim-green">{userRole}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Role-specific guides */}
      <div className="space-y-6 mb-12">
        <h2 className="text-xl font-semibold text-gray-900">Your Guide</h2>

        {roleGuide.sections.map((section) => {
          const SectionIcon = section.icon;
          return (
            <Card key={section.title}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SectionIcon className="h-5 w-5 text-zim-green" />
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {section.content.map((item, index) => (
                    <AccordionItem key={index} value={`${section.title}-${index}`}>
                      <AccordionTrigger className="text-left">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Other role guides for admins */}
      {userRole === "ADMIN" && (
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Other Role Guides
          </h2>
          <Tabs defaultValue="immigration">
            <TabsList>
              <TabsTrigger value="immigration">Immigration</TabsTrigger>
              <TabsTrigger value="zimra">ZIMRA</TabsTrigger>
              <TabsTrigger value="government">Government</TabsTrigger>
            </TabsList>
            {(["IMMIGRATION", "ZIMRA", "GOVERNMENT"] as const).map((role) => (
              <TabsContent key={role} value={role.toLowerCase()}>
                <div className="space-y-4 mt-4">
                  {ROLE_GUIDES[role].sections.map((section) => (
                    <Card key={section.title}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">
                          {section.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="list-disc pl-4 space-y-1 text-sm text-gray-600">
                          {section.content.map((item, index) => (
                            <li key={index}>{item.question}</li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      )}

      {/* Common FAQs */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-zim-green" />
            General FAQs
          </CardTitle>
          <CardDescription>
            Common questions for all staff members
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {COMMON_FAQS.map((faq, index) => (
              <AccordionItem key={index} value={`common-${index}`}>
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

      {/* Quick actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {userRole === "IMMIGRATION" && (
              <>
                <Link
                  href="/immigration/scan"
                  className="flex flex-col items-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <QrCode className="h-8 w-8 text-zim-green mb-2" />
                  <span className="text-sm font-medium">Scan QR Code</span>
                </Link>
                <Link
                  href="/immigration"
                  className="flex flex-col items-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <Search className="h-8 w-8 text-zim-green mb-2" />
                  <span className="text-sm font-medium">Search Cards</span>
                </Link>
              </>
            )}
            {userRole === "ZIMRA" && (
              <Link
                href="/zimra"
                className="flex flex-col items-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <ClipboardList className="h-8 w-8 text-zim-green mb-2" />
                <span className="text-sm font-medium">Declarations</span>
              </Link>
            )}
            {(userRole === "GOVERNMENT" || userRole === "ADMIN") && (
              <Link
                href="/government"
                className="flex flex-col items-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <BarChart3 className="h-8 w-8 text-zim-green mb-2" />
                <span className="text-sm font-medium">Analytics</span>
              </Link>
            )}
            {userRole === "ADMIN" && (
              <Link
                href="/admin"
                className="flex flex-col items-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <Settings className="h-8 w-8 text-zim-green mb-2" />
                <span className="text-sm font-medium">Admin Panel</span>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
