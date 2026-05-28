import type { Config } from 'tailwindcss';
const config: Config = { content: ['./src/**/*.{ts,tsx}'], theme: { extend: { colors: { brand: {50:'#ecfdf5',100:'#d1fae5',500:'#10b981',600:'#059669',700:'#047857'}, ink:'#10201a' }, boxShadow: { soft:'0 18px 45px rgba(16,185,129,.12)' } } }, plugins: [] };
export default config;
