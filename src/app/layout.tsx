import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LiveBackground } from "@/components/LiveBackground";

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
      <body className={`${inter.className} bg-background text-foreground antialiased overflow-hidden selection:bg-purple-500/30 transition-colors duration-300`}>
        <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <div className="flex h-screen w-full relative">
          <Sidebar />
          
          <main className="flex-1 md:ml-[88px] h-full overflow-y-auto overflow-x-hidden relative pb-20 md:pb-0 scroll-smooth">
            <LiveBackground />
            
            <div className="relative z-10 p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16 2xl:p-24 w-full min-h-full max-w-[2400px] mx-auto">
              {children}
            </div>
          </main>
        </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
