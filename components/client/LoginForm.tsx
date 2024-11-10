"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface LoginFormProps {
  onRegisterClick?: () => void;  // Untuk beralih ke form register
  onSuccess?: () => void;        // Untuk menutup modal setelah berhasil
}

// Form Schema
const loginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
  remember: z.boolean().optional(),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginForm({ onRegisterClick, onSuccess }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      window.location.href = '/api/auth/google';
    } catch (error) {
      console.error('Google login error:', error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error instanceof Error ? error.message : "Failed to login with Google"
      });
      setIsLoading(false);
    }
  };

  const onSubmit = async (values: LoginForm) => {
    try {
      setIsLoading(true);

      const response = await fetch("/api/client/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to login");
      }

      toast({
        title: "Login successful",
        description: "Welcome back!",
      });

      // Memanggil onSuccess untuk menutup modal
      if (onSuccess) {
        onSuccess();
      }

      router.push("/dashboard");
      router.refresh();

    } catch (error) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error instanceof Error ? error.message : "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-primary-900">Email</label>
          <Input 
            type="email"
            placeholder="Enter your email"
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
              placeholder="Enter your password"
              className="pr-10"
              {...form.register("password")}
              disabled={isLoading}
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
          {form.formState.errors.password && (
            <p className="text-sm text-red-500">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="remember"
              {...form.register("remember")}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              disabled={isLoading}
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

        <Button 
          type="submit" 
          className="w-full h-11 bg-primary-600 hover:bg-primary-700 text-white"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
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
        <Button 
          variant="outline" 
          className="h-11" 
          onClick={handleGoogleLogin}
          disabled={isLoading}
        >
          <Image
            src="/images/google.png"
            alt="Google"
            width={20}
            height={20}
            className="mr-2"
          />
          Continue with Google
        </Button>
      </div>

      {/* Sign Up Link */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={onRegisterClick}
            className="font-medium text-secondary-600 hover:text-secondary-700 hover:underline transition-all"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}