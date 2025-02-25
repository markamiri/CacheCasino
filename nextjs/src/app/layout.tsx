import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import NavBar from "@/components/NavBar";
import { BetSlipProvider } from "@/context/BetSlipContext";
import Head from "next/head";

import { ThemeProvider } from "@/components/ThemeProvider";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorText: "#ffffff", // White text for all elements
          colorTextSecondary: "#ffffff", // Ensures secondary text is also white
          colorBackground: "rgb(44, 46, 79)", // Dark background
          colorPrimary: "#ffcc00", // Accent color (optional)
          colorInputBackground: "transparent",
          colorNeutral: "#ffffff",
        },
      }}
    >
      <BetSlipProvider>
        <head>
          {" "}
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
        </head>
        <html lang="en">
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <div className="min-h-screen backgroundColor">
                <NavBar />
                <main className="py-8">
                  <div className="max-w-7xl mx-auto px-4">{children}</div>
                </main>
                footer
              </div>
            </ThemeProvider>
          </body>
        </html>
      </BetSlipProvider>
    </ClerkProvider>
  );
}
