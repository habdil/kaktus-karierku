"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoginForm } from "../client/LoginForm";
import RegisterFormComponent from "../client/RegisterForm";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegistOpen, setIsRegistOpen] = useState(false);

  const navItems = [
    { name: "Beranda", href: "/" },
    { name: "Event", href: "/events" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const handleOpenLogin = () => {
    setIsLoginOpen(true);
  };

  const handleOpenRegister = () => {
    setIsRegistOpen(true);
  };

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
            <Button variant="ghost" onClick={handleOpenLogin}>
              Log in
            </Button>
            <Button className=" text-gray-50 bg-primary-600 hover:bg-primary-700" onClick={handleOpenRegister}>
              Sign up
            </Button>
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
              <Button variant="ghost" className="w-full justify-center bg-gray-100" onClick={handleOpenLogin}>
                Log in
              </Button>
              <Button className="w-full bg-primary-600 hover:bg-primary-700 text-white" onClick={handleOpenRegister}>
                Register
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Dialog Components */}
      <LoginForm isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <RegisterFormComponent isRegisterOpen={isRegistOpen} onClose={() => setIsRegistOpen(false)} />
    </nav>
  );
};

export default Navbar;
