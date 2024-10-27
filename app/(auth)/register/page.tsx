"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

// Form Schema
const registerSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  terms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions.",
  }),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      terms: false,
    },
  });

  const onSubmit = async (values: RegisterForm) => {
    try {
      setIsLoading(true);

      const response = await fetch("/api/client/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
          username: `${values.firstName.toLowerCase()}${Math.floor(Math.random() * 1000)}`, // Generate simple username
          fullName: `${values.firstName} ${values.lastName}`,
          // Optional fields can be added here
          interests: [],
          hobbies: [],
          currentStatus: "Mencari Kerja",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      toast({
        title: "Registration successful",
        description: "Your account has been created successfully.",
      });

      // Redirect to login page
      router.push("/login");

    } catch (error) {
      console.error("Registration error:", error);
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary-900">First Name</label>
              <Input 
                placeholder="John"
                {...form.register("firstName")}
                disabled={isLoading}
              />
              {form.formState.errors.firstName && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.firstName.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary-900">Last Name</label>
              <Input 
                placeholder="Doe"
                {...form.register("lastName")}
                disabled={isLoading}
              />
              {form.formState.errors.lastName && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-primary-900">Email</label>
            <Input 
              type="email" 
              placeholder="john@example.com"
              {...form.register("email")}
              disabled={isLoading}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-500">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-primary-900">Password</label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                className="pr-10"
                {...form.register("password")}
                disabled={isLoading}
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
            {form.formState.errors.password && (
              <p className="text-sm text-red-500">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-start space-x-2">
          <input
            type="checkbox"
            id="terms"
            {...form.register("terms")}
            className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            disabled={isLoading}
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
        {form.formState.errors.terms && (
          <p className="text-sm text-red-500 mt-1">
            {form.formState.errors.terms.message}
          </p>
        )}

        <Button 
          type="submit" 
          className="w-full bg-primary-600 hover:bg-primary-700 text-white"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Account...
            </>
          ) : (
            "Create Account"
          )}
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
        <Button variant="outline" disabled={isLoading}>
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

      {/* Login and Home Links */}
      <div className="text-center space-y-4">
      <p className="text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link 
          href="/login" 
          className="font-medium text-secondary-600 hover:text-secondary-700 hover:underline transition-all"
        >
          Sign in
        </Link>
      </p>
      
      <div className="flex items-center justify-center gap-2">
        <div className="h-px w-12 bg-gray-200"></div>
        <Link 
          href="/" 
          className="group flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
        <div className="h-px w-12 bg-gray-200"></div>
      </div>
      </div>
    </div>
  );
}