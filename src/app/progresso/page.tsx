'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  BarChart3,
  CalendarCheck,
  HeartPulse,
  LineChart as LineChartIcon,
  Ruler,
  Save,
  Scale,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { AppShell } from '@/components/AppShell';
import { createClient } from '@/lib/supabaseClient';

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
  measured_at: string;
  created_at: string;
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

const MAX_CHART_WEIGHT = 300;
const MIN_CHART_WEIGHT = 20;

function getTodayInBrazil() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
  }).format(new Date());
}

function toNumberOrNull(value: string) {
  if (!value || value.trim() === '') {
    return null;
  }

  const normalizedValue = value.replace(',', '.');
  const parsed = Number(normalizedValue);

  if (Number.isNaN(parsed)) {
    return null;
  }

  return parsed;
}

function formatNumber(value?: number | null) {
  if (value === null || value === undefined) {
    return '--';
  }

  return String(Number(value).toFixed(1)).replace('.', ',');
}

function formatShortDate(date: string) {
  const cleanDate = date.split('T')[0];
  const [year, month, day] = cleanDate.split('-');

  if (!year || !month || !day) {
    return date;
  }

  return `${day}/${month}`;
}

function formatFullDate(date: string) {
  const cleanDate = date.split('T')[0];
  const [year, month, day] = cleanDate.split('-');

  if (!year || !month || !day) {
    return date;
  }

  return `${day}/${month}/${year}`;
}

function MetricCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">
            {title}
          </p>

          <p className="mt-3 text-3xl font-black text-slate-950">{value}</p>

          <p className="mt-2 text-sm font-medium text-slate-500">
            {description}
          </p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}

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

