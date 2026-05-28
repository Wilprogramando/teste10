import Link from 'next/link';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Jornada Seu Ademir',
  description:
    'Sistema de vida saudável, exercícios, alimentação e acompanhamento de progresso.',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
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

        {children}
      </body>
    </html>
  );
}
