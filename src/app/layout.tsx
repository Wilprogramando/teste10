'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './globals.css';

const privateRoutes = [
  '/dashboard',
  '/meu-dia',
  '/receitas',
  '/plano-alimentar',
  '/treinos',
  '/progresso',
  '/perfil',
  '/onboarding',
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideHeader = privateRoutes.some((route) => pathname.startsWith(route));

  return (
    <html lang="pt-BR">
      <head>
        <title>Jornada Seu Ademir</title>
        <meta
          name="description"
          content="Sistema de vida saudável, exercícios, alimentação e acompanhamento de progresso."
        />
        <link rel="icon" href="/favicon.svg" />
      </head>

      <body>
        {!hideHeader && (
          <header className="border-b bg-white/80 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
              <Link href="/" className="text-xl font-black text-emerald-700">
                Jornada Seu Ademir
              </Link>

              <Link
                href="/auth/login"
                className="text-sm font-bold text-emerald-700"
              >
                Entrar
              </Link>
            </div>
          </header>
        )}

        {children}
      </body>
    </html>
  );
}
