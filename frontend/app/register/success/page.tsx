"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Download,
  Info,
  Users,
} from "lucide-react";

export default function RegistrationSuccessPage() {
  const searchParams = useSearchParams();
  const [registrationDetails, setRegistrationDetails] = useState<{
    id: string;
    sportName: string;
    participants: number;
    price: number;
    date: string;
    status: string;
  } | null>(null);

  useEffect(() => {
    // Try to get registration details from session storage
    const storedDetails = sessionStorage.getItem("registrationDetails");

    if (storedDetails) {
      setRegistrationDetails(JSON.parse(storedDetails));
    } else {
      // If no stored details, use placeholder data
      setRegistrationDetails({
        id: "REG123456",
        sportName: "Sepak Bola",
        participants: 2,
        price: 500000,
        date: new Date().toLocaleDateString("id-ID", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        status: "PENDING",
      });
    }
  }, [searchParams]);

  // Function to determine sport image
  const getSportImage = (sportName: string) => {
    if (sportName.includes("Sepak Bola")) return "/images/sports/soccer.png";
    if (sportName.includes("Basket")) return "/images/sports/basketball.png";
    if (sportName.includes("Voli")) return "/images/sports/volleyball.png";
    if (sportName.includes("Tangkis")) return "/images/sports/badminton.png";
    if (sportName.includes("Tenis")) return "/images/sports/table-tennis.png";
    if (sportName.includes("Renang")) return "/images/sports/swimming.png";
    return "/images/sports/default.png";
  };

  if (!registrationDetails) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center text-primary mb-8 hover:underline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Beranda
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-surface rounded-2xl p-6 md:p-10 shadow-xl"
          >
            <div className="flex flex-col items-center justify-center mb-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <CheckCircle className="w-20 h-20 text-green-500 mb-4" />
              </motion.div>
              <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">
                Pendaftaran Berhasil!
              </h1>
              <p className="text-text-secondary">
                Terima kasih telah mendaftar untuk Pekan Olahraga 2025
              </p>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Detail Pendaftaran</h2>
                <span className="px-3 py-1 bg-yellow-500/20 text-yellow-500 rounded-full text-sm font-medium">
                  {registrationDetails.status}
                </span>
              </div>

              <div className="flex flex-col md:flex-row gap-6 mb-6">
                <div className="flex-1">
                  <div className="text-sm text-text-secondary mb-1">
                    ID Pendaftaran
                  </div>
                  <div className="text-xl font-mono font-semibold">
                    {registrationDetails.id}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-sm text-text-secondary mb-1">
                    Tanggal Pendaftaran
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-primary" />
                    {registrationDetails.date}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-700 my-4"></div>

              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-lg font-semibold mb-2">
                    {registrationDetails.sportName}
                  </h3>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex items-center justify-center md:justify-start">
                      <Users className="w-4 h-4 mr-2 text-primary" />
                      <span>{registrationDetails.participants} peserta</span>
                    </div>
                    <div className="font-medium">
                      Rp {registrationDetails.price.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 mb-8">
              <div className="flex items-start">
                <Info className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-medium mb-2">Langkah Selanjutnya</h3>
                  <ul className="text-sm space-y-2 text-text-secondary">
                    <li>1. Periksa email Anda untuk konfirmasi pendaftaran</li>
                    <li>2. Tunggu persetujuan dari panitia (1-2 hari kerja)</li>
                    <li>
                      3. Setelah disetujui, Anda akan menerima QR Code untuk
                      registrasi ulang
                    </li>
                    <li>
                      4. Simpan QR Code tersebut dan bawa saat hari pertandingan
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/" className="btn btn-outline flex-1">
                <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Beranda
              </Link>
              <button className="btn btn-primary flex-1">
                <Download className="mr-2 h-4 w-4" /> Unduh Bukti Pendaftaran
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
