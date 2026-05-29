import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Dumbbell,
  Flame,
  HeartPulse,
  Medal,
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
    text: 'Estrutura pensada para acelerar sua evolução com constância.',
  },
  {
    icon: Zap,
    title: 'Mais disposição',
    text: 'Ganhe energia para viver melhor, treinar melhor e manter sua rotina.',
  },
  {
    icon: Dumbbell,
    title: 'Treinos simples',
    text: 'Método direto ao ponto, fácil de aplicar mesmo começando do zero.',
  },
  {
    icon: Trophy,
    title: 'Resultados reais',
    text: 'Foco em transformação prática, disciplina e progresso visível.',
  },
  {
    icon: TrendingUp,
    title: 'Transformação física',
    text: 'Construa uma nova versão de você com treinos eficientes.',
  },
  {
    icon: Target,
    title: 'Disciplina e foco',
    text: 'Crie mentalidade forte para não depender apenas de motivação.',
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
    text: 'Mantenha constância e avance semana após semana.',
  },
  {
    step: '04',
    title: 'Transforme sua vida',
    text: 'Veja sua disciplina, corpo e autoestima mudarem.',
  },
];

const testimonials = [
  {
    name: 'Carlos Henrique',
    role: 'Aluno do programa',
    text: 'Eu nunca consegui manter uma rotina. Hoje me sinto outra pessoa.',
  },
  {
    name: 'Patrícia Souza',
    role: 'Aluna do programa',
    text: 'Comecei do zero, perdi peso e ganhei muito mais disposição.',
  },
  {
    name: 'Roberto Lima',
    role: 'Aluno do programa',
    text: 'O método é claro. Você entra, faz o que precisa e evolui.',
  },
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
        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] md:text-xs ${
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
        className={`mt-4 text-sm leading-7 md:text-lg md:leading-8 ${
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
    <main className="min-h-screen overflow-hidden bg-[#060b16] text-white">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-160px] top-[-140px] h-[320px] w-[320px] rounded-full bg-orange-500/20 blur-3xl md:h-[460px] md:w-[460px]" />
        <div className="absolute right-[-140px] top-[220px] h-[280px] w-[280px] rounded-full bg-blue-500/20 blur-3xl md:h-[420px] md:w-[420px]" />
      </div>

      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#060b16]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 md:px-6 md:py-4">
          <Link
            href="/"
            className="flex min-w-0 items-center gap-2 text-sm font-black tracking-tight text-white md:gap-3 md:text-2xl"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-400 text-[#060b16] shadow-lg shadow-orange-500/20 md:h-11 md:w-11">
              <Dumbbell size={21} />
            </div>

            <span className="truncate">Jornada Seu Ademir</span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-300 lg:flex">
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

          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/auth/login"
              className="rounded-full border border-white/15 px-4 py-2 text-xs font-bold text-white transition hover:border-white/30 hover:bg-white/5 md:px-5 md:py-3 md:text-sm"
            >
              Entrar
            </Link>

            <Link
              href="/auth/login"
              className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-orange-500 to-orange-400 px-4 py-2 text-xs font-black text-[#06111d] shadow-lg shadow-orange-500/30 transition hover:scale-[1.03] md:gap-2 md:px-6 md:py-3 md:text-sm"
            >
              Comprar
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </header>

      <section className="relative">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-10 md:px-6 md:py-16 lg:min-h-[88vh] lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-500/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-orange-300 md:text-xs">
              <Sparkles size={14} />
              transformação real
            </div>

            <h1 className="mt-6 text-4xl font-black leading-[1.05] text-white sm:text-5xl md:text-6xl xl:text-7xl">
              O sistema de exercícios que mudou minha vida pode mudar a sua
              também.
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300 md:text-xl md:leading-8 lg:mx-0">
              Treinos simples, eficientes e transformadores para quem quer sair
              do zero e conquistar resultados reais.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:max-w-xl">
              <Link
                href="/auth/login"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-400 px-7 py-4 text-sm font-black text-[#06111d] shadow-xl shadow-orange-500/30 transition hover:scale-[1.03] md:text-base"
              >
                Começar Agora
                <MoveRight
                  size={18}
                  className="transition group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-4 text-sm font-bold text-white transition hover:border-white/30 hover:bg-white/10 md:text-base"
              >
                <PlayCircle size={18} />
                Comprar Programa
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-2xl font-black text-white">100%</p>
                <p className="mt-1 text-xs text-slate-400 md:text-sm">
                  Método direto
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-2xl font-black text-white">24h</p>
                <p className="mt-1 text-xs text-slate-400 md:text-sm">
                  Acesso imediato
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-2xl font-black text-white">R$ 19,90</p>
                <p className="mt-1 text-xs text-slate-400 md:text-sm">
                  Preço especial
                </p>
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="relative rounded-[2rem] border border-white/10 bg-white/5 p-3 shadow-2xl shadow-black/30 backdrop-blur-xl md:p-4">
              <div className="rounded-[1.8rem] bg-gradient-to-br from-[#0d1628] via-[#0a1322] to-[#13243a] p-5 md:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-orange-300 md:text-xs">
                      sistema premium
                    </p>
                    <h3 className="mt-2 text-2xl font-black text-white md:text-3xl">
                      Jornada Seu Ademir
                    </h3>
                  </div>

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-orange-500 to-orange-400 text-[#08111d] shadow-lg shadow-orange-500/20 md:h-14 md:w-14">
                    <Dumbbell size={26} />
                  </div>
                </div>

                <div className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-4">
                  <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">
                    nível
                  </p>
                  <p className="mt-2 text-lg font-black text-white">Do zero</p>
                </div>

                <div className="mt-4 rounded-[1.8rem] bg-gradient-to-r from-orange-500/15 to-blue-500/15 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wide text-orange-200">
                        transformação
                      </p>
                      <p className="mt-2 text-2xl font-black text-white md:text-3xl">
                        Resultados reais
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        Treino, constância, foco e evolução pessoal.
                      </p>
                    </div>

                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white/10 text-orange-300 md:h-20 md:w-20">
                      <HeartPulse size={32} />
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  {['Treino', 'Foco', 'Mudança'].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-white/10 bg-white/5 px-2 py-3 text-center text-xs font-bold text-white md:text-sm"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mx-auto mt-4 w-full max-w-xs rounded-[1.8rem] border border-white/10 bg-[#101b2e]/90 p-4 shadow-xl shadow-black/30 backdrop-blur-xl md:absolute md:-bottom-6 md:-left-6 md:mt-0 md:w-52">
              <p className="text-[10px] font-black uppercase tracking-wide text-orange-300">
                transformação ativa
              </p>
              <p className="mt-2 text-base font-black text-white">
                Método simples e poderoso
              </p>
              <div className="mt-3 h-2 rounded-full bg-white/10">
                <div className="h-2 w-[84%] rounded-full bg-gradient-to-r from-orange-500 to-orange-300" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="beneficios"
        className="bg-white py-16 text-slate-950 md:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <SectionTitle
            eyebrow="benefícios"
            title="Tudo o que você precisa para começar sua transformação"
            text="Uma estrutura pensada para facilitar sua rotina, acelerar seus resultados e fortalecer sua disciplina."
          />

          <div className="mt-10 grid gap-4 md:mt-14 md:grid-cols-2 xl:grid-cols-3">
            {benefits.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-orange-300 hover:shadow-xl md:p-6"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-orange-500 to-orange-400 text-[#07111d] shadow-lg shadow-orange-200/40">
                    <Icon size={26} />
                  </div>

                  <h3 className="mt-5 text-lg font-black text-slate-950 md:text-xl">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-600 md:text-base">
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
        className="bg-gradient-to-b from-[#0b1322] to-[#08101c] py-16 md:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <SectionTitle
            eyebrow="antes e depois"
            title="Veja a transformação"
            text="A mudança acontece quando treino, constância e disciplina se encontram."
            light
          />

          <div className="mt-10 grid gap-6 lg:mt-14 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-4 backdrop-blur-sm md:p-6">
              <div className="grid grid-cols-2 gap-3 md:gap-5">
                <div className="rounded-[1.5rem] bg-[#121d32] p-3 md:p-5">
                  <div className="flex h-full flex-col rounded-[1.5rem] border border-white/10 bg-white/5 p-4 text-center md:p-5">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 md:text-xs">
                      antes
                    </p>

                    <div className="mt-4 flex h-32 items-center justify-center rounded-[1.5rem] bg-slate-800/60 md:h-48">
                      <span className="text-4xl md:text-6xl">😞</span>
                    </div>

                    <p className="mt-4 text-xs font-semibold leading-5 text-slate-300 md:text-sm md:leading-6">
                      Falta de disposição e dificuldade para manter rotina.
                    </p>
                  </div>
                </div>

                <div className="rounded-[1.5rem] bg-gradient-to-br from-orange-500/20 to-blue-500/20 p-3 md:p-5">
                  <div className="flex h-full flex-col rounded-[1.5rem] border border-orange-400/20 bg-white/10 p-4 text-center backdrop-blur-sm md:p-5">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-orange-200 md:text-xs">
                      depois
                    </p>

                    <div className="mt-4 flex h-32 items-center justify-center rounded-[1.5rem] bg-white/10 md:h-48">
                      <span className="text-4xl md:text-6xl">💪</span>
                    </div>

                    <p className="mt-4 text-xs font-semibold leading-5 text-slate-100 md:text-sm md:leading-6">
                      Mais energia, foco, disciplina e resultados reais.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 backdrop-blur-sm md:p-6">
              <h3 className="text-2xl font-black text-white">
                Resultados que inspiram
              </h3>

              <div className="mt-7 space-y-5">
                {[
                  ['Disposição', '92%', 'w-[92%]'],
                  ['Consistência', '88%', 'w-[88%]'],
                  ['Autoconfiança', '95%', 'w-[95%]'],
                  ['Mudança de hábitos', '90%', 'w-[90%]'],
                ].map(([label, value, width]) => (
                  <div key={label}>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-200">
                        {label}
                      </span>
                      <span className="text-sm font-black text-orange-300">
                        {value}
                      </span>
                    </div>

                    <div className="h-3 rounded-full bg-white/10">
                      <div
                        className={`h-3 rounded-full bg-gradient-to-r from-orange-500 to-orange-300 ${width}`}
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

      <section
        id="como-funciona"
        className="bg-white py-16 text-slate-950 md:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <SectionTitle
            eyebrow="como funciona"
            title="Um método simples para gerar resultado"
            text="Sem complicação. Você entra, aplica e evolui."
          />

          <div className="mt-10 grid gap-4 sm:grid-cols-2 md:mt-14 lg:grid-cols-4">
            {timeline.map((item) => (
              <div
                key={item.step}
                className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm md:p-6"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-[#0c1a30] to-[#142846] text-xl font-black text-orange-400 shadow-lg">
                  {item.step}
                </div>

                <h3 className="mt-5 text-lg font-black text-slate-950 md:text-xl">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600 md:text-base">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="depoimentos"
        className="bg-gradient-to-b from-[#0d1628] to-[#08101b] py-16 md:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <SectionTitle
            eyebrow="depoimentos"
            title="Pessoas comuns, transformações reais"
            text="Quando o método é claro e a prática é constante, a transformação aparece."
            light
          />

          <div className="mt-10 grid gap-4 md:mt-14 lg:grid-cols-3">
            {testimonials.map((item) => (
              <div
                key={item.name}
                className="rounded-[2rem] border border-white/10 bg-white/5 p-5 backdrop-blur-sm md:p-6"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-400 text-xl font-black text-[#07101b]">
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
                    <Star
                      key={`${item.name}-${i}`}
                      size={18}
                      fill="currentColor"
                    />
                  ))}
                </div>

                <p className="mt-5 text-sm leading-7 text-slate-300 md:text-base md:leading-8">
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

      <section id="oferta" className="bg-white py-16 text-slate-950 md:py-24">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#0b1424] via-[#0d1b31] to-[#152b47] p-5 text-white shadow-2xl shadow-black/20 md:rounded-[2.5rem] md:p-12">
            <div className="grid gap-8 lg:grid-cols-[1fr_0.82fr] lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/15 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-orange-300 md:text-xs">
                  <Medal size={14} />
                  oferta especial
                </div>

                <h2 className="mt-6 text-4xl font-black leading-tight md:text-6xl">
                  Sua transformação começa hoje
                </h2>

                <p className="mt-5 text-base leading-7 text-slate-300 md:text-lg md:leading-8">
                  Tenha acesso ao programa completo e comece agora mesmo sua
                  jornada de disciplina, emagrecimento e mudança de vida.
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-3">
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

              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 backdrop-blur-sm md:p-6">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-300">
                  sua decisão
                </p>

                <h3 className="mt-4 text-3xl font-black leading-tight text-white">
                  Dê o primeiro passo agora
                </h3>

                <p className="mt-4 text-sm leading-7 text-slate-300 md:text-base">
                  Você não precisa de mais uma promessa. Você precisa de um
                  sistema que te faça agir.
                </p>

                <Link
                  href="/auth/login"
                  className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-400 px-6 py-5 text-center text-sm font-black text-[#07111c] shadow-xl shadow-orange-500/30 transition hover:scale-[1.02] md:text-base"
                >
                  QUERO TRANSFORMAR MINHA VIDA
                  <ArrowRight size={18} />
                </Link>

                <p className="mt-4 text-center text-xs text-slate-400 md:text-sm">
                  Pagamento seguro • Acesso imediato • Oferta especial
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[#060b16]">
        <div className="mx-auto max-w-7xl px-4 py-8 text-center md:px-6">
          <p className="text-lg font-black text-white">Jornada Seu Ademir</p>
          <p className="mt-2 text-sm text-slate-400">
            Disciplina, evolução e transformação em um só lugar.
          </p>
        </div>
      </footer>
    </main>
  );
}
