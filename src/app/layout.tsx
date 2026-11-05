import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Providers } from "@/app/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Pulse Admin", template: "%s · Pulse Admin" },
  description: "SaaS admin dashboard: metrics, customers and orders.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
