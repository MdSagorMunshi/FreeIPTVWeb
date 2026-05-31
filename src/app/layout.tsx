import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { ThemeProvider } from "@/components/ThemeProvider";

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
            {/* Background decorative elements */}
            <div className="fixed top-[-15%] left-[-10%] w-[50%] h-[50%] bg-purple-600/15 rounded-full blur-[150px] pointer-events-none transform -translate-x-1/2 -translate-y-1/2" />
            <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-600/10 rounded-full blur-[150px] pointer-events-none transform translate-x-1/4 translate-y-1/4" />
            <div className="fixed top-[40%] right-[20%] w-[30%] h-[30%] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />
            
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
