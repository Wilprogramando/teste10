'use client';

import { useRouter } from 'next/navigation';
import {
  CheckCircle2,
  CreditCard,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { FormEvent, useState } from 'react';
import { createClient } from '@/lib/supabaseClient';

type Mode = 'signup' | 'login';

function getFriendlyError(message?: string) {
  const text = message || '';
  const lower = text.toLowerCase();

  if (lower.includes('invalid login credentials')) {
    return 'E-mail ou senha incorretos. Confira os dados e tente novamente.';
  }

  if (lower.includes('email not confirmed')) {
    return 'Seu e-mail ainda não foi confirmado. Para teste, desative a confirmação de e-mail no Supabase.';
  }

  if (
    lower.includes('user already registered') ||
    lower.includes('already registered')
  ) {
    return 'Este e-mail já possui cadastro. Clique em “Já tenho conta” e entre com sua senha.';
  }

  if (lower.includes('signup disabled')) {
    return 'O cadastro está desativado no Supabase. Ative o cadastro por e-mail em Authentication.';
  }

  if (lower.includes('password')) {
    return 'Verifique sua senha. Ela precisa ter pelo menos 6 caracteres.';
  }

  return (
    text ||
    'Não foi possível concluir agora. Verifique e-mail, senha e configuração do Supabase.'
  );
}

export default function AuthLoginPage() {
  const supabase = createClient();
  const router = useRouter();

  const [mode, setMode] = useState<Mode>('signup');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState('');
  const [successRegistered, setSuccessRegistered] = useState(false);
  const [hasActiveSession, setHasActiveSession] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setMessage('Informe e-mail e senha.');
      return;
    }

    if (mode === 'signup') {
      if (!confirmPassword) {
        setMessage('Confirme sua senha.');
        return;
      }

      if (password !== confirmPassword) {
        setMessage('As senhas não coincidem.');
        return;
      }

      if (password.length < 6) {
        setMessage('A senha deve ter pelo menos 6 caracteres.');
        return;
      }
    }

    setLoading(true);

    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
        });

        if (error) {
          throw error;
        }

        const sessionWasCreated = Boolean(data.session);

        setHasActiveSession(sessionWasCreated);
        setSuccessRegistered(true);

        if (sessionWasCreated) {
          setMessage('');
        } else {
          setMessage(
            'Cadastro criado. Se o botão “Entrar e pagar” não entrar, desative a confirmação de e-mail no Supabase ou confirme o usuário manualmente.'
          );
        }

        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        throw error;
      }

      router.push('/dashboard');
      router.refresh();
    } catch (error: any) {
      setMessage(getFriendlyError(error?.message));
    } finally {
      setLoading(false);
    }
  }

  async function handleEnterAndPay() {
    setLoading(true);
    setMessage('');

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session || hasActiveSession) {
        router.push('/dashboard');
        router.refresh();
        return;
      }

      const cleanEmail = email.trim().toLowerCase();

      const { error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        throw error;
      }

      router.push('/dashboard');
      router.refresh();
    } catch (error: any) {
      setMessage(getFriendlyError(error?.message));
      setSuccessRegistered(false);
      setMode('login');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7fbfa_0%,#edf8f4_100%)]">
      <section className="mx-auto grid min-h-screen max-w-7xl items-center gap-8 px-4 py-10 md:px-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="hidden lg:block">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-emerald-700">
              <Sparkles size={14} />
              jornada de transformação
            </div>

            <h1 className="mt-6 text-5xl font-black leading-tight text-slate-950">
              Crie sua conta e comece sua transformação hoje.
            </h1>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              Entre para a <strong>Jornada Seu Ademir</strong> e tenha acesso a
              uma experiência pensada para disciplina, treino, evolução e mudança
              real de vida.
            </p>

            <div className="mt-8 grid gap-4">
              <div className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-slate-100">
                <p className="text-sm font-black text-slate-950">
                  Acesso ao sistema completo
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Painel com treinos, alimentação, progresso, IMC e rotina
                  diária.
                </p>
              </div>

              <div className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-slate-100">
                <p className="text-sm font-black text-slate-950">
                  Método simples e direto
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Crie sua conta, entre na plataforma e comece sua jornada.
                </p>
              </div>

              <div className="rounded-[2rem] border border-emerald-100 bg-emerald-50 p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <CreditCard className="mt-0.5 text-emerald-700" size={20} />

                  <div>
                    <p className="text-sm font-black text-emerald-800">
                      Pagamento no primeiro acesso
                    </p>

                    <p className="mt-2 text-sm leading-6 text-emerald-700">
                      O pagamento será cobrado{' '}
                      <strong>após você entrar com seu usuário e senha</strong>{' '}
                      pela primeira vez.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-xl">
          <div className="overflow-hidden rounded-[2rem] bg-white shadow-xl ring-1 ring-slate-100">
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-6 text-white md:px-8">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-50">
                Jornada Seu Ademir
              </p>

              <h2 className="mt-2 text-3xl font-black">
                {successRegistered
                  ? 'Cadastro concluído'
                  : mode === 'signup'
                    ? 'Criar conta'
                    : 'Entrar na plataforma'}
              </h2>

              <p className="mt-2 text-sm leading-6 text-emerald-50">
                {successRegistered
                  ? 'Sua conta foi criada. Agora clique em “Entrar e pagar”.'
                  : mode === 'signup'
                    ? 'Crie sua conta para começar sua jornada.'
                    : 'Entre com seu e-mail e senha para acessar sua área.'}
              </p>
            </div>

            <div className="p-6 md:p-8">
              {!successRegistered ? (
                <>
                  <div className="mb-6 grid grid-cols-2 rounded-2xl bg-slate-100 p-1">
                    <button
                      type="button"
                      onClick={() => {
                        setMode('signup');
                        setMessage('');
                      }}
                      className={`rounded-xl px-4 py-3 text-sm font-bold transition ${
                        mode === 'signup'
                          ? 'bg-white text-emerald-700 shadow-sm'
                          : 'text-slate-500'
                      }`}
                    >
                      Criar conta
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setMode('login');
                        setMessage('');
                      }}
                      className={`rounded-xl px-4 py-3 text-sm font-bold transition ${
                        mode === 'login'
                          ? 'bg-white text-emerald-700 shadow-sm'
                          : 'text-slate-500'
                      }`}
                    >
                      Já tenho conta
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                      <Mail
                        size={18}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="email"
                        placeholder="E-mail"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-4 text-slate-900 outline-none transition focus:border-emerald-500"
                      />
                    </div>

                    <div className="relative">
                      <Lock
                        size={18}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="password"
                        placeholder="Senha"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-4 text-slate-900 outline-none transition focus:border-emerald-500"
                      />
                    </div>

                    {mode === 'signup' && (
                      <div className="relative">
                        <ShieldCheck
                          size={18}
                          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                          type="password"
                          placeholder="Confirmar senha"
                          value={confirmPassword}
                          onChange={(event) =>
                            setConfirmPassword(event.target.value)
                          }
                          className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-4 text-slate-900 outline-none transition focus:border-emerald-500"
                        />
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-2xl border-2 border-slate-950 bg-emerald-600 px-5 py-4 text-base font-black text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {loading
                        ? 'Aguarde...'
                        : mode === 'signup'
                          ? 'Cadastrar'
                          : 'Entrar'}
                    </button>
                  </form>

                  {mode === 'signup' && (
                    <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                      <p className="text-sm leading-6 text-emerald-800">
                        <strong>Atenção:</strong> o pagamento será cobrado
                        somente após você entrar com seu usuário e senha pela
                        primeira vez.
                      </p>
                    </div>
                  )}

                  {message && (
                    <div className="mt-5 rounded-2xl bg-red-50 px-4 py-4 text-sm text-red-700">
                      {message}
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-5">
                  <div className="rounded-[1.75rem] border border-emerald-100 bg-emerald-50 p-6 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600 text-white">
                      <CheckCircle2 size={32} />
                    </div>

                    <h3 className="mt-4 text-2xl font-black text-slate-950">
                      Cadastro realizado com sucesso!
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      Sua conta foi criada. Agora clique abaixo para entrar na
                      plataforma.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
                    <p className="text-sm leading-6 text-amber-800">
                      <strong>Importante:</strong> o pagamento será cobrado após
                      você entrar com seu usuário e senha pela primeira vez.
                    </p>
                  </div>

                  {message && (
                    <div className="rounded-2xl bg-slate-100 px-4 py-4 text-sm text-slate-700">
                      {message}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleEnterAndPay}
                    disabled={loading}
                    className="w-full rounded-2xl border-2 border-slate-950 bg-emerald-600 px-5 py-4 text-base font-black text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loading ? 'Aguarde...' : 'Entrar e pagar'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSuccessRegistered(false);
                      setMode('login');
                      setMessage('');
                    }}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-base font-bold text-slate-700 transition hover:bg-slate-50"
                  >
                    Já tenho conta
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-slate-100 lg:hidden">
            <p className="text-sm font-black text-slate-950">
              Pagamento no primeiro acesso
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              O pagamento será cobrado somente depois que você entrar com seu
              e-mail e senha pela primeira vez.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
