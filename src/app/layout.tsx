import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "SI-PKP | PT Kereta Api Indonesia",
  description:
    "Sistem Informasi Pengelolaan dan Penanganan Keluhan Pelanggan PT KAI",
  keywords: [
    "SI-PKP",
    "keluhan pelanggan",
    "PT KAI",
    "complaint management",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
