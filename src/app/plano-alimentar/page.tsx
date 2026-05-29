import {
  Apple,
  Beef,
  Coffee,
  Cookie,
  Moon,
  Salad,
  Sparkles,
  Soup,
  Utensils,
} from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { createServerSupabase } from '@/lib/supabaseServer';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type MealPlan = {
  id: string;
  day_number: number;
  breakfast: string | null;
  morning_snack: string | null;
  lunch: string | null;
  afternoon_snack: string | null;
  dinner: string | null;
  supper: string | null;
  notes: string | null;
};

const fallbackPlans: MealPlan[] = [
  {
    id: 'fallback-1',
    day_number: 1,
    breakfast: 'Ovos mexidos com pão integral e café sem açúcar.',
    morning_snack: 'Banana com aveia.',
    lunch: 'Arroz, feijão, frango grelhado e salada colorida.',
    afternoon_snack: 'Iogurte natural com fruta.',
    dinner: 'Omelete com legumes.',
    supper: 'Chá sem açúcar.',
    notes: 'Priorize água ao longo do dia.',
  },
  {
    id: 'fallback-2',
    day_number: 2,
    breakfast: 'Tapioca com ovo e queijo branco.',
    morning_snack: 'Maçã ou pera.',
    lunch: 'Batata doce, carne magra e legumes refogados.',
    afternoon_snack: 'Castanhas ou iogurte.',
    dinner: 'Frango desfiado com salada e arroz integral.',
    supper: 'Chá ou água.',
    notes: 'Evite refrigerantes e doces durante a semana.',
  },
  {
    id: 'fallback-3',
    day_number: 3,
    breakfast: 'Vitamina de banana com aveia.',
    morning_snack: 'Fruta da estação.',
    lunch: 'Arroz, feijão, peixe grelhado e salada.',
    afternoon_snack: 'Pão integral com queijo branco.',
    dinner: 'Sopa de legumes com frango.',
    supper: 'Chá de camomila.',
    notes: 'Coma devagar e respeite a saciedade.',
  },
  {
    id: 'fallback-4',
    day_number: 4,
    breakfast: 'Omelete simples com tomate e café.',
    morning_snack: 'Iogurte natural.',
    lunch: 'Macarrão integral com frango e salada.',
    afternoon_snack: 'Banana com pasta de amendoim.',
    dinner: 'Carne magra com legumes.',
    supper: 'Água ou chá.',
    notes: 'Mantenha proteína em todas as principais refeições.',
  },
  {
    id: 'fallback-5',
    day_number: 5,
    breakfast: 'Pão integral com ovos e fruta.',
    morning_snack: 'Maçã com aveia.',
    lunch: 'Arroz, feijão, frango e salada.',
    afternoon_snack: 'Iogurte com granola sem açúcar.',
    dinner: 'Omelete ou frango com legumes.',
    supper: 'Chá sem açúcar.',
    notes: 'Planeje as refeições antes de sentir muita fome.',
  },
  {
    id: 'fallback-6',
    day_number: 6,
    breakfast: 'Cuscuz com ovo e café.',
    morning_snack: 'Fruta.',
    lunch: 'Carne magra, arroz integral e salada.',
    afternoon_snack: 'Sanduíche natural simples.',
    dinner: 'Peixe ou frango com legumes.',
    supper: 'Chá.',
    notes: 'Fim de semana também conta para sua evolução.',
  },
  {
    id: 'fallback-7',
    day_number: 7,
    breakfast: 'Panqueca de banana com aveia.',
    morning_snack: 'Iogurte natural.',
    lunch: 'Frango, batata doce e salada.',
    afternoon_snack: 'Fruta com castanhas.',
    dinner: 'Sopa ou omelete com legumes.',
    supper: 'Chá.',
    notes: 'Revise sua semana e prepare a próxima.',
  },
  {
    id: 'fallback-8',
    day_number: 8,
    breakfast: 'Ovos mexidos, pão integral e fruta.',
    morning_snack: 'Banana.',
    lunch: 'Arroz, feijão, carne magra e salada.',
    afternoon_snack: 'Iogurte natural.',
    dinner: 'Frango com legumes.',
    supper: 'Chá.',
    notes: 'Repita o simples. Consistência vence complicação.',
  },
  {
    id: 'fallback-9',
    day_number: 9,
    breakfast: 'Tapioca com frango desfiado.',
    morning_snack: 'Maçã.',
    lunch: 'Peixe, arroz integral e legumes.',
    afternoon_snack: 'Pão integral com queijo branco.',
    dinner: 'Omelete com salada.',
    supper: 'Água ou chá.',
    notes: 'Evite beliscar fora do planejamento.',
  },
  {
    id: 'fallback-10',
    day_number: 10,
    breakfast: 'Vitamina de fruta com aveia.',
    morning_snack: 'Fruta da estação.',
    lunch: 'Frango grelhado, arroz, feijão e salada.',
    afternoon_snack: 'Iogurte ou castanhas.',
    dinner: 'Carne magra com legumes.',
    supper: 'Chá.',
    notes: 'Hidrate-se bem antes e depois dos treinos.',
  },
  {
    id: 'fallback-11',
    day_number: 11,
    breakfast: 'Cuscuz com ovo.',
    morning_snack: 'Banana com aveia.',
    lunch: 'Arroz integral, feijão, peixe e salada.',
    afternoon_snack: 'Sanduíche natural.',
    dinner: 'Sopa de legumes com proteína.',
    supper: 'Chá sem açúcar.',
    notes: 'Mantenha refeições equilibradas e simples.',
  },
  {
    id: 'fallback-12',
    day_number: 12,
    breakfast: 'Pão integral com ovo e café.',
    morning_snack: 'Fruta.',
    lunch: 'Carne magra, batata doce e salada.',
    afternoon_snack: 'Iogurte natural.',
    dinner: 'Frango com legumes refogados.',
    supper: 'Chá.',
    notes: 'Controle porções, não passe fome.',
  },
  {
    id: 'fallback-13',
    day_number: 13,
    breakfast: 'Omelete com legumes.',
    morning_snack: 'Maçã ou pera.',
    lunch: 'Arroz, feijão, frango e salada.',
    afternoon_snack: 'Fruta com castanhas.',
    dinner: 'Peixe com legumes.',
    supper: 'Água ou chá.',
    notes: 'Faça boas escolhas mesmo fora de casa.',
  },
  {
    id: 'fallback-14',
    day_number: 14,
    breakfast: 'Panqueca de banana com aveia.',
    morning_snack: 'Iogurte natural.',
    lunch: 'Frango, arroz integral, feijão e salada.',
    afternoon_snack: 'Pão integral com queijo branco.',
    dinner: 'Omelete ou sopa leve.',
    supper: 'Chá.',
    notes: 'Finalize o ciclo e continue repetindo o que funcionou.',
  },
];

function MealCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string | null;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm">
          <Icon size={21} />
        </div>

        <div>
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">
            {value || 'Não informado'}
          </p>
        </div>
      </div>
    </div>
  );
}

function DayPlanCard({ plan }: { plan: MealPlan }) {
  return (
    <article className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm">
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="inline-flex rounded-full bg-emerald-600 px-4 py-2 text-xs font-black uppercase tracking-wide text-white">
              Dia {plan.day_number}
            </span>

            <h2 className="mt-4 text-2xl font-black text-slate-950">
              Plano alimentar
            </h2>

            <p className="mt-2 text-sm font-semibold text-slate-600">
              Refeições simples, práticas e equilibradas.
            </p>
          </div>

          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl bg-white text-emerald-700 shadow-sm">
            <Utensils size={27} />
          </div>
        </div>
      </div>

      <div className="grid gap-3 p-5">
        <MealCard
          title="Café da manhã"
          value={plan.breakfast}
          icon={Coffee}
        />

        <MealCard
          title="Lanche da manhã"
          value={plan.morning_snack}
          icon={Apple}
        />

        <MealCard title="Almoço" value={plan.lunch} icon={Beef} />

        <MealCard
          title="Lanche da tarde"
          value={plan.afternoon_snack}
          icon={Cookie}
        />

        <MealCard title="Jantar" value={plan.dinner} icon={Salad} />

        <MealCard title="Ceia" value={plan.supper} icon={Moon} />

        {plan.notes && (
          <div className="rounded-3xl bg-emerald-50 p-4">
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-emerald-700">
              <Sparkles size={16} />
              Observação
            </p>

            <p className="mt-2 text-sm font-semibold leading-6 text-emerald-900">
              {plan.notes}
            </p>
          </div>
        )}
      </div>
    </article>
  );
}

export default async function PlanoAlimentarPage() {
  const supabase = createServerSupabase();

  const { data } = await supabase
    .from('meal_plans')
    .select('*')
    .order('day_number', { ascending: true });

  const plans = ((data ?? []) as MealPlan[]).length
    ? ((data ?? []) as MealPlan[])
    : fallbackPlans;

  return (
    <AppShell>
      <div className="space-y-6 pb-10">
        <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-500 p-5 text-white shadow-xl shadow-emerald-100 md:p-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-xs font-black uppercase tracking-wide">
            <Soup size={16} />
            Plano alimentar
          </span>

          <h1 className="mt-5 text-3xl font-black leading-tight md:text-5xl">
            Refeições simples para manter constância.
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-50 md:text-base">
            Siga uma estrutura prática de alimentação com café da manhã,
            lanches, almoço, jantar e ceia. O foco é facilitar sua rotina e
            manter boas escolhas todos os dias.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <Apple size={23} />
            </div>

            <h2 className="mt-4 text-xl font-black text-slate-950">
              Comida de verdade
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Priorize arroz, feijão, ovos, carnes magras, legumes, frutas e
              boas fontes de carboidrato.
            </p>
          </div>

          <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <Utensils size={23} />
            </div>

            <h2 className="mt-4 text-xl font-black text-slate-950">
              Rotina prática
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Repita refeições simples para reduzir decisões e manter o plano
              fácil de seguir.
            </p>
          </div>

          <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <Sparkles size={23} />
            </div>

            <h2 className="mt-4 text-xl font-black text-slate-950">
              Consistência
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              O resultado vem da repetição. Faça o básico bem feito todos os
              dias.
            </p>
          </div>
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-2xl font-black text-slate-950">
              Seu plano diário
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Escolha o dia e siga as refeições sugeridas.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {plans.map((plan) => (
              <DayPlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
