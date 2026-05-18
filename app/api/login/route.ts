import { NextResponse } from 'next/server';

// Proxy endpoints removed: prefer using the Supabase client directly from the browser.
export async function POST() {
  return NextResponse.json({ message: 'This proxy endpoint was removed. Use Supabase client directly in the frontend.' }, { status: 410 });
}


