import { redirect } from 'next/navigation';
import {
  Activity,
  Apple,
  CalendarCheck,
  CheckCircle2,
  Dumbbell,
  Flame,
  HeartPulse,
  Scale,
  Target,
  TrendingUp,
  Trophy,
  User,
} from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { createServerSupabase } from '@/lib/supabaseServer';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function getTodayInBrazil() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
  }).format(new Date());
}

function formatGoal(goal?: string | null) {
  const goals: Record<string, string> = {
    emagrecer: 'Emagrecer',
    ganhar_massa: 'Ganhar massa',
    condicionamento: 'Condicionamento',
    vida_saudavel: 'Vida saudável',
  };

  if (!goal) return 'Não definido';

  return goals[goal] ?? goal;
}

function formatLevel(level?: string | null) {
  const levels: Record<string, string> = {
    iniciante: 'Iniciante',
    intermediario: 'Intermediário',
    avancado: 'Avançado',
  };

  if (!level) return 'Não definido';

  return levels[level] ?? level;
}

function formatNumber(value?: number | null) {
  if (value === null || value === undefined) {
    return '--';
  }

  return String(value).replace('.', ',');
}

function getGreeting() {
  const hour = Number(
    new Intl.DateTimeFormat('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      hour: '2-digit',
      hour12: false,
    }).format(new Date())
  );

  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

