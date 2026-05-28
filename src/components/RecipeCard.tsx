'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Clock, Flame, Salad, Utensils } from 'lucide-react';
import type { Recipe } from '@/types/database';

function categoryLabel(category: string) {
  const labels: Record<string, string> = {
    'café da manhã': 'Café da manhã',
    cafe: 'Café da manhã',
    almoço: 'Almoço',
    almoco: 'Almoço',
    jantar: 'Jantar',
    lanche: 'Lanche',
    'pré-treino': 'Pré-treino',
    pre_treino: 'Pré-treino',
    geral: 'Geral',
  };

  return labels[category] ?? category;
}

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  const [open, setOpen] = useState(false);

  return (
    <article className="group overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-100">
      <div className="relative h-36 bg-gradient-to-br from-emerald-100 via-green-50 to-teal-100">
        {recipe.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={recipe.image_url}
            alt={recipe.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-white/70 text-emerald-700 shadow-sm">
              <Utensils size={34} />
            </div>
          </div>
        )}

        <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-black capitalize text-emerald-700 shadow-sm">
          {categoryLabel(recipe.category)}
        </span>
      </div>

      <div className="p-5">
        <h2 className="line-clamp-2 text-xl font-black leading-tight text-slate-950">
          {recipe.name}
        </h2>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="rounded-2xl bg-slate-50 p-3">
            <Flame className="text-orange-500" size={18} />
            <p className="mt-1 text-xs font-bold text-slate-500">Calorias</p>
            <p className="font-black text-slate-950">{recipe.calories}</p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-3">
            <Salad className="text-emerald-600" size={18} />
            <p className="mt-1 text-xs font-bold text-slate-500">Proteína</p>
            <p className="font-black text-slate-950">{recipe.protein_g}g</p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-3">
            <Clock className="text-sky-600" size={18} />
            <p className="mt-1 text-xs font-bold text-slate-500">Tempo</p>
            <p className="font-black text-slate-950">
              {recipe.prep_time_minutes}m
            </p>
          </div>
        </div>

        <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-600">
          {recipe.healthy_note}
        </p>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="mt-5 flex w-full items-center justify-between rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-700 transition hover:bg-emerald-100"
        >
          {open ? 'Ocultar preparo' : 'Ver preparo'}
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {open && (
          <div className="mt-5 space-y-5 rounded-3xl bg-slate-50 p-4">
            <div>
              <h3 className="text-sm font-black text-slate-950">
                Ingredientes
              </h3>

              <ul className="mt-3 grid gap-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <li
                    key={`${ingredient}-${index}`}
                    className="flex gap-2 text-sm text-slate-600"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-black text-slate-950">
                Modo de preparo
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                {recipe.preparation}
              </p>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
