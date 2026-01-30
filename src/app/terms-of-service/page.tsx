import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Terms of Service | Zimbabwe Arrival Card",
  description: "Terms of Service for the Zimbabwe Arrival Card System",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-zim-green text-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 min-h-[44px]">
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

      <main id="main-content" className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <Button asChild variant="ghost" className="mb-6 min-h-[44px] min-w-[44px]">
          <Link href="/">
            <ArrowLeft className="mr-2 h-5 w-5" aria-hidden="true" />
            Back to Home
          </Link>
        </Button>

        <article className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-zim-black mb-6">Terms of Service</h1>
          <p className="text-sm text-muted-foreground mb-8">
            Last updated: {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
          </p>

          <div className="prose prose-lg max-w-none space-y-6">
            <section aria-labelledby="acceptance">
              <h2 id="acceptance" className="text-lg md:text-xl font-semibold text-zim-black mb-3">
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-700 leading-relaxed text-base">
                By accessing and using the Zimbabwe Arrival Card System, you accept and agree to be bound by these
                Terms of Service. If you do not agree to these terms, please do not use this service. This system
                is operated by the Department of Immigration under the Ministry of Home Affairs of the Republic of
                Zimbabwe.
              </p>
            </section>

            <section aria-labelledby="eligibility">
              <h2 id="eligibility" className="text-lg md:text-xl font-semibold text-zim-black mb-3">
                2. Eligibility
              </h2>
              <p className="text-gray-700 leading-relaxed text-base">
                This service is available to all persons intending to enter Zimbabwe. By using this service, you
                confirm that you are providing information on your own behalf or on behalf of minors or dependents
                traveling with you, and that you have the authority to do so.
              </p>
            </section>

            <section aria-labelledby="obligations">
              <h2 id="obligations" className="text-lg md:text-xl font-semibold text-zim-black mb-3">
                3. User Obligations
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3 text-base">
                When using this service, you agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 text-base">
                <li>Provide accurate, complete, and truthful information</li>
                <li>Not submit false or misleading information</li>
                <li>Keep your account credentials secure and confidential</li>
                <li>Notify us immediately of any unauthorized access to your account</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Not attempt to access, tamper with, or use non-public areas of the system</li>
              </ul>
            </section>

            <section aria-labelledby="accuracy">
              <h2 id="accuracy" className="text-lg md:text-xl font-semibold text-zim-black mb-3">
                4. Accuracy of Information
              </h2>
              <p className="text-gray-700 leading-relaxed text-base">
                All information submitted through the Zimbabwe Arrival Card System must be accurate and truthful.
                Providing false or misleading information is a criminal offense under Zimbabwe immigration law and
                may result in denial of entry, deportation, fines, or imprisonment. You are responsible for
                verifying all information before submission.
              </p>
            </section>

            <section aria-labelledby="arrival-card">
              <h2 id="arrival-card" className="text-lg md:text-xl font-semibold text-zim-black mb-3">
                5. Arrival Card Requirements
              </h2>
              <p className="text-gray-700 leading-relaxed text-base">
                The arrival card is a mandatory requirement for entry into Zimbabwe. Completion of the online
                arrival card does not guarantee entry into Zimbabwe. Final entry decisions are made by immigration
                officers at the port of entry based on applicable laws, regulations, and officer discretion.
              </p>
            </section>

            <section aria-labelledby="service">
              <h2 id="service" className="text-lg md:text-xl font-semibold text-zim-black mb-3">
                6. Service Availability
              </h2>
              <p className="text-gray-700 leading-relaxed text-base">
                We strive to maintain continuous service availability. However, we do not guarantee uninterrupted
                access and may temporarily suspend the service for maintenance, updates, or due to circumstances
                beyond our control. We recommend completing your arrival card at least 24 hours before your
                intended entry.
              </p>
            </section>

            <section aria-labelledby="liability">
              <h2 id="liability" className="text-lg md:text-xl font-semibold text-zim-black mb-3">
                7. Limitation of Liability
              </h2>
              <p className="text-gray-700 leading-relaxed text-base">
                To the maximum extent permitted by law, the Government of Zimbabwe and its agencies shall not be
                liable for any indirect, incidental, special, consequential, or punitive damages arising from your
                use of this service or any delay or inability to use the service.
              </p>
            </section>

            <section aria-labelledby="ip">
              <h2 id="ip" className="text-lg md:text-xl font-semibold text-zim-black mb-3">
                8. Intellectual Property
              </h2>
              <p className="text-gray-700 leading-relaxed text-base">
                All content, design, graphics, and other materials on this system are the property of the
                Government of Zimbabwe and are protected by applicable intellectual property laws. You may not
                reproduce, distribute, or create derivative works without prior written permission.
              </p>
            </section>

            <section aria-labelledby="governing-law">
              <h2 id="governing-law" className="text-lg md:text-xl font-semibold text-zim-black mb-3">
                9. Governing Law
              </h2>
              <p className="text-gray-700 leading-relaxed text-base">
                These Terms of Service are governed by and construed in accordance with the laws of Zimbabwe.
                Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the
                courts of Zimbabwe.
              </p>
            </section>

            <section aria-labelledby="changes">
              <h2 id="changes" className="text-lg md:text-xl font-semibold text-zim-black mb-3">
                10. Changes to Terms
              </h2>
              <p className="text-gray-700 leading-relaxed text-base">
                We reserve the right to modify these Terms of Service at any time. Changes will be effective
                immediately upon posting. Your continued use of the service constitutes acceptance of the
                modified terms.
              </p>
            </section>

            <section aria-labelledby="contact">
              <h2 id="contact" className="text-lg md:text-xl font-semibold text-zim-black mb-3">
                11. Contact Information
              </h2>
              <p className="text-gray-700 leading-relaxed text-base">
                For questions about these Terms of Service, please contact:
              </p>
              <address className="not-italic mt-3 text-gray-700 text-base">
                <strong>Department of Immigration</strong><br />
                Ministry of Home Affairs<br />
                Harare, Zimbabwe<br />
                Email: legal@immigration.gov.zw<br />
                Phone: +263 (0) 4 123456
              </address>
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
