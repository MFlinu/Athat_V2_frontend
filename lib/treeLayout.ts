// athar-frontend/lib/treeLayout.ts
//
// خوارزمية حساب مواقع شجرة العائلة تلقائيًا من جدول العلاقات (Relationship).
//
// الفكرة الجوهرية (وهي سبب إعادة كتابة هذا الملف): شجرة عائلة حقيقية ليست شجرة
// أشخاص منفردين، بل شجرة "وحدات عائلية" - الزوجان يُحسبان كوحدة واحدة لها مركز
// أفقي واحد، وكل جيل يتوسط فوق أبنائه (أو فوق وحدات أبنائه الزوجية). بهذا يتوسط
// الجذر (كالنبي محمد) تلقائيًا فوق كامل الشجرة تحته، مهما بلغت من فروع لاحقًا -
// بدل "تقريب" الأزواج من بعضهما بخطوة تجميلية لاحقة لا تُصحح موقع من فوقهم.

import type { PersonListItem, RelationshipItem } from './api';

export interface TreeNode {
  id: number;
  slug: string;
  full_name: string;
  kunya: string;
  role: string;
  x: number;
  y: number;
}

export interface TreeEdge {
  x1: number; y1: number;
  x2: number; y2: number;
  type: 'lineage' | 'spouse'; // نسب (خط زاوية قائمة) أو زواج (خط منقط أفقي قصير)
}

export interface TreeLayout {
  nodes: TreeNode[];
  edges: TreeEdge[];
  width: number;
  height: number;
}

const NODE_SPACING_X = 170;  // المسافة الأفقية الدنيا بين وحدتين متجاورتين (شخص/زوجين)
const SPOUSE_GAP = 76;       // نصف المسافة بين الزوجين حول مركز وحدتهما
const LEVEL_HEIGHT_Y = 150;
const MARGIN = 90;

