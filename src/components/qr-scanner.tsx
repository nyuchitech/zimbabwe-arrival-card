"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Camera, CameraOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QRScannerProps {
  onScan: (data: string) => void;
  onError?: (error: string) => void;
}

export function QRScanner({ onScan, onError }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const startScanning = async () => {
    if (!containerRef.current) return;

    try {
      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          onScan(decodedText);
          // Don't stop scanning - let the parent handle it
        },
        (errorMessage) => {
          // Ignore scan errors (no QR found)
          if (errorMessage.includes("No QR code found")) return;
          console.log("QR scan error:", errorMessage);
        }
      );

      setIsScanning(true);
      setHasPermission(true);
    } catch (err) {
      console.error("Failed to start scanner:", err);
      setHasPermission(false);
      onError?.("Camera access denied or not available");
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current && isScanning) {
      try {
        await scannerRef.current.stop();
        scannerRef.current = null;
        setIsScanning(false);
      } catch (err) {
        console.error("Failed to stop scanner:", err);
      }
    }
  };

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  return (
    <div className="space-y-4">
      <div
        id="qr-reader"
        ref={containerRef}
        className="relative w-full max-w-md mx-auto bg-black rounded-lg overflow-hidden"
        style={{ minHeight: isScanning ? "300px" : "200px" }}
      >
        {!isScanning && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-white p-4">
            {hasPermission === false ? (
              <>
                <CameraOff className="h-12 w-12 mb-4 text-red-400" aria-hidden="true" />
                <p className="text-center text-sm">
                  Camera access denied. Please enable camera permissions to scan QR codes.
                </p>
              </>
            ) : (
              <>
                <Camera className="h-12 w-12 mb-4 text-gray-400" aria-hidden="true" />
                <p className="text-center text-sm text-gray-400">
                  Click the button below to start scanning arrival card QR codes.
                </p>
              </>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-center gap-3">
        {!isScanning ? (
          <Button
            onClick={startScanning}
            className="bg-zim-green hover:bg-zim-green/90 min-h-[44px]"
          >
            <Camera className="h-4 w-4 mr-2" aria-hidden="true" />
            Start Scanner
          </Button>
        ) : (
          <>
            <Button
              onClick={stopScanning}
              variant="outline"
              className="min-h-[44px]"
            >
              <CameraOff className="h-4 w-4 mr-2" aria-hidden="true" />
              Stop Scanner
            </Button>
            <Button
              onClick={() => {
                stopScanning();
                setTimeout(startScanning, 100);
              }}
              variant="outline"
              className="min-h-[44px]"
            >
              <RefreshCw className="h-4 w-4 mr-2" aria-hidden="true" />
              Reset
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
