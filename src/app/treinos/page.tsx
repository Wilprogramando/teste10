import { redirect } from 'next/navigation';
import { AppShell } from '@/components/AppShell';
import { WorkoutPlanView } from '@/components/WorkoutPlanView';
import { createServerSupabase } from '@/lib/supabaseServer';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

export default async function TreinosPage() {
  const supabase = createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const [{ data: plansData }, { data: exercisesData }] = await Promise.all([
    supabase
      .from('workout_plans')
      .select('*')
      .order('week_number', { ascending: true })
      .order('day_number', { ascending: true }),

    supabase.from('workout_exercises').select('*'),
  ]);

  return (
    <AppShell>
      <WorkoutPlanView
        plans={(plansData ?? []) as WorkoutPlanItem[]}
        exercises={(exercisesData ?? []) as WorkoutExerciseItem[]}
        userStartedAt={user.created_at}
      />
    </AppShell>
  );
}
