"use client";

import { QRCodeSVG } from "qrcode.react";

interface QRCodeDisplayProps {
  value: string;
  size?: number;
  className?: string;
  includeMargin?: boolean;
  level?: "L" | "M" | "Q" | "H";
}

export function QRCodeDisplay({
  value,
  size = 128,
  className = "",
  includeMargin = true,
  level = "M",
}: QRCodeDisplayProps) {
  return (
    <div
      className={`bg-white p-3 rounded-lg border-2 border-gray-200 ${className}`}
      role="img"
      aria-label="QR code for arrival card verification"
    >
      <QRCodeSVG
        value={value}
        size={size}
        level={level}
        includeMargin={includeMargin}
        bgColor="#ffffff"
        fgColor="#000000"
        imageSettings={{
          src: "/zim-coat-of-arms.png",
          x: undefined,
          y: undefined,
          height: 24,
          width: 24,
          excavate: true,
        }}
      />
    </div>
  );
}
