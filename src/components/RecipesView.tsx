'use client';

import { useMemo, useState } from 'react';
import { ChefHat, Coffee, Drumstick, Moon, Search, Sparkles, Utensils } from 'lucide-react';
import { RecipeCard } from '@/components/RecipeCard';
import type { Recipe } from '@/types/database';

const categoryOrder = [
  'café da manhã',
  'cafe',
  'almoço',
  'almoco',
  'lanche',
  'jantar',
  'pré-treino',
  'pre_treino',
  'geral',
];

function normalizeCategory(category: string) {
  const value = category.toLowerCase().trim();

  const map: Record<string, string> = {
    cafe: 'café da manhã',
    'café': 'café da manhã',
    'cafe da manha': 'café da manhã',
    'café da manhã': 'café da manhã',
    almoco: 'almoço',
    almoço: 'almoço',
    lanche: 'lanche',
    jantar: 'jantar',
    'pré-treino': 'pré-treino',
    'pre-treino': 'pré-treino',
    pre_treino: 'pré-treino',
    geral: 'geral',
  };

  return map[value] ?? value;
}

function categoryLabel(category: string) {
  const labels: Record<string, string> = {
    'café da manhã': 'Café da manhã',
    almoço: 'Almoço',
    lanche: 'Lanche',
    jantar: 'Jantar',
    'pré-treino': 'Pré-treino',
    geral: 'Geral',
  };

  return labels[category] ?? category;
}

function categoryIcon(category: string) {
  const icons: Record<string, React.ElementType> = {
    'café da manhã': Coffee,
    almoço: Drumstick,
    lanche: Utensils,
    jantar: Moon,
    'pré-treino': Sparkles,
    geral: ChefHat,
  };

  return icons[category] ?? ChefHat;
}

export function RecipesView({
  recipes,
  hasError,
}: {
  recipes: Recipe[];
  hasError: boolean;
}) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const normalizedRecipes = useMemo(
    () =>
      recipes.map((recipe) => ({
        ...recipe,
        category: normalizeCategory(recipe.category),
      })),
    [recipes]
  );

  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(normalizedRecipes.map((recipe) => recipe.category))
    );

    return unique.sort((a, b) => {
      const indexA = categoryOrder.indexOf(a);
      const indexB = categoryOrder.indexOf(b);

      if (indexA === -1 && indexB === -1) return a.localeCompare(b);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;

      return indexA - indexB;
    });
  }, [normalizedRecipes]);

  const filteredRecipes = selectedCategory
    ? normalizedRecipes.filter((recipe) => recipe.category === selectedCategory)
    : [];

  return (
    <div className="space-y-6 pb-10">
      <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-500 p-5 text-white shadow-xl shadow-emerald-100 md:p-8">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-xs font-black uppercase tracking-wide">
          <ChefHat size={16} />
          Receitas saudáveis
        </span>

        <h1 className="mt-5 text-3xl font-black leading-tight md:text-5xl">
          Escolha sua refeição.
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-50 md:text-base">
          Primeiro selecione o tipo de refeição que deseja preparar. Depois o
          sistema mostra apenas as opções daquela categoria.
        </p>

        <div className="mt-6 rounded-3xl bg-white/15 p-4 backdrop-blur">
          <p className="text-xs font-bold uppercase tracking-wide text-emerald-50">
            Total de receitas cadastradas
          </p>
          <p className="mt-2 text-4xl font-black">{recipes.length}</p>
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            <Search size={22} />
          </div>

          <div>
            <h2 className="text-lg font-black text-slate-950">
              Qual refeição você quer fazer?
            </h2>
            <p className="text-sm text-slate-500">
              Toque em uma categoria para liberar as receitas.
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((category) => {
            const Icon = categoryIcon(category);
            const isActive = selectedCategory === category;
            const total = normalizedRecipes.filter(
              (recipe) => recipe.category === category
            ).length;

            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-3xl border p-4 text-left transition ${
                  isActive
                    ? 'border-emerald-600 bg-emerald-600 text-white shadow-lg shadow-emerald-100'
                    : 'border-slate-100 bg-slate-50 text-slate-700 hover:border-emerald-200 hover:bg-emerald-50'
                }`}
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-white text-emerald-700'
                  }`}
                >
                  <Icon size={21} />
                </div>

                <p className="mt-3 text-sm font-black capitalize">
                  {categoryLabel(category)}
                </p>

                <p
                  className={`mt-1 text-xs ${
                    isActive ? 'text-emerald-50' : 'text-slate-500'
                  }`}
                >
                  {total} opções
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {hasError && (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          Não foi possível carregar as receitas agora.
        </div>
      )}

      {!selectedCategory && (
        <div className="rounded-[2rem] border border-dashed border-emerald-200 bg-emerald-50/70 p-8 text-center">
          <ChefHat className="mx-auto text-emerald-700" size={40} />
          <h2 className="mt-4 text-xl font-black text-slate-950">
            Escolha uma refeição acima
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            As receitas ficam ocultas até você selecionar café da manhã, almoço,
            lanche, jantar ou pré-treino.
          </p>
        </div>
      )}

      {selectedCategory && (
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-emerald-700">
                Categoria selecionada
              </p>
              <h2 className="text-2xl font-black capitalize text-slate-950">
                {categoryLabel(selectedCategory)}
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setSelectedCategory(null)}
              className="rounded-full bg-slate-100 px-4 py-2 text-xs font-black text-slate-600"
            >
              Trocar
            </button>
          </div>

          {filteredRecipes.length === 0 ? (
            <div className="rounded-[2rem] border border-slate-100 bg-white p-8 text-center shadow-sm">
              <Sparkles className="mx-auto text-emerald-700" size={36} />
              <h2 className="mt-4 text-xl font-black text-slate-950">
                Nenhuma receita nesta categoria
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Escolha outra refeição ou cadastre novas receitas no Supabase.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
