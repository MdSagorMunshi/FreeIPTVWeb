import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

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
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#09090b] text-[#fafafa] antialiased overflow-hidden`}>
        <div className="flex h-screen w-full relative">
          <Sidebar />
          
          <main className="flex-1 ml-[80px] h-full overflow-y-auto overflow-x-hidden relative">
            {/* Background decorative elements */}
            <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-600/10 rounded-full blur-[120px] pointer-events-none" />
            
            <div className="relative z-10 p-6 md:p-8 lg:p-12 w-full min-h-full">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
