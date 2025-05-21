"use client";

import Link from "next/link";
import {
  Facebook,
  Instagram,
  Twitter,
  GitlabIcon as GitHub,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  // Don't show footer on admin pages
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-surface pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-heading font-bold mb-4">
              <span className="text-primary">PEKAN</span> OLAHRAGA!
            </h3>
            <p className="text-text-secondary mb-4">
              Event tahunan yang mempertemukan mahasiswa-mahasiswi dari seluruh
              jurusan kampus.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-text-secondary hover:text-primary transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/syafwan_pj?igsh=MXhrbDBrbDB2ejdhbA=="
                className="text-text-secondary hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-text-secondary hover:text-primary transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://github.com/chalik1pj"
                className="text-text-secondary hover:text-primary transition-colors"
              >
                <GitHub className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Tautan Cepat</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-text-secondary hover:text-primary transition-colors"
                >
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  href="/#about"
                  className="text-text-secondary hover:text-primary transition-colors"
                >
                  Tentang
                </Link>
              </li>
              <li>
                <Link
                  href="/#sports"
                  className="text-text-secondary hover:text-primary transition-colors"
                >
                  Cabang Olahraga
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-text-secondary hover:text-primary transition-colors"
                >
                  Pendaftaran
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/login"
                  className="text-text-secondary hover:text-primary transition-colors"
                >
                  Login Admin
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Hubungi Kami</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Mail className="h-5 w-5 text-primary mr-2 mt-0.5" />
                <span className="text-text-secondary">
                  syafwanchalik5@gmail.com
                </span>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 text-primary mr-2 mt-0.5" />
                <span className="text-text-secondary">+62 812 3456 7890</span>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-primary mr-2 mt-0.5" />
                <span className="text-text-secondary">
                  Kampus STIKOM Tunas Bangsa, Jl. Jenderal Sudirman No. 77,
                  Pematangsiantar, Indonesia
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 text-center">
          <p className="text-sm text-text-secondary">
            &copy; {new Date().getFullYear()} Pekan Olahraga. Seluruh hak cipta
            dilindungi. Dibuat oleh{" "}
            <a
              href="https://github.com/chalik1pj"
              className="text-primary hover:underline"
            >
              SyafwanChalik
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
