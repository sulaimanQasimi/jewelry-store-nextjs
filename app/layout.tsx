import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import FontLoader from "@/components/FontLoader";

export const metadata: Metadata = {
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
