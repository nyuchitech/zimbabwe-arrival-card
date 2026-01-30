"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Printer, Download, Mail } from "lucide-react";

interface EpassActionsProps {
  cardId: string;
}

export function EpassActions({ cardId }: EpassActionsProps) {
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <>
      {/* Action Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center print:hidden">
        <Button
          variant="outline"
          className="min-h-[44px]"
          onClick={handlePrint}
        >
          <Printer className="h-4 w-4 mr-2" aria-hidden="true" />
          Print e-Pass
        </Button>
        <Link href={`/arrival-card/${cardId}/download`}>
          <Button variant="outline" className="min-h-[44px] w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" aria-hidden="true" />
            Download PDF
          </Button>
        </Link>
        <Button variant="outline" className="min-h-[44px]">
          <Mail className="h-4 w-4 mr-2" aria-hidden="true" />
          Email Confirmation
        </Button>
      </div>

      {/* Additional Links */}
      <div className="mt-8 text-center print:hidden">
        <p className="text-sm text-muted-foreground mb-4">
          Need to make changes or check your status?
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/arrival-card/lookup">
            <Button variant="link" className="text-zim-green">
              Check Arrival Card Status
            </Button>
          </Link>
          <Link href="/">
            <Button variant="link" className="text-zim-green">
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
