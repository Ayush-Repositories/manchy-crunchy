import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Manchester Treasure Hunt",
  description: "Find the buried treasure... if ye dare sail to the right port!",
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
