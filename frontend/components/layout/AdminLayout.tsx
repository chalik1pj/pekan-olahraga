"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { BarChart3, LogOut, Menu, QrCode, Users, X, Home } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

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

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    router.push("/admin/login");
  };

  const isActivePath = (path: string) => {
    return pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`admin-sidebar fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0`}
      >
        <div className="h-full flex flex-col">
          {/* Logo/Brand */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <Link href="/admin/dashboard" className="flex items-center">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">PO</span>
              </div>
              <span className="text-lg font-heading font-bold text-gray-900">
                Admin Panel
              </span>
            </Link>

            {isMobile && (
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            <Link
              href="/admin/dashboard"
              className={`admin-nav-item ${
                isActivePath("/admin/dashboard") ? "active" : ""
              }`}
            >
              <BarChart3 className="h-5 w-5 mr-3" />
              Dashboard
            </Link>

            <Link
              href="/admin/scan"
              className={`admin-nav-item ${
                isActivePath("/admin/scan") ? "active" : ""
              }`}
            >
              <QrCode className="h-5 w-5 mr-3" />
              Scan QR Code
            </Link>

            <Link
              href="/admin/participants"
              className={`admin-nav-item ${
                isActivePath("/admin/participant") ? "active" : ""
              }`}
            >
              <Users className="h-5 w-5 mr-3" />
              Peserta
            </Link>

            <div className="pt-4 mt-4 border-t border-gray-200">
              <Link href="/" className="admin-nav-item">
                <Home className="h-5 w-5 mr-3" />
                Kembali ke Website
              </Link>
            </div>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-all duration-200 font-medium"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="admin-header h-16 flex items-center px-4 lg:px-6">
          {isMobile && (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="mr-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu className="h-5 w-5 text-gray-600" />
            </button>
          )}

          <div className="flex-1">
            <h1 className="text-xl font-heading font-bold text-gray-900">
              {pathname === "/admin/dashboard" && "Dashboard"}
              {pathname === "/admin/scan" && "QR Code Scanner"}
              {pathname === "/admin/participant" && "Manajemen Peserta"}
            </h1>
          </div>

          {/* User Info */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-900">Administrator</p>
              <p className="text-xs text-gray-500">Pekan Olahraga 2025</p>
            </div>
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">A</span>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto bg-gray-50 p-4 lg:p-6">
          <div className="admin-fade-in">{children}</div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-40 transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
