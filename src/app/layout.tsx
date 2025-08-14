import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import MaintenanceOverlay from "@/components/MaintenanceOverlay";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lumina Cheats",
  description: "High-performance tools with a modern, sleek UI. Role-gated access with Discord.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0b0b14] text-white`}
      >
        <AuthProvider>
          <Nav />
          <main className="relative z-10 min-h-[calc(100vh-80px)]">{children}</main>
          <Footer />
          <MaintenanceOverlay />
        </AuthProvider>
      </body>
    </html>
  );
}
