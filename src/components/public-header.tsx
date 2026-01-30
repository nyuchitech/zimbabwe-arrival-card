import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function PublicHeader() {
  return (
    <header className="bg-zim-green text-white" role="banner">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-4">
          <Image
            src="https://www.moha.gov.zw/images/logo.png"
            alt="Government of Zimbabwe Coat of Arms"
            width={48}
            height={48}
            className="h-12 w-auto"
          />
          <div>
            <h1 className="text-lg md:text-xl font-bold">Zimbabwe Arrival Card</h1>
            <p className="text-sm text-white/90">Department of Immigration</p>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/help">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              Help
            </Button>
          </Link>
          <Link href="/auth/login">
            <Button className="bg-zim-yellow text-zim-black hover:bg-zim-yellow/90">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
