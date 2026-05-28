import './globals.css';
import type { Metadata } from 'next';
import { Header } from '@/components/Header';
export const metadata: Metadata = { title:'Fit Transformação', description:'SaaS motivacional de vida fitness com Supabase' };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="pt-BR"><body><Header/>{children}</body></html>}
