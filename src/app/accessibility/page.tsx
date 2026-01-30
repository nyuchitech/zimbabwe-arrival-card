import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Accessibility Statement | Zimbabwe Arrival Card",
  description: "Accessibility Statement for the Zimbabwe Arrival Card System",
};

export default function AccessibilityPage() {
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
          <h1 className="text-2xl md:text-3xl font-bold text-zim-black mb-6">Accessibility Statement</h1>
          <p className="text-sm text-muted-foreground mb-8">
            Last updated: {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
          </p>

          <div className="prose prose-lg max-w-none space-y-6">
            <section aria-labelledby="commitment">
              <h2 id="commitment" className="text-lg md:text-xl font-semibold text-zim-black mb-3">
                Our Commitment
              </h2>
              <p className="text-gray-700 leading-relaxed text-base">
                The Government of Zimbabwe is committed to ensuring digital accessibility for all people,
                including those with disabilities. We continually work to improve the accessibility of the
                Zimbabwe Arrival Card System to ensure it provides a user-friendly experience for everyone.
              </p>
            </section>

            <section aria-labelledby="standards">
              <h2 id="standards" className="text-lg md:text-xl font-semibold text-zim-black mb-3">
                Accessibility Standards
              </h2>
              <p className="text-gray-700 leading-relaxed text-base mb-3">
                This website aims to conform to the Web Content Accessibility Guidelines (WCAG) 2.2 at Level AAA.
                These guidelines explain how to make web content more accessible for people with disabilities.
                Conformance with these guidelines helps make the web more user-friendly for everyone.
              </p>
              <p className="text-gray-700 leading-relaxed text-base">
                We have implemented the following accessibility features:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 text-base mt-3">
                <li><strong>Keyboard Navigation:</strong> All functionality is accessible via keyboard</li>
                <li><strong>Screen Reader Support:</strong> Content is structured for screen reader compatibility</li>
                <li><strong>Color Contrast:</strong> Text meets WCAG AAA contrast requirements (7:1 ratio)</li>
                <li><strong>Touch Targets:</strong> Interactive elements have minimum 44x44 pixel touch targets</li>
                <li><strong>Responsive Design:</strong> Content adapts to different screen sizes and devices</li>
                <li><strong>Focus Indicators:</strong> Clear visible focus indicators for keyboard users</li>
                <li><strong>Alternative Text:</strong> Images include descriptive alternative text</li>
                <li><strong>Form Labels:</strong> All form fields have associated labels</li>
                <li><strong>Error Identification:</strong> Form errors are clearly identified and described</li>
                <li><strong>Skip Navigation:</strong> Skip links allow users to bypass repetitive content</li>
              </ul>
            </section>

            <section aria-labelledby="technologies">
              <h2 id="technologies" className="text-lg md:text-xl font-semibold text-zim-black mb-3">
                Assistive Technologies
              </h2>
              <p className="text-gray-700 leading-relaxed text-base">
                This website is designed to be compatible with the following assistive technologies:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 text-base mt-3">
                <li>Screen readers (JAWS, NVDA, VoiceOver, TalkBack)</li>
                <li>Screen magnification software</li>
                <li>Speech recognition software</li>
                <li>Keyboard-only navigation</li>
                <li>Switch devices</li>
              </ul>
            </section>

            <section aria-labelledby="browsers">
              <h2 id="browsers" className="text-lg md:text-xl font-semibold text-zim-black mb-3">
                Browser Compatibility
              </h2>
              <p className="text-gray-700 leading-relaxed text-base">
                This website is designed to be compatible with recent versions of the following browsers:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 text-base mt-3">
                <li>Google Chrome (desktop and mobile)</li>
                <li>Mozilla Firefox</li>
                <li>Apple Safari (desktop and mobile)</li>
                <li>Microsoft Edge</li>
                <li>Samsung Internet</li>
              </ul>
            </section>

            <section aria-labelledby="limitations">
              <h2 id="limitations" className="text-lg md:text-xl font-semibold text-zim-black mb-3">
                Known Limitations
              </h2>
              <p className="text-gray-700 leading-relaxed text-base">
                While we strive for full accessibility, some content may have limitations. We are actively working
                to address these issues. If you encounter any accessibility barriers, please contact us so we can
                assist you and improve our service.
              </p>
            </section>

            <section aria-labelledby="feedback">
              <h2 id="feedback" className="text-lg md:text-xl font-semibold text-zim-black mb-3">
                Feedback and Contact
              </h2>
              <p className="text-gray-700 leading-relaxed text-base">
                We welcome your feedback on the accessibility of this website. If you experience any accessibility
                barriers or have suggestions for improvement, please contact us:
              </p>
              <address className="not-italic mt-3 text-gray-700 text-base">
                <strong>Accessibility Support</strong><br />
                Department of Immigration<br />
                Ministry of Home Affairs<br />
                Email: accessibility@immigration.gov.zw<br />
                Phone: +263 (0) 4 123456
              </address>
              <p className="text-gray-700 leading-relaxed text-base mt-4">
                We aim to respond to accessibility feedback within 5 business days.
              </p>
            </section>

            <section aria-labelledby="alternative">
              <h2 id="alternative" className="text-lg md:text-xl font-semibold text-zim-black mb-3">
                Alternative Formats
              </h2>
              <p className="text-gray-700 leading-relaxed text-base">
                If you require information in an alternative format due to a disability, please contact us.
                We will work with you to provide information in a suitable format.
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
