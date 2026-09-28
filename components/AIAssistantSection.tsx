// athar-frontend/components/AIAssistantSection.tsx
'use client';
import { BookOpen, Quote, Sparkles } from 'lucide-react';

export default function AIAssistantSection() {
  return (
    <section id="assistant" className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-16">
      <div className="bg-white rounded-2xl md:rounded-3xl shadow-soft p-5 md:p-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-900 to-gold-500 flex items-center justify-center flex-shrink-0"><Sparkles className="w-6 h-6 text-white" /></div>
          <div><h2 className="font-display text-2xl md:text-3xl text-emerald-900 mb-1">اسأل المساعد الذكي</h2><p className="text-ink-700 text-sm md:text-base">مدرّب على مصادر موثوقة عن أهل البيت (ع)</p></div>
        </div>
        <div className="space-y-3 mb-6 p-4 bg-cream-50 rounded-xl">
          <div className="flex items-start gap-2"><div className="w-7 h-7 rounded-full bg-emerald-900/10 flex items-center justify-center flex-shrink-0"><Quote className="w-3 h-3 text-emerald-900" /></div><div className="bg-white p-3 rounded-xl shadow-sm text-sm">ما هي أهم مناقب الإمام علي (ع)؟</div></div>
          <div className="flex items-start gap-2 flex-row-reverse"><div className="w-7 h-7 rounded-full bg-gold-500/10 flex items-center justify-center flex-shrink-0"><Sparkles className="w-3 h-3 text-gold-500" /></div><div className="bg-emerald-900 text-white p-3 rounded-xl text-sm">ذكر الشيخ المفيد في كتاب "الإرشاد"...</div></div>
        </div>
        <div className="relative"><input type="text" placeholder="اكتب سؤالك هنا..." className="w-full pr-4 pl-14 py-3 bg-cream-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-900/20" /><button className="absolute left-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-emerald-900 text-white rounded-lg text-xs font-medium touch-target">إرسال</button></div>
      </div>
    </section>
  );
}