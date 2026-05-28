import { createServerSupabase } from '@/lib/supabaseServer';
import { AppShell } from '@/components/AppShell';
import { RecipeCard } from '@/components/RecipeCard';
export default async function Receitas(){const supabase=createServerSupabase();const {data:recipes=[]}=await supabase.from('recipes').select('*').order('category');return <AppShell><h1 className="text-4xl font-black">Receitas saudáveis</h1><p className="mt-2 text-slate-600">Mais de 30 opções simples, acessíveis e práticas.</p><div className="mt-6 grid gap-4 md:grid-cols-3">{recipes.map((r:any)=><RecipeCard key={r.id} recipe={r}/>)}</div></AppShell>}
