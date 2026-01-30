"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { Suspense } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const errorMessages: Record<string, string> = {
  Configuration: "There is a problem with the server configuration.",
  AccessDenied: "You do not have permission to sign in.",
  Verification: "The verification token has expired or has already been used.",
  Default: "An error occurred during authentication.",
};

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") || "Default";
  const errorMessage = errorMessages[error] || errorMessages.Default;

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-zim-red rounded-full flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl text-center text-zim-red">
          Authentication Error
        </CardTitle>
        <CardDescription className="text-center">
          {errorMessage}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-center text-muted-foreground">
          Please try again or contact support if the problem persists.
        </p>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <Button asChild className="w-full bg-zim-green hover:bg-zim-green/90">
          <Link href="/auth/login">Back to Login</Link>
        </Button>
        <Button asChild variant="outline" className="w-full">
          <Link href="/">Go to Home</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function ErrorFallback() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-zim-red rounded-full flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl text-center text-zim-red">
          Authentication Error
        </CardTitle>
        <CardDescription className="text-center">Loading...</CardDescription>
      </CardHeader>
    </Card>
  );
}

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zim-red/10 to-zim-yellow/10 p-4">
      <Suspense fallback={<ErrorFallback />}>
        <ErrorContent />
      </Suspense>
    </div>
  );
}
