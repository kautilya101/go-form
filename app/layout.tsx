import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import DesignerContextProvider from "@/components/context/DesignerContext";
import NextTopLoader from 'nextjs-toploader'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Go-Form",
  description: "new form solutions",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
      <NextTopLoader/>
      <ClerkProvider>
      <DesignerContextProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
          >
          {children}
          <Toaster />
        </ThemeProvider>
      </DesignerContextProvider>
      </ClerkProvider>
      </body>
    </html>
  );
}
