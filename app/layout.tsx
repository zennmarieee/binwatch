import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin",
  ],
});

export const metadata: Metadata = {
  title: "BinWatch: Smart Campus Waste Reporting",
  description:
    "BinWatch is a smart QR-based waste reporting system for campuses, enabling students to report overflowing bins and staff to manage reports in real time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth bg-[#f0f4f8] text-[#191c1d]`}
    >
      <body className={`${geistSans.className} min-h-full flex flex-col`}>
        {children}
      </body>
    </html>
  );
}