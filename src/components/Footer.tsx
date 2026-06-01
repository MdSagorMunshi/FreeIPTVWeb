import { Heart, Code } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full mt-20 border-t border-border-light bg-surface/30 rounded-3xl p-8 md:p-12 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-12">
        {/* Brand & Description */}
        <div className="col-span-1 md:col-span-1 flex flex-col gap-5">
          <div className="flex items-center gap-2 text-primary-text font-bold text-xl tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm">
              <span className="text-white text-xs font-black leading-none">TV</span>
            </div>
            FreeIPTV Web
          </div>
          <p className="text-muted-text leading-relaxed text-sm pr-4">
            A premium, privacy-focused IPTV player designed for the modern web. Experience lag-less live TV directly in your browser.
          </p>
          <div className="flex items-center gap-4 mt-1">
            <a href="https://github.com/mbs-sagor/FreeIPTVWeb" target="_blank" rel="noopener noreferrer" className="text-muted-text hover:text-primary transition-colors bg-background p-2 rounded-xl border border-border-light shadow-sm">
              <Code size={20} />
            </a>
          </div>
        </div>

        {/* Links - Product */}
        <div className="flex flex-col gap-4">
          <h3 className="font-semibold text-primary-text mb-1">Product</h3>
          <Link href="/" className="text-sm text-secondary-text hover:text-primary transition-colors w-fit">Home</Link>
          <Link href="/world" className="text-sm text-secondary-text hover:text-primary transition-colors w-fit">World Channels</Link>
          <Link href="/my-playlists" className="text-sm text-secondary-text hover:text-primary transition-colors w-fit">My Playlists</Link>
          <Link href="/settings" className="text-sm text-secondary-text hover:text-primary transition-colors w-fit">Settings</Link>
        </div>

        {/* Links - Resources */}
        <div className="flex flex-col gap-4">
          <h3 className="font-semibold text-primary-text mb-1">Resources</h3>
          <Link href="/about" className="text-sm text-secondary-text hover:text-primary transition-colors w-fit">About Us</Link>
          <Link href="/faq" className="text-sm text-secondary-text hover:text-primary transition-colors w-fit">FAQ</Link>
          <a href="https://github.com/mbs-sagor/FreeIPTVWeb/releases" target="_blank" rel="noopener noreferrer" className="text-sm text-secondary-text hover:text-primary transition-colors w-fit">Download App</a>
        </div>

        {/* Links - Legal */}
        <div className="flex flex-col gap-4">
          <h3 className="font-semibold text-primary-text mb-1">Legal</h3>
          <Link href="/privacy" className="text-sm text-secondary-text hover:text-primary transition-colors w-fit">Privacy Policy</Link>
          <Link href="/terms" className="text-sm text-secondary-text hover:text-primary transition-colors w-fit">Terms of Service</Link>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="pt-8 border-t border-border-light flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-muted-text font-medium">
          © {new Date().getFullYear()} FreeIPTV Web. All rights reserved.
        </p>
        <div className="flex items-center gap-1.5 text-xs text-muted-text bg-background py-1.5 px-3 rounded-full border border-border-light shadow-sm">
          <span>Crafted with</span>
          <Heart size={14} className="text-primary fill-primary" />
          <span>by Md Sagor Munshi</span>
        </div>
      </div>
    </footer>
  );
}
