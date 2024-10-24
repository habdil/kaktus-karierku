"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
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
        <h1 className="text-2xl font-bold text-primary-900">Welcome Back!</h1>
        <p className="text-muted-foreground">
          Sign in to continue your journey
        </p>
      </div>

      {/* Login Form */}
      <form className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-primary-900">Email</label>
            <Input 
              type="email"
              placeholder="Enter your email"
              className="w-full h-11"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-primary-900">Password</label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full h-11 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary-600"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="remember"
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="remember" className="text-muted-foreground">
              Remember me
            </label>
          </div>
          <Link 
            href="/forgot-password"
            className="text-secondary-600 hover:text-secondary-700"
          >
            Forgot Password?
          </Link>
        </div>

        <Button type="submit" className="w-full text-white h-11 bg-primary-600 hover:bg-primary-700">
          Login
        </Button>
      </form>

      {/* Social Login */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid gap-4">
        <Button variant="outline" className="h-11">
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

      {/* Sign Up Link */}
      <p className="text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link 
          href="/register" 
          className="font-medium text-secondary-600 hover:text-secondary-700"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}