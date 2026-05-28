'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/meu-dia', label: 'Meu Dia' },
  { href: '/receitas', label: 'Receitas' },
  { href: '/plano-alimentar', label: 'Plano alimentar' },
  { href: '/treinos', label: 'Treinos' },
  { href: '/progresso', label: 'Progresso' },
  { href: '/perfil', label: 'Perfil' },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-6 flex items-center justify-between rounded-3xl border border-slate-100 bg-white p-4 shadow-soft md:hidden">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
            Jornada Seu Ademir
          </p>
          <p className="text-sm text-slate-500">Área do aluno</p>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-white"
          aria-label="Abrir menu"
        >
          <Menu size={22} />
        </button>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/50"
            onClick={() => setMenuOpen(false)}
            aria-label="Fechar menu"
          />

          <aside className="absolute left-0 top-0 h-full w-[82%] max-w-xs bg-white p-6 shadow-2xl">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="text-lg font-black text-emerald-700">
                  Jornada Seu Ademir
                </p>
                <p className="text-sm text-slate-500">Menu</p>
              </div>

              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700"
                aria-label="Fechar menu"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="grid gap-2">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-2xl px-4 py-4 text-base font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-[240px_1fr]">
        <aside className="card hidden h-fit md:sticky md:top-24 md:block">
          <p className="mb-4 font-black text-brand-700">Menu</p>

          <nav className="grid gap-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-2xl px-4 py-3 text-slate-700 hover:bg-brand-50 hover:text-brand-700"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <section className="min-w-0">{children}</section>
      </div>
    </main>
  );
}
