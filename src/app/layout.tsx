import type { Metadata } from "next";
import { Inter, Fira_Code } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sufyan Studio Engine | Developer Console",
  description: "Automated Context Ingestion Engine & Versioned Project Catalog",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${firaCode.variable} antialiased h-full`}
    >
      <body className="min-h-full flex flex-col bg-console-bg text-console-text-main">{children}</body>
    </html>
  );
}
