import { redirect } from 'next/navigation';
import { AppShell } from '@/components/AppShell';
import { createServerSupabase } from '@/lib/supabaseServer';
import {
  Activity,
  CalendarCheck,
  Dumbbell,
  Flame,
  HeartPulse,
  Scale,
  Target,
  TrendingDown,
} from 'lucide-react';

type Profile = {
  full_name?: string | null;
  name?: string | null;
  age?: number | null;
  height_cm?: number | null;
  initial_weight_kg?: number | null;
  current_weight_kg?: number | null;
  initial_weight?: number | null;
  current_weight?: number | null;
  goal?: string | null;
  level?: string | null;
  fitness_level?: string | null;
  training_frequency?: number | string | null;
};

type DailyProgress = {
  completed?: boolean | null;
  day_completed?: boolean | null;
};

type ProgressStage = {
  stage_number?: number | null;
  name?: string | null;
  title?: string | null;
  description?: string | null;
  motivation?: string | null;
  percentage?: number | null;
};

function formatGoal(goal?: string | null) {
  const labels: Record<string, string> = {
    emagrecer: 'Emagrecimento',
    ganhar_massa: 'Ganho de massa',
    condicionamento: 'Condicionamento',
    vida_saudavel: 'Vida saudável',
  };

  return goal ? labels[goal] ?? goal : 'Não informado';
}

function formatNumber(value?: number | null, suffix = '') {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return '--';
  }

  return `${Number(value).toLocaleString('pt-BR', {
    maximumFractionDigits: 1,
  })}${suffix}`;
}

function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
}: {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm md:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-2xl font-black leading-none text-slate-950 md:text-3xl">
            {value}
          </p>

          {subtitle && (
            <p className="mt-2 text-xs font-medium text-slate-500">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const supabase = createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const { data: profileData } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!profileData) {
    redirect('/onboarding');
  }

  const profile = profileData as Profile;

  const { data: progressData } = await supabase
    .from('daily_progress')
    .select('*')
    .eq('user_id', user.id);

  const completedDays = ((progressData ?? []) as DailyProgress[]).filter(
    (item) => item.completed || item.day_completed
  ).length;

  const progressPercent = Math.min(Math.round((completedDays / 28) * 100), 100);
  const currentStageNumber = Math.min(
    Math.max(Math.ceil((progressPercent || 1) / 10), 1),
    10
  );

  const { data: stageData } = await supabase
    .from('progress_stages')
    .select('*')
    .eq('stage_number', currentStageNumber)
    .maybeSingle();

  const stage = stageData as ProgressStage | null;

  const fullName = profile.full_name || profile.name || 'Aluno';
  const firstName = fullName.split(' ')[0];

  const initialWeight =
    profile.initial_weight_kg ?? profile.initial_weight ?? null;

  const currentWeight =
    profile.current_weight_kg ?? profile.current_weight ?? initialWeight;

  const height = profile.height_cm ?? null;
  const age = profile.age ?? null;

  const weightDiff =
    initialWeight && currentWeight
      ? Number(currentWeight) - Number(initialWeight)
      : null;

  return (
    <AppShell>
      <div className="space-y-6 pb-10">
        <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-500 p-5 text-white shadow-xl shadow-emerald-100 md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="inline-flex rounded-full bg-white/20 px-4 py-2 text-xs font-black uppercase tracking-wide text-white">
                Etapa {currentStageNumber} de 10
              </span>

              <h1 className="mt-5 text-3xl font-black leading-tight md:text-5xl">
                Olá, {firstName}
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-emerald-50 md:text-base">
                Sua evolução é construída um dia por vez. Continue registrando
                seus treinos, hábitos e progresso.
              </p>
            </div>

            <div className="rounded-3xl bg-white/15 p-4 backdrop-blur md:min-w-60">
              <p className="text-xs font-bold uppercase tracking-wide text-emerald-50">
                Progresso geral
              </p>

              <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full rounded-full bg-white"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <p className="mt-3 text-2xl font-black">{progressPercent}%</p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          <MetricCard
            title="Peso inicial"
            value={formatNumber(initialWeight, ' kg')}
            subtitle="Ponto de partida"
            icon={Scale}
          />

          <MetricCard
            title="Peso atual"
            value={formatNumber(currentWeight, ' kg')}
            subtitle={
              weightDiff === null
                ? 'Aguardando dados'
                : weightDiff === 0
                  ? 'Sem alteração'
                  : `${weightDiff > 0 ? '+' : ''}${formatNumber(
                      weightDiff,
                      ' kg'
                    )}`
            }
            icon={TrendingDown}
          />

          <MetricCard
            title="Altura"
            value={formatNumber(height, ' cm')}
            subtitle={age ? `${age} anos` : 'Idade não informada'}
            icon={HeartPulse}
          />

          <MetricCard
            title="Dias concluídos"
            value={`${completedDays}`}
            subtitle="Meta: 28 dias"
            icon={CalendarCheck}
          />
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm md:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                <Target size={22} />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Etapa atual
                </p>
                <h2 className="text-xl font-black text-slate-950">
                  {stage?.name || stage?.title || 'Começo da transformação'}
                </h2>
              </div>
            </div>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              {stage?.description ||
                'Você está criando a base da sua nova rotina. O foco agora é aparecer todos os dias e manter consistência.'}
            </p>

            <div className="mt-5 rounded-3xl bg-emerald-50 p-4">
              <p className="text-sm font-bold text-emerald-800">
                {stage?.motivation ||
                  'Não procure perfeição. Procure continuidade. Cada dia concluído fortalece sua disciplina.'}
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm md:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                <Flame size={22} />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Objetivo principal
                </p>
                <h2 className="text-xl font-black text-slate-950">
                  {formatGoal(profile.goal)}
                </h2>
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase text-slate-500">
                  Nível
                </p>
                <p className="mt-1 font-black capitalize text-slate-900">
                  {profile.level || profile.fitness_level || 'Não informado'}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase text-slate-500">
                  Frequência semanal
                </p>
                <p className="mt-1 font-black text-slate-900">
                  {profile.training_frequency
                    ? `${profile.training_frequency} treinos por semana`
                    : 'Não informado'}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm">
            <Activity className="text-emerald-700" size={26} />
            <h3 className="mt-4 text-lg font-black text-slate-950">
              Meu Dia
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Registre treino, água, alimentação e hábitos saudáveis.
            </p>
          </div>

          <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm">
            <Dumbbell className="text-emerald-700" size={26} />
            <h3 className="mt-4 text-lg font-black text-slate-950">
              Treino da semana
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Siga o plano de exercícios e evolua com segurança.
            </p>
          </div>

          <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm">
            <Scale className="text-emerald-700" size={26} />
            <h3 className="mt-4 text-lg font-black text-slate-950">
              Comparativo
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Compare seu início com seus dados atuais e acompanhe sua jornada.
            </p>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
