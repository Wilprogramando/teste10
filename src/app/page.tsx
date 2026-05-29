import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Dumbbell,
  Flame,
  HeartPulse,
  Medal,
  Menu,
  MoveRight,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Zap,
} from 'lucide-react';

const benefits = [
  {
    icon: Flame,
    title: 'Emagrecimento acelerado',
    text: 'Estrutura pensada para acelerar sua evolução com constância e estratégia.',
  },
  {
    icon: Zap,
    title: 'Mais disposição',
    text: 'Ganhe energia para viver melhor, treinar melhor e manter sua rotina.',
  },
  {
    icon: Dumbbell,
    title: 'Treinos simples',
    text: 'Método direto ao ponto, fácil de aplicar mesmo para quem está começando.',
  },
  {
    icon: Trophy,
    title: 'Resultados reais',
    text: 'Foco em transformação prática, disciplina e progresso visível.',
  },
  {
    icon: TrendingUp,
    title: 'Transformação física',
    text: 'Construa uma nova versão de você com treinos eficientes e consistentes.',
  },
  {
    icon: Target,
    title: 'Disciplina e foco',
    text: 'Crie uma mentalidade forte para não depender apenas de motivação.',
  },
];

const timeline = [
  {
    step: '01',
    title: 'Entre na plataforma',
    text: 'Acesse o sistema e conheça seu plano de evolução.',
  },
  {
    step: '02',
    title: 'Escolha seu treino',
    text: 'Siga o plano ideal para o seu momento e rotina.',
  },
  {
    step: '03',
    title: 'Siga o método',
    text: 'Mantenha a consistência e avance semana após semana.',
  },
  {
    step: '04',
    title: 'Transforme sua vida',
    text: 'Veja sua disciplina, seu corpo e sua autoestima mudarem.',
  },
];

const testimonials = [
  {
    name: 'Carlos Henrique',
    role: 'Aluno do programa',
    text: 'Eu nunca consegui manter uma rotina. Hoje me sinto outra pessoa. O método é simples, motivador e me fez voltar a acreditar em mim.',
  },
  {
    name: 'Patrícia Souza',
    role: 'Aluna do programa',
    text: 'Comecei do zero e hoje tenho disciplina. Perdi peso, ganhei energia e me sinto muito mais confiante.',
  },
  {
    name: 'Roberto Lima',
    role: 'Aluno do programa',
    text: 'O que mais gostei foi a clareza. Não é complicado. Você entra, faz o que precisa e começa a ver resultado de verdade.',
  },
];

const stats = [
  { label: 'Método direto', value: '100%' },
  { label: 'Acesso imediato', value: '24h' },
  { label: 'Preço especial', value: 'R$ 19,90' },
];

