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
      <body>{children}</body>
    </html>
  );
}
