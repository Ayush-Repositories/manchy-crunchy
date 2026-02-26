import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "☠ Treasure Hunt | EHAX CTRF",
  description: "Find the buried treasure... if ye dare sail to the right port!",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
