import Link from "next/link";
import Image from "next/image";
import { Shield, ArrowLeft, UserPlus, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zim-green/10 to-zim-yellow/10 p-4">
      <div className="w-full max-w-md space-y-4">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-zim-green min-h-[44px]"
        >
          <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
          Back to Public Portal
        </Link>

        <Card>
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              <Image
                src="https://www.moha.gov.zw/images/logo.png"
                alt="Government of Zimbabwe Coat of Arms"
                width={64}
                height={64}
                className="h-16 w-auto"
                priority
              />
            </div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="h-5 w-5 text-zim-green" aria-hidden="true" />
              <span className="text-sm font-medium text-zim-green">Staff Portal</span>
            </div>
            <CardTitle className="text-2xl text-center">Staff Registration</CardTitle>
            <CardDescription className="text-center">
              Staff accounts are created by System Administrators
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-zim-green/5 border border-zim-green/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <UserPlus className="h-5 w-5 text-zim-green mt-0.5 flex-shrink-0" aria-hidden="true" />
                <div className="space-y-2">
                  <p className="text-sm font-medium">How to Get Access</p>
                  <p className="text-sm text-muted-foreground">
                    Staff accounts for Immigration Officers, Government Officials, and ZIMRA Officers
                    are created by authorized System Administrators.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Contact Your Department:</h3>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-medium">Immigration Department</p>
                    <a
                      href="mailto:immigration@moha.gov.zw"
                      className="text-sm text-zim-green hover:underline"
                    >
                      immigration@moha.gov.zw
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-medium">ZIMRA (Tax Administration)</p>
                    <a
                      href="mailto:info@zimra.co.zw"
                      className="text-sm text-zim-green hover:underline"
                    >
                      info@zimra.co.zw
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-medium">IT Support</p>
                    <p className="text-sm text-muted-foreground">+263 242 703631</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Link href="/auth/login" className="w-full">
              <Button
                variant="outline"
                className="w-full min-h-[44px]"
              >
                Already have an account? Sign In
              </Button>
            </Link>
            <p className="text-xs text-center text-muted-foreground">
              Travelers do not need an account.
              <br />
              <Link href="/arrival-card/new" className="text-zim-green hover:underline">
                Fill out your arrival card here
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
