// athar-frontend/app/page.tsx
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import SearchSection from '@/components/SearchSection';
import PersonalitiesBento from '@/components/PersonalitiesBento';
import InteractiveFamilyTree from '@/components/InteractiveFamilyTree';
import AIAssistantSection from '@/components/AIAssistantSection';
import Footer from '@/components/Footer';
import { getPersons, getRelationships } from '@/lib/api';

export default async function Home() {
  // نجلب الأشخاص والعلاقات هنا (في مكوّن خادم Server Component) لا داخل الشجرة نفسها،
  // حتى تبقى الشجرة (Client Component) مسؤولة فقط عن العرض والتفاعل، لا عن الشبكة.
  let persons: Awaited<ReturnType<typeof getPersons>> = [];
  let relationships: Awaited<ReturnType<typeof getRelationships>> = [];
  try {
    [persons, relationships] = await Promise.all([getPersons(), getRelationships()]);
  } catch (error) {
    console.error('تعذّر جلب بيانات الشجرة:', error);
  }

  return (
    <div className="min-h-screen bg-cream-50 font-arabic">
      <Navbar />
      <HeroSection />
      <SearchSection />
      <PersonalitiesBento />

      <section id="tree" className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-16">
        <h2 className="font-display text-3xl md:text-4xl text-emerald-900 mb-6 text-center">شجرة آل البيت</h2>
        <InteractiveFamilyTree persons={persons} relationships={relationships} />
      </section>

      <AIAssistantSection />
      <Footer />
    </div>
  );
}