export default async function DashboardPage() {
  const supabase = createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const today = getTodayInBrazil();

  const [
    { data: profile },
    { data: latestMetric },
    { data: todayProgress },
    { count: completedDaysCount },
  ] = await Promise.all([
    supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle(),

    supabase
      .from('user_metrics')
      .select('*')
      .eq('user_id', user.id)
      .order('measured_at', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),

    supabase
      .from('daily_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .maybeSingle(),

    supabase
      .from('daily_progress')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('completed', true)
      .lt('date', today),
  ]);

  if (!profile?.onboarding_completed) {
    redirect('/onboarding');
  }

  const fullName =
    profile?.full_name ||
    user.email?.split('@')[0] ||
    'Aluno';

  const firstName = fullName.split(' ')[0];

  const initialWeight =
    profile?.initial_weight_kg ??
    profile?.current_weight_kg ??
    profile?.current_weight ??
    null;

  const currentWeight =
    latestMetric?.weight_kg ??
    profile?.current_weight_kg ??
    profile?.current_weight ??
    initialWeight;

  const weightDifference =
    currentWeight !== null &&
    currentWeight !== undefined &&
    initialWeight !== null &&
    initialWeight !== undefined
      ? Number(currentWeight) - Number(initialWeight)
      : null;

  const completedDays = completedDaysCount ?? 0;

  const todayCompleted = Boolean(todayProgress?.completed);
  const workoutDone = Boolean(todayProgress?.workout_done);
  const mealsOk = Boolean(todayProgress?.meals_ok);
  const habitDone = Boolean(todayProgress?.habit_done);

  const todayScore =
    [workoutDone, mealsOk, habitDone].filter(Boolean).length * 33 +
    (todayCompleted ? 1 : 0);

  return (
    <AppShell>
      <div className="space-y-6 pb-10">
        <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-500 p-5 text-white shadow-xl shadow-emerald-100 md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-xs font-black uppercase tracking-wide">
                <Trophy size={16} />
                Área de membro
              </span>

              <h1 className="mt-5 text-3xl font-black leading-tight md:text-5xl">
                {getGreeting()}, {firstName}
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-50 md:text-base">
                Sua jornada está em andamento. Continue evoluindo um dia de cada
                vez, com treino, alimentação e disciplina.
              </p>
            </div>

            <div className="rounded-[1.5rem] bg-white/15 p-5 backdrop-blur">
              <p className="text-xs font-black uppercase tracking-wide text-emerald-50">
                Hoje
              </p>

              <p className="mt-2 text-3xl font-black">
                {todayCompleted ? 'Concluído' : 'Em progresso'}
              </p>

              <p className="mt-1 text-sm text-emerald-50">
                {todayCompleted
                  ? 'Esse dia contará amanhã, após meia-noite.'
                  : 'Complete sua rotina de hoje.'}
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-wide text-slate-500">
                  Peso atual
                </p>

                <p className="mt-3 text-3xl font-black text-slate-950">
                  {formatNumber(currentWeight)}
                  <span className="ml-1 text-base text-slate-400">kg</span>
                </p>

                <p className="mt-2 text-sm font-medium text-slate-500">
                  Inicial: {formatNumber(initialWeight)} kg
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                <Scale size={24} />
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-wide text-slate-500">
                  Evolução
                </p>

                <p className="mt-3 text-3xl font-black text-slate-950">
                  {weightDifference === null
                    ? '--'
                    : `${weightDifference > 0 ? '+' : ''}${String(
                        weightDifference.toFixed(1)
                      ).replace('.', ',')}`}
                  <span className="ml-1 text-base text-slate-400">kg</span>
                </p>

                <p className="mt-2 text-sm font-medium text-slate-500">
                  Desde o início
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                <TrendingUp size={24} />
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-wide text-slate-500">
                  Dias concluídos
                </p>

                <p className="mt-3 text-3xl font-black text-slate-950">
                  {completedDays}
                </p>

                <p className="mt-2 text-sm font-medium text-slate-500">
                  Meta: 28 dias
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                <CalendarCheck size={24} />
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-wide text-slate-500">
                  Progresso de hoje
                </p>

                <p className="mt-3 text-3xl font-black text-slate-950">
                  {todayScore}
                  <span className="ml-1 text-base text-slate-400">%</span>
                </p>

                <p className="mt-2 text-sm font-medium text-slate-500">
                  Treino, alimentação e hábito
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <Activity size={24} />
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm md:p-6">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-950">
                  Seu dia de hoje
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Complete sua rotina diária. O dia só entra em “Dias
                  concluídos” depois da meia-noite.
                </p>
              </div>

              <div className="hidden h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 md:flex">
                <CheckCircle2 size={24} />
              </div>
            </div>

            <div className="grid gap-3">
              <div
                className={`flex items-center gap-4 rounded-3xl border p-4 ${
                  workoutDone
                    ? 'border-emerald-200 bg-emerald-50'
                    : 'border-slate-100 bg-slate-50'
                }`}
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                    workoutDone
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white text-slate-400'
                  }`}
                >
                  <Dumbbell size={23} />
                </div>

                <div>
                  <p className="font-black text-slate-950">Treino do dia</p>
                  <p className="text-sm text-slate-500">
                    {workoutDone ? 'Marcado como feito' : 'Ainda pendente'}
                  </p>
                </div>
              </div>

              <div
                className={`flex items-center gap-4 rounded-3xl border p-4 ${
                  mealsOk
                    ? 'border-emerald-200 bg-emerald-50'
                    : 'border-slate-100 bg-slate-50'
                }`}
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                    mealsOk
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white text-slate-400'
                  }`}
                >
                  <Apple size={23} />
                </div>

                <div>
                  <p className="font-black text-slate-950">Alimentação</p>
                  <p className="text-sm text-slate-500">
                    {mealsOk ? 'Marcada como concluída' : 'Ainda pendente'}
                  </p>
                </div>
              </div>

              <div
                className={`flex items-center gap-4 rounded-3xl border p-4 ${
                  habitDone
                    ? 'border-emerald-200 bg-emerald-50'
                    : 'border-slate-100 bg-slate-50'
                }`}
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                    habitDone
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white text-slate-400'
                  }`}
                >
                  <HeartPulse size={23} />
                </div>

                <div>
                  <p className="font-black text-slate-950">Hábito saudável</p>
                  <p className="text-sm text-slate-500">
                    {habitDone ? 'Marcado como feito' : 'Ainda pendente'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm md:p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-black text-slate-950">
                Seu perfil
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Dados principais da sua jornada.
              </p>
            </div>

            <div className="space-y-3">
              <div className="rounded-3xl bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                    <User size={21} />
                  </div>

                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-slate-500">
                      Nome
                    </p>
                    <p className="font-black text-slate-950">{fullName}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                    <Target size={21} />
                  </div>

                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-slate-500">
                      Objetivo
                    </p>
                    <p className="font-black text-slate-950">
                      {formatGoal(profile?.goal)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                    <Flame size={21} />
                  </div>

                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-slate-500">
                      Nível
                    </p>
                    <p className="font-black text-slate-950">
                      {formatLevel(profile?.level)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-[1.5rem] bg-gradient-to-br from-emerald-600 to-teal-500 p-5 text-white">
              <p className="text-sm font-black">
                Continue firme hoje.
              </p>

              <p className="mt-2 text-sm leading-6 text-emerald-50">
                Cada dia feito constrói sua transformação. A contagem oficial de
                dias concluídos atualiza após virar o dia.
              </p>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
