export function stageFromDays(days:number){return Math.min(10, Math.max(1, Math.floor(days/3)+1))}
export function percentFromDays(days:number){return Math.min(100, Math.round((days/28)*100))}
export const goalLabel:Record<string,string>={emagrecer:'Emagrecer',ganhar_massa:'Ganhar massa muscular',condicionamento:'Melhorar condicionamento',vida_saudavel:'Vida saudável'};
export const motivationalMessages=['Sua nova versão nasce nas pequenas escolhas.','Consistência vence intensidade aleatória.','Hoje é mais um voto na pessoa que você quer ser.','Disciplina é liberdade para viver melhor.'];
