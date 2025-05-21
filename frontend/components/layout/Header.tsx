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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/90 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-heading font-bold">
              <span className="text-primary">Pekan</span> Olahraga
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-text-primary hover:text-primary transition-colors"
            >
              Beranda
            </Link>
            <Link
              href="/#about"
              className="text-text-primary hover:text-primary transition-colors"
            >
              Tentang
            </Link>
            <Link
              href="/#sports"
              className="text-text-primary hover:text-primary transition-colors"
            >
              Cabang Olahraga
            </Link>
            <Link
              href="/#contact"
              className="text-text-primary hover:text-primary transition-colors"
            >
              Kontak
            </Link>
            <Link href="/register" className="btn btn-primary">
              Daftar Sekarang
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
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
        <div className="md:hidden bg-surface">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-text-primary hover:text-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Beranda
              </Link>
              <Link
                href="/#about"
                className="text-text-primary hover:text-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Tentang
              </Link>
              <Link
                href="/#sports"
                className="text-text-primary hover:text-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Cabang Olahraga
              </Link>
              <Link
                href="/#contact"
                className="text-text-primary hover:text-primary transition-colors py-2"
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
