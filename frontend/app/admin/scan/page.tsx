"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import {
  CheckCircle,
  Loader2,
  QrCode,
  Search,
  XCircle,
  Scan,
} from "lucide-react";
import AdminLayout from "@/components/layout/AdminLayout";
import { jwtDecode } from "jwt-decode";
import QrCodeScanner from "@/components/QrCodeScanner";

type ScanResult = {
  participant: {
    id: number;
    nama: string;
    email: string;
    nowa: string;
    kelas: string;
    status: string;
    updateAt: string | null;
    cabang: {
      id: number;
      nama: string;
      participant: number;
      harga: number;
    };
  };
  message: string;
};

export default function ScanQRPage() {
  const [qrCode, setQrCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanMode, setScanMode] = useState<"manual" | "scanner">("manual");

  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    // Verify token expiration
    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        localStorage.removeItem("adminToken");
        router.push("/admin/login");
        return;
      }
    } catch (error) {
      localStorage.removeItem("adminToken");
      router.push("/admin/login");
      return;
    }
  }, [router]);

  // Process the QR code data - extract numeric ID if needed
  const processQrCode = async (code: string) => {
    if (!code.trim()) {
      toast.error("Silakan masukkan ID QR code");
      return;
    }

    // Clean up the scanned data to extract just the numeric ID
    let participantId = code.trim();

    // Check if the code might be JSON (starts with { and ends with })
    if (participantId.startsWith("{") && participantId.endsWith("}")) {
      try {
        // Try to parse as JSON
        const jsonData = JSON.parse(participantId);
        // Extract the ID field if it exists
        if (jsonData && jsonData.id !== undefined) {
          participantId = jsonData.id.toString();
        }
      } catch (e) {
        // If parsing fails, continue with the original string
        console.log("Not valid JSON, using as-is:", participantId);
      }
    }

    // Log the extracted ID for debugging
    console.log("Processing participant ID:", participantId);

    setIsLoading(true);
    setError(null);
    setScanResult(null);

    try {
      const response = await axios.patch(
        `http://localhost:5000/api/admin/scan/${participantId}`
      );

      if (response.data.status === "success") {
        setScanResult(response.data.data);
        toast.success(response.data.message || "QR code berhasil dipindai");
      }
    } catch (error: any) {
      console.error("Error scanning QR code:", error);
      setError(error.response?.data?.message || "Gagal memindai QR code");
      toast.error(error.response?.data?.message || "QR code tidak valid");
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualScan = async (e: React.FormEvent) => {
    e.preventDefault();
    await processQrCode(qrCode);
  };

  const handleScanSuccess = async (decodedText: string) => {
    // Set the QR code value in the input field for reference
    setQrCode(decodedText);

    // Process the scanned QR code
    await processQrCode(decodedText);
  };

  const handleScanError = (errorMessage: string) => {
    setError(errorMessage);
    toast.error(errorMessage);
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-heading font-bold mb-8">
          QR Code Scanner
        </h1>

        <div className="max-w-2xl mx-auto">
          <div className="bg-surface rounded-xl p-6 shadow-md mb-8">
            <div className="flex justify-center mb-6">
              <div className="inline-flex rounded-md shadow-sm" role="group">
                <button
                  type="button"
                  onClick={() => setScanMode("manual")}
                  className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                    scanMode === "manual"
                      ? "bg-primary text-white"
                      : "bg-surface text-text-primary hover:bg-primary/10"
                  }`}
                >
                  <QrCode className="h-4 w-4 mr-2 inline-block" />
                  Input Manual
                </button>
                <button
                  type="button"
                  onClick={() => setScanMode("scanner")}
                  className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                    scanMode === "scanner"
                      ? "bg-primary text-white"
                      : "bg-surface text-text-primary hover:bg-primary/10"
                  }`}
                >
                  <Scan className="h-4 w-4 mr-2 inline-block" />
                  Pindai QR
                </button>
              </div>
            </div>

            {scanMode === "manual" ? (
              <form onSubmit={handleManualScan} className="space-y-4">
                <div>
                  <label
                    htmlFor="qrCode"
                    className="block text-sm font-medium mb-1"
                  >
                    Masukkan ID QR Code
                  </label>
                  <div className="relative">
                    <input
                      id="qrCode"
                      type="text"
                      className="input-field pl-10"
                      placeholder="Masukkan ID peserta dari QR code"
                      value={qrCode}
                      onChange={(e) => setQrCode(e.target.value)}
                    />
                    <QrCode className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-primary w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Memindai...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-5 w-5" />
                      Pindai QR Code
                    </>
                  )}
                </button>
              </form>
            ) : (
              <QrCodeScanner
                onScanSuccess={handleScanSuccess}
                onScanError={handleScanError}
              />
            )}
          </div>

          {error && !scanResult && (
            <div className="bg-red-500/10 border border-red-500 rounded-xl p-6 text-center">
              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Pemindaian Gagal</h2>
              <p className="text-text-secondary">{error}</p>
            </div>
          )}

          {scanResult && (
            <div className="bg-green-500/10 border border-green-500 rounded-xl p-6">
              <div className="text-center mb-6">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">
                  Peserta Terverifikasi
                </h2>
                <p className="text-text-secondary">{scanResult.message}</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-background rounded-lg p-4">
                    <p className="text-sm text-text-secondary mb-1">Nama</p>
                    <p className="font-semibold">
                      {scanResult.participant.nama}
                    </p>
                  </div>

                  <div className="bg-background rounded-lg p-4">
                    <p className="text-sm text-text-secondary mb-1">Kelas</p>
                    <p className="font-semibold">
                      {scanResult.participant.kelas}
                    </p>
                  </div>

                  <div className="bg-background rounded-lg p-4">
                    <p className="text-sm text-text-secondary mb-1">Email</p>
                    <p className="font-semibold">
                      {scanResult.participant.email}
                    </p>
                  </div>

                  <div className="bg-background rounded-lg p-4">
                    <p className="text-sm text-text-secondary mb-1">Telepon</p>
                    <p className="font-semibold">
                      {scanResult.participant.nowa}
                    </p>
                  </div>
                </div>

                <div className="bg-background rounded-lg p-4">
                  <p className="text-sm text-text-secondary mb-1">ID Peserta</p>
                  <p className="font-semibold">{scanResult.participant.id}</p>
                </div>

                <div className="bg-background rounded-lg p-4">
                  <p className="text-sm text-text-secondary mb-1">
                    Cabang Olahraga
                  </p>
                  <p className="font-semibold">
                    {scanResult.participant.cabang.nama}
                  </p>
                </div>

                <div className="bg-background rounded-lg p-4">
                  <p className="text-sm text-text-secondary mb-1">
                    Status Pendaftaran
                  </p>
                  <div className="flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full mr-2 ${
                        scanResult.participant.status === "APPROVED"
                          ? "bg-green-500"
                          : scanResult.participant.status === "PENDING"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    ></div>
                    <p className="font-semibold">
                      {scanResult.participant.status}
                    </p>
                  </div>
                </div>

                <div className="bg-background rounded-lg p-4">
                  <p className="text-sm text-text-secondary mb-1">
                    Waktu Registrasi Ulang
                  </p>
                  <p className="font-semibold">
                    {scanResult.participant.updateAt
                      ? new Date(
                          scanResult.participant.updateAt
                        ).toLocaleString()
                      : "Baru saja selesai"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
