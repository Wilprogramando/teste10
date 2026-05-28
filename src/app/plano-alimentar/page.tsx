import { AppShell } from '@/components/AppShell';
import { createServerSupabase } from '@/lib/supabaseServer';

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

export default async function PlanoAlimentarPage() {
  const supabase = createServerSupabase();

  const { data, error } = await supabase
    .from('meal_plans')
    .select('*')
    .order('day_number', { ascending: true });

  const mealPlans: MealPlan[] = data ?? [];

  return (
    <AppShell>
      <h1 className="text-4xl font-black">Plano alimentar de 14 dias</h1>

      <p className="mt-2 rounded-2xl bg-amber-50 p-4 text-amber-800">
        Plano geral para reeducação alimentar. Não substitui avaliação e
        acompanhamento com nutricionista.
      </p>

      {error && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
          Não foi possível carregar o plano alimentar agora.
        </div>
      )}

      <div className="mt-6 grid gap-4">
        {mealPlans.map((day) => (
          <div className="card" key={day.id}>
            <span className="badge">Dia {day.day_number}</span>

            <h2 className="mt-3 text-xl font-black">Cardápio do dia</h2>

            <div className="mt-3 grid gap-2 text-sm md:grid-cols-2">
              <p>
                <b>Café:</b> {day.breakfast ?? 'Não informado'}
              </p>

              <p>
                <b>Lanche manhã:</b> {day.morning_snack ?? 'Não informado'}
              </p>

              <p>
                <b>Almoço:</b> {day.lunch ?? 'Não informado'}
              </p>

              <p>
                <b>Lanche tarde:</b> {day.afternoon_snack ?? 'Não informado'}
              </p>

              <p>
                <b>Jantar:</b> {day.dinner ?? 'Não informado'}
              </p>

              <p>
                <b>Ceia:</b> {day.supper ?? 'Opcional'}
              </p>
            </div>

            <p className="mt-3 text-slate-600">
              {day.notes ?? 'Mantenha constância, hidratação e equilíbrio ao longo do dia.'}
            </p>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
