'use client';

import { useEffect, useState } from 'react';
import {
  Activity,
  AlertCircle,
  Apple,
  Dumbbell,
  HeartPulse,
  Ruler,
  Save,
  Scale,
  Target,
  User,
} from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { createClient } from '@/lib/supabaseClient';

type ProfileForm = {
  full_name: string;
  age: string;
  height_cm: string;
  current_weight_kg: string;
  training_frequency: string;
  dietary_restrictions: string;
  health_notes: string;
  goal: string;
  level: string;
};

const initialForm: ProfileForm = {
  full_name: '',
  age: '',
  height_cm: '',
  current_weight_kg: '',
  training_frequency: '',
  dietary_restrictions: '',
  health_notes: '',
  goal: 'emagrecer',
  level: 'iniciante',
};

const goals = [
  { value: 'emagrecer', label: 'Emagrecer' },
  { value: 'ganhar_massa', label: 'Ganhar massa' },
  { value: 'condicionamento', label: 'Condicionamento' },
  { value: 'vida_saudavel', label: 'Vida saudável' },
];

const levels = [
  { value: 'iniciante', label: 'Iniciante' },
  { value: 'intermediario', label: 'Intermediário' },
  { value: 'avancado', label: 'Avançado' },
];

function Field({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <label className="block rounded-3xl border border-slate-100 bg-slate-50 p-4">
      <span className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-500">
        <Icon size={16} className="text-emerald-700" />
        {label}
      </span>

      {children}
    </label>
  );
}

