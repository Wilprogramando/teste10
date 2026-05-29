'use client';

import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  CheckCircle2,
  Dumbbell,
  Flame,
  HeartPulse,
  Ruler,
  Scale,
  Sparkles,
  Target,
  User,
  Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabaseClient';

type FormData = {
  full_name: string;
  age: string;
  height_cm: string;
  initial_weight_kg: string;
  goal: string;
  level: string;
};

const initialForm: FormData = {
  full_name: '',
  age: '',
  height_cm: '',
  initial_weight_kg: '',
  goal: 'emagrecer',
  level: 'iniciante',
};

const goals = [
  {
    value: 'emagrecer',
    title: 'Emagrecer',
    description: 'Perder gordura e ganhar mais disposição.',
    icon: Flame,
  },
  {
    value: 'ganhar_massa',
    title: 'Ganhar massa',
    description: 'Construir força, músculo e evolução física.',
    icon: Dumbbell,
  },
  {
    value: 'condicionamento',
    title: 'Condicionamento',
    description: 'Melhorar resistência, fôlego e performance.',
    icon: Zap,
  },
  {
    value: 'vida_saudavel',
    title: 'Vida saudável',
    description: 'Criar uma rotina equilibrada e consistente.',
    icon: HeartPulse,
  },
];

const levels = [
  {
    value: 'iniciante',
    title: 'Iniciante',
    description: 'Estou começando agora.',
  },
  {
    value: 'intermediario',
    title: 'Intermediário',
    description: 'Já treino ou já treinei antes.',
  },
  {
    value: 'avancado',
    title: 'Avançado',
    description: 'Tenho boa experiência com treinos.',
  },
];

function toNumberOrNull(value: string) {
  if (!value || value.trim() === '') {
    return null;
  }

  const parsed = Number(value.replace(',', '.'));

  if (Number.isNaN(parsed)) {
    return null;
  }

  return parsed;
}