function SectionTitle({
  eyebrow,
  title,
  text,
  light = false,
}: {
  eyebrow: string;
  title: string;
  text: string;
  light?: boolean;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <div
        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.18em] ${
          light
            ? 'bg-white/10 text-orange-200'
            : 'bg-orange-100 text-orange-600'
        }`}
      >
        <Sparkles size={14} />
        {eyebrow}
      </div>

      <h2
        className={`mt-5 text-3xl font-black leading-tight md:text-5xl ${
          light ? 'text-white' : 'text-slate-950'
        }`}
      >
        {title}
      </h2>

      <p
        className={`mt-4 text-base leading-8 md:text-lg ${
          light ? 'text-slate-300' : 'text-slate-600'
        }`}
      >
        {text}
      </p>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#060b16] text-white">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-120px] top-[-120px] h-[420px] w-[420px] rounded-full bg-orange-500/20 blur-3xl" />
        <div className="absolute right-[-80px] top-[120px] h-[320px] w-[320px] rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute bottom-[-100px] left-[30%] h-[360px] w-[360px] rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#060b16]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-3 text-lg font-black tracking-tight text-white md:text-2xl"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-400 text-[#060b16] shadow-lg shadow-orange-500/20">
              <Dumbbell size={22} />
            </div>
            <span>Jornada Seu Ademir</span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-300 md:flex">
            <a href="#beneficios" className="transition hover:text-white">
              Benefícios
            </a>
            <a href="#transformacao" className="transition hover:text-white">
              Transformação
            </a>
            <a href="#como-funciona" className="transition hover:text-white">
              Como funciona
            </a>
            <a href="#depoimentos" className="transition hover:text-white">
              Depoimentos
            </a>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/auth/login"
              className="rounded-full border border-white/15 px-5 py-3 text-sm font-bold text-white transition hover:border-white/30 hover:bg-white/5"
            >
              Entrar
            </Link>

            <a
              href="#oferta"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-400 px-6 py-3 text-sm font-black text-[#06111d] shadow-lg shadow-orange-500/30 transition hover:scale-[1.03] hover:shadow-orange-400/40"
            >
              Comprar Agora
              <ArrowRight
                size={17}
                className="transition group-hover:translate-x-1"
              />
            </a>
          </div>

          <button className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 text-white md:hidden">
            <Menu size={22} />
          </button>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="mx-auto grid min-h-[88vh] max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-[1.08fr_0.92fr] lg:py-24">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-orange-300">
              <Sparkles size={14} />
              transformação real
            </div>

            <h1 className="mt-6 max-w-4xl text-4xl font-black leading-[1.05] text-white md:text-6xl xl:text-7xl">
              O sistema de exercícios que mudou minha vida pode mudar a sua
              também.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
              Treinos simples, eficientes e transformadores para quem quer sair
              do zero e conquistar resultados reais.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="#oferta"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-400 px-8 py-4 text-base font-black text-[#06111d] shadow-xl shadow-orange-500/30 transition hover:scale-[1.03]"
              >
                Começar Agora
                <MoveRight
                  size={18}
                  className="transition group-hover:translate-x-1"
                />
              </a>

              <a
                href="#oferta"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-8 py-4 text-base font-bold text-white transition hover:border-white/30 hover:bg-white/10"
              >
                <PlayCircle size={18} />
                Comprar Programa
              </a>
            </div>

            <div className="mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
                >
                  <p className="text-2xl font-black text-white">
                    {item.value}
                  </p>
                  <p className="mt-1 text-sm text-slate-400">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-6 top-8 h-24 w-24 rounded-full bg-orange-500/20 blur-2xl" />
            <div className="absolute -right-8 bottom-10 h-28 w-28 rounded-full bg-blue-500/20 blur-2xl" />

            <div className="relative rounded-[2rem] border border-white/10 bg-white/5 p-4 shadow-2xl shadow-black/30 backdrop-blur-xl">
              <div className="rounded-[1.8rem] bg-gradient-to-br from-[#0d1628] via-[#0a1322] to-[#13243a] p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-300">
                      sistema premium
                    </p>
                    <h3 className="mt-2 text-2xl font-black text-white">
                      Jornada Seu Ademir
                    </h3>
                  </div>

                  <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-orange-500 to-orange-400 text-[#08111d] shadow-lg shadow-orange-500/20">
                    <Dumbbell size={28} />
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                    <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                      foco
                    </p>
                    <p className="mt-2 text-xl font-black text-white">
                      Emagrecimento + Disciplina
                    </p>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                    <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                      nível
                    </p>
                    <p className="mt-2 text-xl font-black text-white">
                      Do zero ao resultado
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-[1.8rem] bg-gradient-to-r from-orange-500/15 to-blue-500/15 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-black uppercase tracking-wide text-orange-200">
                        transformação
                      </p>
                      <p className="mt-2 text-3xl font-black text-white">
                        Resultados reais
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        Treino, constância, foco e evolução pessoal.
                      </p>
                    </div>

                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10 text-orange-300">
                      <HeartPulse size={34} />
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3">
                  {['Treino', 'Disciplina', 'Mudança'].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-white/10 bg-white/5 px-3 py-4 text-center text-sm font-bold text-white"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="absolute -bottom-6 -left-6 w-52 rounded-[1.8rem] border border-white/10 bg-[#101b2e]/90 p-4 shadow-xl shadow-black/30 backdrop-blur-xl">
                <p className="text-xs font-black uppercase tracking-wide text-orange-300">
                  transformação ativa
                </p>
                <p className="mt-2 text-lg font-black text-white">
                  Método simples e poderoso
                </p>
                <div className="mt-3 h-2 rounded-full bg-white/10">
                  <div className="h-2 w-[84%] rounded-full bg-gradient-to-r from-orange-500 to-orange-300" />
                </div>
              </div>

              <div className="absolute -right-4 top-10 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-black text-white backdrop-blur-xl">
                + motivação
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="beneficios" className="bg-white py-24 text-slate-950">
        <div className="mx-auto max-w-7xl px-6">
          <SectionTitle
            eyebrow="benefícios"
            title="Tudo o que você precisa para começar a sua transformação"
            text="Uma estrutura pensada para facilitar sua rotina, acelerar seus resultados e fortalecer sua disciplina."
          />

          <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {benefits.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="group rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-orange-300 hover:shadow-xl"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-orange-500 to-orange-400 text-[#07111d] shadow-lg shadow-orange-200/40">
                    <Icon size={26} />
                  </div>

                  <h3 className="mt-5 text-xl font-black text-slate-950">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-base leading-7 text-slate-600">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section
        id="transformacao"
        className="bg-gradient-to-b from-[#0b1322] to-[#08101c] py-24"
      >
        <div className="mx-auto max-w-7xl px-6">
          <SectionTitle
            eyebrow="antes e depois"
            title="Veja a transformação"
            text="A mudança acontece quando treino, constância e disciplina se encontram."
            light
          />

          <div className="mt-14 grid gap-8 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-[1.5rem] bg-[#121d32] p-5">
                  <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6 text-center">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                      antes
                    </p>
                    <div className="mt-5 flex h-48 items-center justify-center rounded-[1.5rem] bg-slate-800/60">
                      <span className="text-6xl">😞</span>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-slate-300">
                      Falta de disposição, baixa constância e dificuldade para
                      manter uma rotina.
                    </p>
                  </div>
                </div>

                <div className="rounded-[1.5rem] bg-gradient-to-br from-orange-500/20 to-blue-500/20 p-5">
                  <div className="rounded-[1.5rem] border border-orange-400/20 bg-white/10 p-6 text-center backdrop-blur-sm">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-200">
                      depois
                    </p>
                    <div className="mt-5 flex h-48 items-center justify-center rounded-[1.5rem] bg-white/10">
                      <span className="text-6xl">💪</span>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-slate-100">
                      Mais energia, corpo em evolução, foco, disciplina e
                      resultados reais.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <h3 className="text-2xl font-black text-white">
                Resultados que inspiram
              </h3>

              <div className="mt-8 space-y-6">
                {[
                  {
                    label: 'Disposição',
                    value: '92%',
                    width: 'w-[92%]',
                  },
                  {
                    label: 'Consistência nos treinos',
                    value: '88%',
                    width: 'w-[88%]',
                  },
                  {
                    label: 'Autoconfiança',
                    value: '95%',
                    width: 'w-[95%]',
                  },
                  {
                    label: 'Mudança de hábitos',
                    value: '90%',
                    width: 'w-[90%]',
                  },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-200">
                        {item.label}
                      </span>
                      <span className="text-sm font-black text-orange-300">
                        {item.value}
                      </span>
                    </div>

                    <div className="h-3 rounded-full bg-white/10">
                      <div
                        className={`h-3 rounded-full bg-gradient-to-r from-orange-500 to-orange-300 ${item.width}`}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-[1.5rem] bg-gradient-to-r from-orange-500/15 to-blue-500/15 p-5">
                <p className="text-lg font-black text-white">
                  “Transformação não é sorte. É método, ação e repetição.”
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="como-funciona" className="bg-white py-24 text-slate-950">
        <div className="mx-auto max-w-7xl px-6">
          <SectionTitle
            eyebrow="como funciona"
            title="Um método simples para gerar resultado"
            text="Sem complicação, sem excesso de teoria. Você entra, aplica e evolui."
          />

          <div className="mt-14 grid gap-6 lg:grid-cols-4">
            {timeline.map((item) => (
              <div
                key={item.step}
                className="relative rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-[#0c1a30] to-[#142846] text-xl font-black text-orange-400 shadow-lg">
                  {item.step}
                </div>

                <h3 className="mt-5 text-xl font-black text-slate-950">
                  {item.title}
                </h3>

                <p className="mt-3 text-base leading-7 text-slate-600">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="depoimentos"
        className="bg-gradient-to-b from-[#0d1628] to-[#08101b] py-24"
      >
        <div className="mx-auto max-w-7xl px-6">
          <SectionTitle
            eyebrow="depoimentos"
            title="Pessoas comuns, transformações reais"
            text="Quando o método é claro e a prática é constante, a transformação aparece."
            light
          />

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {testimonials.map((item, index) => (
              <div
                key={item.name}
                className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-400 text-xl font-black text-[#07101b]">
                    {item.name.charAt(0)}
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-white">
                      {item.name}
                    </h3>
                    <p className="text-sm text-slate-400">{item.role}</p>
                  </div>
                </div>

                <div className="mt-5 flex gap-1 text-orange-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={`${item.name}-${i}`} size={18} fill="currentColor" />
                  ))}
                </div>

                <p className="mt-5 text-base leading-8 text-slate-300">
                  “{item.text}”
                </p>

                <div className="mt-6 flex items-center gap-2 text-sm font-bold text-emerald-300">
                  <CheckCircle2 size={16} />
                  Resultado validado pelo método
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="oferta" className="bg-white py-24 text-slate-950">
        <div className="mx-auto max-w-6xl px-6">
          <div className="overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#0b1424] via-[#0d1b31] to-[#152b47] p-8 text-white shadow-2xl shadow-black/20 md:p-12">
            <div className="grid gap-10 lg:grid-cols-[1fr_0.82fr] lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/15 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-orange-300">
                  <Medal size={14} />
                  oferta especial
                </div>

                <h2 className="mt-6 text-4xl font-black leading-tight md:text-6xl">
                  Sua transformação começa hoje
                </h2>

                <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
                  Tenha acesso ao programa completo e comece agora mesmo sua
                  jornada de disciplina, emagrecimento e mudança de vida.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                      preço normal
                    </p>
                    <p className="mt-2 text-xl font-bold text-slate-400 line-through">
                      R$ 97,00
                    </p>
                  </div>

                  <div className="rounded-3xl border border-orange-400/20 bg-orange-500/10 p-4">
                    <p className="text-xs font-black uppercase tracking-wide text-orange-200">
                      hoje por
                    </p>
                    <p className="mt-2 text-4xl font-black text-white">
                      R$ 19,90
                    </p>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                      acesso
                    </p>
                    <p className="mt-2 text-xl font-black text-white">
                      Imediato
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex flex-col gap-3 text-sm text-slate-300">
                  <div className="flex items-center gap-3">
                    <ShieldCheck size={18} className="text-orange-300" />
                    Método simples e fácil de aplicar
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock3 size={18} className="text-orange-300" />
                    Acesso liberado logo após a compra
                  </div>
                  <div className="flex items-center gap-3">
                    <Flame size={18} className="text-orange-300" />
                    Programa voltado para mudança real
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <p className="text-sm font-black uppercase tracking-[0.18em] text-orange-300">
                  sua decisão
                </p>

                <h3 className="mt-4 text-3xl font-black leading-tight text-white">
                  Dê o primeiro passo agora
                </h3>

                <p className="mt-4 text-base leading-7 text-slate-300">
                  Você não precisa de mais uma promessa. Você precisa de um
                  sistema que te faça agir.
                </p>

                <a
                  href="#"
                  className="mt-8 group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-400 px-8 py-5 text-center text-base font-black text-[#07111c] shadow-xl shadow-orange-500/30 transition hover:scale-[1.02]"
                >
                  QUERO TRANSFORMAR MINHA VIDA
                  <ArrowRight
                    size={18}
                    className="transition group-hover:translate-x-1"
                  />
                </a>

                <p className="mt-4 text-center text-sm text-slate-400">
                  Pagamento seguro • Acesso imediato • Oferta especial
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[#060b16]">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-lg font-black text-white">
              Jornada Seu Ademir
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Disciplina, evolução e transformação em um só lugar.
            </p>
          </div>

          <div className="flex flex-wrap gap-6 text-sm text-slate-400">
            <a href="#" className="transition hover:text-white">
              Instagram
            </a>
            <a href="#" className="transition hover:text-white">
              Facebook
            </a>
            <a href="#" className="transition hover:text-white">
              Termos
            </a>
            <a href="#" className="transition hover:text-white">
              Privacidade
            </a>
            <a href="#" className="transition hover:text-white">
              Contato
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
