"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
      {/* Logo & Title */}
      <div className="space-y-2 text-center">
        <Image
          src="/images/logo.png"
          alt="Logo"
          width={60}
          height={60}
          className="mx-auto"
        />
        <h1 className="text-2xl font-bold text-primary-900">Create Account</h1>
        <p className="text-muted-foreground">
          Join us and start your journey
        </p>
      </div>

      {/* Register Form */}
      <form className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary-900">First Name</label>
              <Input placeholder="John" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary-900">Last Name</label>
              <Input placeholder="Doe" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-primary-900">Email</label>
            <Input type="email" placeholder="john@gmail.com" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-primary-900">Password</label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-start space-x-2">
          <input
            type="checkbox"
            id="terms"
            className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <label htmlFor="terms" className="text-sm text-muted-foreground">
            I agree to the{" "}
            <Link href="/terms" className="text-secondary-600 hover:text-secondary-700 transition-colors">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-secondary-600 hover:text-secondary-700 transition-colors">
              Privacy Policy
            </Link>
          </label>
        </div>

        <Button type="submit" className="w-full bg-primary-600 hover:bg-primary-700 text-white">
          Create Account
        </Button>
      </form>

      {/* Social Registration */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-muted-foreground">
            Or register with
          </span>
        </div>
      </div>

      <div className="grid gap-4">
        <Button variant="outline">
          <Image
            src="/images/google.png"
            alt="Google"
            width={20}
            height={20}
            className="mr-2"
          />
          Google
        </Button>
      </div>

      {/* Login Link */}
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link 
          href="/login" 
          className="font-medium text-secondary-600 hover:text-secondary-700 transition-colors"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}