export default function PerfilPage() {
  const supabase = createClient();

  const [form, setForm] = useState<ProfileForm>(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (data) {
        setForm({
          full_name: data.full_name ?? data.name ?? '',
          age: data.age ? String(data.age) : '',
          height_cm: data.height_cm ? String(data.height_cm) : '',
          current_weight_kg:
            data.current_weight_kg ?? data.current_weight
              ? String(data.current_weight_kg ?? data.current_weight)
              : '',
          training_frequency: data.training_frequency
            ? String(data.training_frequency)
            : '',
          dietary_restrictions: data.dietary_restrictions ?? '',
          health_notes: data.health_notes ?? '',
          goal: data.goal ?? 'emagrecer',
          level: data.level ?? data.fitness_level ?? 'iniciante',
        });
      }

      setLoading(false);
    }

    loadProfile();
  }, [supabase]);

  function updateField(field: keyof ProfileForm, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function saveProfile() {
    setSaving(true);
    setMsg('');

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setSaving(false);
      setMsgType('error');
      setMsg('Usuário não encontrado.');
      return;
    }

    const payload = {
      full_name: form.full_name.trim(),
      age: Number(form.age),
      height_cm: Number(form.height_cm),
      current_weight_kg: Number(form.current_weight_kg),
      training_frequency: Number(form.training_frequency),
      dietary_restrictions: form.dietary_restrictions.trim() || null,
      health_notes: form.health_notes.trim() || null,
      goal: form.goal,
      level: form.level,
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('profiles')
      .update(payload)
      .eq('user_id', user.id);

    setSaving(false);

    if (error) {
      setMsgType('error');
      setMsg(error.message);
      return;
    }

    setMsgType('success');
    setMsg('Perfil atualizado com sucesso.');
  }

  if (loading) {
    return (
      <AppShell>
        <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm">
          <p className="text-slate-600">Carregando perfil...</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-6 pb-10">
        <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-500 p-5 text-white shadow-xl shadow-emerald-100 md:p-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-xs font-black uppercase tracking-wide">
            <User size={16} />
            Meu perfil
          </span>

          <h1 className="mt-5 text-3xl font-black leading-tight md:text-5xl">
            Seus dados da jornada
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-50 md:text-base">
            Atualize suas informações para manter o sistema alinhado com seu
            objetivo, rotina e evolução.
          </p>
        </section>

        <section className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <Target size={22} />
            </div>
            <p className="mt-4 text-xs font-black uppercase tracking-wide text-slate-500">
              Objetivo
            </p>
            <p className="mt-1 text-lg font-black capitalize text-slate-950">
              {goals.find((goal) => goal.value === form.goal)?.label ??
                'Emagrecer'}
            </p>
          </div>

          <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <Dumbbell size={22} />
            </div>
            <p className="mt-4 text-xs font-black uppercase tracking-wide text-slate-500">
              Nível
            </p>
            <p className="mt-1 text-lg font-black text-slate-950">
              {levels.find((level) => level.value === form.level)?.label ??
                'Iniciante'}
            </p>
          </div>

          <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <Activity size={22} />
            </div>
            <p className="mt-4 text-xs font-black uppercase tracking-wide text-slate-500">
              Frequência
            </p>
            <p className="mt-1 text-lg font-black text-slate-950">
              {form.training_frequency
                ? `${form.training_frequency}x semana`
                : 'Não informado'}
            </p>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm md:p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-black text-slate-950">
              Informações pessoais
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Mantenha os dados atualizados para acompanhar melhor sua evolução.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Nome" icon={User}>
              <input
                className="w-full bg-transparent text-base font-semibold text-slate-950 outline-none placeholder:text-slate-400"
                placeholder="Seu nome"
                value={form.full_name}
                onChange={(event) =>
                  updateField('full_name', event.target.value)
                }
              />
            </Field>

            <Field label="Idade" icon={HeartPulse}>
              <input
                className="w-full bg-transparent text-base font-semibold text-slate-950 outline-none placeholder:text-slate-400"
                placeholder="Sua idade"
                type="number"
                value={form.age}
                onChange={(event) => updateField('age', event.target.value)}
              />
            </Field>

            <Field label="Altura" icon={Ruler}>
              <div className="flex items-center gap-2">
                <input
                  className="w-full bg-transparent text-base font-semibold text-slate-950 outline-none placeholder:text-slate-400"
                  placeholder="Altura"
                  type="number"
                  value={form.height_cm}
                  onChange={(event) =>
                    updateField('height_cm', event.target.value)
                  }
                />
                <span className="text-sm font-bold text-slate-400">cm</span>
              </div>
            </Field>

            <Field label="Peso atual" icon={Scale}>
              <div className="flex items-center gap-2">
                <input
                  className="w-full bg-transparent text-base font-semibold text-slate-950 outline-none placeholder:text-slate-400"
                  placeholder="Peso atual"
                  type="number"
                  value={form.current_weight_kg}
                  onChange={(event) =>
                    updateField('current_weight_kg', event.target.value)
                  }
                />
                <span className="text-sm font-bold text-slate-400">kg</span>
              </div>
            </Field>

            <Field label="Treinos por semana" icon={Activity}>
              <input
                className="w-full bg-transparent text-base font-semibold text-slate-950 outline-none placeholder:text-slate-400"
                placeholder="Ex: 3"
                type="number"
                min="1"
                max="7"
                value={form.training_frequency}
                onChange={(event) =>
                  updateField('training_frequency', event.target.value)
                }
              />
            </Field>

            <Field label="Objetivo" icon={Target}>
              <select
                className="w-full bg-transparent text-base font-semibold text-slate-950 outline-none"
                value={form.goal}
                onChange={(event) => updateField('goal', event.target.value)}
              >
                {goals.map((goal) => (
                  <option key={goal.value} value={goal.value}>
                    {goal.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Nível de treino" icon={Dumbbell}>
              <select
                className="w-full bg-transparent text-base font-semibold text-slate-950 outline-none"
                value={form.level}
                onChange={(event) => updateField('level', event.target.value)}
              >
                {levels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Restrições alimentares" icon={Apple}>
              <input
                className="w-full bg-transparent text-base font-semibold text-slate-950 outline-none placeholder:text-slate-400"
                placeholder="Ex: lactose, glúten, nenhuma"
                value={form.dietary_restrictions}
                onChange={(event) =>
                  updateField('dietary_restrictions', event.target.value)
                }
              />
            </Field>

            <label className="block rounded-3xl border border-slate-100 bg-slate-50 p-4 md:col-span-2">
              <span className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-500">
                <AlertCircle size={16} className="text-emerald-700" />
                Observações de saúde
              </span>

              <textarea
                className="min-h-28 w-full resize-none bg-transparent text-base font-semibold text-slate-950 outline-none placeholder:text-slate-400"
                placeholder="Informe dores, limitações, cuidados médicos ou observações importantes."
                value={form.health_notes}
                onChange={(event) =>
                  updateField('health_notes', event.target.value)
                }
              />
            </label>

            <button
              className="flex items-center justify-center gap-2 rounded-3xl bg-emerald-600 px-6 py-4 text-sm font-black text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70 md:col-span-2"
              type="button"
              onClick={saveProfile}
              disabled={saving}
            >
              <Save size={19} />
              {saving ? 'Salvando...' : 'Salvar alterações'}
            </button>

            {msg && (
              <p
                className={`rounded-3xl p-4 text-sm font-semibold md:col-span-2 ${
                  msgType === 'success'
                    ? 'bg-emerald-50 text-emerald-800'
                    : 'bg-red-50 text-red-700'
                }`}
              >
                {msg}
              </p>
            )}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