export function buildFamilyTree(
  persons: PersonListItem[],
  relationships: RelationshipItem[]
): TreeLayout {
  const lineageEdges = relationships.filter(
    r => r.relation_type === 'FATHER' || r.relation_type === 'MOTHER'
  );
  const spouseEdges = relationships.filter(r => r.relation_type === 'SPOUSE');

  // ---------- بناء "الوحدات الزوجية" ----------
  // كل شخص متزوج يُحال إلى "معرّف وحدة" واحد مشترك بينه وبين شريكه (أصغر id بين الاثنين،
  // كطريقة ثابتة ومستقرة لاختيار مُعرّف تمثيلي). الأشخاص غير المتزوجين وحدتهم هي أنفسهم.
  const spouseOf = new Map<number, number>();
  for (const rel of spouseEdges) {
    if (!spouseOf.has(rel.from_person.id)) spouseOf.set(rel.from_person.id, rel.to_person.id);
    if (!spouseOf.has(rel.to_person.id)) spouseOf.set(rel.to_person.id, rel.from_person.id);
  }
  function unitOf(personId: number): number {
    const spouseId = spouseOf.get(personId);
    return spouseId !== undefined ? Math.min(personId, spouseId) : personId;
  }

  // خريطة نسب: من هو "الأب/الأم الأساسي" لكل شخص (أول علاقة أب/أم تصله فقط، لتفادي
  // ازدواج الحساب لو أُدخلت لاحقًا علاقتا أب وأم معًا لنفس الابن)
  const primaryParentOf = new Map<number, number>();
  for (const rel of lineageEdges) {
    if (!primaryParentOf.has(rel.to_person.id)) {
      primaryParentOf.set(rel.to_person.id, rel.from_person.id);
    }
  }

  // خريطة: معرّف الوحدة (الوالد أو الوالدين معًا) -> معرّفات وحدات الأبناء
  const unitChildrenOf = new Map<number, Set<number>>();
  for (const [childId, parentId] of primaryParentOf.entries()) {
    const parentUnit = unitOf(parentId);
    const childUnit = unitOf(childId);
    if (!unitChildrenOf.has(parentUnit)) unitChildrenOf.set(parentUnit, new Set());
    unitChildrenOf.get(parentUnit)!.add(childUnit);
  }

  // الجذور: وحدات ليس لأي فرد منها والد/والدة مُدخل ضمن الأشخاص الحاليين
  const parentedUnits = new Set(
    [...primaryParentOf.keys()].map(unitOf)
  );
  const seenRootUnit = new Set<number>();
  const roots: number[] = [];
  for (const p of [...persons].sort((a, b) => a.order - b.order)) {
    const u = unitOf(p.id);
    if (!parentedUnits.has(u) && !seenRootUnit.has(u)) {
      seenRootUnit.add(u);
      roots.push(u);
    }
  }

  // ---------- المرحلة 1: الجيل (Y) - على مستوى الوحدات مباشرة، فلا حاجة لتصحيح لاحق ----------
  const unitGeneration = new Map<number, number>();
  function assignGeneration(unit: number, gen: number) {
    unitGeneration.set(unit, gen);
    for (const childUnit of unitChildrenOf.get(unit) || []) {
      assignGeneration(childUnit, gen + 1);
    }
  }
  roots.forEach(u => assignGeneration(u, 0));

  // ---------- المرحلة 2: الموقع الأفقي (X) - توسيط كل وحدة فوق وحدات أبنائها ----------
  const unitX = new Map<number, number>();
  let cursor = 0;

  function layoutX(unit: number): number {
    const children = [...(unitChildrenOf.get(unit) || [])];
    if (children.length === 0) {
      const x = cursor;
      cursor += NODE_SPACING_X;
      unitX.set(unit, x);
      return x;
    }
    const childXs = children.map(layoutX);
    const x = (Math.min(...childXs) + Math.max(...childXs)) / 2;
    unitX.set(unit, x);
    return x;
  }
  roots.forEach(layoutX);

  // ---------- بناء العقد النهائية: كل شخص ياخذ موقع وحدته (± إزاحة بسيطة لو متزوج) ----------
  const nodes: TreeNode[] = [];
  for (const person of persons) {
    const unit = unitOf(person.id);
    const centerX = unitX.get(unit);
    if (centerX === undefined) continue; // شخص بلا أي علاقة منشورة بعد - لا يظهر في الشجرة حاليًا

    const spouseId = spouseOf.get(person.id);
    // ترتيب ثابت للزوجين حول المركز (الأصغر id يمينًا، الأكبر يسارًا) حتى لا يتبادلا
    // مكانيهما عشوائيًا بين تحميل وآخر
    const offset = spouseId === undefined ? 0 : (person.id < spouseId ? SPOUSE_GAP : -SPOUSE_GAP);

    nodes.push({
      id: person.id,
      slug: person.slug,
      full_name: person.full_name,
      kunya: person.kunya,
      role: person.role,
      x: centerX + offset + MARGIN,
      y: (unitGeneration.get(unit) || 0) * LEVEL_HEIGHT_Y + MARGIN,
    });
  }

  // ---------- بناء الخطوط ----------
  const nodeById = new Map(nodes.map(n => [n.id, n]));
  const edges: TreeEdge[] = [];

  // خطوط النسب: نرسمها من "مركز الوحدة الوالدة" (منتصف الزوجين إن وُجدا) إلى كل ابن،
  // بزاوية قائمة (خط عمودي من الوالد، ثم أفقي، ثم عمودي للابن) لتبدو كشجرة عائلة تقليدية
  // واضحة، بدل خط مائل مباشر يصعب تتبعه بصريًا عند كثرة الفروع.
  for (const [childId, parentId] of primaryParentOf.entries()) {
    const child = nodeById.get(childId);
    const parentUnit = unitOf(parentId);
    const parentSpouseId = spouseOf.get(parentId);
    const parentNode = nodeById.get(parentId);
    const parentSpouseNode = parentSpouseId !== undefined ? nodeById.get(parentSpouseId) : undefined;
    if (!child || !parentNode) continue;

    const parentCenterX = parentSpouseNode
      ? (parentNode.x + parentSpouseNode.x) / 2
      : parentNode.x;
    const parentY = parentNode.y; // كلا الزوجين في نفس y دائمًا بحكم بناء الخوارزمية

    edges.push({ x1: parentCenterX, y1: parentY, x2: child.x, y2: child.y, type: 'lineage' });
    void parentUnit;
  }

  for (const rel of spouseEdges) {
    if (rel.from_person.id > rel.to_person.id) continue; // كل علاقة مُدخلة مرتين، نرسمها مرة واحدة
    const a = nodeById.get(rel.from_person.id);
    const b = nodeById.get(rel.to_person.id);
    if (a && b) edges.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y, type: 'spouse' });
  }

  const maxX = Math.max(...nodes.map(n => n.x), 0) + MARGIN;
  const maxY = Math.max(...nodes.map(n => n.y), 0) + MARGIN;

  return { nodes, edges, width: maxX, height: maxY };
}

// يبني مسار SVG بزاوية قائمة (elbow) بين والد وابنه بدل خط مستقيم مائل - هذا هو
// الشكل البصري المعتاد في مخططات الشجرة العائلية/التنظيمية (org chart style).
export function elbowPath(edge: TreeEdge): string {
  const midY = (edge.y1 + edge.y2) / 2;
  return `M ${edge.x1} ${edge.y1} V ${midY} H ${edge.x2} V ${edge.y2}`;
}
