'use client';

import { useMemo, useState } from 'react';
import {
  Activity,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Dumbbell,
  Flame,
  Home,
  ShieldCheck,
  Target,
} from 'lucide-react';
import type {
  WorkoutExerciseItem,
  WorkoutPlanItem,
} from '@/app/treinos/page';

const fallbackPlans: WorkoutPlanItem[] = [
  {
    id: 'fallback-1',
    week_number: 1,
    day_number: 1,
    day_name: 'Segunda-feira',
    title: 'Treino A',
    focus: 'Peito, ombros e tríceps',
    intensity: 'Leve a moderada',
    notes:
      'Semana de adaptação. Foque em aprender os movimentos e manter boa postura.',
  },
  {
    id: 'fallback-2',
    week_number: 1,
    day_number: 2,
    day_name: 'Quarta-feira',
    title: 'Treino B',
    focus: 'Costas e bíceps',
    intensity: 'Leve a moderada',
    notes:
      'Controle a execução e evite puxar cargas acima do necessário.',
  },
  {
    id: 'fallback-3',
    week_number: 1,
    day_number: 3,
    day_name: 'Sexta-feira',
    title: 'Treino C',
    focus: 'Pernas e abdômen',
    intensity: 'Moderada',
    notes:
      'Priorize amplitude segura, estabilidade e respiração durante os exercícios.',
  },
  {
    id: 'fallback-4',
    week_number: 2,
    day_number: 1,
    day_name: 'Segunda-feira',
    title: 'Treino A',
    focus: 'Peito, ombros e tríceps',
    intensity: 'Moderada',
    notes: 'Aumente levemente a carga se a execução estiver segura.',
  },
  {
    id: 'fallback-5',
    week_number: 2,
    day_number: 2,
    day_name: 'Quarta-feira',
    title: 'Treino B',
    focus: 'Costas e bíceps',
    intensity: 'Moderada',
    notes: 'Mantenha descanso controlado e boa contração muscular.',
  },
  {
    id: 'fallback-6',
    week_number: 2,
    day_number: 3,
    day_name: 'Sexta-feira',
    title: 'Treino C',
    focus: 'Pernas e abdômen',
    intensity: 'Moderada',
    notes: 'Busque constância. Não sacrifique postura por carga.',
  },
  {
    id: 'fallback-7',
    week_number: 3,
    day_number: 1,
    day_name: 'Segunda-feira',
    title: 'Treino A',
    focus: 'Peito, ombros e tríceps',
    intensity: 'Moderada a alta',
    notes:
      'Semana de progressão. Aumente carga ou repetições com segurança.',
  },
  {
    id: 'fallback-8',
    week_number: 3,
    day_number: 2,
    day_name: 'Quarta-feira',
    title: 'Treino B',
    focus: 'Costas e bíceps',
    intensity: 'Moderada a alta',
    notes:
      'Controle a fase de descida dos movimentos e mantenha estabilidade.',
  },
  {
    id: 'fallback-9',
    week_number: 3,
    day_number: 3,
    day_name: 'Sexta-feira',
    title: 'Treino C',
    focus: 'Pernas e abdômen',
    intensity: 'Moderada a alta',
    notes:
      'Atenção a joelhos, lombar e respiração durante os exercícios.',
  },
  {
    id: 'fallback-10',
    week_number: 4,
    day_number: 1,
    day_name: 'Segunda-feira',
    title: 'Treino A',
    focus: 'Superiores',
    intensity: 'Alta controlada',
    notes: 'Última semana. Treine forte, mas com técnica limpa.',
  },
  {
    id: 'fallback-11',
    week_number: 4,
    day_number: 2,
    day_name: 'Quarta-feira',
    title: 'Treino B',
    focus: 'Costas, bíceps e core',
    intensity: 'Alta controlada',
    notes: 'Mantenha concentração e registre sua evolução.',
  },
  {
    id: 'fallback-12',
    week_number: 4,
    day_number: 3,
    day_name: 'Sexta-feira',
    title: 'Treino C',
    focus: 'Pernas completas',
    intensity: 'Alta controlada',
    notes: 'Finalize o ciclo com disciplina, controle e boa recuperação.',
  },
];

