import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AppGate } from "@/components/AppGate";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FreeIPTV Web | Modern Live TV",
  description: "A premium web version of FreeIPTV featuring modern design and lag-less playback.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground antialiased overflow-hidden selection:bg-primary/30 transition-colors duration-300`}>
        <ThemeProvider attribute="data-theme" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <AppGate>
            {children}
          </AppGate>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
