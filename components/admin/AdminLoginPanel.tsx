"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LogIn } from "lucide-react";
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

export function AdminLoginPanel() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    // Add your login logic here
    // await loginAdmin(email, password);
    setTimeout(() => {
      setIsLoading(false);
      router.push('/admin/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="relative w-16 h-16">
              <Image
                src="/images/logo.png"
                alt="Logo"
                fill
                className="object-contain"
              />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Admin Panel
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Masuk ke dashboard admin untuk mengelola platform
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@perusahaan.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password"
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  title="Remember me"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="remember" className="text-sm font-normal">
                  Ingat saya
                </Label>
              </div>
              <Link
                href="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Lupa password?
              </Link>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary-600"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  <span>Memproses...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <LogIn className="h-4 w-4 text-white" />
                  <span className="text-white">Masuk</span>
                </div>
              )}
            </Button>
          </CardFooter>
        </form>
        <div className="p-6 pt-0">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Atau
              </span>
            </div>
          </div>
          <div className="mt-6 flex flex-col space-y-2 text-center text-sm">
            <p className="text-muted-foreground">
              Membutuhkan bantuan?{" "}
              <Link href="/contact" className="text-primary hover:underline">
                Hubungi support
              </Link>
            </p>
            <p className="text-muted-foreground">
              Kembali ke{" "}
              <Link href="/" className="text-primary hover:underline">
                Beranda
              </Link>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}