const fallbackExercises: WorkoutExerciseItem[] = [
  {
    id: 'ex-1',
    workout_plan_id: 'fallback-1',
    name: 'Supino com halteres',
    sets: '3',
    reps: '10 a 12',
    rest_seconds: 60,
    instructions:
      'Deite no banco, mantenha os pés firmes no chão e empurre os halteres para cima sem travar os cotovelos.',
    precautions:
      'Evite abrir demais os cotovelos e não use carga que comprometa a estabilidade.',
    image_url: null,
  },
  {
    id: 'ex-2',
    workout_plan_id: 'fallback-1',
    name: 'Desenvolvimento de ombros',
    sets: '3',
    reps: '10 a 12',
    rest_seconds: 60,
    instructions:
      'Empurre os halteres acima da cabeça com o tronco firme e abdômen contraído.',
    precautions: 'Não arqueie a lombar. Reduza a carga se perder controle.',
    image_url: null,
  },
  {
    id: 'ex-3',
    workout_plan_id: 'fallback-1',
    name: 'Tríceps na polia',
    sets: '3',
    reps: '12 a 15',
    rest_seconds: 45,
    instructions:
      'Mantenha os cotovelos próximos ao corpo e estenda os braços até contrair o tríceps.',
    precautions: 'Evite balançar o tronco durante o movimento.',
    image_url: null,
  },
  {
    id: 'ex-4',
    workout_plan_id: 'fallback-2',
    name: 'Puxada frontal',
    sets: '3',
    reps: '10 a 12',
    rest_seconds: 60,
    instructions:
      'Puxe a barra em direção ao peito, mantendo o tronco firme e os ombros para baixo.',
    precautions: 'Não puxe atrás da nuca e evite impulso excessivo.',
    image_url: null,
  },
  {
    id: 'ex-5',
    workout_plan_id: 'fallback-2',
    name: 'Remada baixa',
    sets: '3',
    reps: '10 a 12',
    rest_seconds: 60,
    instructions:
      'Puxe o pegador em direção ao abdômen, aproximando as escápulas no final.',
    precautions: 'Não curve a lombar e mantenha controle na volta.',
    image_url: null,
  },
  {
    id: 'ex-6',
    workout_plan_id: 'fallback-2',
    name: 'Rosca direta',
    sets: '3',
    reps: '12',
    rest_seconds: 45,
    instructions:
      'Flexione os cotovelos sem balançar o corpo e desça a barra com controle.',
    precautions: 'Evite jogar o tronco para trás para levantar a carga.',
    image_url: null,
  },
  {
    id: 'ex-7',
    workout_plan_id: 'fallback-3',
    name: 'Agachamento livre ou guiado',
    sets: '3',
    reps: '10 a 12',
    rest_seconds: 75,
    instructions:
      'Desça mantendo o peito aberto, joelhos alinhados e pés firmes no chão.',
    precautions: 'Não deixe os joelhos colapsarem para dentro.',
    image_url: null,
  },
  {
    id: 'ex-8',
    workout_plan_id: 'fallback-3',
    name: 'Leg press',
    sets: '3',
    reps: '12',
    rest_seconds: 75,
    instructions:
      'Empurre a plataforma com controle e desça até uma amplitude confortável.',
    precautions: 'Não trave os joelhos no topo do movimento.',
    image_url: null,
  },
  {
    id: 'ex-9',
    workout_plan_id: 'fallback-3',
    name: 'Prancha abdominal',
    sets: '3',
    reps: '30 a 45 segundos',
    rest_seconds: 45,
    instructions:
      'Mantenha corpo alinhado, abdômen contraído e respiração controlada.',
    precautions: 'Não deixe o quadril cair e evite prender a respiração.',
    image_url: null,
  },
];

