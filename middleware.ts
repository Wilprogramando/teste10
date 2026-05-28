import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
export async function middleware(request:NextRequest){let response=NextResponse.next({request});const supabase=createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,{cookies:{get:n=>request.cookies.get(n)?.value,set(n,v,o){request.cookies.set({name:n,value:v,...o});response=NextResponse.next({request});response.cookies.set({name:n,value:v,...o})},remove(n,o){request.cookies.set({name:n,value:'',...o});response=NextResponse.next({request});response.cookies.set({name:n,value:'',...o})}}});await supabase.auth.getUser();return response}
export const config={matcher:['/((?!_next/static|_next/image|favicon.ico).*)']}
