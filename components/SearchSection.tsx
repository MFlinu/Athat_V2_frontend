// athar-frontend/components/SearchSection.tsx
import { Search } from 'lucide-react';

export default function SearchSection() {
  const tags = ['الإمام علي (ع)', 'السيدة فاطمة (ع)', 'غدير خم', 'كربلاء'];
  return (
    <section className="max-w-3xl mx-auto px-4 md:px-6 mb-6 md:mb-12">
      <div className="relative">
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none"><Search className="w-5 h-5 text-ink-500" /></div>
        <input type="text" placeholder="ابحث عن شخصية، حدث، أو مصطلح..." className="w-full pr-12 pl-4 py-3 bg-white border border-emerald-900/10 rounded-2xl text-ink-900 placeholder:text-ink-500 focus:outline-none focus:ring-2 focus:ring-emerald-900/20" />
      </div>
      <div className="flex flex-wrap gap-2 mt-3 justify-center">
        {tags.map(t => <button key={t} className="px-3 py-1.5 text-xs md:text-sm bg-white border border-emerald-900/10 rounded-full text-ink-700 touch-target">{t}</button>)}
      </div>
    </section>
  );
}