// athar-frontend/components/HeroSection.tsx
import { Sparkles, ChevronLeft } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative max-w-7xl mx-auto px-4 md:px-6 pt-10 md:pt-16 pb-6 md:pb-12 text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-900/5 border border-emerald-900/10 text-emerald-900 text-xs md:text-sm mb-4 md:mb-6">
        <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-gold-500" /><span>موسوعة رقمية موثّقة</span>
      </div>
      <h1 className="font-display text-4xl md:text-6xl text-emerald-900 mb-3 md:mb-5 leading-tight px-2">
        اكتشف سيرة <br/><span className="text-gold-500">خاتم الأنبياء وآل بيته</span>
      </h1>
      <p className="text-base md:text-lg text-ink-700 max-w-2xl mx-auto mb-6 md:mb-8 leading-relaxed px-2">
        مرجع شامل وموثّق لسيرة النبي محمد ﷺ والأئمة المعصومين (ع)، بأسلوب حديث يجمع بين الأصالة والمعاصرة.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 px-4">
        <a href="#tree" className="w-full sm:w-auto px-6 py-3 bg-emerald-900 text-cream-50 rounded-xl font-medium hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 touch-target">
          ابدأ الاستكشاف <ChevronLeft className="w-4 h-4" />
        </a>
      </div>
    </section>
  );
}