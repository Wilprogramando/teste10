'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  ChevronRight,
  Clock3,
  Dumbbell,
  Flame,
  Lock,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { createClient } from '@/lib/supabaseClient';
import type {
  WorkoutExerciseItem,
  WorkoutPlanItem,
} from '@/app/treinos/page';

type WorkoutPlanViewProps = {
  plans: WorkoutPlanItem[];
  exercises: WorkoutExerciseItem[];
  userStartedAt: string;
};

const fallbackPlans: WorkoutPlanItem[] = [
  {
    id: 'fallback-week-1-a',
    week_number: 1,
    day_number: 1,
    day_name: 'Treino A',
    title: 'Treino A',
    focus: 'Corpo todo',
    intensity: 'Leve',
    notes:
      'Treino inicial para ativar o corpo, criar consistência e começar com segurança.',
  },
  {
    id: 'fallback-week-1-b',
    week_number: 1,
    day_number: 2,
    day_name: 'Treino B',
    title: 'Treino B',
    focus: 'Pernas e glúteos',
    intensity: 'Leve a moderada',
    notes:
      'Foco em membros inferiores com movimentos simples e controle corporal.',
  },
  {
    id: 'fallback-week-1-c',
    week_number: 1,
    day_number: 3,
    day_name: 'Treino C',
    title: 'Treino C',
    focus: 'Superiores e abdômen',
    intensity: 'Leve a moderada',
    notes:
      'Trabalho para braços, peito, costas e região central do corpo.',
  },
  {
    id: 'fallback-week-2-a',
    week_number: 2,
    day_number: 1,
    day_name: 'Treino A',
    title: 'Treino A',
    focus: 'Corpo todo',
    intensity: 'Moderada',
    notes:
      'Segunda semana com mais controle, volume e evolução dos movimentos.',
  },
  {
    id: 'fallback-week-2-b',
    week_number: 2,
    day_number: 2,
    day_name: 'Treino B',
    title: 'Treino B',
    focus: 'Pernas e glúteos',
    intensity: 'Moderada',
    notes:
      'Treino para fortalecer pernas, glúteos e resistência muscular.',
  },
  {
    id: 'fallback-week-2-c',
    week_number: 2,
    day_number: 3,
    day_name: 'Treino C',
    title: 'Treino C',
    focus: 'Superiores e abdômen',
    intensity: 'Moderada',
    notes:
      'Treino para membros superiores, postura, abdômen e estabilidade.',
  },
  {
    id: 'fallback-week-3-a',
    week_number: 3,
    day_number: 1,
    day_name: 'Treino A',
    title: 'Treino A',
    focus: 'Corpo todo',
    intensity: 'Moderada a alta',
    notes:
      'Semana de progressão para aumentar gasto calórico e condicionamento.',
  },
  {
    id: 'fallback-week-3-b',
    week_number: 3,
    day_number: 2,
    day_name: 'Treino B',
    title: 'Treino B',
    focus: 'Inferiores',
    intensity: 'Moderada a alta',
    notes:
      'Treino mais intenso para membros inferiores, resistência e força.',
  },
  {
    id: 'fallback-week-3-c',
    week_number: 3,
    day_number: 3,
    day_name: 'Treino C',
    title: 'Treino C',
    focus: 'Superiores',
    intensity: 'Moderada a alta',
    notes:
      'Treino para superiores com foco em evolução, postura e definição.',
  },
  {
    id: 'fallback-week-4-a',
    week_number: 4,
    day_number: 1,
    day_name: 'Treino A',
    title: 'Treino A',
    focus: 'Corpo todo',
    intensity: 'Alta',
    notes:
      'Semana final com mais intensidade para consolidar a evolução da jornada.',
  },
  {
    id: 'fallback-week-4-b',
    week_number: 4,
    day_number: 2,
    day_name: 'Treino B',
    title: 'Treino B',
    focus: 'Pernas e glúteos',
    intensity: 'Alta',
    notes:
      'Treino forte para membros inferiores, resistência e gasto calórico.',
  },
  {
    id: 'fallback-week-4-c',
    week_number: 4,
    day_number: 3,
    day_name: 'Treino C',
    title: 'Treino C',
    focus: 'Superiores e abdômen',
    intensity: 'Alta',
    notes:
      'Treino final para superiores, abdômen e condicionamento geral.',
  },
];

