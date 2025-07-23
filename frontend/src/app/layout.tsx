import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/providers";
import { globalMetadata, globalViewport } from "@/config/seo";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
export const metadata: Metadata = globalMetadata;
export const viewport = globalViewport;
export const dynamic = 'force-dynamic'; // We MUST need this to be force-dynamic to allow for nonces to be set in the middleware (which is essential for CSP)

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <GoogleAnalytics />
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
