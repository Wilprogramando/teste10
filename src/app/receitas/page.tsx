import { AppShell } from '@/components/AppShell';
import { RecipeCard } from '@/components/RecipeCard';
import { createServerSupabase } from '@/lib/supabaseServer';
import type { Recipe } from '@/types/database';

type RecipeRow = {
  id: string;
  name: string | null;
  category: string | null;
  ingredients: string[] | string | null;
  preparation: string | null;
  prep_time_minutes: number | null;
  calories: number | null;
  protein_g: number | null;
  healthy_note: string | null;
  image_url: string | null;
};

function normalizeIngredients(value: string[] | string | null): string[] {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim().length > 0) {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function normalizeRecipe(recipe: RecipeRow): Recipe {
  return {
    id: recipe.id,
    name: recipe.name ?? 'Receita saudável',
    category: recipe.category ?? 'geral',
    ingredients: normalizeIngredients(recipe.ingredients),
    preparation: recipe.preparation ?? 'Modo de preparo não informado.',
    prep_time_minutes: recipe.prep_time_minutes ?? 0,
    calories: recipe.calories ?? 0,
    protein_g: recipe.protein_g ?? 0,
    healthy_note: recipe.healthy_note ?? 'Opção simples para manter uma rotina mais equilibrada.',
    image_url: recipe.image_url ?? null,
  };
}

export default async function ReceitasPage() {
  const supabase = createServerSupabase();

  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .order('category', { ascending: true });

  const recipes: Recipe[] = ((data ?? []) as RecipeRow[]).map(normalizeRecipe);

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
