import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { AppProviders } from "./providers";

export const metadata: Metadata = {
  title: "FormGuide - Soccer Form Analysis",
  description: "Analyze soccer team form and performance statistics",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}