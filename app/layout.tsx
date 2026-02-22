import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import FontLoader from "@/components/FontLoader";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "Jewelry Store Management System",
  description: "Jewelry Store Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body suppressHydrationWarning>
        <FontLoader />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
