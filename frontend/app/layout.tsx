import type React from "react";
import type { Metadata } from "next";
import { Poppins, Montserrat } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pekan Olahraga 2025",
  description: "Daftar untuk event olahraga terbesar tahun ini!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`scroll-smooth ${poppins.variable} ${montserrat.variable}`}
    >
      <body className="font-sans bg-background text-text-primary min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#fff",
              color: "#333",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            },
          }}
        />
      </body>
    </html>
  );
}
