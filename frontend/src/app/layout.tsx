import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vayukrishi",
  description: "Agricultural AI Platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
