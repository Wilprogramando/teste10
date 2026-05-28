import { AppShell } from '@/components/AppShell';
import { RecipeCard } from '@/components/RecipeCard';
import { createServerSupabase } from '@/lib/supabaseServer';
import type { Recipe } from '@/types/database';
import { ChefHat, Search, Sparkles } from 'lucide-react';

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
  if (Array.isArray(value)) return value;

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
    healthy_note:
      recipe.healthy_note ??
      'Opção simples para manter uma rotina mais equilibrada.',
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

  const categories = Array.from(new Set(recipes.map((recipe) => recipe.category)));

  return (
    <AppShell>
      <div className="space-y-6 pb-10">
        <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-500 p-5 text-white shadow-xl shadow-emerald-100 md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-xs font-black uppercase tracking-wide">
                <ChefHat size={16} />
                Receitas saudáveis
              </span>

              <h1 className="mt-5 text-3xl font-black leading-tight md:text-5xl">
                Coma melhor sem complicar sua rotina.
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-50 md:text-base">
                Receitas simples, acessíveis e práticas para café da manhã,
                almoço, jantar, lanches e pré-treino.
              </p>
            </div>

            <div className="rounded-3xl bg-white/15 p-4 backdrop-blur md:min-w-52">
              <p className="text-xs font-bold uppercase tracking-wide text-emerald-50">
                Total de receitas
              </p>
              <p className="mt-2 text-4xl font-black">{recipes.length}</p>
            </div>
          </div>
        </section>

        <section className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
          <div className="flex items-center gap-3 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <Search size={21} />
            </div>

            <div>
              <p className="text-sm font-black text-slate-950">
                Explore por categoria
              </p>
              <p className="text-xs text-slate-500">
                Escolha refeições leves, proteicas e fáceis de preparar.
              </p>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 md:justify-end">
            {categories.map((category) => (
              <span
                key={category}
                className="shrink-0 rounded-full bg-emerald-50 px-4 py-2 text-xs font-black capitalize text-emerald-700"
              >
                {category}
              </span>
            ))}
          </div>
        </section>

        {error && (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
            Não foi possível carregar as receitas agora.
          </div>
        )}

        {recipes.length === 0 ? (
          <div className="rounded-[2rem] border border-slate-100 bg-white p-8 text-center shadow-sm">
            <Sparkles className="mx-auto text-emerald-700" size={36} />
            <h2 className="mt-4 text-xl font-black text-slate-950">
              Nenhuma receita cadastrada
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Execute o seed de receitas no Supabase para preencher esta tela.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