export default function OnboardingPage() {
  const supabase = createClient();
  const router = useRouter();

  const [form, setForm] = useState<FormData>(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'error' | 'success'>('error');

  useEffect(() => {
    async function loadUserProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/auth/login');
        return;
      }

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (data) {
        setForm({
          full_name: data.full_name ?? '',
          age: data.age ? String(data.age) : '',
          height_cm: data.height_cm ? String(data.height_cm) : '',
          initial_weight_kg: data.initial_weight_kg
            ? String(data.initial_weight_kg)
            : data.current_weight_kg
              ? String(data.current_weight_kg)
              : data.current_weight
                ? String(data.current_weight)
                : '',
          goal: data.goal ?? 'emagrecer',
          level: data.level ?? 'iniciante',
        });
      }

      setLoading(false);
    }

    loadUserProfile();
  }, [router, supabase]);

  function updateField(field: keyof FormData, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function finishOnboarding() {
    setMessage('');

    const cleanName = form.full_name.trim();
    const age = toNumberOrNull(form.age);
    const height = toNumberOrNull(form.height_cm);
    const weight = toNumberOrNull(form.initial_weight_kg);

    if (!cleanName) {
      setMessageType('error');
      setMessage('Informe seu nome para continuar.');
      return;
    }

    if (!age) {
      setMessageType('error');
      setMessage('Informe sua idade.');
      return;
    }

    if (!height) {
      setMessageType('error');
      setMessage('Informe sua altura.');
      return;
    }

    if (!weight) {
      setMessageType('error');
      setMessage('Informe seu peso atual.');
      return;
    }

    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setSaving(false);
      router.push('/auth/login');
      return;
    }

    const payload = {
      user_id: user.id,
      full_name: cleanName,
      age,
      height_cm: height,
      initial_weight_kg: weight,
      current_weight_kg: weight,
      current_weight: weight,
      goal: form.goal,
      level: form.level,
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('profiles')
      .upsert(payload, {
        onConflict: 'user_id',
      });

    setSaving(false);

    if (error) {
      setMessageType('error');
      setMessage(error.message);
      return;
    }

    setMessageType('success');
    setMessage('Perfil criado com sucesso. Redirecionando...');

    router.push('/dashboard');
    router.refresh();
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07111f] px-4">
        <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6 text-center text-white shadow-2xl backdrop-blur">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500">
            <Sparkles size={26} />
          </div>

          <p className="text-sm font-bold text-emerald-100">
            Preparando seu primeiro acesso...
          </p>
        </div>
      </main>
    );
  }

  const selectedGoal = goals.find((goal) => goal.value === form.goal);
  const SelectedGoalIcon = selectedGoal?.icon ?? Target;

  return (
    <main className="min-h-screen overflow-hidden bg-[#07111f] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute bottom-[-160px] right-[-140px] h-[380px] w-[380px] rounded-full bg-orange-500/20 blur-3xl" />
        <div className="absolute left-1/2 top-1/3 h-[320px] w-[320px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <section className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-8 px-4 py-8 md:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:py-10">
        <div className="hidden lg:block">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-emerald-200">
              <Sparkles size={14} />
              primeiro acesso
            </div>

            <h1 className="mt-6 text-5xl font-black leading-tight">
              Vamos montar sua jornada de transformação.
            </h1>

            <p className="mt-5 text-lg leading-8 text-slate-300">
              Antes de entrar na plataforma, precisamos de algumas informações
              essenciais para deixar sua experiência mais alinhada com seu
              objetivo.
            </p>

            <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/20 backdrop-blur">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-400 text-[#07111f]">
                  <SelectedGoalIcon size={30} />
                </div>

                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-200">
                    seu objetivo
                  </p>

                  <h2 className="mt-1 text-2xl font-black">
                    {selectedGoal?.title ?? 'Emagrecer'}
                  </h2>
                </div>
              </div>

              <p className="mt-5 text-sm leading-7 text-slate-300">
                {selectedGoal?.description ??
                  'Vamos focar em evolução, disciplina e constância.'}
              </p>

              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-2xl font-black text-white">1º</p>
                  <p className="mt-1 text-xs text-slate-400">Acesso</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-2xl font-black text-white">100%</p>
                  <p className="mt-1 text-xs text-slate-400">Foco</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-2xl font-black text-white">Hoje</p>
                  <p className="mt-1 text-xs text-slate-400">Começo</p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-3">
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                <CheckCircle2 size={20} className="text-emerald-300" />
                <p className="text-sm font-semibold text-slate-200">
                  Dados simples para personalizar sua experiência.
                </p>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                <CheckCircle2 size={20} className="text-emerald-300" />
                <p className="text-sm font-semibold text-slate-200">
                  Você poderá acompanhar peso, progresso e evolução depois.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-2xl">
          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white shadow-2xl shadow-black/30">
            <div className="bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-500 p-6 text-white md:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-50">
                    Jornada Seu Ademir
                  </p>

                  <h1 className="mt-3 text-3xl font-black leading-tight md:text-4xl">
                    Primeiro acesso
                  </h1>

                  <p className="mt-3 max-w-xl text-sm leading-6 text-emerald-50 md:text-base">
                    Preencha seus dados principais para liberar sua área de
                    membro e iniciar sua jornada.
                  </p>
                </div>

                <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20 md:flex">
                  <User size={28} />
                </div>
              </div>
            </div>

            <div className="p-5 md:p-8">
              <div className="mb-6 rounded-[1.5rem] border border-emerald-100 bg-emerald-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white">
                    <Sparkles size={18} />
                  </div>

                  <div>
                    <p className="text-sm font-black text-emerald-900">
                      Sua transformação começa com clareza
                    </p>

                    <p className="mt-1 text-sm leading-6 text-emerald-700">
                      Informe apenas o essencial agora. Depois você poderá
                      acompanhar sua evolução completa dentro da plataforma.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <span className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-500">
                    <User size={16} className="text-emerald-700" />
                    Nome
                  </span>

                  <input
                    type="text"
                    placeholder="Seu nome"
                    value={form.full_name}
                    onChange={(event) =>
                      updateField('full_name', event.target.value)
                    }
                    className="w-full bg-transparent text-base font-semibold text-slate-950 outline-none placeholder:text-slate-400"
                  />
                </label>

                <label className="block rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <span className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-500">
                    <HeartPulse size={16} className="text-emerald-700" />
                    Idade
                  </span>

                  <input
                    type="number"
                    placeholder="Sua idade"
                    value={form.age}
                    onChange={(event) => updateField('age', event.target.value)}
                    className="w-full bg-transparent text-base font-semibold text-slate-950 outline-none placeholder:text-slate-400"
                  />
                </label>

                <label className="block rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <span className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-500">
                    <Ruler size={16} className="text-emerald-700" />
                    Altura
                  </span>

                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Ex: 175"
                      value={form.height_cm}
                      onChange={(event) =>
                        updateField('height_cm', event.target.value)
                      }
                      className="w-full bg-transparent text-base font-semibold text-slate-950 outline-none placeholder:text-slate-400"
                    />

                    <span className="text-sm font-bold text-slate-400">cm</span>
                  </div>
                </label>

                <label className="block rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <span className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-500">
                    <Scale size={16} className="text-emerald-700" />
                    Peso atual
                  </span>

                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Ex: 82"
                      value={form.initial_weight_kg}
                      onChange={(event) =>
                        updateField('initial_weight_kg', event.target.value)
                      }
                      className="w-full bg-transparent text-base font-semibold text-slate-950 outline-none placeholder:text-slate-400"
                    />

                    <span className="text-sm font-bold text-slate-400">kg</span>
                  </div>
                </label>
              </div>

              <div className="mt-7">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                    <Target size={18} />
                  </div>

                  <div>
                    <h2 className="text-lg font-black text-slate-950">
                      Qual é seu principal objetivo?
                    </h2>

                    <p className="text-sm text-slate-500">
                      Escolha a opção que mais combina com sua fase atual.
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {goals.map((goal) => {
                    const Icon = goal.icon;
                    const active = form.goal === goal.value;

                    return (
                      <button
                        key={goal.value}
                        type="button"
                        onClick={() => updateField('goal', goal.value)}
                        className={`rounded-3xl border p-4 text-left transition ${
                          active
                            ? 'border-emerald-600 bg-emerald-600 text-white shadow-lg shadow-emerald-100'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50'
                        }`}
                      >
                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                            active
                              ? 'bg-white/20 text-white'
                              : 'bg-emerald-50 text-emerald-700'
                          }`}
                        >
                          <Icon size={22} />
                        </div>

                        <p className="mt-4 text-base font-black">
                          {goal.title}
                        </p>

                        <p
                          className={`mt-2 text-sm leading-6 ${
                            active ? 'text-emerald-50' : 'text-slate-500'
                          }`}
                        >
                          {goal.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-7">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                    <Dumbbell size={18} />
                  </div>

                  <div>
                    <h2 className="text-lg font-black text-slate-950">
                      Qual é seu nível atual?
                    </h2>

                    <p className="text-sm text-slate-500">
                      Isso ajuda a organizar sua jornada com mais segurança.
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  {levels.map((level) => {
                    const active = form.level === level.value;

                    return (
                      <button
                        key={level.value}
                        type="button"
                        onClick={() => updateField('level', level.value)}
                        className={`rounded-3xl border p-4 text-left transition ${
                          active
                            ? 'border-slate-950 bg-slate-950 text-white shadow-lg shadow-slate-200'
                            : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-400 hover:bg-white'
                        }`}
                      >
                        <p className="text-base font-black">{level.title}</p>

                        <p
                          className={`mt-2 text-sm leading-6 ${
                            active ? 'text-slate-200' : 'text-slate-500'
                          }`}
                        >
                          {level.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {message && (
                <div
                  className={`mt-6 rounded-2xl px-4 py-4 text-sm font-semibold ${
                    messageType === 'success'
                      ? 'bg-emerald-50 text-emerald-800'
                      : 'bg-red-50 text-red-700'
                  }`}
                >
                  {message}
                </div>
              )}

              <button
                type="button"
                onClick={finishOnboarding}
                disabled={saving}
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-500 px-6 py-5 text-base font-black text-white shadow-xl shadow-emerald-100 transition hover:scale-[1.01] hover:from-emerald-700 hover:to-teal-600 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {saving ? 'Salvando...' : 'Liberar minha jornada'}
                {!saving && <ArrowRight size={20} />}
              </button>

              <p className="mt-4 text-center text-xs leading-5 text-slate-400">
                Ao continuar, sua área de membro será liberada com base nas
                informações preenchidas.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
