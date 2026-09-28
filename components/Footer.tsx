// athar-frontend/components/Footer.tsx
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-emerald-900 text-white mt-12 md:mt-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-3">
              <Image src="/logos/logo-full.png" alt="أثر" width={48} height={48} className="w-12 h-12 object-contain" />
              <div><h3 className="font-display text-2xl">أثر</h3><p className="text-gold-300 text-xs">موسوعة أهل البيت الرقمية</p></div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed max-w-md">مرجع شامل يجمع بين الأصالة التاريخية والعرض الرقمي الحديث، صُمم ليكون سهل الوصول ودقيق المعلومة.</p>
          </div>
          <div><h4 className="font-medium mb-3 text-gold-300 text-sm">الاستكشاف</h4><ul className="space-y-2 text-white/70 text-sm"><li><a href="#" className="hover:text-gold-300">الشخصيات</a></li><li><a href="#" className="hover:text-gold-300">الأحداث</a></li><li><a href="#" className="hover:text-gold-300">المصادر</a></li></ul></div>
          <div><h4 className="font-medium mb-3 text-gold-300 text-sm">حول الموقع</h4><ul className="space-y-2 text-white/70 text-sm"><li><a href="#" className="hover:text-gold-300">من نحن</a></li><li><a href="#" className="hover:text-gold-300">إخلاء مسؤولية</a></li></ul></div>
        </div>
        <div className="pt-6 border-t border-white/10 text-xs text-white/50 text-center">© {new Date().getFullYear()} أثر - جميع الحقوق محفوظة.</div>
      </div>
    </footer>
  );
}