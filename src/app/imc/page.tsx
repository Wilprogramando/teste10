'use client';

import { useMemo, useState } from 'react';
import {
  Activity,
  Calculator,
  HeartPulse,
  Info,
  Ruler,
  Scale,
  Sparkles,
} from 'lucide-react';
import { AppShell } from '@/components/AppShell';

function getImcStatus(imc: number | null) {
  if (!imc) {
    return {
      label: 'Informe seus dados',
      description: 'Digite seu peso e altura para calcular o IMC.',
      bg: 'bg-slate-50',
      text: 'text-slate-700',
    };
  }

  if (imc < 18.5) {
    return {
      label: 'Abaixo do peso',
      description:
        'Seu IMC está abaixo da faixa considerada adequada. Avalie alimentação, rotina e acompanhamento profissional.',
      bg: 'bg-blue-50',
      text: 'text-blue-700',
    };
  }

  if (imc < 25) {
    return {
      label: 'Peso adequado',
      description:
        'Seu IMC está dentro da faixa considerada adequada. Continue mantendo bons hábitos.',
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
    };
  }

  if (imc < 30) {
    return {
      label: 'Sobrepeso',
      description:
        'Seu IMC indica sobrepeso. Ajustes em alimentação, treino e rotina podem ajudar na evolução.',
      bg: 'bg-yellow-50',
      text: 'text-yellow-700',
    };
  }

  if (imc < 35) {
    return {
      label: 'Obesidade grau I',
      description:
        'Seu IMC está na faixa de obesidade grau I. Busque acompanhamento profissional para uma estratégia segura.',
      bg: 'bg-orange-50',
      text: 'text-orange-700',
    };
  }

  if (imc < 40) {
    return {
      label: 'Obesidade grau II',
      description:
        'Seu IMC está na faixa de obesidade grau II. É recomendado acompanhamento profissional.',
      bg: 'bg-red-50',
      text: 'text-red-700',
    };
  }

  return {
    label: 'Obesidade grau III',
    description:
      'Seu IMC está na faixa de obesidade grau III. Procure orientação profissional para uma abordagem segura.',
    bg: 'bg-red-50',
    text: 'text-red-700',
  };
}

function formatImc(value: number | null) {
  if (!value) return '--';

  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

export default function ImcPage() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');

  const imc = useMemo(() => {
    const weightNumber = Number(weight);
    const heightNumber = Number(height);

    if (!weightNumber || !heightNumber) return null;

    const heightInMeters =
      heightNumber > 3 ? heightNumber / 100 : heightNumber;

    if (heightInMeters <= 0) return null;

    return weightNumber / (heightInMeters * heightInMeters);
  }, [weight, height]);

  const status = getImcStatus(imc);

  return (
    <AppShell>
      <div className="space-y-6 pb-10">
        <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-500 p-5 text-white shadow-xl shadow-emerald-100 md:p-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-xs font-black uppercase tracking-wide">
            <Calculator size={16} />
            Calculadora de IMC
          </span>

          <h1 className="mt-5 text-3xl font-black leading-tight md:text-5xl">
            Calcule seu índice de massa corporal.
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-50 md:text-base">
            Informe seu peso e altura para ver uma estimativa rápida do seu IMC.
            Esse cálculo é apenas informativo e não substitui avaliação
            profissional.
          </p>
        </section>

        <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm md:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                <Calculator size={23} />
              </div>

              <div>
                <h2 className="text-xl font-black text-slate-950">
                  Seus dados
                </h2>
                <p className="text-sm text-slate-500">
                  Preencha os campos abaixo para calcular.
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              <label className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                <span className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-500">
                  <Scale size={16} className="text-emerald-700" />
                  Peso
                </span>

                <div className="flex items-center gap-2">
                  <input
                    className="w-full bg-transparent text-base font-semibold text-slate-950 outline-none placeholder:text-slate-400"
                    type="number"
                    placeholder="Ex: 80"
                    value={weight}
                    onChange={(event) => setWeight(event.target.value)}
                  />
                  <span className="text-sm font-bold text-slate-400">kg</span>
                </div>
              </label>

              <label className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                <span className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-500">
                  <Ruler size={16} className="text-emerald-700" />
                  Altura
                </span>

                <div className="flex items-center gap-2">
                  <input
                    className="w-full bg-transparent text-base font-semibold text-slate-950 outline-none placeholder:text-slate-400"
                    type="number"
                    placeholder="Ex: 185 ou 1.85"
                    value={height}
                    onChange={(event) => setHeight(event.target.value)}
                  />
                  <span className="text-sm font-bold text-slate-400">
                    cm/m
                  </span>
                </div>
              </label>

              <div className="rounded-3xl bg-emerald-50 p-4">
                <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-emerald-700">
                  <Info size={16} />
                  Como funciona
                </p>

                <p className="mt-2 text-sm leading-6 text-emerald-900">
                  O IMC é calculado usando a fórmula: peso dividido pela altura
                  ao quadrado.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-5">
            <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm md:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-wide text-slate-500">
                    Resultado do IMC
                  </p>

                  <p className="mt-3 text-6xl font-black tracking-tight text-slate-950">
                    {formatImc(imc)}
                  </p>
                </div>

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-700">
                  <HeartPulse size={28} />
                </div>
              </div>

              <div className={`mt-5 rounded-3xl p-4 ${status.bg}`}>
                <p className={`text-lg font-black ${status.text}`}>
                  {status.label}
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {status.description}
                </p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm md:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                  <Activity size={23} />
                </div>

                <div>
                  <h2 className="text-xl font-black text-slate-950">
                    Classificação
                  </h2>
                  <p className="text-sm text-slate-500">
                    Referência geral para adultos.
                  </p>
                </div>
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3 text-sm">
                  <span className="font-semibold text-slate-600">
                    Abaixo do peso
                  </span>
                  <span className="font-black text-slate-950">
                    Menor que 18,5
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3 text-sm">
                  <span className="font-semibold text-slate-600">
                    Peso adequado
                  </span>
                  <span className="font-black text-slate-950">
                    18,5 a 24,9
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3 text-sm">
                  <span className="font-semibold text-slate-600">
                    Sobrepeso
                  </span>
                  <span className="font-black text-slate-950">
                    25 a 29,9
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3 text-sm">
                  <span className="font-semibold text-slate-600">
                    Obesidade I
                  </span>
                  <span className="font-black text-slate-950">
                    30 a 34,9
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3 text-sm">
                  <span className="font-semibold text-slate-600">
                    Obesidade II
                  </span>
                  <span className="font-black text-slate-950">
                    35 a 39,9
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3 text-sm">
                  <span className="font-semibold text-slate-600">
                    Obesidade III
                  </span>
                  <span className="font-black text-slate-950">
                    40 ou mais
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-emerald-100 bg-emerald-50 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-emerald-700">
                <Sparkles size={23} />
              </div>

              <h3 className="mt-4 text-lg font-black text-emerald-950">
                Observação importante
              </h3>

              <p className="mt-2 text-sm leading-6 text-emerald-800">
                O IMC não avalia composição corporal, massa muscular,
                percentual de gordura ou condições individuais. Use como uma
                referência simples.
              </p>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
