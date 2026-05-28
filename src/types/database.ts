export type Goal = 'emagrecer'|'ganhar_massa'|'condicionamento'|'vida_saudavel';
export type Level = 'iniciante'|'intermediario'|'avancado';
export type Profile = { id:string; user_id:string; full_name:string; age:number; height_cm:number; initial_weight_kg:number; current_weight_kg:number; goal:Goal; level:Level; training_frequency:number; dietary_restrictions:string|null; health_notes:string|null; onboarding_completed:boolean; created_at:string; updated_at:string };
export type Recipe = { id:string; name:string; category:string; ingredients:string[]; preparation:string; prep_time_minutes:number; calories:number; protein_g:number; healthy_note:string; image_url:string|null };
export type ProgressStage = { id:number; name:string; description:string; motivational_message:string; unlock_days:number; required_completed_days:number; evolution_percent:number };
export type DailyProgress = { id:string; user_id:string; date:string; water_liters:number; workout_done:boolean; meals_ok:boolean; habit_done:boolean; completed:boolean; energy:number; mood:number; sleep_quality:number; notes:string|null };
