import Link from 'next/link';
import {
  Apple,
  BarChart3,
  CheckCircle2,
  Dumbbell,
  HeartPulse,
  Sparkles,
} from 'lucide-react';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <section className="mx-auto flex min-h-screen max-w-7xl items-center px-6 py-16">
        <div className="grid w-full gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-xs font-black uppercase tracking-wide text-emerald-700">
              <Sparkles size={16} />
              Jornada Seu Ademir
            </span>

            <h1 className="mt-6 max-w-3xl text-4xl font-black leading-tight text-slate-950 md:text-6xl">
              Sua jornada de saúde, treino e evolução em um só lugar.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
              Organize sua rotina com treinos, alimentação, receitas,
              acompanhamento diário e evolução de progresso.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center rounded-3xl bg-emerald-600 px-7 py-4 text-sm font-black text-white transition hover:bg-emerald-700"
              >
                Começar agora
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-xl shadow-emerald-100">
            <div className="rounded-[1.5rem] bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-500 p-6 text-white">
              <p className="text-sm font-black uppercase tracking-wide text-emerald-50">
                Área do aluno
              </p>

              <h2 className="mt-3 text-3xl font-black">
                Treino, dieta e progresso
              </h2>

              <p className="mt-3 text-sm leading-6 text-emerald-50">
                Tudo organizado para manter constância todos os dias.
              </p>
            </div>

            <div className="mt-5 grid gap-3">
              <div className="flex items-center gap-3 rounded-3xl bg-emerald-50 p-4">
                <Dumbbell className="text-emerald-700" size={24} />
                <div>
                  <p className="font-black text-slate-950">Treinos</p>
                  <p className="text-sm text-slate-500">
                    Plano semanal de exercícios.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-3xl bg-emerald-50 p-4">
                <Apple className="text-emerald-700" size={24} />
                <div>
                  <p className="font-black text-slate-950">Alimentação</p>
                  <p className="text-sm text-slate-500">
                    Plano alimentar e receitas.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-3xl bg-emerald-50 p-4">
                <BarChart3 className="text-emerald-700" size={24} />
                <div>
                  <p className="font-black text-slate-950">Progresso</p>
                  <p className="text-sm text-slate-500">
                    Peso, medidas e evolução.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-3xl bg-emerald-50 p-4">
                <HeartPulse className="text-emerald-700" size={24} />
                <div>
                  <p className="font-black text-slate-950">Rotina diária</p>
                  <p className="text-sm text-slate-500">
                    Checklist de hábitos saudáveis.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-3xl bg-slate-50 p-4">
                <CheckCircle2 className="text-emerald-700" size={24} />
                <p className="text-sm font-bold text-slate-700">
                  Simples, visual e fácil de seguir.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
