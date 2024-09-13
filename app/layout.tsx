import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Time Deposit Interest Rates`,
  description: `Compare and find the best HKD time deposit interest rates from various banks in Hong Kong. Stay updated with the latest rates and maximize your savings with our easy-to-use tool.`,
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
