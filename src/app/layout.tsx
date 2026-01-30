import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "@/components/providers/session-provider";

export const metadata: Metadata = {
  title: "Zimbabwe Arrival Card",
  description:
    "Official Zimbabwe Immigration Arrival Card System for all entries into Zimbabwe",
  keywords: ["Zimbabwe", "Immigration", "Arrival Card", "Border Control"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
