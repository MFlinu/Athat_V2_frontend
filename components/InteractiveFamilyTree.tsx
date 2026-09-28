// athar-frontend/components/InteractiveFamilyTree.tsx
'use client';
import { useState, useRef, useMemo } from 'react';
import { ZoomIn, ZoomOut, Move } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { buildFamilyTree, elbowPath } from '@/lib/treeLayout';
import type { PersonListItem, RelationshipItem } from '@/lib/api';

// خريطة الألوان بحسب دور الشخصية - نفس الهوية البصرية للنسخة الأصلية بالضبط،
// فقط أضفنا COMPANION لأن نموذج البيانات يدعمه (لمرحلتك القادمة لاحقًا).
const ROLE_COLORS: Record<string, { fill: string; text: string; stroke?: string }> = {
  PROPHET: { fill: '#0D5C4C', text: '#fff' },
  IMAM: { fill: '#fff', text: '#0D5C4C', stroke: '#C9A961' },
  WOMAN: { fill: '#fff', text: '#9D174D', stroke: '#E17A87' },
  COMPANION: { fill: '#fff', text: '#0D5C4C', stroke: '#9CA3AF' },
};

interface Props {
  persons: PersonListItem[];
  relationships: RelationshipItem[];
}

export default function InteractiveFamilyTree({ persons, relationships }: Props) {
  const router = useRouter();
  const [scale, setScale] = useState(0.7);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // الحساب يتم مرة واحدة فقط عند تغيّر البيانات، وليس عند كل تكبير/تحريك -
  // فصل منطق "أين توضع العقد" (بيانات) عن "كيف تُعرض" (تفاعل) يحسّن الأداء.
  const layout = useMemo(() => buildFamilyTree(persons, relationships), [persons, relationships]);

  const handleDown = (e: React.PointerEvent) => { setDragging(true); setStart({ x: e.clientX - pos.x, y: e.clientY - pos.y }); };
  const handleMove = (e: React.PointerEvent) => { if (!dragging) return; setPos({ x: e.clientX - start.x, y: e.clientY - start.y }); };
  const handleUp = () => setDragging(false);

  if (layout.nodes.length === 0) {
    // رسالة تشخيصية تفرّق بين سببين مختلفين تمامًا لظهور شجرة فارغة، بدل رسالة
    // عامة غامضة - كل سبب يحتاج إجراء مختلفًا تمامًا من المستخدم لإصلاحه.
    const message = persons.length === 0
      ? 'لا توجد شخصيات منشورة بعد - تأكد أن حالة النشر "منشور" في لوحة الإدارة'
      : 'يوجد أشخاص منشورون، لكن لا توجد علاقات (أب/أم/زوج) مضافة بينهم بعد - أضفها من صفحة الشخص في لوحة الإدارة';
    return (
      <div className="w-full h-[300px] flex items-center justify-center bg-white rounded-2xl shadow-soft border border-emerald-900/5 text-emerald-900/50 font-arabic text-center px-6">
        {message}
      </div>
    );
  }

  return (
    <div className="relative w-full h-[500px] bg-white rounded-2xl md:rounded-3xl shadow-soft overflow-hidden border border-emerald-900/5">

      <div className="absolute top-4 left-4 z-20 flex gap-2 p-2 bg-white/90 backdrop-blur rounded-xl shadow-md">
        <button onClick={() => setScale(s => Math.min(s + 0.2, 2))} className="p-2 rounded-lg hover:bg-emerald-50 touch-target">
          <ZoomIn className="w-5 h-5 text-emerald-900" />
        </button>
        <button onClick={() => setScale(s => Math.max(s - 0.2, 0.3))} className="p-2 rounded-lg hover:bg-emerald-50 touch-target">
          <ZoomOut className="w-5 h-5 text-emerald-900" />
        </button>
        <button onClick={() => { setPos({ x: 0, y: 0 }); setScale(0.7); }} className="p-2 rounded-lg hover:bg-emerald-50 touch-target">
          <Move className="w-5 h-5 text-emerald-900" />
        </button>
      </div>

      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing touch-none select-none"
        onPointerDown={handleDown}
        onPointerMove={handleMove}
        onPointerUp={handleUp}
        onPointerLeave={handleUp}
      >
        <svg
          className="w-full h-full"
          viewBox={`0 0 ${layout.width} ${layout.height}`}
          preserveAspectRatio="xMidYMid meet"
          style={{
            transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
            transformOrigin: 'center center',
            transition: dragging ? 'none' : 'transform 0.2s',
          }}
        >
          <defs>
            <pattern id="g" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#0D5C4C" strokeOpacity="0.05" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#g)" />

          {layout.edges.map((edge, i) =>
            edge.type === 'lineage' ? (
              <path
                key={i}
                d={elbowPath(edge)}
                fill="none"
                stroke="#0D5C4C"
                strokeOpacity="0.3"
                strokeWidth="2"
              />
            ) : (
              <line
                key={i}
                x1={edge.x1} y1={edge.y1} x2={edge.x2} y2={edge.y2}
                stroke="#C9A961"
                strokeOpacity="0.6"
                strokeWidth="2"
                strokeDasharray="2 3"
              />
            )
          )}

          {layout.nodes.map((node) => {
            const c = ROLE_COLORS[node.role] || ROLE_COLORS.IMAM;
            return (
              <g
                key={node.id}
                className="cursor-pointer hover:scale-105 transition-transform"
                onClick={() => router.push(`/personality/${node.slug}`)}
              >
                <circle cx={node.x} cy={node.y} r="32" fill={c.fill} stroke={c.stroke || c.fill} strokeWidth="2" />
                <text x={node.x} y={node.y} textAnchor="middle" dominantBaseline="central" fill={c.text} className="font-arabic font-bold pointer-events-none" style={{ fontSize: '13px' }}>
                  {/* نعرض الاسم الشخصي فقط (أول كلمة) لا "بن"/"بنت" التي تقع دائمًا
                      في الكلمة الثانية من full_name - موقع العقدة في الشجرة نفسه هو
                      ما يميّز الشخص عن أي تسمية متكررة (كتكرار "علي" أو "محمد" بين
                      الأئمة)، تمامًا كما في أي رسم شجرة عائلة تقليدي. */}
                  {node.full_name.split(' ')[0]}
                </text>
                {node.kunya && (
                  <text x={node.x} y={node.y + 22} textAnchor="middle" fill={c.text === '#fff' ? 'rgba(255,255,255,0.8)' : '#7A7A7A'} className="font-arabic pointer-events-none" style={{ fontSize: '10px' }}>
                    {node.kunya}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-emerald-900/90 text-white px-4 py-2 rounded-full text-xs flex items-center gap-2 shadow-lg pointer-events-none">
        <Move className="w-3 h-3" /> اسحب للتحريك • اضغط للتفاصيل
      </div>
    </div>
  );
}
