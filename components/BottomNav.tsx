// athar-frontend/components/BottomNav.tsx
'use client';
import Link from 'next/link';
import { Home, Users, TreePine, Sparkles } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();
  const items = [
    { href: '/', label: 'الرئيسية', icon: Home },
    { href: '#tree', label: 'الشجرة', icon: TreePine },
    { href: '#assistant', label: 'المساعد', icon: Sparkles },
  ];
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur border-t border-emerald-900/10 safe-area-pb">
      <div className="flex items-center justify-around py-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all touch-target ${isActive ? 'text-emerald-900 bg-emerald-50' : 'text-ink-500'}`}>
              <Icon className="w-5 h-5" /><span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}