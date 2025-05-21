"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import {
  Html5Qrcode,
  Html5QrcodeScannerState,
  Html5QrcodeError,
} from "html5-qrcode";
import { Camera, StopCircle, Upload, RefreshCw } from "lucide-react";

interface QrCodeScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanError?: (error: string) => void;
}

export default function QrCodeScanner({
  onScanSuccess,
  onScanError,
}: QrCodeScannerProps) {
  const [scannerState, setScannerState] = useState<
    "idle" | "camera" | "file" | "scanning"
  >("idle");
  const [availableCameras, setAvailableCameras] = useState<
    Array<{ id: string; label: string }>
  >([]);
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerId = "qr-reader";

  // Initialize scanner on component mount
  useEffect(() => {
    scannerRef.current = new Html5Qrcode(scannerContainerId);

    // Get available cameras
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length) {
          setAvailableCameras(devices);
          setSelectedCamera(devices[0].id); // Select the first camera by default
        }
      })
      .catch((err) => {
        console.error("Error getting cameras", err);
        setError(
          "Tidak dapat mengakses kamera. Pastikan Anda memberikan izin kamera."
        );
        if (onScanError) onScanError("Tidak dapat mengakses kamera");
      });

    // Cleanup on unmount
    return () => {
      if (
        scannerRef.current &&
        scannerRef.current.getState() === Html5QrcodeScannerState.SCANNING
      ) {
        scannerRef.current
          .stop()
          .catch((err) => console.error("Error stopping scanner", err));
      }
    };
  }, [onScanError]);

  // Process the scanned QR code data
  const processQrCodeData = (decodedText: string) => {
    console.log("Raw QR code data:", decodedText);

    // Prevent duplicate scans within a short time period
    if (lastScannedCode === decodedText) {
      return;
    }

    setLastScannedCode(decodedText);

    // Reset the last scanned code after a delay to allow rescanning the same code
    setTimeout(() => {
      setLastScannedCode(null);
    }, 3000);

    // Pass the decoded text to the parent component
    onScanSuccess(decodedText);
  };

  const startCameraScanner = async () => {
    if (!scannerRef.current || !selectedCamera) return;

    setIsLoading(true);
    setError(null);
    setScannerState("scanning");

    try {
      await scannerRef.current.start(
        selectedCamera,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          // On successful scan
          processQrCodeData(decodedText);
          // Don't stop scanner automatically to allow multiple scans
        },
        (errorMessage) => {
          // Ignore errors during scanning as they're usually just frames without QR codes
          console.log(errorMessage);
        }
      );
    } catch (err) {
      console.error("Error starting scanner", err);
      const errorMessage =
        err instanceof Html5QrcodeError
          ? err.message
          : "Gagal memulai pemindai kamera";

      setError(errorMessage);
      if (onScanError) onScanError(errorMessage);
      setScannerState("idle");
    } finally {
      setIsLoading(false);
    }
  };

  const stopCameraScanner = async () => {
    if (
      !scannerRef.current ||
      scannerRef.current.getState() !== Html5QrcodeScannerState.SCANNING
    )
      return;

    setIsLoading(true);
    try {
      await scannerRef.current.stop();
      setScannerState("idle");
    } catch (err) {
      console.error("Error stopping scanner", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !scannerRef.current) return;

    setIsLoading(true);
    setError(null);
    setScannerState("file");

    try {
      const result = await scannerRef.current.scanFile(file, true);
      processQrCodeData(result);
    } catch (err) {
      console.error("Error scanning file", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Gagal memindai file. Pastikan file berisi QR code yang valid.";

      setError(errorMessage);
      if (onScanError) onScanError(errorMessage);
    } finally {
      setIsLoading(false);
      setScannerState("idle");
      // Reset file input
      event.target.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 justify-center mb-4">
        <button
          onClick={() =>
            setScannerState((prev) => (prev === "camera" ? "idle" : "camera"))
          }
          className={`btn ${
            scannerState === "camera" ? "btn-primary" : "btn-outline"
          }`}
          disabled={isLoading || scannerState === "scanning"}
        >
          <Camera className="mr-2 h-5 w-5" />
          Gunakan Kamera
        </button>

        <label
          className={`btn ${
            scannerState === "file" ? "btn-primary" : "btn-outline"
          } cursor-pointer`}
        >
          <Upload className="mr-2 h-5 w-5" />
          Unggah Gambar QR
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
            disabled={isLoading || scannerState === "scanning"}
          />
        </label>

        {scannerState === "scanning" && (
          <button
            onClick={stopCameraScanner}
            className="btn btn-outline border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
            disabled={isLoading}
          >
            <StopCircle className="mr-2 h-5 w-5" />
            Hentikan Pemindaian
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 text-center mb-4">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {scannerState === "camera" && !isLoading && (
        <div className="space-y-4">
          {availableCameras.length > 1 && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Pilih Kamera
              </label>
              <select
                className="input-field"
                value={selectedCamera || ""}
                onChange={(e) => setSelectedCamera(e.target.value)}
              >
                {availableCameras.map((camera) => (
                  <option key={camera.id} value={camera.id}>
                    {camera.label || `Kamera ${camera.id}`}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={startCameraScanner}
            className="btn btn-primary w-full"
            disabled={!selectedCamera}
          >
            Mulai Pemindaian
          </button>
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center py-4">
          <RefreshCw className="h-8 w-8 text-primary animate-spin" />
        </div>
      )}

      <div
        id={scannerContainerId}
        className={`overflow-hidden rounded-lg ${
          scannerState !== "scanning" ? "hidden" : ""
        }`}
      ></div>

      {scannerState === "scanning" && (
        <p className="text-center text-sm text-text-secondary">
          Arahkan kamera ke QR code untuk memindai
        </p>
      )}
    </div>
  );
}
