import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Privacy Policy | Zimbabwe Arrival Card",
  description: "Privacy Policy for the Zimbabwe Arrival Card System",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-zim-green text-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="https://www.moha.gov.zw/images/logo.png"
              alt="Government of Zimbabwe"
              width={48}
              height={48}
              className="h-12 w-auto"
            />
            <div>
              <h1 className="text-lg font-bold">Zimbabwe Arrival Card</h1>
              <p className="text-xs text-white/80">Department of Immigration</p>
            </div>
          </Link>
        </div>
      </header>

      <main id="main-content" className="container mx-auto px-4 py-12 max-w-4xl">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
            Back to Home
          </Link>
        </Button>

        <article className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-zim-black mb-6">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground mb-8">
            Last updated: {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
          </p>

          <div className="prose prose-lg max-w-none space-y-6">
            <section aria-labelledby="introduction">
              <h2 id="introduction" className="text-xl font-semibold text-zim-black mb-3">
                1. Introduction
              </h2>
              <p className="text-gray-700 leading-relaxed">
                The Government of Zimbabwe, through the Department of Immigration under the Ministry of Home Affairs,
                is committed to protecting your privacy and ensuring the security of your personal information.
                This Privacy Policy explains how we collect, use, store, and protect your data when you use the
                Zimbabwe Arrival Card System.
              </p>
            </section>

            <section aria-labelledby="data-collection">
              <h2 id="data-collection" className="text-xl font-semibold text-zim-black mb-3">
                2. Information We Collect
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                We collect the following categories of personal information:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Personal Identification:</strong> Full name, date of birth, gender, nationality, and country of residence</li>
                <li><strong>Passport Information:</strong> Passport number, issue date, expiry date, and issuing country</li>
                <li><strong>Contact Information:</strong> Email address, phone number, and emergency contact details</li>
                <li><strong>Travel Information:</strong> Purpose of visit, arrival date, intended stay duration, and accommodation details</li>
                <li><strong>Customs Declaration:</strong> Information about currency and goods being brought into Zimbabwe</li>
                <li><strong>Health Declaration:</strong> Health status information as required for entry</li>
              </ul>
            </section>

            <section aria-labelledby="data-use">
              <h2 id="data-use" className="text-xl font-semibold text-zim-black mb-3">
                3. How We Use Your Information
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                Your personal information is used for the following purposes:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Processing your arrival card application and facilitating entry into Zimbabwe</li>
                <li>Verifying your identity and travel documents at border posts</li>
                <li>Ensuring compliance with immigration laws and regulations</li>
                <li>Maintaining national security and public health</li>
                <li>Statistical analysis and improving immigration services</li>
                <li>Communicating with you regarding your application status</li>
              </ul>
            </section>

            <section aria-labelledby="data-sharing">
              <h2 id="data-sharing" className="text-xl font-semibold text-zim-black mb-3">
                4. Information Sharing
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Your personal information may be shared with authorized government agencies including the
                Department of Immigration, Zimbabwe Revenue Authority (ZIMRA), Ministry of Health, and law
                enforcement agencies as required by law. We do not sell or share your personal information
                with third parties for commercial purposes.
              </p>
            </section>

            <section aria-labelledby="data-security">
              <h2 id="data-security" className="text-xl font-semibold text-zim-black mb-3">
                5. Data Security
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We implement appropriate technical and organizational security measures to protect your personal
                information against unauthorized access, alteration, disclosure, or destruction. This includes
                encryption of data in transit and at rest, secure server infrastructure, access controls, and
                regular security audits.
              </p>
            </section>

            <section aria-labelledby="data-retention">
              <h2 id="data-retention" className="text-xl font-semibold text-zim-black mb-3">
                6. Data Retention
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Your arrival card information is retained for a period of 5 years from the date of your entry
                into Zimbabwe, in accordance with immigration record-keeping requirements. After this period,
                your data will be securely archived or deleted.
              </p>
            </section>

            <section aria-labelledby="your-rights">
              <h2 id="your-rights" className="text-xl font-semibold text-zim-black mb-3">
                7. Your Rights
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                You have the following rights regarding your personal information:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Access:</strong> Request a copy of your personal data held by us</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data</li>
                <li><strong>Deletion:</strong> Request deletion of your data where legally permissible</li>
                <li><strong>Portability:</strong> Request your data in a portable format</li>
              </ul>
            </section>

            <section aria-labelledby="contact">
              <h2 id="contact" className="text-xl font-semibold text-zim-black mb-3">
                8. Contact Us
              </h2>
              <p className="text-gray-700 leading-relaxed">
                For questions or concerns about this Privacy Policy or your personal data, please contact:
              </p>
              <address className="not-italic mt-3 text-gray-700">
                <strong>Department of Immigration</strong><br />
                Ministry of Home Affairs<br />
                Harare, Zimbabwe<br />
                Email: privacy@immigration.gov.zw<br />
                Phone: +263 (0) 4 123456
              </address>
            </section>

            <section aria-labelledby="updates">
              <h2 id="updates" className="text-xl font-semibold text-zim-black mb-3">
                9. Policy Updates
              </h2>
              <p className="text-gray-700 leading-relaxed">
                This Privacy Policy may be updated periodically. Any significant changes will be communicated
                through our website. We encourage you to review this policy regularly.
              </p>
            </section>
          </div>
        </article>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Republic of Zimbabwe. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
