import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import type { NextRequest } from 'next/server'

export async function proxy(req: NextRequest) {
  const res = NextResponse.next()

  const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll() {
            return req.cookies.getAll()
          },
          setAll() {},
        },
      }
  )

  const {data: { user }} = await supabase.auth.getUser()

  if (!user) return NextResponse.redirect(new URL('/login', req.url))

  return res
}

export const config = {
  matcher: ['/auth/:path*']
}