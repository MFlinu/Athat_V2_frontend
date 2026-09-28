// athar-frontend/components/Navbar.tsx
import { BookOpen, Globe } from 'lucide-react';
import Image from 'next/image';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-40 bg-cream-50/80 backdrop-blur-md border-b border-emerald-900/5">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <Image src="/logos/logo-compact.png" alt="أثر" width={32} height={32} className="w-8 h-8 object-contain" />
          <span className="font-display text-xl text-emerald-900">أثر</span>
        </a>
        <div className="hidden md:flex items-center gap-6 text-ink-700">
          <a href="#" className="hover:text-emerald-900">الرئيسية</a>
          <a href="#tree" className="hover:text-emerald-900">الشجرة</a>
          <a href="#assistant" className="hover:text-emerald-900">المساعد</a>
        </div>
        <button className="flex items-center gap-1 text-ink-700 touch-target">
          <Globe className="w-4 h-4" /><span className="text-sm hidden md:inline">EN</span>
        </button>
      </div>
    </nav>
  );
}