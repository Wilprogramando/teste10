'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Apple,
  CheckCircle2,
  Droplets,
  Dumbbell,
  Heart,
  Leaf,
  Moon,
  NotebookPen,
  Save,
  Sparkles,
  Target,
  Trophy,
  Zap,
} from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { createClient } from '@/lib/supabaseClient';

type DailyForm = {
  workout_done: boolean;
  meals_ok: boolean;
  habit_done: boolean;
  completed: boolean;
  water_liters: string;
  energy: string;
  mood: string;
  sleep_quality: string;
  notes: string;
};

const initialForm: DailyForm = {
  workout_done: false,
  meals_ok: false,
  habit_done: false,
  completed: false,
  water_liters: '2',
  energy: '3',
  mood: '3',
  sleep_quality: '3',
  notes: '',
};

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function formatToday() {
  return new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  });
}

function numberOrNull(value: string) {
  if (!value || value.trim() === '') return null;

  const parsed = Number(value);

  if (Number.isNaN(parsed)) return null;

  return parsed;
}

function TaskCard({
  title,
  description,
  icon: Icon,
  checked,
  onClick,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  checked: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-3xl border p-4 text-left transition ${
        checked
          ? 'border-emerald-600 bg-emerald-600 text-white shadow-lg shadow-emerald-100'
          : 'border-slate-100 bg-white text-slate-900 shadow-sm hover:border-emerald-200 hover:bg-emerald-50'
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
            checked
              ? 'bg-white/20 text-white'
              : 'bg-emerald-50 text-emerald-700'
          }`}
        >
          <Icon size={23} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-black leading-tight">{title}</h3>

            <div
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${
                checked
                  ? 'border-white bg-white text-emerald-700'
                  : 'border-slate-300 bg-white text-transparent'
              }`}
            >
              <CheckCircle2 size={18} />
            </div>
          </div>

          <p
            className={`mt-2 text-sm leading-6 ${
              checked ? 'text-emerald-50' : 'text-slate-500'
            }`}
          >
            {description}
          </p>
        </div>
      </div>
    </button>
  );
}

