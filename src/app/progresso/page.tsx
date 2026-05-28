'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  BarChart3,
  CalendarCheck,
  Heart,
  LineChart,
  Moon,
  NotebookPen,
  Plus,
  Save,
  Scale,
  Sparkles,
  Target,
  TrendingDown,
  Zap,
} from 'lucide-react';
import {
  CartesianGrid,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { AppShell } from '@/components/AppShell';
import { createClient } from '@/lib/supabaseClient';

type Profile = {
  initial_weight_kg?: number | null;
  initial_weight?: number | null;
  current_weight_kg?: number | null;
  current_weight?: number | null;
  goal?: string | null;
};

type Metric = {
  id: string;
  user_id: string;
  weight_kg: number | null;
  waist_cm: number | null;
  chest_cm: number | null;
  hip_cm: number | null;
  arm_cm: number | null;
  thigh_cm: number | null;
  energy: number | null;
  mood: number | null;
  sleep_quality: number | null;
  notes: string | null;
  photo_url: string | null;
  measured_at: string;
  created_at?: string;
};

type DailyProgress = {
  id: string;
  user_id: string;
  date: string;
  completed?: boolean | null;
  day_completed?: boolean | null;
};

type MetricForm = {
  weight_kg: string;
  waist_cm: string;
  chest_cm: string;
  hip_cm: string;
  arm_cm: string;
  thigh_cm: string;
  energy: string;
  mood: string;
  sleep_quality: string;
  notes: string;
};

const initialForm: MetricForm = {
  weight_kg: '',
  waist_cm: '',
  chest_cm: '',
  hip_cm: '',
  arm_cm: '',
  thigh_cm: '',
  energy: '3',
  mood: '3',
  sleep_quality: '3',
  notes: '',
};

function numberOrNull(value: string) {
  if (!value || value.trim() === '') return null;

  const parsed = Number(value);

  if (Number.isNaN(parsed)) return null;

  return parsed;
}

function formatNumber(value?: number | null, suffix = '') {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return '--';
  }

  return `${Number(value).toLocaleString('pt-BR', {
    maximumFractionDigits: 1,
  })}${suffix}`;
}

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
  });
}

function goalLabel(goal?: string | null) {
  const labels: Record<string, string> = {
    emagrecer: 'Emagrecimento',
    ganhar_massa: 'Ganho de massa',
    condicionamento: 'Condicionamento',
    vida_saudavel: 'Vida saudável',
  };

  return goal ? labels[goal] ?? goal : 'Sua evolução';
}

