// athar-frontend/components/PersonalityCard.tsx
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function PersonalityCard({ name, title, period, color, slug }: { 
  name: string; title: string; period: string; color: string; slug: string 
}) {
  return (
    <Link href={`/personality/${slug}`} className="block group relative bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-soft hover:shadow-lg transition-all border border-emerald-900/5">
      <div className={`absolute top-0 right-0 w-full h-1.5 ${color}`} />
      <div className="p-5 md:p-8 flex flex-col justify-between min-h-[200px] md:min-h-[260px]">
        <div>
          <div className={`inline-block px-2 py-1 rounded-full text-[10px] md:text-xs font-medium mb-2 md:mb-3 ${color} bg-opacity-10`}>{title}</div>
          <h3 className="font-display text-lg md:text-2xl text-ink-900 mb-1">{name}</h3>
          <p className="text-ink-500 text-xs md:text-sm">{period}</p>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-emerald-900/5">
          <span className="text-xs md:text-sm text-emerald-900 font-medium">استكشف السيرة</span>
          <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-emerald-900 group-hover:-translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}