function getExercisesForPlan(
  plan: WorkoutPlanItem,
  exercises: WorkoutExerciseItem[]
) {
  const directExercises = exercises.filter(
    (exercise) => exercise.workout_plan_id === plan.id
  );

  if (directExercises.length > 0) return directExercises;

  const fallbackByPlan = fallbackExercises.filter(
    (exercise) => exercise.workout_plan_id === plan.id
  );

  if (fallbackByPlan.length > 0) return fallbackByPlan;

  const focus = plan.focus.toLowerCase();

  if (focus.includes('perna')) {
    return fallbackExercises.filter(
      (exercise) => exercise.workout_plan_id === 'fallback-3'
    );
  }

  if (
    focus.includes('costas') ||
    focus.includes('bíceps') ||
    focus.includes('biceps')
  ) {
    return fallbackExercises.filter(
      (exercise) => exercise.workout_plan_id === 'fallback-2'
    );
  }

  return fallbackExercises.filter(
    (exercise) => exercise.workout_plan_id === 'fallback-1'
  );
}

function WeekButton({
  week,
  selectedWeek,
  setSelectedWeek,
}: {
  week: number;
  selectedWeek: number;
  setSelectedWeek: (week: number) => void;
}) {
  const active = selectedWeek === week;

  return (
    <button
      type="button"
      onClick={() => setSelectedWeek(week)}
      className={`rounded-3xl border p-4 text-left transition ${
        active
          ? 'border-emerald-600 bg-emerald-600 text-white shadow-lg shadow-emerald-100'
          : 'border-slate-100 bg-white text-slate-700 hover:border-emerald-200 hover:bg-emerald-50'
      }`}
    >
      <p className="text-xs font-black uppercase tracking-wide opacity-80">
        Semana
      </p>

      <p className="mt-1 text-3xl font-black">{week}</p>

      <p className="mt-1 text-xs font-semibold opacity-80">
        {week === 1 && 'Adaptação'}
        {week === 2 && 'Consistência'}
        {week === 3 && 'Progressão'}
        {week === 4 && 'Evolução'}
      </p>
    </button>
  );
}

