"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BarChart3, LogOut, Menu, QrCode, Users, X } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={`bg-surface fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0`}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
            <Link href="/admin/dashboard" className="flex items-center">
              <span className="text-xl font-heading font-bold">
                <span className="text-primary">PEKAN</span> OLAHRAGA!!
              </span>
            </Link>

            {isMobile && (
              <button onClick={() => setIsSidebarOpen(false)}>
                <X className="h-6 w-6 text-text-secondary" />
              </button>
            )}
          </div>

          <nav className="flex-1 px-2 py-4 space-y-1">
            <Link
              href="/admin/dashboard"
              className="flex items-center px-4 py-3 text-text-primary hover:bg-primary/10 rounded-lg"
            >
              <BarChart3 className="h-5 w-5 mr-3 text-primary" />
              Dashboard
            </Link>

            <Link
              href="/admin/scan"
              className="flex items-center px-4 py-3 text-text-primary hover:bg-primary/10 rounded-lg"
            >
              <QrCode className="h-5 w-5 mr-3 text-primary" />
              Scan QR Code
            </Link>

            <Link
              href="/admin/participants"
              className="flex items-center px-4 py-3 text-text-primary hover:bg-primary/10 rounded-lg"
            >
              <Users className="h-5 w-5 mr-3 text-primary" />
              Peserta
            </Link>
          </nav>

          <div className="p-4 border-t border-gray-700">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-text-primary hover:bg-red-500/10 rounded-lg"
            >
              <LogOut className="h-5 w-5 mr-3 text-red-500" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-surface h-16 flex items-center px-4 border-b border-gray-700">
          {isMobile && (
            <button onClick={() => setIsSidebarOpen(true)} className="mr-4">
              <Menu className="h-6 w-6 text-text-secondary" />
            </button>
          )}
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </header>

        <main className="flex-1 overflow-auto">{children}</main>
      </div>

      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
