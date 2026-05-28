import { AppShell } from '@/components/AppShell';
import { createServerSupabase } from '@/lib/supabaseServer';
import {
  Apple,
  CalendarDays,
  Coffee,
  Cookie,
  Moon,
  Soup,
  Sun,
  Utensils,
} from 'lucide-react';

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

const meals = [
  {
    key: 'breakfast',
    label: 'Café da manhã',
    icon: Coffee,
    color: 'bg-amber-50 text-amber-700',
  },
  {
    key: 'morning_snack',
    label: 'Lanche da manhã',
    icon: Apple,
    color: 'bg-green-50 text-green-700',
  },
  {
    key: 'lunch',
    label: 'Almoço',
    icon: Utensils,
    color: 'bg-emerald-50 text-emerald-700',
  },
  {
    key: 'afternoon_snack',
    label: 'Lanche da tarde',
    icon: Cookie,
    color: 'bg-orange-50 text-orange-700',
  },
  {
    key: 'dinner',
    label: 'Jantar',
    icon: Soup,
    color: 'bg-sky-50 text-sky-700',
  },
  {
    key: 'supper',
    label: 'Ceia',
    icon: Moon,
    color: 'bg-indigo-50 text-indigo-700',
  },
] as const;

export default async function PlanoAlimentarPage() {
  const supabase = createServerSupabase();

  const { data, error } = await supabase
    .from('meal_plans')
    .select('*')
    .order('day_number', { ascending: true });

  const mealPlans: MealPlan[] = (data ?? []) as MealPlan[];

  return (
    <AppShell>
      <div className="space-y-6 pb-10">
        <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-500 p-5 text-white shadow-xl shadow-emerald-100 md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-xs font-black uppercase tracking-wide">
                <CalendarDays size={16} />
                Plano alimentar
              </span>

              <h1 className="mt-5 text-3xl font-black leading-tight md:text-5xl">
                14 dias de refeições simples e organizadas.
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-50 md:text-base">
                Siga um cardápio prático para criar rotina, melhorar escolhas e
                manter consistência durante sua jornada.
              </p>
            </div>

            <div className="rounded-3xl bg-white/15 p-4 backdrop-blur md:min-w-52">
              <p className="text-xs font-bold uppercase tracking-wide text-emerald-50">
                Duração
              </p>
              <p className="mt-2 text-4xl font-black">14</p>
              <p className="text-sm font-semibold text-emerald-50">dias</p>
            </div>
          </div>
        </section>

        {error && (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
            Não foi possível carregar o plano alimentar agora.
          </div>
        )}

        {mealPlans.length === 0 ? (
          <div className="rounded-[2rem] border border-slate-100 bg-white p-8 text-center shadow-sm">
            <Sun className="mx-auto text-emerald-700" size={40} />
            <h2 className="mt-4 text-xl font-black text-slate-950">
              Nenhum plano cadastrado
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Execute o seed do plano alimentar no Supabase para preencher esta
              tela.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {mealPlans.map((day) => (
              <article
                key={day.id}
                className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm"
              >
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <span className="inline-flex rounded-full bg-emerald-600 px-4 py-2 text-xs font-black uppercase tracking-wide text-white">
                        Dia {day.day_number}
                      </span>

                      <h2 className="mt-4 text-2xl font-black text-slate-950">
                        Cardápio do dia
                      </h2>
                    </div>

                    <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-white text-emerald-700 shadow-sm">
                      <Utensils size={26} />
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 p-5">
                  {meals.map((meal) => {
                    const Icon = meal.icon;
                    const value = day[meal.key] ?? 'Opcional';

                    return (
                      <div
                        key={meal.key}
                        className="flex gap-3 rounded-3xl bg-slate-50 p-4"
                      >
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${meal.color}`}
                        >
                          <Icon size={21} />
                        </div>

                        <div>
                          <p className="text-xs font-black uppercase tracking-wide text-slate-500">
                            {meal.label}
                          </p>
                          <p className="mt-1 text-sm font-semibold leading-6 text-slate-800">
                            {value}
                          </p>
                        </div>
                      </div>
                    );
                  })}

                  {day.notes && (
                    <div className="mt-2 rounded-3xl bg-emerald-50 p-4">
                      <p className="text-xs font-black uppercase tracking-wide text-emerald-700">
                        Observação do dia
                      </p>
                      <p className="mt-2 text-sm font-semibold leading-6 text-emerald-900">
                        {day.notes}
                      </p>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