function ExerciseCard({ exercise }: { exercise: WorkoutExerciseItem }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-3xl bg-slate-50 p-4">
      <div className="flex gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm">
          <Dumbbell size={22} />
        </div>

        <div className="min-w-0 flex-1">
          <h4 className="font-black leading-tight text-slate-950">
            {exercise.name}
          </h4>

          <div className="mt-3 grid grid-cols-3 gap-2">
            <div className="rounded-2xl bg-white p-3">
              <p className="text-[10px] font-black uppercase text-slate-400">
                Séries
              </p>
              <p className="text-sm font-black text-slate-950">
                {exercise.sets}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-3">
              <p className="text-[10px] font-black uppercase text-slate-400">
                Reps
              </p>
              <p className="text-sm font-black text-slate-950">
                {exercise.reps}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-3">
              <p className="text-[10px] font-black uppercase text-slate-400">
                Desc.
              </p>
              <p className="text-sm font-black text-slate-950">
                {exercise.rest_seconds}s
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="mt-3 flex w-full items-center justify-between rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-700"
          >
            {open ? 'Ocultar execução' : 'Como executar'}
            {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {open && (
            <div className="mt-3 grid gap-3">
              <div className="rounded-2xl bg-white p-4">
                <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-emerald-700">
                  <Activity size={16} />
                  Execução
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {exercise.instructions}
                </p>
              </div>

              <div className="rounded-2xl bg-white p-4">
                <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-orange-600">
                  <ShieldCheck size={16} />
                  Cuidados
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {exercise.precautions}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function WorkoutDayCard({
  plan,
  exercises,
}: {
  plan: WorkoutPlanItem;
  exercises: WorkoutExerciseItem[];
}) {
  return (
    <article className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm">
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="inline-flex rounded-full bg-emerald-600 px-4 py-2 text-xs font-black uppercase tracking-wide text-white">
              {plan.day_name}
            </span>

            <h3 className="mt-4 text-2xl font-black leading-tight text-slate-950">
              {plan.title}
            </h3>

            <p className="mt-2 text-sm font-semibold text-slate-600">
              {plan.focus}
            </p>
          </div>

          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl bg-white text-emerald-700 shadow-sm">
            <Dumbbell size={27} />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white/80 p-3">
            <p className="flex items-center gap-2 text-xs font-black uppercase text-slate-500">
              <Flame size={15} />
              Intensidade
            </p>
            <p className="mt-1 text-sm font-black text-slate-950">
              {plan.intensity}
            </p>
          </div>

          <div className="rounded-2xl bg-white/80 p-3">
            <p className="flex items-center gap-2 text-xs font-black uppercase text-slate-500">
              <Clock size={15} />
              Duração
            </p>
            <p className="mt-1 text-sm font-black text-slate-950">
              45 a 60 min
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 p-5">
        <div className="rounded-3xl bg-emerald-50 p-4">
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-emerald-700">
            <Target size={16} />
            Foco do dia
          </p>
          <p className="mt-2 text-sm font-semibold leading-6 text-emerald-900">
            {plan.notes}
          </p>
        </div>

        {exercises.map((exercise) => (
          <ExerciseCard key={exercise.id} exercise={exercise} />
        ))}
      </div>
    </article>
  );
}

export function WorkoutPlanView({
  plans,
  exercises,
}: {
  plans: WorkoutPlanItem[];
  exercises: WorkoutExerciseItem[];
  userLevel?: string;
  trainingFrequency?: string;
}) {
  const workoutPlans = plans.length > 0 ? plans : fallbackPlans;
  const [selectedWeek, setSelectedWeek] = useState(1);

  const weeks = useMemo(() => {
    return Array.from(
      new Set(workoutPlans.map((plan) => plan.week_number))
    ).sort((a, b) => a - b);
  }, [workoutPlans]);

  const selectedPlans = workoutPlans.filter(
    (plan) => plan.week_number === selectedWeek
  );

  return (
    <div className="space-y-6 pb-10">
      <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-500 p-5 text-white shadow-xl shadow-emerald-100 md:p-8">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-xs font-black uppercase tracking-wide">
          <Dumbbell size={16} />
          Plano de treinos
        </span>

        <h1 className="mt-5 text-3xl font-black leading-tight md:text-5xl">
          4 semanas para criar força, disciplina e consistência.
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-50 md:text-base">
          Escolha a semana, siga os treinos indicados e acompanhe a execução de
          cada exercício com séries, repetições, descanso e cuidados.
        </p>

        <div className="mt-6 rounded-3xl bg-white/15 p-4 backdrop-blur">
          <p className="text-xs font-bold uppercase tracking-wide text-emerald-50">
            Duração
          </p>
          <p className="mt-2 text-3xl font-black">4 semanas</p>
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            <CalendarDays size={23} />
          </div>

          <div>
            <h2 className="text-lg font-black text-slate-950">
              Escolha a semana do treino
            </h2>
            <p className="text-sm text-slate-500">
              Cada semana aumenta gradualmente foco, controle e intensidade.
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
          {weeks.map((week) => (
            <WeekButton
              key={week}
              week={week}
              selectedWeek={selectedWeek}
              setSelectedWeek={setSelectedWeek}
            />
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {selectedPlans.map((plan) => (
          <WorkoutDayCard
            key={plan.id}
            plan={plan}
            exercises={getExercisesForPlan(plan, exercises)}
          />
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
            <Home size={23} />
          </div>

          <h2 className="mt-4 text-xl font-black text-slate-950">
            Alternativa em casa
          </h2>

          <div className="mt-4 grid gap-3 text-sm leading-6 text-slate-600">
            <p>• Agachamento livre: 3 séries de 15 repetições.</p>
            <p>• Flexão apoiada no joelho: 3 séries de 8 a 12 repetições.</p>
            <p>• Remada com mochila: 3 séries de 12 repetições.</p>
            <p>• Prancha abdominal: 3 séries de 30 segundos.</p>
            <p>• Polichinelo ou caminhada: 10 a 20 minutos.</p>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            <CheckCircle2 size={23} />
          </div>

          <h2 className="mt-4 text-xl font-black text-slate-950">
            Progressão semanal
          </h2>

          <div className="mt-4 grid gap-3 text-sm leading-6 text-slate-600">
            <p>
              <b>Semana 1:</b> aprenda os movimentos e controle a execução.
            </p>
            <p>
              <b>Semana 2:</b> mantenha frequência e aumente levemente o ritmo.
            </p>
            <p>
              <b>Semana 3:</b> aumente carga ou repetições se estiver seguro.
            </p>
            <p>
              <b>Semana 4:</b> consolide disciplina e registre sua evolução.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
