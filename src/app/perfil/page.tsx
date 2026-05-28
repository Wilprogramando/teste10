'use client';

import { useEffect, useState } from 'react';
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

export default function PerfilPage() {
  const supabase = createClient();

  const [form, setForm] = useState<ProfileForm>(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

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
      setMsg(error.message);
      return;
    }

    setMsg('Perfil atualizado com sucesso.');
  }

  if (loading) {
    return (
      <AppShell>
        <div className="card">
          <p className="text-slate-600">Carregando perfil...</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-6 pb-10">
        <section>
          <h1 className="text-4xl font-black text-slate-950">Perfil</h1>
          <p className="mt-2 text-slate-600">
            Atualize seus dados pessoais, objetivo e nível de treino.
          </p>
        </section>

        <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm md:p-6">
          <div className="grid gap-3 md:grid-cols-2">
            <input
              className="input"
              placeholder="Nome"
              value={form.full_name}
              onChange={(event) => updateField('full_name', event.target.value)}
            />

            <input
              className="input"
              placeholder="Idade"
              type="number"
              value={form.age}
              onChange={(event) => updateField('age', event.target.value)}
            />

            <input
              className="input"
              placeholder="Altura em cm"
              type="number"
              value={form.height_cm}
              onChange={(event) => updateField('height_cm', event.target.value)}
            />

            <input
              className="input"
              placeholder="Peso atual em kg"
              type="number"
              value={form.current_weight_kg}
              onChange={(event) =>
                updateField('current_weight_kg', event.target.value)
              }
            />

            <input
              className="input"
              placeholder="Treinos por semana"
              type="number"
              min="1"
              max="7"
              value={form.training_frequency}
              onChange={(event) =>
                updateField('training_frequency', event.target.value)
              }
            />

            <input
              className="input"
              placeholder="Restrições alimentares"
              value={form.dietary_restrictions}
              onChange={(event) =>
                updateField('dietary_restrictions', event.target.value)
              }
            />

            <input
              className="input md:col-span-2"
              placeholder="Observações de saúde"
              value={form.health_notes}
              onChange={(event) =>
                updateField('health_notes', event.target.value)
              }
            />

            <select
              className="input"
              value={form.goal}
              onChange={(event) => updateField('goal', event.target.value)}
            >
              <option value="emagrecer">Emagrecer</option>
              <option value="ganhar_massa">Ganhar massa</option>
              <option value="condicionamento">Condicionamento</option>
              <option value="vida_saudavel">Vida saudável</option>
            </select>

            <select
              className="input"
              value={form.level}
              onChange={(event) => updateField('level', event.target.value)}
            >
              <option value="iniciante">Iniciante</option>
              <option value="intermediario">Intermediário</option>
              <option value="avancado">Avançado</option>
            </select>

            <button
              className="btn md:col-span-2"
              type="button"
              onClick={saveProfile}
              disabled={saving}
            >
              {saving ? 'Salvando...' : 'Salvar alterações'}
            </button>

            {msg && (
              <p className="rounded-2xl bg-slate-100 p-3 text-sm md:col-span-2">
                {msg}
              </p>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
