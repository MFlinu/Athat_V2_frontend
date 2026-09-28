// athar-frontend/components/PersonalitiesBento.tsx
import { getPersons, type PersonListItem } from '@/lib/api';
import PersonalityCard from './PersonalityCard';

interface CardData {
  name: string;
  title: string;
  period: string;
  color: string;
  slug: string;
}

export default async function PersonalitiesBento() {
  let personalities: CardData[] = [];

  try {
    const data: PersonListItem[] = await getPersons();
    personalities = data.map((p) => ({
      name: p.full_name,
      title: p.kunya || p.main_title || p.role,
      period: `${p.birth_date_hijri || ''} - ${p.death_date_hijri || 'حتى الآن'}`,
      color: p.role === 'PROPHET' ? 'bg-emerald-900' : 
             p.role === 'WOMAN' ? 'bg-rose-400' : 'bg-gold-500',
      slug: p.slug,  // ✅ هذا السطر مهم جداً!
    }));
  } catch (error) {
    console.error('Error fetching persons:', error);
    personalities = [];
  }

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-12">
      <h2 className="font-display text-2xl md:text-4xl text-emerald-900 mb-4 md:mb-6 text-center">الشخصيات</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {personalities.map((p, i) => (
          <div key={p.slug} className={i === 0 ? "md:col-span-2" : ""}>
            <PersonalityCard 
              name={p.name} 
              title={p.title} 
              period={p.period} 
              color={p.color} 
              slug={p.slug}  // ✅ تمرير slug هنا
            />
          </div>
        ))}
      </div>
    </section>
  );
}