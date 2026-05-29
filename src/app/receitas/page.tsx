import { AppShell } from '@/components/AppShell';
import { RecipesView } from '@/components/RecipesView';
import { createServerSupabase } from '@/lib/supabaseServer';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export type Recipe = {
  id: string;
  title?: string | null;
  name?: string | null;
  category?: string | null;
  description?: string | null;
  ingredients?: string[] | string | null;
  instructions?: string[] | string | null;
  calories?: number | null;
  protein_g?: number | null;
  carbs_g?: number | null;
  fat_g?: number | null;
  prep_time_minutes?: number | null;
  difficulty?: string | null;
  image_url?: string | null;
  created_at?: string | null;
};

export default async function ReceitasPage() {
  const supabase = createServerSupabase();

  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .order('category', { ascending: true })
    .order('title', { ascending: true });

  return (
    <AppShell>
      <RecipesView
        recipes={(data ?? []) as Recipe[]}
        hasError={Boolean(error)}
      />
    </AppShell>
  );
}
