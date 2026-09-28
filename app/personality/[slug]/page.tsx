// athar-frontend/app/personality/[slug]/page.tsx
import { getPersonBySlug } from '@/lib/api';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Calendar, MapPin, BookOpen } from 'lucide-react';

// ✅ تغيير 1: params الآن هو Promise
interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function PersonalityPage({ params }: PageProps) {
  // ✅ تغيير 2: استخدام await قبل الوصول لـ slug
  const { slug } = await params;
  const person = await getPersonBySlug(slug);

  if (!person) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-cream-50 font-arabic pb-12">
      <div className="bg-emerald-900 text-cream-50 py-12 md:py-16 px-4 md:px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold-500 to-transparent" />
        <div className="relative max-w-4xl mx-auto">
          <span className="inline-block px-3 py-1 bg-gold-500/20 text-gold-300 rounded-full text-sm mb-4 border border-gold-500/30">
            {person.role === 'PROPHET' ? 'النبي ﷺ' : person.role === 'IMAM' ? 'إمام معصوم' : 'سيدة من أهل البيت'}
          </span>
          <h1 className="font-display text-4xl md:text-6xl mb-4">{person.full_name}</h1>
          <p className="text-xl md:text-2xl text-gold-300 mb-6">{person.kunya}</p>
          
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-sm md:text-base text-cream-50/80">
            {person.birth_date_hijri && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>ولد: {person.birth_date_hijri}</span>
              </div>
            )}
            {person.birth_place && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>مكان الولادة: {person.birth_place}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-6 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-soft p-6 md:p-10">
          <div className="flex items-center gap-3 mb-6 border-b border-emerald-900/10 pb-4">
            <BookOpen className="w-6 h-6 text-emerald-900" />
            <h2 className="font-display text-2xl md:text-3xl text-emerald-900">السيرة الذاتية</h2>
          </div>
          
          <div className="prose prose-lg prose-emerald max-w-none text-ink-700 leading-loose text-justify">
            {person.biography.split('\n').map((paragraph, idx) => (
              <p key={idx} className="mb-4">{paragraph}</p>
            ))}
          </div>
        </div>

        <Link href="/" className="mt-8 inline-flex items-center gap-2 text-emerald-900 hover:text-gold-500 transition-colors font-medium">
          <ChevronRight className="w-5 h-5" />
          العودة إلى الصفحة الرئيسية
        </Link>
      </div>
    </div>
  );
}

// ✅ تغيير 3: generateMetadata أيضاً يحتاج await params
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const person = await getPersonBySlug(slug);
  
  if (!person) return { title: 'غير موجود' };

  return {
    title: `${person.full_name} | أثر`,
    description: `سيرة ومعلومات موثقة عن ${person.full_name} ${person.kunya}`,
  };
}