import Link from 'next/link';
import { Dumbbell, Flame, Target, TrendingUp } from 'lucide-react';

const benefits = [
  {
    title: 'Onboarding personalizado',
    description:
      'Comece informando seu objetivo, nível atual e rotina disponível.',
    icon: Target,
  },
  {
    title: 'Plano alimentar de 14 dias',
    description: 'Organização simples para criar consistência na alimentação.',
    icon: Flame,
  },
  {
    title: '10 etapas de evolução',
    description: 'Acompanhe sua jornada com metas, progresso e motivação diária.',
    icon: TrendingUp,
  },
  {
    title: 'Treinos e hábitos saudáveis',
    description: 'Construa disciplina com checklists, treinos e acompanhamento.',
    icon: Dumbbell,
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-slate-50">
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2">
        <div>
          <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-700">
            Transformação em 4 semanas
          </span>

          <h1 className="mt-8 text-5xl font-black leading-tight text-slate-950 md:text-6xl">
            Mude seu corpo, sua energia e seus hábitos.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Um sistema completo para acompanhar treinos, alimentação, progresso,
            hábitos e motivação diária com dados protegidos por usuário.
          </p>
        </div>

        <div className="rounded-[2rem] border bg-white/80 p-6 shadow-xl shadow-emerald-100">
          <h2 className="text-2xl font-black text-slate-950">
            O que você recebe
          </h2>

          <div className="mt-6 grid gap-4">
            {benefits.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="flex gap-4 rounded-2xl bg-white p-5 shadow-sm"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                    <Icon size={22} />
                  </div>

                  <div>
                    <h3 className="font-black text-slate-950">{item.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
