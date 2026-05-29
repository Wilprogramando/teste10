'use client';

import { useMemo, useState } from 'react';
import {
  ChefHat,
  Clock3,
  Coffee,
  Flame,
  Moon,
  Search,
  Sandwich,
  Sparkles,
  Utensils,
} from 'lucide-react';
import type { Recipe } from '@/app/receitas/page';

type Category = {
  key: string;
  label: string;
  description: string;
  icon: React.ElementType;
};

const categories: Category[] = [
  {
    key: 'cafe_da_manha',
    label: 'Café Da Manhã',
    description: 'Opções leves para começar o dia.',
    icon: Coffee,
  },
  {
    key: 'almoco',
    label: 'Almoço',
    description: 'Refeições completas e equilibradas.',
    icon: Utensils,
  },
  {
    key: 'lanche',
    label: 'Lanche',
    description: 'Receitas rápidas para o intervalo.',
    icon: Sandwich,
  },
  {
    key: 'jantar',
    label: 'Jantar',
    description: 'Opções práticas para fechar o dia.',
    icon: Moon,
  },
  {
    key: 'pre_treino',
    label: 'Pré-Treino',
    description: 'Energia antes do treino.',
    icon: Sparkles,
  },
];

const fallbackRecipes: Recipe[] = [
  {
    id: 'fallback-1',
    title: 'Iogurte com frutas e granola',
    category: 'Café Da Manhã',
    description: 'Uma opção rápida, leve e nutritiva para começar o dia.',
    calories: 280,
    protein_g: 14,
    carbs_g: 38,
    fat_g: 8,
    prep_time_minutes: 5,
    ingredients: [
      '1 pote de iogurte natural',
      '1 banana picada',
      '1 colher de granola',
      'Canela a gosto',
    ],
    instructions: [
      'Coloque o iogurte em uma tigela.',
      'Adicione a banana picada.',
      'Finalize com granola e canela.',
    ],
  },
  {
    id: 'fallback-2',
    title: 'Tapioca com ovo mexido',
    category: 'Café Da Manhã',
    description: 'Boa fonte de energia e proteína para o início do dia.',
    calories: 310,
    protein_g: 18,
    carbs_g: 34,
    fat_g: 11,
    prep_time_minutes: 10,
    ingredients: ['2 colheres de goma de tapioca', '2 ovos', 'Sal a gosto'],
    instructions: [
      'Prepare a tapioca na frigideira.',
      'Mexa os ovos separadamente.',
      'Recheie a tapioca com os ovos.',
    ],
  },
  {
    id: 'fallback-3',
    title: 'Frango grelhado com arroz e salada',
    category: 'Almoço',
    description: 'Refeição clássica, simples e eficiente.',
    calories: 520,
    protein_g: 42,
    carbs_g: 55,
    fat_g: 13,
    prep_time_minutes: 25,
    ingredients: [
      '150g de frango',
      '3 colheres de arroz',
      'Salada verde',
      'Azeite e temperos',
    ],
    instructions: [
      'Grelhe o frango temperado.',
      'Monte o prato com arroz e salada.',
      'Finalize com azeite moderado.',
    ],
  },
  {
    id: 'fallback-4',
    title: 'Sanduíche natural de frango',
    category: 'Lanche',
    description: 'Lanche prático para manter a rotina.',
    calories: 350,
    protein_g: 26,
    carbs_g: 36,
    fat_g: 10,
    prep_time_minutes: 12,
    ingredients: [
      '2 fatias de pão integral',
      'Frango desfiado',
      'Cenoura ralada',
      'Iogurte natural',
    ],
    instructions: [
      'Misture o frango com cenoura e iogurte.',
      'Monte no pão integral.',
      'Sirva em seguida.',
    ],
  },
  {
    id: 'fallback-5',
    title: 'Omelete com legumes',
    category: 'Jantar',
    description: 'Jantar leve, proteico e fácil de preparar.',
    calories: 290,
    protein_g: 22,
    carbs_g: 10,
    fat_g: 18,
    prep_time_minutes: 12,
    ingredients: ['3 ovos', 'Tomate', 'Cebola', 'Espinafre', 'Sal a gosto'],
    instructions: [
      'Bata os ovos.',
      'Misture os legumes picados.',
      'Leve à frigideira até firmar.',
    ],
  },
  {
    id: 'fallback-6',
    title: 'Banana com aveia e pasta de amendoim',
    category: 'Pré-Treino',
    description: 'Energia rápida para treinar melhor.',
    calories: 330,
    protein_g: 10,
    carbs_g: 48,
    fat_g: 12,
    prep_time_minutes: 5,
    ingredients: [
      '1 banana',
      '2 colheres de aveia',
      '1 colher de pasta de amendoim',
    ],
    instructions: [
      'Corte a banana.',
      'Adicione aveia.',
      'Finalize com pasta de amendoim.',
    ],
  },
];

