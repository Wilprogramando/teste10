import { Sidebar } from './Sidebar';
export function AppShell({children}:{children:React.ReactNode}){return <main className="mx-auto grid max-w-6xl gap-6 px-4 py-8 md:grid-cols-[240px_1fr]"><Sidebar/><section>{children}</section></main>}
