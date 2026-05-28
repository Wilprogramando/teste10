import Link from 'next/link';
const items=[['/dashboard','Dashboard'],['/meu-dia','Meu Dia'],['/receitas','Receitas'],['/plano-alimentar','Plano alimentar'],['/treinos','Treinos'],['/progresso','Progresso'],['/perfil','Perfil']];
export function Sidebar(){return <aside className="card h-fit md:sticky md:top-24"><p className="mb-4 font-black text-brand-700">Menu</p><div className="grid gap-2">{items.map(([href,label])=><Link key={href} href={href} className="rounded-2xl px-4 py-3 hover:bg-brand-50">{label}</Link>)}</div></aside>}
