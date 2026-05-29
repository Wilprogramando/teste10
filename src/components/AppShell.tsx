'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Apple,
  BarChart3,
  Calculator,
  CalendarCheck,
  ChevronRight,
  Dumbbell,
  Home,
  LogOut,
  Menu,
  NotebookTabs,
  Salad,
  User,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { createClient } from '@/lib/supabaseClient';

const menuItems = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    description: 'Visão geral',
    icon: Home,
  },
  {
    href: '/meu-dia',
    label: 'Meu Dia',
    description: 'Rotina diária',
    icon: CalendarCheck,
  },
  {
    href: '/receitas',
    label: 'Receitas',
    description: 'Ideias saudáveis',
    icon: Salad,
  },
  {
    href: '/plano-alimentar',
    label: 'Plano alimentar',
    description: 'Refeições do dia',
    icon: Apple,
  },
  {
    href: '/treinos',
    label: 'Treinos',
    description: 'Plano de exercícios',
    icon: Dumbbell,
  },
  {
    href: '/progresso',
    label: 'Progresso',
    description: 'Evolução e medidas',
    icon: BarChart3,
  },
  {
    href: '/imc',
    label: 'Calculadora IMC',
    description: 'Peso ideal',
    icon: Calculator,
  },
  {
    href: '/perfil',
    label: 'Perfil',
    description: 'Dados pessoais',
    icon: User,
  },
];

function MenuLink({
  href,
  label,
  description,
  icon: Icon,
  onClick,
}: {
  href: string;
  label: string;
  description: string;
  icon: React.ElementType;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`group flex items-center gap-3 rounded-3xl p-3 transition ${
        active
          ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100'
          : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
      }`}
    >
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition ${
          active
            ? 'bg-white/20 text-white'
            : 'bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-emerald-700'
        }`}
      >
        <Icon size={21} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-black">{label}</p>
        <p
          className={`truncate text-xs font-medium ${
            active ? 'text-emerald-50' : 'text-slate-400'
          }`}
        >
          {description}
        </p>
      </div>

      <ChevronRight
        size={18}
        className={`shrink-0 transition ${
          active ? 'text-white' : 'text-slate-300 group-hover:text-emerald-600'
        }`}
      />
    </Link>
  );
}

function DesktopMenu({ onLogout }: { onLogout: () => void }) {
  return (
    <aside className="hidden h-fit md:sticky md:top-6 md:block">
      <div className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm">
        <div className="bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-500 p-5 text-white">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
            <NotebookTabs size={24} />
          </div>

          <h2 className="mt-4 text-xl font-black leading-tight">
            Jornada Seu Ademir
          </h2>

          <p className="mt-1 text-sm font-medium text-emerald-50">
            Área do aluno
          </p>
        </div>

        <nav className="grid gap-1 p-3">
          {menuItems.map((item) => (
            <MenuLink
              key={item.href}
              href={item.href}
              label={item.label}
              description={item.description}
              icon={item.icon}
            />
          ))}
        </nav>

        <div className="border-t border-slate-100 p-3">
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-3xl p-3 text-left text-slate-500 transition hover:bg-red-50 hover:text-red-600"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100">
              <LogOut size={20} />
            </div>

            <div>
              <p className="text-sm font-black">Sair</p>
              <p className="text-xs font-medium text-slate-400">
                Encerrar sessão
              </p>
            </div>
          </button>
        </div>
      </div>
    </aside>
  );
}

function MobileHeader({ onOpen }: { onOpen: () => void }) {
  const pathname = usePathname();

  const currentPage =
    menuItems.find(
      (item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
    ) ?? menuItems[0];

  const CurrentIcon = currentPage.icon;

  return (
    <div className="mb-6 rounded-[2rem] border border-slate-100 bg-white p-4 shadow-sm md:hidden">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            <CurrentIcon size={23} />
          </div>

          <div className="min-w-0">
            <p className="truncate text-xs font-black uppercase tracking-wide text-emerald-700">
              Jornada Seu Ademir
            </p>
            <p className="truncate text-sm font-semibold text-slate-500">
              {currentPage.label}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpen}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-100"
          aria-label="Abrir menu"
        >
          <Menu size={24} />
        </button>
      </div>
    </div>
  );
}

function MobileMenu({
  open,
  onClose,
  onLogout,
}: {
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <button
        type="button"
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Fechar menu"
      />

      <aside className="absolute left-0 top-0 h-full w-[86%] max-w-sm overflow-y-auto bg-white shadow-2xl">
        <div className="bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-500 p-6 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
                <NotebookTabs size={24} />
              </div>

              <h2 className="mt-4 text-2xl font-black leading-tight">
                Jornada Seu Ademir
              </h2>

              <p className="mt-1 text-sm font-medium text-emerald-50">
                Escolha uma área para continuar.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-white"
              aria-label="Fechar menu"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        <nav className="grid gap-1 p-4">
          {menuItems.map((item) => (
            <MenuLink
              key={item.href}
              href={item.href}
              label={item.label}
              description={item.description}
              icon={item.icon}
              onClick={onClose}
            />
          ))}
        </nav>

        <div className="border-t border-slate-100 p-4">
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-3xl bg-red-50 p-3 text-left text-red-600"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white">
              <LogOut size={20} />
            </div>

            <div>
              <p className="text-sm font-black">Sair</p>
              <p className="text-xs font-medium text-red-400">
                Encerrar sessão
              </p>
            </div>
          </button>
        </div>
      </aside>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/auth/login');
    router.refresh();
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 md:px-6">
      <MobileHeader onOpen={() => setMenuOpen(true)} />

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onLogout={handleLogout}
      />

      <div className="grid gap-6 md:grid-cols-[290px_1fr]">
        <DesktopMenu onLogout={handleLogout} />

        <section className="min-w-0">{children}</section>
      </div>
    </main>
  );
}
