'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabaseClient';

type AuthMode = 'login' | 'signup' | 'reset-request' | 'reset-password';

function LoginContent() {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const type = searchParams.get('type');
    const reset = searchParams.get('reset');

    if (type === 'recovery' || reset === '1') {
      setMode('reset-password');
      setMsg('Digite sua nova senha para concluir a recuperação.');
    }
  }, [searchParams]);

  async function submit() {
    setLoading(true);
    setMsg('');

    if (!email || !password) {
      setLoading(false);
      setMsg('Informe e-mail e senha.');
      return;
    }

    const result =
      mode === 'login'
        ? await supabase.auth.signInWithPassword({
            email,
            password,
          })
        : await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/auth/login`,
            },
          });

    setLoading(false);

    if (result.error) {
      setMsg(result.error.message);
      return;
    }

    router.push('/dashboard');
  }

  async function sendResetEmail() {
    setLoading(true);
    setMsg('');

    if (!email) {
      setLoading(false);
      setMsg('Informe seu e-mail para recuperar a senha.');
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/login?reset=1`,
    });

    setLoading(false);

    if (error) {
      setMsg(error.message);
      return;
    }

    setMsg(
      'Enviamos um link de recuperação para seu e-mail. Verifique sua caixa de entrada e spam.'
    );
  }

  async function updatePassword() {
    setLoading(true);
    setMsg('');

    if (!newPassword || !confirmPassword) {
      setLoading(false);
      setMsg('Informe e confirme a nova senha.');
      return;
    }

    if (newPassword.length < 6) {
      setLoading(false);
      setMsg('A nova senha precisa ter pelo menos 6 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setLoading(false);
      setMsg('As senhas não conferem.');
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    setLoading(false);

    if (error) {
      setMsg(error.message);
      return;
    }

    setMsg('Senha alterada com sucesso. Você já pode entrar.');
    setMode('login');
    setPassword('');
    setNewPassword('');
    setConfirmPassword('');
  }

  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <div className="card">
        <h1 className="text-3xl font-black">
          {mode === 'login' && 'Entrar'}
          {mode === 'signup' && 'Criar conta'}
          {mode === 'reset-request' && 'Recuperar senha'}
          {mode === 'reset-password' && 'Nova senha'}
        </h1>

        <p className="mt-2 text-slate-600">
          {mode === 'login' && 'Acesse sua evolução com segurança.'}
          {mode === 'signup' && 'Crie sua conta para começar sua jornada.'}
          {mode === 'reset-request' &&
            'Informe seu e-mail para receber o link de recuperação.'}
          {mode === 'reset-password' &&
            'Digite uma nova senha para sua conta.'}
        </p>

        <div className="mt-6 grid gap-3">
          {(mode === 'login' ||
            mode === 'signup' ||
            mode === 'reset-request') && (
            <input
              className="input"
              placeholder="E-mail"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          )}

          {(mode === 'login' || mode === 'signup') && (
            <input
              className="input"
              placeholder="Senha"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          )}

          {mode === 'reset-password' && (
            <>
              <input
                className="input"
                placeholder="Nova senha"
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
              />

              <input
                className="input"
                placeholder="Confirmar nova senha"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
            </>
          )}

          {(mode === 'login' || mode === 'signup') && (
            <button className="btn" disabled={loading} onClick={submit}>
              {loading
                ? 'Aguarde...'
                : mode === 'login'
                  ? 'Entrar'
                  : 'Cadastrar'}
            </button>
          )}

          {mode === 'reset-request' && (
            <button className="btn" disabled={loading} onClick={sendResetEmail}>
              {loading ? 'Enviando...' : 'Enviar link de recuperação'}
            </button>
          )}

          {mode === 'reset-password' && (
            <button className="btn" disabled={loading} onClick={updatePassword}>
              {loading ? 'Salvando...' : 'Alterar senha'}
            </button>
          )}

          {mode === 'login' && (
            <>
              <button
                className="btn-secondary"
                type="button"
                onClick={() => {
                  setMsg('');
                  setMode('signup');
                }}
              >
                Criar nova conta
              </button>

              <button
                className="text-sm font-semibold text-brand-700"
                type="button"
                onClick={() => {
                  setMsg('');
                  setMode('reset-request');
                }}
              >
                Esqueci minha senha
              </button>
            </>
          )}

          {mode === 'signup' && (
            <button
              className="btn-secondary"
              type="button"
              onClick={() => {
                setMsg('');
                setMode('login');
              }}
            >
              Já tenho conta
            </button>
          )}

          {(mode === 'reset-request' || mode === 'reset-password') && (
            <button
              className="btn-secondary"
              type="button"
              onClick={() => {
                setMsg('');
                setMode('login');
              }}
            >
              Voltar para login
            </button>
          )}

          {msg && <p className="rounded-2xl bg-slate-100 p-3 text-sm">{msg}</p>}
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-md px-4 py-16">
          <div className="card">
            <p className="text-slate-600">Carregando...</p>
          </div>
        </main>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
