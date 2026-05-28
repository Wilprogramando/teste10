import { AppShell } from '@/components/AppShell';
import { WorkoutPlanView } from '@/components/WorkoutPlanView';
import { createServerSupabase } from '@/lib/supabaseServer';
import { redirect } from 'next/navigation';

export type WorkoutPlanItem = {
  id: string;
  week_number: number;
  day_number: number;
  day_name: string;
  title: string;
  focus: string;
  intensity: string;
  notes: string;
};

export type WorkoutExerciseItem = {
  id: string;
  workout_plan_id: string;
  name: string;
  sets: string;
  reps: string;
  rest_seconds: number;
  instructions: string;
  precautions: string;
  image_url: string | null;
};

function normalizeWorkoutPlan(plan: any): WorkoutPlanItem {
  return {
    id: String(plan.id),
    week_number: Number(plan.week_number ?? plan.week ?? 1),
    day_number: Number(plan.day_number ?? 1),
    day_name: String(plan.day_name ?? plan.day ?? 'Dia de treino'),
    title: String(plan.title ?? plan.name ?? 'Treino do dia'),
    focus: String(plan.focus ?? plan.muscle_group ?? 'Corpo completo'),
    intensity: String(plan.intensity ?? 'Moderada'),
    notes: String(
      plan.notes ??
        plan.description ??
        'Execute com controle, boa postura e respeitando seus limites.'
    ),
  };
}

function normalizeExercise(exercise: any): WorkoutExerciseItem {
  return {
    id: String(exercise.id),
    workout_plan_id: String(
      exercise.workout_plan_id ?? exercise.plan_id ?? exercise.workout_id
    ),
    name: String(exercise.name ?? exercise.exercise_name ?? 'Exercício'),
    sets: String(exercise.sets ?? '3'),
    reps: String(exercise.reps ?? exercise.repetitions ?? '12'),
    rest_seconds: Number(exercise.rest_seconds ?? exercise.rest ?? 60),
    instructions: String(
      exercise.instructions ??
        exercise.execution ??
        'Execute o movimento com controle, mantendo boa postura.'
    ),
    precautions: String(
      exercise.precautions ??
        exercise.care_notes ??
        'Evite cargas excessivas e interrompa em caso de dor.'
    ),
    image_url: exercise.image_url ?? null,
  };
}

function formatLevel(level?: string | null) {
  const normalized = String(level ?? '')
    .toLowerCase()
    .trim();

  const labels: Record<string, string> = {
    iniciante: 'Iniciante',
    intermediario: 'Intermediário',
    intermediário: 'Intermediário',
    avancado: 'Avançado',
    avançado: 'Avançado',
  };

  return labels[normalized] ?? 'Iniciante';
}

export default async function TreinosPage() {
  const supabase = createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('level, fitness_level, training_frequency')
    .eq('user_id', user.id)
    .maybeSingle();

  const { data: plansData } = await supabase
    .from('workout_plans')
    .select('*')
    .order('week_number', { ascending: true })
    .order('day_number', { ascending: true });

  const { data: exercisesData } = await supabase
    .from('workout_exercises')
    .select('*');

  const plans = ((plansData ?? []) as any[]).map(normalizeWorkoutPlan);
  const exercises = ((exercisesData ?? []) as any[]).map(normalizeExercise);

  const userLevel = formatLevel(profile?.level ?? profile?.fitness_level);
  const trainingFrequency = profile?.training_frequency
    ? `${profile.training_frequency}x semana`
    : '3x semana';

  return (
    <AppShell>
      <WorkoutPlanView
        plans={plans}
        exercises={exercises}
        userLevel={userLevel}
        trainingFrequency={trainingFrequency}
      />
    </AppShell>
  );
}
