"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Shield, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-4">
      <Link
        href="/"
        className="inline-flex items-center text-base text-gray-600 hover:text-zim-green min-h-[48px] font-medium"
      >
        <ArrowLeft className="h-5 w-5 mr-2" aria-hidden="true" />
        Back to Public Portal
      </Link>

      <Card className="shadow-lg">
        <CardHeader className="space-y-1 pb-4">
          <div className="flex items-center justify-center mb-4">
            <Image
              src="https://www.moha.gov.zw/images/logo.png"
              alt="Government of Zimbabwe Coat of Arms"
              width={80}
              height={80}
              className="h-20 w-auto"
              priority
            />
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="h-6 w-6 text-zim-green" aria-hidden="true" />
            <span className="text-base font-semibold text-zim-green">Staff Portal</span>
          </div>
          <CardTitle className="text-2xl md:text-3xl text-center text-gray-900">Staff Login</CardTitle>
          <CardDescription className="text-center text-base text-gray-600">
            For Immigration Officers, Government Officials, and System Administrators
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-5">
            {error && (
              <div
                className="p-4 text-base text-red-700 bg-red-50 border-2 border-red-300 rounded-lg font-medium"
                role="alert"
              >
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-base font-semibold text-gray-900">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@gov.zw"
                autoComplete="email"
                className="h-14 text-base"
                {...register("email")}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-base text-red-600 font-medium" role="alert">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-base font-semibold text-gray-900">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                className="h-14 text-base"
                {...register("password")}
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-base text-red-600 font-medium" role="alert">
                  {errors.password.message}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pt-2">
            <Button
              type="submit"
              className="w-full bg-zim-green hover:bg-zim-green/90 h-14 text-lg font-semibold"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />}
              Sign In
            </Button>
            <p className="text-sm text-center text-gray-600">
              Staff accounts are created by System Administrators.
              <br />
              Contact your department for access.
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

function LoginFallback() {
  return (
    <div className="w-full max-w-md space-y-4">
      <div className="min-h-[44px]" />
      <Card>
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="h-16 w-16 bg-gray-100 rounded-full animate-pulse" />
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="h-5 w-5 text-zim-green" aria-hidden="true" />
            <span className="text-sm font-medium text-zim-green">Staff Portal</span>
          </div>
          <CardTitle className="text-2xl text-center">Staff Login</CardTitle>
          <CardDescription className="text-center">Loading...</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zim-green/10 to-zim-yellow/10 p-4">
      <Suspense fallback={<LoginFallback />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