const fallbackExercises: WorkoutExerciseItem[] = [
  {
    id: 'fallback-exercise-1',
    workout_plan_id: 'fallback-week-1-a',
    name: 'Agachamento livre',
    sets: '3',
    reps: '12',
    rest_seconds: 45,
    instructions:
      'Mantenha os pés afastados na largura dos ombros, desça com controle e suba contraindo pernas e glúteos.',
    precautions:
      'Não deixe os joelhos fecharem para dentro. Mantenha a coluna neutra.',
    image_url: null,
  },
  {
    id: 'fallback-exercise-2',
    workout_plan_id: 'fallback-week-1-a',
    name: 'Flexão adaptada',
    sets: '3',
    reps: '8 a 12',
    rest_seconds: 45,
    instructions:
      'Apoie os joelhos no chão se necessário. Desça o peito com controle e empurre o chão para subir.',
    precautions:
      'Evite deixar o quadril cair. Mantenha abdômen firme.',
    image_url: null,
  },
  {
    id: 'fallback-exercise-3',
    workout_plan_id: 'fallback-week-1-a',
    name: 'Prancha',
    sets: '3',
    reps: '20 a 30 segundos',
    rest_seconds: 45,
    instructions:
      'Apoie antebraços e pontas dos pés no chão, mantendo o corpo alinhado.',
    precautions:
      'Não prenda a respiração. Contraia abdômen e glúteos.',
    image_url: null,
  },
];

function getTodayInBrazil() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
  }).format(new Date());
}

function getWorkoutLetter(index: number) {
  return String.fromCharCode(65 + index);
}

function getUnlockedWeek(startDate: string) {
  const start = new Date(startDate);
  const now = new Date();

  const diffMs = now.getTime() - start.getTime();
  const diffDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

  const unlockedWeek = Math.floor(diffDays / 7) + 1;

  return Math.min(Math.max(unlockedWeek, 1), 4);
}

function getNextUnlockDate(startDate: string, unlockedWeek: number) {
  if (unlockedWeek >= 4) {
    return null;
  }

  const start = new Date(startDate);
  const nextUnlock = new Date(start);

  nextUnlock.setDate(start.getDate() + unlockedWeek * 7);

  return nextUnlock;
}

