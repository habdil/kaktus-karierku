"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthDialog } from "../client/AuthDialog";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Beranda", href: "/" },
    { name: "Event", href: "/events" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={40}
              height={40}
              className="w-auto h-8"
            />
            <span className="hidden font-semibold sm:block text-primary-900">
              Karierku
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Login Button */}
          <div className="hidden md:flex md:items-center md:space-x-4">
          <AuthDialog mode="login">
            <Button variant="ghost" className="text-primary-900">
              Login
            </Button>
          </AuthDialog>
          
          <AuthDialog mode="register">
            <Button className="text-gray-50 bg-primary-600 hover:bg-primary-700">
              Sign up
            </Button>
          </AuthDialog>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              className="text-gray-500"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-primary hover:bg-primary-50 rounded-md"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="grid gap-2 px-3 py-2">
            <AuthDialog mode="login">
            <Button variant="ghost">
              Log in
            </Button>
          </AuthDialog>
          
          <AuthDialog mode="register">
            <Button className="text-gray-50 bg-primary-600 hover:bg-primary-700">
              Sign up
            </Button>
          </AuthDialog>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;