function StatCard({
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
    <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-2xl font-black leading-none text-slate-950">
            {value}
          </p>

          {subtitle && (
            <p className="mt-2 text-xs font-semibold text-slate-500">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}

function RatingInput({
  label,
  value,
  onChange,
  icon: Icon,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  icon: React.ElementType;
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

export default function ProgressoPage() {
  const supabase = createClient();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [dailyProgress, setDailyProgress] = useState<DailyProgress[]>([]);
  const [form, setForm] = useState<MetricForm>(initialForm);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>(
    'success'
  );

  async function loadData() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const [{ data: profileData }, { data: metricsData }, { data: dailyData }] =
      await Promise.all([
        supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle(),

        supabase
          .from('user_metrics')
          .select('*')
          .eq('user_id', user.id)
          .order('measured_at', { ascending: true }),

        supabase
          .from('daily_progress')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: true }),
      ]);

    setProfile((profileData ?? null) as Profile | null);
    setMetrics((metricsData ?? []) as Metric[]);
    setDailyProgress((dailyData ?? []) as DailyProgress[]);

    const latest = ((metricsData ?? []) as Metric[]).at(-1);

    if (latest) {
      setForm((current) => ({
        ...current,
        weight_kg: latest.weight_kg ? String(latest.weight_kg) : '',
        waist_cm: latest.waist_cm ? String(latest.waist_cm) : '',
        chest_cm: latest.chest_cm ? String(latest.chest_cm) : '',
        hip_cm: latest.hip_cm ? String(latest.hip_cm) : '',
        arm_cm: latest.arm_cm ? String(latest.arm_cm) : '',
        thigh_cm: latest.thigh_cm ? String(latest.thigh_cm) : '',
        energy: latest.energy ? String(latest.energy) : '3',
        mood: latest.mood ? String(latest.mood) : '3',
        sleep_quality: latest.sleep_quality
          ? String(latest.sleep_quality)
          : '3',
      }));
    }

    setLoading(false);
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function updateField(field: keyof MetricForm, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function saveMetric() {
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

    const currentDate = new Date().toISOString().slice(0, 10);

    const payload = {
      user_id: user.id,
      weight_kg: numberOrNull(form.weight_kg),
      waist_cm: numberOrNull(form.waist_cm),
      chest_cm: numberOrNull(form.chest_cm),
      hip_cm: numberOrNull(form.hip_cm),
      arm_cm: numberOrNull(form.arm_cm),
      thigh_cm: numberOrNull(form.thigh_cm),
      energy: numberOrNull(form.energy),
      mood: numberOrNull(form.mood),
      sleep_quality: numberOrNull(form.sleep_quality),
      notes: form.notes.trim() || null,
      measured_at: currentDate,
    };

    const { error } = await supabase.from('user_metrics').insert(payload);

    if (!error && payload.weight_kg) {
      await supabase
        .from('profiles')
        .update({
          current_weight_kg: payload.weight_kg,
          current_weight: payload.weight_kg,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);
    }

    setSaving(false);

    if (error) {
      setMessageType('error');
      setMessage(error.message);
      return;
    }

    setMessageType('success');
    setMessage('Progresso registrado com sucesso.');
    setForm((current) => ({
      ...current,
      notes: '',
    }));

    await loadData();
  }

  const initialWeight =
    profile?.initial_weight_kg ?? profile?.initial_weight ?? null;

  const latestMetric = metrics.at(-1);

  const currentWeight =
    latestMetric?.weight_kg ??
    profile?.current_weight_kg ??
    profile?.current_weight ??
    initialWeight ??
    null;

  const completedDays = dailyProgress.filter(
    (item) => item.completed || item.day_completed
  ).length;

  const progressPercent = Math.min(Math.round((completedDays / 28) * 100), 100);

  const unlockedStages = Math.min(
    Math.max(Math.ceil((progressPercent || 1) / 10), 1),
    10
  );

  const weightDiff =
    initialWeight && currentWeight
      ? Number(currentWeight) - Number(initialWeight)
      : null;

  const chartData = useMemo(() => {
    const data = metrics
      .filter((metric) => metric.weight_kg !== null)
      .map((metric) => ({
        date: formatDate(metric.measured_at),
        peso: Number(metric.weight_kg),
      }));

    if (data.length > 0) return data;

    if (initialWeight) {
      return [
        {
          date: 'Início',
          peso: Number(initialWeight),
        },
      ];
    }

    return [];
  }, [metrics, initialWeight]);

  if (loading) {
    return (
      <AppShell>
        <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm">
          <p className="text-slate-600">Carregando progresso...</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-6 pb-10">
        <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-500 p-5 text-white shadow-xl shadow-emerald-100 md:p-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-xs font-black uppercase tracking-wide">
            <BarChart3 size={16} />
            Progresso
          </span>

          <h1 className="mt-5 text-3xl font-black leading-tight md:text-5xl">
            Acompanhe sua evolução real.
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-50 md:text-base">
            Registre peso, medidas, energia, humor e sono para visualizar sua
            jornada com mais clareza.
          </p>

          <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-white"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="mt-3 flex items-center justify-between text-sm font-bold text-emerald-50">
            <span>{progressPercent}% da jornada</span>
            <span>{completedDays}/28 dias</span>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard
            title="Peso inicial"
            value={formatNumber(initialWeight, ' kg')}
            subtitle="Ponto de partida"
            icon={Scale}
          />

          <StatCard
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

          <StatCard
            title="Dias concluídos"
            value={String(completedDays)}
            subtitle="Meta de 28 dias"
            icon={CalendarCheck}
          />

          <StatCard
            title="Etapas liberadas"
            value={`${unlockedStages}/10`}
            subtitle={goalLabel(profile?.goal)}
            icon={Sparkles}
          />
        </section>

        <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm md:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                <Plus size={23} />
              </div>

              <div>
                <h2 className="text-xl font-black text-slate-950">
                  Registrar progresso
                </h2>
                <p className="text-sm text-slate-500">
                  Atualize seus dados de hoje.
                </p>
              </div>
            </div>

            <div className="grid gap-3">
              <label className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                <span className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-500">
                  <Scale size={16} className="text-emerald-700" />
                  Peso atual
                </span>

                <div className="flex items-center gap-2">
                  <input
                    className="w-full bg-transparent text-base font-semibold text-slate-950 outline-none placeholder:text-slate-400"
                    placeholder="Ex: 80"
                    type="number"
                    value={form.weight_kg}
                    onChange={(event) =>
                      updateField('weight_kg', event.target.value)
                    }
                  />
                  <span className="text-sm font-bold text-slate-400">kg</span>
                </div>
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                  <span className="text-xs font-black uppercase tracking-wide text-slate-500">
                    Cintura
                  </span>
                  <input
                    className="mt-2 w-full bg-transparent font-semibold outline-none"
                    placeholder="cm"
                    type="number"
                    value={form.waist_cm}
                    onChange={(event) =>
                      updateField('waist_cm', event.target.value)
                    }
                  />
                </label>

                <label className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                  <span className="text-xs font-black uppercase tracking-wide text-slate-500">
                    Peito
                  </span>
                  <input
                    className="mt-2 w-full bg-transparent font-semibold outline-none"
                    placeholder="cm"
                    type="number"
                    value={form.chest_cm}
                    onChange={(event) =>
                      updateField('chest_cm', event.target.value)
                    }
                  />
                </label>

                <label className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                  <span className="text-xs font-black uppercase tracking-wide text-slate-500">
                    Quadril
                  </span>
                  <input
                    className="mt-2 w-full bg-transparent font-semibold outline-none"
                    placeholder="cm"
                    type="number"
                    value={form.hip_cm}
                    onChange={(event) =>
                      updateField('hip_cm', event.target.value)
                    }
                  />
                </label>

                <label className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                  <span className="text-xs font-black uppercase tracking-wide text-slate-500">
                    Braço
                  </span>
                  <input
                    className="mt-2 w-full bg-transparent font-semibold outline-none"
                    placeholder="cm"
                    type="number"
                    value={form.arm_cm}
                    onChange={(event) =>
                      updateField('arm_cm', event.target.value)
                    }
                  />
                </label>

                <label className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                  <span className="text-xs font-black uppercase tracking-wide text-slate-500">
                    Coxa
                  </span>
                  <input
                    className="mt-2 w-full bg-transparent font-semibold outline-none"
                    placeholder="cm"
                    type="number"
                    value={form.thigh_cm}
                    onChange={(event) =>
                      updateField('thigh_cm', event.target.value)
                    }
                  />
                </label>
              </div>

              <RatingInput
                label="Energia"
                value={form.energy}
                onChange={(value) => updateField('energy', value)}
                icon={Zap}
              />

              <RatingInput
                label="Humor"
                value={form.mood}
                onChange={(value) => updateField('mood', value)}
                icon={Heart}
              />

              <RatingInput
                label="Sono"
                value={form.sleep_quality}
                onChange={(value) => updateField('sleep_quality', value)}
                icon={Moon}
              />

              <label className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                <span className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-500">
                  <NotebookPen size={16} className="text-emerald-700" />
                  Observações
                </span>

                <textarea
                  className="min-h-24 w-full resize-none bg-transparent text-base font-semibold text-slate-950 outline-none placeholder:text-slate-400"
                  placeholder="Como foi seu dia? Treinou bem? Sentiu evolução?"
                  value={form.notes}
                  onChange={(event) => updateField('notes', event.target.value)}
                />
              </label>

              <button
                type="button"
                onClick={saveMetric}
                disabled={saving}
                className="flex items-center justify-center gap-2 rounded-3xl bg-emerald-600 px-6 py-4 text-sm font-black text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <Save size={19} />
                {saving ? 'Registrando...' : 'Registrar progresso'}
              </button>

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

          <div className="space-y-5">
            <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm md:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                  <LineChart size={23} />
                </div>

                <div>
                  <h2 className="text-xl font-black text-slate-950">
                    Evolução do peso
                  </h2>
                  <p className="text-sm text-slate-500">
                    Histórico dos registros realizados.
                  </p>
                </div>
              </div>

              <div className="h-72">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="date" tickLine={false} axisLine={false} />
                      <YAxis tickLine={false} axisLine={false} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="peso"
                        stroke="#059669"
                        strokeWidth={3}
                        dot={{ r: 5 }}
                        activeDot={{ r: 7 }}
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center rounded-3xl bg-slate-50 text-center">
                    <div>
                      <Scale className="mx-auto text-emerald-700" size={36} />
                      <p className="mt-3 text-sm font-semibold text-slate-500">
                        Registre seu primeiro peso para gerar o gráfico.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm md:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                  <Activity size={23} />
                </div>

                <div>
                  <h2 className="text-xl font-black text-slate-950">
                    Últimos registros
                  </h2>
                  <p className="text-sm text-slate-500">
                    Seus dados mais recentes.
                  </p>
                </div>
              </div>

              {metrics.length === 0 ? (
                <div className="rounded-3xl bg-slate-50 p-5 text-center">
                  <p className="text-sm font-semibold text-slate-500">
                    Nenhum registro encontrado ainda.
                  </p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {metrics
                    .slice()
                    .reverse()
                    .slice(0, 5)
                    .map((metric) => (
                      <div
                        key={metric.id}
                        className="rounded-3xl bg-slate-50 p-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-xs font-black uppercase tracking-wide text-slate-500">
                              {new Date(
                                `${metric.measured_at}T00:00:00`
                              ).toLocaleDateString('pt-BR')}
                            </p>

                            <p className="mt-1 text-lg font-black text-slate-950">
                              {formatNumber(metric.weight_kg, ' kg')}
                            </p>
                          </div>

                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="rounded-2xl bg-white px-3 py-2">
                              <p className="text-[10px] font-black uppercase text-slate-400">
                                Energia
                              </p>
                              <p className="font-black text-slate-950">
                                {metric.energy ?? '--'}
                              </p>
                            </div>

                            <div className="rounded-2xl bg-white px-3 py-2">
                              <p className="text-[10px] font-black uppercase text-slate-400">
                                Humor
                              </p>
                              <p className="font-black text-slate-950">
                                {metric.mood ?? '--'}
                              </p>
                            </div>

                            <div className="rounded-2xl bg-white px-3 py-2">
                              <p className="text-[10px] font-black uppercase text-slate-400">
                                Sono
                              </p>
                              <p className="font-black text-slate-950">
                                {metric.sleep_quality ?? '--'}
                              </p>
                            </div>
                          </div>
                        </div>

                        {metric.notes && (
                          <p className="mt-3 text-sm leading-6 text-slate-600">
                            {metric.notes}
                          </p>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