function formatCountdown(targetDate: Date | null) {
  if (!targetDate) {
    return 'Todas as semanas foram liberadas.';
  }

  const now = new Date();
  const diffMs = targetDate.getTime() - now.getTime();

  if (diffMs <= 0) {
    return 'Nova semana liberada.';
  }

  const totalSeconds = Math.floor(diffMs / 1000);

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}min`;
  }

  return `${hours}h ${minutes}min`;
}

async function markWorkoutDoneInDatabase() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return;
  }

  const today = getTodayInBrazil();

  const { data: existingProgress } = await supabase
    .from('daily_progress')
    .select('id, meals_ok, habit_done')
    .eq('user_id', user.id)
    .eq('date', today)
    .maybeSingle();

  if (existingProgress?.id) {
    await supabase
      .from('daily_progress')
      .update({
        workout_done: true,
        completed: Boolean(existingProgress.meals_ok && existingProgress.habit_done),
        updated_at: new Date().toISOString(),
      })
      .eq('id', existingProgress.id);

    return;
  }

  await supabase.from('daily_progress').insert({
    user_id: user.id,
    date: today,
    workout_done: true,
    meals_ok: false,
    habit_done: false,
    completed: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
}

export function WorkoutPlanView({
  plans,
  exercises,
  userStartedAt,
}: WorkoutPlanViewProps) {
  const availablePlans = plans.length > 0 ? plans : fallbackPlans;
  const availableExercises = exercises.length > 0 ? exercises : fallbackExercises;

  const unlockedWeek = getUnlockedWeek(userStartedAt);
  const nextUnlockDate = getNextUnlockDate(userStartedAt, unlockedWeek);

  const [selectedWeek, setSelectedWeek] = useState(unlockedWeek);
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [completedPlanIds, setCompletedPlanIds] = useState<string[]>([]);
  const [savingDone, setSavingDone] = useState(false);
  const [message, setMessage] = useState('');

  const weekPlans = useMemo(() => {
    return availablePlans
      .filter((plan) => plan.week_number === selectedWeek)
      .sort((a, b) => a.day_number - b.day_number);
  }, [availablePlans, selectedWeek]);

  const selectedPlan = useMemo(() => {
    return (
      weekPlans.find((plan) => plan.id === selectedPlanId) ??
      weekPlans[0] ??
      null
    );
  }, [weekPlans, selectedPlanId]);

  const selectedExercises = useMemo(() => {
    if (!selectedPlan) {
      return [];
    }

    return availableExercises.filter(
      (exercise) => exercise.workout_plan_id === selectedPlan.id
    );
  }, [availableExercises, selectedPlan]);

  useEffect(() => {
    if (weekPlans.length > 0) {
      setSelectedPlanId((current) => {
        const currentExists = weekPlans.some((plan) => plan.id === current);

        if (currentExists) {
          return current;
        }

        return weekPlans[0].id;
      });
    }
  }, [weekPlans]);

  useEffect(() => {
    const stored = window.localStorage.getItem('completed-workout-plans');

    if (stored) {
      try {
        setCompletedPlanIds(JSON.parse(stored));
      } catch {
        setCompletedPlanIds([]);
      }
    }
  }, []);

  function saveCompletedPlans(nextCompletedPlans: string[]) {
    setCompletedPlanIds(nextCompletedPlans);
    window.localStorage.setItem(
      'completed-workout-plans',
      JSON.stringify(nextCompletedPlans)
    );
  }

  async function handleMarkAsDone() {
    if (!selectedPlan) {
      return;
    }

    setSavingDone(true);
    setMessage('');

    const alreadyCompleted = completedPlanIds.includes(selectedPlan.id);

    const nextCompletedPlans = alreadyCompleted
      ? completedPlanIds
      : [...completedPlanIds, selectedPlan.id];

    saveCompletedPlans(nextCompletedPlans);

    await markWorkoutDoneInDatabase();

    setSavingDone(false);
    setMessage('Treino marcado como feito. Excelente trabalho!');
  }

  function handleSelectWeek(week: number) {
    if (week > unlockedWeek) {
      return;
    }

    setSelectedWeek(week);
    setMessage('');
  }

  const selectedPlanIndex = selectedPlan
    ? weekPlans.findIndex((plan) => plan.id === selectedPlan.id)
    : 0;

  const selectedPlanLabel = `Treino ${getWorkoutLetter(
    Math.max(selectedPlanIndex, 0)
  )}`;

  const selectedPlanDone = selectedPlan
    ? completedPlanIds.includes(selectedPlan.id)
    : false;

  const weekProgress =
    weekPlans.length > 0
      ? Math.round(
          (weekPlans.filter((plan) => completedPlanIds.includes(plan.id))
            .length /
            weekPlans.length) *
            100
        )
      : 0;

  return (
    <div className="space-y-6 pb-10">
      <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-500 p-5 text-white shadow-xl shadow-emerald-100 md:p-8">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-xs font-black uppercase tracking-wide">
          <Dumbbell size={16} />
          Treinos
        </span>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.75fr] lg:items-end">
          <div>
            <h1 className="text-3xl font-black leading-tight md:text-5xl">
              Escolha seu treino e marque sua evolução
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-50 md:text-base">
              Toque em um treino para abrir os exercícios. Depois de concluir,
              marque como feito para registrar seu progresso do dia.
            </p>
          </div>

          <div className="rounded-[1.5rem] bg-white/15 p-5 backdrop-blur">
            <p className="text-xs font-black uppercase tracking-wide text-emerald-50">
              Progresso da semana
            </p>

            <p className="mt-2 text-4xl font-black text-white">
              {weekProgress}%
            </p>

            <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-white transition-all"
                style={{ width: `${weekProgress}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {[1, 2, 3, 4].map((week) => {
          const locked = week > unlockedWeek;
          const active = selectedWeek === week;

          return (
            <button
              key={week}
              type="button"
              onClick={() => handleSelectWeek(week)}
              className={`rounded-[2rem] border p-5 text-left transition ${
                active
                  ? 'border-emerald-600 bg-emerald-600 text-white shadow-lg shadow-emerald-100'
                  : locked
                    ? 'border-slate-100 bg-slate-50 text-slate-400'
                    : 'border-slate-100 bg-white text-slate-700 hover:border-emerald-200 hover:bg-emerald-50'
              }`}
            >
              <div
                className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl ${
                  active
                    ? 'bg-white/20 text-white'
                    : locked
                      ? 'bg-white text-slate-300'
                      : 'bg-emerald-50 text-emerald-700'
                }`}
              >
                {locked ? <Lock size={22} /> : <Trophy size={22} />}
              </div>

              <p className="text-sm font-black uppercase tracking-wide">
                Semana {week}
              </p>

              <p
                className={`mt-2 text-sm leading-6 ${
                  active
                    ? 'text-emerald-50'
                    : locked
                      ? 'text-slate-400'
                      : 'text-slate-500'
                }`}
              >
                {locked ? 'Bloqueada' : active ? 'Selecionada' : 'Liberada'}
              </p>
            </button>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm md:p-6">
          <div className="mb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                <PlayCircle size={24} />
              </div>

              <div>
                <h2 className="text-2xl font-black text-slate-950">
                  Selecione o treino
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Clique em um card para abrir os exercícios.
                </p>
              </div>
            </div>
          </div>

          {weekPlans.length > 0 ? (
            <div className="grid gap-3">
              {weekPlans.map((plan, index) => {
                const active = selectedPlan?.id === plan.id;
                const done = completedPlanIds.includes(plan.id);
                const label = `Treino ${getWorkoutLetter(index)}`;

                return (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => {
                      setSelectedPlanId(plan.id);
                      setMessage('');
                    }}
                    className={`rounded-3xl border p-4 text-left transition ${
                      active
                        ? 'border-emerald-600 bg-emerald-600 text-white shadow-lg shadow-emerald-100'
                        : done
                          ? 'border-emerald-200 bg-emerald-50 text-slate-800'
                          : 'border-slate-100 bg-slate-50 text-slate-700 hover:border-emerald-200 hover:bg-emerald-50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                            active
                              ? 'bg-white/20 text-white'
                              : done
                                ? 'bg-emerald-600 text-white'
                                : 'bg-white text-emerald-700'
                          }`}
                        >
                          {done ? (
                            <CheckCircle2 size={23} />
                          ) : (
                            <Dumbbell size={23} />
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-lg font-black">
                            {label}
                          </p>

                          <p
                            className={`mt-1 truncate text-sm ${
                              active
                                ? 'text-emerald-50'
                                : done
                                  ? 'text-emerald-700'
                                  : 'text-slate-500'
                            }`}
                          >
                            {plan.focus || 'Treino da jornada'}
                          </p>
                        </div>
                      </div>

                      <ChevronRight
                        size={20}
                        className={
                          active ? 'text-white' : 'text-slate-400'
                        }
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="rounded-3xl bg-slate-50 p-6 text-center">
              <p className="font-black text-slate-950">
                Nenhum treino disponível nessa semana.
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Cadastre treinos no banco de dados ou use o plano padrão.
              </p>
            </div>
          )}
        </div>

        <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm md:p-6">
          {selectedPlan ? (
            <>
              <div className="mb-6 rounded-[1.75rem] bg-gradient-to-br from-slate-950 to-slate-800 p-5 text-white">
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-emerald-300">
                      {selectedPlanLabel}
                    </p>

                    <h2 className="mt-2 text-3xl font-black leading-tight">
                      {selectedPlan.title || selectedPlanLabel}
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      {selectedPlan.notes ||
                        'Siga os exercícios abaixo com atenção e respeite seus limites.'}
                    </p>
                  </div>

                  <div
                    className={`w-fit rounded-full px-4 py-2 text-xs font-black uppercase tracking-wide ${
                      selectedPlanDone
                        ? 'bg-emerald-500 text-white'
                        : 'bg-white/10 text-slate-200'
                    }`}
                  >
                    {selectedPlanDone ? 'Feito' : 'Pendente'}
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                      Foco
                    </p>
                    <p className="mt-2 text-lg font-black">
                      {selectedPlan.focus || 'Corpo todo'}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                      Intensidade
                    </p>
                    <p className="mt-2 text-lg font-black">
                      {selectedPlan.intensity || 'Moderada'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleMarkAsDone}
                  disabled={savingDone || selectedPlanDone}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-3xl px-6 py-4 text-sm font-black transition disabled:cursor-not-allowed disabled:opacity-80 ${
                    selectedPlanDone
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                >
                  <CheckCircle2 size={20} />
                  {selectedPlanDone
                    ? 'Treino já marcado como feito'
                    : savingDone
                      ? 'Salvando...'
                      : 'Marcar treino como feito'}
                </button>
              </div>

              {message && (
                <div className="mb-6 rounded-3xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
                  {message}
                </div>
              )}

              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                  <Flame size={22} />
                </div>

                <div>
                  <h3 className="text-xl font-black text-slate-950">
                    Exercícios do treino
                  </h3>

                  <p className="text-sm text-slate-500">
                    Execute em sequência e descanse conforme indicado.
                  </p>
                </div>
              </div>

              {selectedExercises.length > 0 ? (
                <div className="grid gap-3">
                  {selectedExercises.map((exercise, index) => (
                    <div
                      key={exercise.id}
                      className="rounded-3xl border border-slate-100 bg-slate-50 p-4"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-lg font-black text-emerald-700">
                          {index + 1}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h4 className="text-lg font-black text-slate-950">
                            {exercise.name}
                          </h4>

                          <div className="mt-3 grid gap-2 sm:grid-cols-3">
                            <div className="rounded-2xl bg-white p-3">
                              <p className="text-xs font-black uppercase text-slate-400">
                                Séries
                              </p>
                              <p className="mt-1 font-black text-slate-950">
                                {exercise.sets}
                              </p>
                            </div>

                            <div className="rounded-2xl bg-white p-3">
                              <p className="text-xs font-black uppercase text-slate-400">
                                Repetições
                              </p>
                              <p className="mt-1 font-black text-slate-950">
                                {exercise.reps}
                              </p>
                            </div>

                            <div className="rounded-2xl bg-white p-3">
                              <p className="text-xs font-black uppercase text-slate-400">
                                Descanso
                              </p>
                              <p className="mt-1 font-black text-slate-950">
                                {exercise.rest_seconds}s
                              </p>
                            </div>
                          </div>

                          {exercise.instructions && (
                            <p className="mt-4 text-sm leading-6 text-slate-600">
                              {exercise.instructions}
                            </p>
                          )}

                          {exercise.precautions && (
                            <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 p-3">
                              <div className="flex gap-2">
                                <ShieldCheck
                                  size={18}
                                  className="mt-0.5 shrink-0 text-amber-700"
                                />

                                <p className="text-sm leading-6 text-amber-800">
                                  {exercise.precautions}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl bg-slate-50 p-6 text-center">
                  <p className="font-black text-slate-950">
                    Nenhum exercício cadastrado.
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Cadastre exercícios para este treino no banco de dados.
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-3xl bg-slate-50 p-6 text-center">
              <p className="font-black text-slate-950">
                Selecione um treino para começar.
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Os exercícios aparecerão aqui.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <Clock3 size={23} />
            </div>

            <div>
              <h2 className="text-xl font-black text-slate-950">
                Liberação das próximas semanas
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Uma nova semana é liberada a cada 7 dias desde o seu primeiro
                acesso.
              </p>
            </div>
          </div>

          <div className="rounded-3xl bg-slate-50 px-5 py-4 text-left md:text-right">
            <p className="text-xs font-black uppercase tracking-wide text-slate-500">
              Próxima liberação
            </p>

            <p className="mt-1 text-lg font-black text-slate-950">
              {formatCountdown(nextUnlockDate)}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
