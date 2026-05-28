import { AppShell } from '@/components/AppShell';
import { RecipeCard } from '@/components/RecipeCard';
import { createServerSupabase } from '@/lib/supabaseServer';

type Recipe = {
  id: string;
  name: string;
  category: string;
  ingredients: string | null;
  preparation: string | null;
  prep_time_minutes: number | null;
  calories: number | null;
  protein_g: number | null;
  healthy_note: string | null;
  image_url: string | null;
};

export default async function ReceitasPage() {
  const supabase = createServerSupabase();

  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .order('category', { ascending: true });

  const recipes: Recipe[] = (data ?? []) as Recipe[];

  return (
    <AppShell>
      <h1 className="text-4xl font-black">Receitas saudáveis</h1>

      <p className="mt-2 text-slate-600">
        Mais de 30 opções simples, acessíveis e práticas.
      </p>

      {error && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
          Não foi possível carregar as receitas agora.
        </div>
      )}

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </AppShell>
  );
}
