"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const [showHeader, setShowHeader] = useState(true);

  useEffect(() => {
    setShowHeader(!pathname.startsWith("/admin"));
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!showHeader) {
    return null;
  }

  // Check if we're on registration pages
  const isRegistrationPage = pathname.startsWith("/register");

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isRegistrationPage
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-heading font-bold">
              <span
                className={`${
                  isScrolled || isRegistrationPage
                    ? "text-primary"
                    : "text-white"
                }`}
              >
                Pekan
              </span>{" "}
              <span
                className={`${
                  isScrolled || isRegistrationPage
                    ? "text-gray-900"
                    : "text-white"
                }`}
              >
                Olahraga
              </span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`font-medium transition-colors ${
                isScrolled || isRegistrationPage
                  ? "text-gray-700 hover:text-primary"
                  : "text-white hover:text-yellow-300"
              }`}
            >
              Beranda
            </Link>
            <Link
              href="/#about"
              className={`font-medium transition-colors ${
                isScrolled || isRegistrationPage
                  ? "text-gray-700 hover:text-primary"
                  : "text-white hover:text-yellow-300"
              }`}
            >
              Tentang
            </Link>
            <Link
              href="/#sports"
              className={`font-medium transition-colors ${
                isScrolled || isRegistrationPage
                  ? "text-gray-700 hover:text-primary"
                  : "text-white hover:text-yellow-300"
              }`}
            >
              Cabang Olahraga
            </Link>
            <Link
              href="/#contact"
              className={`font-medium transition-colors ${
                isScrolled || isRegistrationPage
                  ? "text-gray-700 hover:text-primary"
                  : "text-white hover:text-yellow-300"
              }`}
            >
              Kontak
            </Link>
            <Link href="/register" className="btn btn-primary">
              Daftar Sekarang
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden transition-colors ${
              isScrolled || isRegistrationPage ? "text-gray-900" : "text-white"
            }`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-gray-700 hover:text-primary transition-colors py-2 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Beranda
              </Link>
              <Link
                href="/#about"
                className="text-gray-700 hover:text-primary transition-colors py-2 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Tentang
              </Link>
              <Link
                href="/#sports"
                className="text-gray-700 hover:text-primary transition-colors py-2 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Cabang Olahraga
              </Link>
              <Link
                href="/#contact"
                className="text-gray-700 hover:text-primary transition-colors py-2 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Kontak
              </Link>
              <Link
                href="/register"
                className="btn btn-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Daftar Sekarang
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