export default function ProgressoPage() {
  const supabase = createClient();

  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [completedDays, setCompletedDays] = useState(0);
  const [form, setForm] = useState<MetricForm>(initialForm);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>(
    'success'
  );

  useEffect(() => {
    async function loadProgressData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const today = getTodayInBrazil();

      const [{ data: metricsData }, { count: completedDaysCount }] =
        await Promise.all([
          supabase
            .from('user_metrics')
            .select('*')
            .eq('user_id', user.id)
            .order('measured_at', { ascending: true })
            .order('created_at', { ascending: true }),

          supabase
            .from('daily_progress')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('completed', true)
            .lt('date', today),
        ]);

      setMetrics((metricsData ?? []) as Metric[]);
      setCompletedDays(completedDaysCount ?? 0);
      setLoading(false);
    }

    loadProgressData();
  }, [supabase]);

  function updateField(field: keyof MetricForm, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  const validChartMetrics = useMemo(() => {
    return metrics.filter((metric) => {
      const weight = Number(metric.weight_kg);

      return (
        metric.weight_kg !== null &&
        metric.weight_kg !== undefined &&
        !Number.isNaN(weight) &&
        weight >= MIN_CHART_WEIGHT &&
        weight <= MAX_CHART_WEIGHT
      );
    });
  }, [metrics]);

  const ignoredChartMetrics = useMemo(() => {
    return metrics.filter((metric) => {
      const weight = Number(metric.weight_kg);

      if (metric.weight_kg === null || metric.weight_kg === undefined) {
        return false;
      }

      return (
        Number.isNaN(weight) ||
        weight < MIN_CHART_WEIGHT ||
        weight > MAX_CHART_WEIGHT
      );
    });
  }, [metrics]);

  const chartData = useMemo(() => {
    return validChartMetrics.map((metric, index) => ({
      index: index + 1,
      date: formatShortDate(metric.measured_at),
      fullDate: formatFullDate(metric.measured_at),
      weight: Number(metric.weight_kg),
    }));
  }, [validChartMetrics]);

  const latestMetric = metrics[metrics.length - 1] ?? null;
  const firstMetric = metrics.find((metric) => metric.weight_kg !== null) ?? null;

  const latestWeight = latestMetric?.weight_kg ?? null;
  const firstWeight = firstMetric?.weight_kg ?? null;

  const weightDifference =
    latestWeight !== null &&
    latestWeight !== undefined &&
    firstWeight !== null &&
    firstWeight !== undefined
      ? Number(latestWeight) - Number(firstWeight)
      : null;

  const averageEnergy =
    metrics.length > 0
      ? metrics.reduce((sum, metric) => sum + Number(metric.energy ?? 0), 0) /
        metrics.length
      : null;

  const averageSleep =
    metrics.length > 0
      ? metrics.reduce(
          (sum, metric) => sum + Number(metric.sleep_quality ?? 0),
          0
        ) / metrics.length
      : null;

  async function saveMetric() {
    setMessage('');

    const weight = toNumberOrNull(form.weight_kg);

    if (!weight) {
      setMessageType('error');
      setMessage('Informe seu peso atual.');
      return;
    }

    if (weight <= 0) {
      setMessageType('error');
      setMessage('Informe um peso válido.');
      return;
    }

    if (weight > MAX_CHART_WEIGHT) {
      setMessageType('error');
      setMessage(
        `O peso informado parece incorreto. O gráfico aceita no máximo ${MAX_CHART_WEIGHT} kg.`
      );
      return;
    }

    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setSaving(false);
      setMessageType('error');
      setMessage('Usuário não encontrado.');
      return;
    }

    const payload = {
      user_id: user.id,
      weight_kg: weight,
      waist_cm: toNumberOrNull(form.waist_cm),
      chest_cm: toNumberOrNull(form.chest_cm),
      hip_cm: toNumberOrNull(form.hip_cm),
      arm_cm: toNumberOrNull(form.arm_cm),
      thigh_cm: toNumberOrNull(form.thigh_cm),
      energy: toNumberOrNull(form.energy),
      mood: toNumberOrNull(form.mood),
      sleep_quality: toNumberOrNull(form.sleep_quality),
      notes: form.notes.trim() || null,
      measured_at: getTodayInBrazil(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('user_metrics')
      .insert(payload)
      .select('*')
      .single();

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

    setMetrics((current) => [...current, data as Metric]);
    setForm(initialForm);

    setMessageType('success');
    setMessage('Progresso registrado com sucesso.');
  }

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
            <Sparkles size={16} />
            Progresso
          </span>

          <h1 className="mt-5 text-3xl font-black leading-tight md:text-5xl">
            Acompanhe sua evolução
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-50 md:text-base">
            Registre seu peso, medidas e sensação do dia para acompanhar sua
            transformação com clareza.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <MetricCard
            title="Peso atual"
            value={`${formatNumber(latestWeight)} kg`}
            description="Último registro"
            icon={Scale}
          />

          <MetricCard
            title="Evolução"
            value={
              weightDifference === null
                ? '-- kg'
                : `${weightDifference > 0 ? '+' : ''}${String(
                    weightDifference.toFixed(1)
                  ).replace('.', ',')} kg`
            }
            description="Desde o primeiro registro"
            icon={
              weightDifference && weightDifference < 0
                ? TrendingDown
                : TrendingUp
            }
          />

          <MetricCard
            title="Dias concluídos"
            value={String(completedDays)}
            description="Conta após meia-noite"
            icon={CalendarCheck}
          />

          <MetricCard
            title="Energia"
            value={averageEnergy === null ? '--' : averageEnergy.toFixed(1)}
            description="Média dos registros"
            icon={Activity}
          />

          <MetricCard
            title="Sono"
            value={averageSleep === null ? '--' : averageSleep.toFixed(1)}
            description="Qualidade média"
            icon={HeartPulse}
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm md:p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-black text-slate-950">
                Registrar progresso
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Preencha seu peso atual e, se quiser, suas medidas corporais.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Peso atual" icon={Scale}>
                <div className="flex items-center gap-2">
                  <input
                    className="w-full bg-transparent text-base font-semibold text-slate-950 outline-none placeholder:text-slate-400"
                    placeholder="Ex: 82"
                    type="number"
                    min="1"
                    max="300"
                    value={form.weight_kg}
                    onChange={(event) =>
                      updateField('weight_kg', event.target.value)
                    }
                  />
                  <span className="text-sm font-bold text-slate-400">kg</span>
                </div>
              </Field>

              <Field label="Cintura" icon={Ruler}>
                <div className="flex items-center gap-2">
                  <input
                    className="w-full bg-transparent text-base font-semibold text-slate-950 outline-none placeholder:text-slate-400"
                    placeholder="Ex: 88"
                    type="number"
                    value={form.waist_cm}
                    onChange={(event) =>
                      updateField('waist_cm', event.target.value)
                    }
                  />
                  <span className="text-sm font-bold text-slate-400">cm</span>
                </div>
              </Field>

              <Field label="Peitoral" icon={Ruler}>
                <div className="flex items-center gap-2">
                  <input
                    className="w-full bg-transparent text-base font-semibold text-slate-950 outline-none placeholder:text-slate-400"
                    placeholder="Ex: 102"
                    type="number"
                    value={form.chest_cm}
                    onChange={(event) =>
                      updateField('chest_cm', event.target.value)
                    }
                  />
                  <span className="text-sm font-bold text-slate-400">cm</span>
                </div>
              </Field>

              <Field label="Quadril" icon={Ruler}>
                <div className="flex items-center gap-2">
                  <input
                    className="w-full bg-transparent text-base font-semibold text-slate-950 outline-none placeholder:text-slate-400"
                    placeholder="Ex: 98"
                    type="number"
                    value={form.hip_cm}
                    onChange={(event) =>
                      updateField('hip_cm', event.target.value)
                    }
                  />
                  <span className="text-sm font-bold text-slate-400">cm</span>
                </div>
              </Field>

              <Field label="Braço" icon={Ruler}>
                <div className="flex items-center gap-2">
                  <input
                    className="w-full bg-transparent text-base font-semibold text-slate-950 outline-none placeholder:text-slate-400"
                    placeholder="Ex: 34"
                    type="number"
                    value={form.arm_cm}
                    onChange={(event) =>
                      updateField('arm_cm', event.target.value)
                    }
                  />
                  <span className="text-sm font-bold text-slate-400">cm</span>
                </div>
              </Field>

              <Field label="Coxa" icon={Ruler}>
                <div className="flex items-center gap-2">
                  <input
                    className="w-full bg-transparent text-base font-semibold text-slate-950 outline-none placeholder:text-slate-400"
                    placeholder="Ex: 58"
                    type="number"
                    value={form.thigh_cm}
                    onChange={(event) =>
                      updateField('thigh_cm', event.target.value)
                    }
                  />
                  <span className="text-sm font-bold text-slate-400">cm</span>
                </div>
              </Field>

              <Field label="Energia do dia" icon={Activity}>
                <select
                  className="w-full bg-transparent text-base font-semibold text-slate-950 outline-none"
                  value={form.energy}
                  onChange={(event) => updateField('energy', event.target.value)}
                >
                  <option value="1">1 - Muito baixa</option>
                  <option value="2">2 - Baixa</option>
                  <option value="3">3 - Normal</option>
                  <option value="4">4 - Boa</option>
                  <option value="5">5 - Excelente</option>
                </select>
              </Field>

              <Field label="Humor" icon={HeartPulse}>
                <select
                  className="w-full bg-transparent text-base font-semibold text-slate-950 outline-none"
                  value={form.mood}
                  onChange={(event) => updateField('mood', event.target.value)}
                >
                  <option value="1">1 - Ruim</option>
                  <option value="2">2 - Baixo</option>
                  <option value="3">3 - Normal</option>
                  <option value="4">4 - Bom</option>
                  <option value="5">5 - Excelente</option>
                </select>
              </Field>

              <Field label="Sono" icon={HeartPulse}>
                <select
                  className="w-full bg-transparent text-base font-semibold text-slate-950 outline-none"
                  value={form.sleep_quality}
                  onChange={(event) =>
                    updateField('sleep_quality', event.target.value)
                  }
                >
                  <option value="1">1 - Péssimo</option>
                  <option value="2">2 - Ruim</option>
                  <option value="3">3 - Normal</option>
                  <option value="4">4 - Bom</option>
                  <option value="5">5 - Excelente</option>
                </select>
              </Field>

              <label className="block rounded-3xl border border-slate-100 bg-slate-50 p-4 md:col-span-2">
                <span className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-500">
                  <BarChart3 size={16} className="text-emerald-700" />
                  Observações
                </span>

                <textarea
                  className="min-h-28 w-full resize-none bg-transparent text-base font-semibold text-slate-950 outline-none placeholder:text-slate-400"
                  placeholder="Como você se sentiu hoje?"
                  value={form.notes}
                  onChange={(event) => updateField('notes', event.target.value)}
                />
              </label>

              <button
                type="button"
                onClick={saveMetric}
                disabled={saving}
                className="flex items-center justify-center gap-2 rounded-3xl bg-emerald-600 px-6 py-4 text-sm font-black text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70 md:col-span-2"
              >
                <Save size={19} />
                {saving ? 'Salvando...' : 'Salvar progresso'}
              </button>

              {message && (
                <p
                  className={`rounded-3xl p-4 text-sm font-semibold md:col-span-2 ${
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

          <div className="space-y-6">
            <section className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm md:p-6">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                      <LineChartIcon size={23} />
                    </div>

                    <div>
                      <h2 className="text-2xl font-black text-slate-950">
                        Evolução do peso
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        Peso em kg. Visualização limitada até{' '}
                        {MAX_CHART_WEIGHT} kg.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {chartData.length > 0 ? (
                <>
                  <div className="h-[300px] w-full overflow-hidden md:h-[360px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={chartData}
                        margin={{
                          top: 20,
                          right: 20,
                          left: 10,
                          bottom: 16,
                        }}
                      >
                        <CartesianGrid
                          strokeDasharray="4 4"
                          vertical={false}
                          stroke="#e2e8f0"
                        />

                        <XAxis
                          dataKey="date"
                          tick={{ fontSize: 12, fill: '#64748b' }}
                          tickLine={false}
                          axisLine={false}
                          minTickGap={18}
                        />

                        <YAxis
                          domain={[0, MAX_CHART_WEIGHT]}
                          ticks={[0, 60, 120, 180, 240, 300]}
                          tick={{ fontSize: 12, fill: '#64748b' }}
                          tickLine={false}
                          axisLine={false}
                          width={52}
                          tickFormatter={(value) => `${value}`}
                        />

                        <Tooltip
                          cursor={{
                            stroke: '#10b981',
                            strokeWidth: 1,
                            strokeDasharray: '4 4',
                          }}
                          contentStyle={{
                            borderRadius: 18,
                            border: '1px solid #d1fae5',
                            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.12)',
                          }}
                          formatter={(value) => [
                            `${String(value).replace('.', ',')} kg`,
                            'Peso',
                          ]}
                          labelFormatter={(_, payload) => {
                            const item = payload?.[0]?.payload;

                            return item?.fullDate
                              ? `Data: ${item.fullDate}`
                              : 'Registro';
                          }}
                        />

                        <Line
                          type="monotone"
                          dataKey="weight"
                          stroke="#059669"
                          strokeWidth={4}
                          dot={{
                            r: 5,
                            strokeWidth: 3,
                            stroke: '#059669',
                            fill: '#ffffff',
                          }}
                          activeDot={{
                            r: 8,
                            strokeWidth: 3,
                            stroke: '#047857',
                            fill: '#ffffff',
                          }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {ignoredChartMetrics.length > 0 && (
                    <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 p-4">
                      <p className="text-sm font-semibold leading-6 text-amber-800">
                        {ignoredChartMetrics.length} registro(s) fora do limite
                        de {MIN_CHART_WEIGHT} kg a {MAX_CHART_WEIGHT} kg não
                        aparecem no gráfico para manter a visualização correta.
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="rounded-3xl bg-slate-50 p-6 text-center">
                  <p className="font-black text-slate-950">
                    Nenhum peso válido para o gráfico.
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Registre pesos entre {MIN_CHART_WEIGHT} kg e{' '}
                    {MAX_CHART_WEIGHT} kg para visualizar sua evolução.
                  </p>
                </div>
              )}
            </section>

            <section className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm md:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                  <CalendarCheck size={23} />
                </div>

                <div>
                  <h2 className="text-2xl font-black text-slate-950">
                    Últimos registros
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Histórico recente do seu progresso.
                  </p>
                </div>
              </div>

              {metrics.length > 0 ? (
                <div className="space-y-3">
                  {[...metrics]
                    .reverse()
                    .slice(0, 6)
                    .map((metric) => (
                      <div
                        key={metric.id}
                        className="rounded-3xl border border-slate-100 bg-slate-50 p-4"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-sm font-black text-slate-950">
                              {formatFullDate(metric.measured_at)}
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                              Peso: {formatNumber(metric.weight_kg)} kg
                            </p>

                            {metric.notes && (
                              <p className="mt-2 text-sm leading-6 text-slate-600">
                                {metric.notes}
                              </p>
                            )}
                          </div>

                          <div className="rounded-2xl bg-white px-3 py-2 text-xs font-black text-emerald-700">
                            Registro
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="rounded-3xl bg-slate-50 p-6 text-center">
                  <p className="font-black text-slate-950">
                    Nenhum registro ainda.
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Salve seu primeiro progresso para começar seu histórico.
                  </p>
                </div>
              )}
            </section>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
