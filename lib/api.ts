// athar-frontend/lib/api.ts

const API_URL = process.env.NEXT_PUBLIC_DJANGO_API_URL || 'http://localhost:8000/api';

// ---------- الأنواع (Types) ----------
// ملاحظة مهمة: يوجد نوعان للشخصية الآن بدل نوع واحد -
// PersonListItem (خفيف، لصفحة البطاقات والشجرة) و PersonDetail (كامل، لصفحة شخص واحد).
// هذا يعكس الفصل الذي بنيناه في الـbackend بين PersonListSerializer و PersonDetailSerializer.

export interface PersonListItem {
  id: number;
  slug: string;
  full_name: string;
  kunya: string;
  main_title: string | null;
  role: string;
  birth_date_hijri: string;
  death_date_hijri: string;
  order: number;
}

export interface Title {
  id: number;
  text: string;
  explanation: string;
  order: number;
}

export interface Topic {
  id: number;
  name: string;
  slug: string;
}

export interface Source {
  id: number;
  title: string;
  author: string;
  source_type: string;
  volume: string;
  page: string;
  notes: string;
}

export interface Quote {
  id: number;
  quote_type: string;
  text: string;
  context: string;
  source: Source;
  topics: Topic[];
}

export interface PersonMini {
  id: number;
  slug: string;
  full_name: string;
  kunya: string;
  role: string;
}

export interface RelationshipItem {
  id: number;
  from_person: PersonMini;
  to_person: PersonMini;
  relation_type: 'FATHER' | 'MOTHER' | 'SPOUSE' | 'CHILD' | 'SIBLING';
  notes: string;
}

export interface PersonDetail {
  id: number;
  slug: string;
  full_name: string;
  kunya: string;
  role: string;
  birth_date_hijri: string;
  death_date_hijri: string;
  birth_place: string;
  death_place: string;
  biography: string;
  titles: Title[];
  topics: Topic[];
  quotes: Quote[];
  relationships_from: RelationshipItem[];
  relationships_to: RelationshipItem[];
}

// ---------- أداة مساعدة: تتبع صفحات DRF تلقائيًا ----------
// أي endpoint مرقّم (paginated) في DRF يرجع 20 نتيجة كحد أقصى + رابط "next" للصفحة التالية.
// بما أن الشجرة تحتاج *كل* الأشخاص والعلاقات دفعة واحدة (لا فائدة من ترقيم صفحات هنا)،
// هذه الدالة تتبع "next" تلقائيًا حتى تجمع كل النتائج.
async function fetchAllPages<T>(url: string): Promise<T[]> {
  let results: T[] = [];
  let nextUrl: string | null = url;
  while (nextUrl) {
    // ملاحظة مهمة: نستخدم cache: 'no-store' (بلا تخزين مؤقت إطلاقًا) بدل
    // next.revalidate الذي كان هنا سابقًا. في هذه المرحلة (تحرير نشط يومي من شخص
    // واحد عبر لوحة الإدارة)، تحتاج رؤية أي تعديل فورًا - لا الانتظار حتى تنتهي
    // مهلة التخزين المؤقت. الكلفة: كل طلب صفحة يستدعي الـAPI فعليًا بدل قراءة نسخة
    // محفوظة، وهذا مقبول تمامًا بحجم بياناتك الحالي. حين يُطلق الموقع للجمهور
    // لاحقًا (زوار كثر، محتوى شبه ثابت)، سنعيد تفعيل next.revalidate بذكاء أكبر.
    const res: Response = await fetch(nextUrl, { cache: 'no-store' });
    if (!res.ok) throw new Error(`فشل الطلب: ${nextUrl}`);
    const data = await res.json();
    results = results.concat(data.results ?? data);
    nextUrl = data.next ?? null;
  }
  return results;
}

export async function getPersons(): Promise<PersonListItem[]> {
  return fetchAllPages<PersonListItem>(`${API_URL}/persons/`);
}

export async function getPersonBySlug(slug: string): Promise<PersonDetail | null> {
  const res = await fetch(`${API_URL}/persons/${slug}/`, { cache: 'no-store' });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('فشل في جلب بيانات الشخصية');
  return await res.json();
}

export async function getRelationships(): Promise<RelationshipItem[]> {
  return fetchAllPages<RelationshipItem>(`${API_URL}/relationships/`);
}