function normalizeText(value?: string | null) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/-/g, ' ')
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ');
}

function getCategoryKey(category?: string | null) {
  const normalized = normalizeText(category);

  if (
    normalized.includes('cafe') ||
    normalized.includes('manha') ||
    normalized.includes('cafe da manha')
  ) {
    return 'cafe_da_manha';
  }

  if (normalized.includes('almoco')) {
    return 'almoco';
  }

  if (normalized.includes('lanche')) {
    return 'lanche';
  }

  if (normalized.includes('jantar')) {
    return 'jantar';
  }

  if (
    normalized.includes('pre treino') ||
    normalized.includes('pretreino') ||
    normalized.includes('pré treino') ||
    normalized.includes('pré-treino')
  ) {
    return 'pre_treino';
  }

  return 'almoco';
}

function getCategoryByRecipe(recipe: Recipe) {
  const key = getCategoryKey(recipe.category);
  return categories.find((category) => category.key === key) ?? categories[1];
}

function parseList(value?: string[] | string | null) {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

function getRecipeTitle(recipe: Recipe) {
  return recipe.title || recipe.name || 'Receita sem título';
}

function RecipeCard({ recipe }: { recipe: Recipe }) {
  const recipeCategory = getCategoryByRecipe(recipe);
  const RecipeIcon = recipeCategory.icon;

  const ingredients = parseList(recipe.ingredients);
  const instructions = parseList(recipe.instructions);

  return (
    <article className="overflow-hidden rounded-[2rem] border border-emerald-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative bg-gradient-to-br from-emerald-100 via-emerald-50 to-teal-100 p-5">
        <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-black text-emerald-800 shadow-sm">
          {recipeCategory.label}
        </span>

        <div className="absolute right-5 top-8 flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-white text-emerald-800 shadow-sm">
          <RecipeIcon size={36} />
        </div>

        <div className="pt-20">
          <h3 className="text-xl font-black leading-tight text-slate-950">
            {getRecipeTitle(recipe)}
          </h3>

          {recipe.description && (
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {recipe.description}
            </p>
          )}
        </div>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-emerald-50 p-3">
            <div className="flex items-center gap-2 text-emerald-700">
              <Flame size={16} />
              <span className="text-xs font-black uppercase">Calorias</span>
            </div>

            <p className="mt-2 text-lg font-black text-slate-950">
              {recipe.calories ?? '--'} kcal
            </p>
          </div>

          <div className="rounded-2xl bg-emerald-50 p-3">
            <div className="flex items-center gap-2 text-emerald-700">
              <Clock3 size={16} />
              <span className="text-xs font-black uppercase">Tempo</span>
            </div>

            <p className="mt-2 text-lg font-black text-slate-950">
              {recipe.prep_time_minutes ?? '--'} min
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="rounded-2xl bg-emerald-100 p-3 text-center">
            <p className="text-xs font-bold text-emerald-800">Proteína</p>
            <p className="mt-1 text-sm font-black text-slate-950">
              {recipe.protein_g ?? '--'}g
            </p>
          </div>

          <div className="rounded-2xl bg-orange-100 p-3 text-center">
            <p className="text-xs font-bold text-orange-800">Carbo</p>
            <p className="mt-1 text-sm font-black text-slate-950">
              {recipe.carbs_g ?? '--'}g
            </p>
          </div>

          <div className="rounded-2xl bg-blue-100 p-3 text-center">
            <p className="text-xs font-bold text-blue-800">Gordura</p>
            <p className="mt-1 text-sm font-black text-slate-950">
              {recipe.fat_g ?? '--'}g
            </p>
          </div>
        </div>

        {ingredients.length > 0 && (
          <div className="mt-5">
            <h4 className="text-sm font-black text-slate-950">
              Ingredientes
            </h4>

            <ul className="mt-3 space-y-2">
              {ingredients.slice(0, 5).map((ingredient, index) => (
                <li
                  key={`${recipe.id}-ingredient-${index}`}
                  className="flex gap-2 text-sm leading-6 text-slate-600"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-700" />
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>
        )}

        {instructions.length > 0 && (
          <div className="mt-5 rounded-3xl bg-emerald-50 p-4">
            <h4 className="text-sm font-black text-slate-950">
              Modo de preparo
            </h4>

            <ol className="mt-3 space-y-2">
              {instructions.slice(0, 4).map((instruction, index) => (
                <li
                  key={`${recipe.id}-instruction-${index}`}
                  className="flex gap-2 text-sm leading-6 text-slate-600"
                >
                  <span className="font-black text-emerald-800">
                    {index + 1}.
                  </span>
                  {instruction}
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </article>
  );
}

export function RecipesView({
  recipes,
  hasError,
}: {
  recipes: Recipe[];
  hasError?: boolean;
}) {
  const allRecipes = recipes.length > 0 ? recipes : fallbackRecipes;

  const [selectedCategory, setSelectedCategory] = useState<string>(
    categories[0].key
  );

  const selectedCategoryData =
    categories.find((category) => category.key === selectedCategory) ??
    categories[0];

  const selectedRecipes = useMemo(() => {
    return allRecipes.filter(
      (recipe) => getCategoryByRecipe(recipe).key === selectedCategory
    );
  }, [allRecipes, selectedCategory]);

  const totalRecipes = allRecipes.length;
  const SelectedIcon = selectedCategoryData.icon;

  function getCategoryCount(categoryKey: string) {
    return allRecipes.filter(
      (recipe) => getCategoryByRecipe(recipe).key === categoryKey
    ).length;
  }

  return (
    <div className="space-y-6 pb-10">
      <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-600 p-5 text-white shadow-xl shadow-emerald-100 md:p-8">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-xs font-black uppercase tracking-wide">
          <ChefHat size={16} />
          Receitas saudáveis
        </span>

        <h1 className="mt-5 text-3xl font-black leading-tight md:text-5xl">
          Escolha sua refeição
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-50 md:text-base">
          Toque em uma categoria para liberar as receitas daquela refeição.
        </p>

        <div className="mt-7 rounded-[1.5rem] bg-white/15 p-5 backdrop-blur">
          <p className="text-xs font-black uppercase tracking-wide text-emerald-50">
            Total de receitas cadastradas
          </p>

          <p className="mt-3 text-4xl font-black text-white">{totalRecipes}</p>
        </div>
      </section>

      {hasError && (
        <div className="rounded-[2rem] border border-amber-100 bg-amber-50 p-5 text-sm font-semibold leading-6 text-amber-800">
          Não foi possível carregar as receitas do banco agora. Mostrando opções
          padrão para manter a experiência funcionando.
        </div>
      )}

      <section className="rounded-[2rem] border border-emerald-100 bg-white p-5 shadow-sm md:p-6">
        <div className="mb-5 flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800">
            <Search size={23} />
          </div>

          <div>
            <h2 className="text-xl font-black text-slate-950">
              Qual refeição você quer fazer?
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Toque em uma categoria para liberar as receitas.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {categories.map((category) => {
            const Icon = category.icon;
            const active = selectedCategory === category.key;
            const count = getCategoryCount(category.key);

            return (
              <button
                key={category.key}
                type="button"
                onClick={() => setSelectedCategory(category.key)}
                className={`rounded-3xl border p-4 text-left transition ${
                  active
                    ? 'border-emerald-950 bg-emerald-800 text-white shadow-lg shadow-emerald-200'
                    : 'border-emerald-200 bg-emerald-100 text-slate-800 hover:border-emerald-500 hover:bg-emerald-200'
                }`}
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                    active
                      ? 'bg-white/20 text-white'
                      : 'bg-emerald-50 text-emerald-800'
                  }`}
                >
                  <Icon size={22} />
                </div>

                <p className="mt-4 text-base font-black">{category.label}</p>

                <p
                  className={`mt-1 text-sm ${
                    active ? 'text-emerald-50' : 'text-emerald-800'
                  }`}
                >
                  {count} opções
                </p>
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-emerald-800">
              Categoria selecionada
            </p>

            <div className="mt-2 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800">
                <SelectedIcon size={24} />
              </div>

              <div>
                <h2 className="text-3xl font-black text-slate-950">
                  {selectedCategoryData.label}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {selectedCategoryData.description}
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSelectedCategory(categories[0].key)}
            className="w-fit rounded-full bg-emerald-100 px-5 py-3 text-sm font-black text-emerald-800 transition hover:bg-emerald-200"
          >
            Trocar
          </button>
        </div>

        {selectedRecipes.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {selectedRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-emerald-100 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-800">
              <SelectedIcon size={30} />
            </div>

            <h3 className="mt-5 text-2xl font-black text-slate-950">
              Nenhuma receita nessa categoria
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Cadastre receitas para {selectedCategoryData.label} no banco de
              dados ou escolha outra refeição.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