function RatingInput({
  label,
  icon: Icon,
  value,
  onChange,
}: {
  label: string;
  icon: React.ElementType;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
      <div className="flex items-center gap-2">
        <Icon size={17} className="text-emerald-700" />
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">
          {label}
        </p>
      </div>

      <div className="mt-3 grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5].map((number) => {
          const active = value === String(number);

          return (
            <button
              key={number}
              type="button"
              onClick={() => onChange(String(number))}
              className={`h-10 rounded-2xl text-sm font-black transition ${
                active
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100'
                  : 'bg-white text-slate-500 hover:bg-emerald-50 hover:text-emerald-700'
              }`}
            >
              {number}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function InfoCard({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
        <Icon size={23} />
      </div>

      <h3 className="mt-4 text-lg font-black text-slate-950">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}

export default function MeuDiaPage() {
  const supabase = createClient();

  const [form, setForm] = useState<DailyForm>(initialForm);
  const [dailyId, setDailyId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>(
    'success'
  );

  const progressPercent = useMemo(() => {
    const total =
      Number(form.workout_done) +
      Number(form.meals_ok) +
      Number(form.habit_done);

    return Math.round((total / 3) * 100);
  }, [form.workout_done, form.meals_ok, form.habit_done]);

  const completedTasks = useMemo(() => {
    return (
      Number(form.workout_done) +
      Number(form.meals_ok) +
      Number(form.habit_done)
    );
  }, [form.workout_done, form.meals_ok, form.habit_done]);

  useEffect(() => {
    async function loadDailyProgress() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from('daily_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', todayISO())
        .maybeSingle();

      if (data) {
        setDailyId(data.id ?? null);

        setForm({
          workout_done: Boolean(data.workout_done),
          meals_ok: Boolean(data.meals_ok),
          habit_done: Boolean(data.habit_done),
          completed: Boolean(data.completed),
          water_liters:
            data.water_liters !== null && data.water_liters !== undefined
              ? String(data.water_liters)
              : '2',
          energy:
            data.energy !== null && data.energy !== undefined
              ? String(data.energy)
              : '3',
          mood:
            data.mood !== null && data.mood !== undefined
              ? String(data.mood)
              : '3',
          sleep_quality:
            data.sleep_quality !== null && data.sleep_quality !== undefined
              ? String(data.sleep_quality)
              : '3',
          notes: data.notes ?? '',
        });
      }

      setLoading(false);
    }

    loadDailyProgress();
  }, [supabase]);

  function updateField(field: keyof DailyForm, value: string | boolean) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function saveDay(forceCompleted = false) {
    setSaving(true);
    setMessage('');

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setSaving(false);
      setMessageType('error');
      setMessage('Usuário não encontrado.');
      return;
    }

    const isCompleted =
      forceCompleted ||
      (form.workout_done && form.meals_ok && form.habit_done);

    const payload = {
      user_id: user.id,
      date: todayISO(),
      workout_done: form.workout_done,
      meals_ok: form.meals_ok,
      habit_done: form.habit_done,
      completed: isCompleted,
      water_liters: numberOrNull(form.water_liters),
      energy: numberOrNull(form.energy),
      mood: numberOrNull(form.mood),
      sleep_quality: numberOrNull(form.sleep_quality),
      notes: form.notes.trim() || null,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = dailyId
      ? await supabase
          .from('daily_progress')
          .update(payload)
          .eq('id', dailyId)
          .select('id')
          .single()
      : await supabase
          .from('daily_progress')
          .insert(payload)
          .select('id')
          .single();

    setSaving(false);

    if (error) {
      setMessageType('error');
      setMessage(error.message);
      return;
    }

    if (data?.id) {
      setDailyId(data.id);
    }

    setForm((current) => ({
      ...current,
      completed: isCompleted,
    }));

    setMessageType('success');
    setMessage(
      isCompleted
        ? 'Dia concluído com sucesso. Excelente!'
        : 'Seu dia foi salvo.'
    );
  }

  if (loading) {
    return (
      <AppShell>
        <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm">
          <p className="text-slate-600">Carregando seu dia...</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-6 pb-10">
        <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-500 p-5 text-white shadow-xl shadow-emerald-100 md:p-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-xs font-black uppercase tracking-wide">
            <Sparkles size={16} />
            Meu Dia
          </span>

          <h1 className="mt-5 text-3xl font-black leading-tight md:text-5xl">
            Execute o essencial de hoje.
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-50 md:text-base">
            Simples, claro e consistente: treino, alimentação, água, hábito e
            registro do seu estado diário.
          </p>

          <div className="mt-6 rounded-3xl bg-white/15 p-4 backdrop-blur">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-wide text-emerald-50">
                  {formatToday()}
                </p>

                <p className="mt-2 text-3xl font-black">
                  {completedTasks}/3 tarefas
                </p>
              </div>

              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-xl font-black text-emerald-700">
                {progressPercent}%
              </div>
            </div>

            <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-white"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm md:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                <Target size={23} />
              </div>

              <div>
                <h2 className="text-xl font-black text-slate-950">
                  Checklist do dia
                </h2>
                <p className="text-sm text-slate-500">
                  Marque o que você completou hoje.
                </p>
              </div>
            </div>

            <div className="grid gap-3">
              <TaskCard
                title="Treino recomendado"
                description="Faça o treino planejado ou uma alternativa em casa."
                icon={Dumbbell}
                checked={form.workout_done}
                onClick={() =>
                  updateField('workout_done', !form.workout_done)
                }
              />

              <TaskCard
                title="Refeições alinhadas"
                description="Mantenha refeições simples, ricas em proteína e com bons alimentos."
                icon={Apple}
                checked={form.meals_ok}
                onClick={() => updateField('meals_ok', !form.meals_ok)}
              />

              <TaskCard
                title="Hábito saudável"
                description="Cumpra um hábito pequeno que melhora sua rotina."
                icon={Leaf}
                checked={form.habit_done}
                onClick={() => updateField('habit_done', !form.habit_done)}
              />

              <label className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                <span className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-500">
                  <Droplets size={17} className="text-emerald-700" />
                  Água consumida
                </span>

                <div className="flex items-center gap-3">
                  <input
                    className="h-2 w-full accent-emerald-600"
                    type="range"
                    min="0"
                    max="5"
                    step="0.5"
                    value={form.water_liters}
                    onChange={(event) =>
                      updateField('water_liters', event.target.value)
                    }
                  />

                  <span className="min-w-14 text-right text-lg font-black text-slate-950">
                    {form.water_liters}L
                  </span>
                </div>
              </label>

              <div className="grid gap-3 md:grid-cols-3">
                <RatingInput
                  label="Energia"
                  icon={Zap}
                  value={form.energy}
                  onChange={(value) => updateField('energy', value)}
                />

                <RatingInput
                  label="Humor"
                  icon={Heart}
                  value={form.mood}
                  onChange={(value) => updateField('mood', value)}
                />

                <RatingInput
                  label="Sono"
                  icon={Moon}
                  value={form.sleep_quality}
                  onChange={(value) => updateField('sleep_quality', value)}
                />
              </div>

              <label className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                <span className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-500">
                  <NotebookPen size={17} className="text-emerald-700" />
                  Observações do dia
                </span>

                <textarea
                  className="min-h-24 w-full resize-none bg-transparent text-base font-semibold text-slate-950 outline-none placeholder:text-slate-400"
                  placeholder="Como foi seu dia? O que foi bom? O que precisa melhorar?"
                  value={form.notes}
                  onChange={(event) => updateField('notes', event.target.value)}
                />
              </label>

              <div className="grid gap-3 md:grid-cols-2">
                <button
                  type="button"
                  onClick={() => saveDay(false)}
                  disabled={saving}
                  className="flex items-center justify-center gap-2 rounded-3xl border border-emerald-200 bg-white px-6 py-4 text-sm font-black text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <Save size={19} />
                  {saving ? 'Salvando...' : 'Salvar progresso'}
                </button>

                <button
                  type="button"
                  onClick={() => saveDay(true)}
                  disabled={saving}
                  className="flex items-center justify-center gap-2 rounded-3xl bg-emerald-600 px-6 py-4 text-sm font-black text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <Trophy size={19} />
                  Marcar dia como concluído
                </button>
              </div>

              {message && (
                <p
                  className={`rounded-3xl p-4 text-sm font-semibold ${
                    messageType === 'success'
                      ? 'bg-emerald-50 text-emerald-800'
                      : 'bg-red-50 text-red-700'
                  }`}
                >
                  {message}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-5">
            <InfoCard
              title="Treino recomendado"
              description="Agachamento, remada, supino ou flexão, desenvolvimento e caminhada leve. Adapte a intensidade ao seu nível."
              icon={Dumbbell}
            />

            <InfoCard
              title="Refeição sugerida"
              description="Arroz, feijão, frango grelhado, salada colorida e fruta. Simples, eficiente e fácil de repetir."
              icon={Apple}
            />

            <InfoCard
              title="Hábito do dia"
              description="Durma 30 minutos mais cedo e deixe uma garrafa de água visível para facilitar sua rotina."
              icon={Leaf}
            />

            <div className="rounded-[2rem] border border-emerald-100 bg-emerald-50 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-emerald-700">
                <CheckCircle2 size={23} />
              </div>

              <h3 className="mt-4 text-lg font-black text-emerald-950">
                Regra do dia
              </h3>

              <p className="mt-2 text-sm leading-6 text-emerald-800">
                Não precisa ser perfeito. Precisa ser feito. Um dia consistente
                vale mais do que uma semana esperando motivação.
              </p>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
