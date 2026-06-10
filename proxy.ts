import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export const proxy = auth((request) => {
  if (process.env.DEV_BYPASS_AUTH === 'true') {
    return NextResponse.next()
  }
  if (!request.auth) {
    return NextResponse.redirect(new URL('/', request.url))
  }
})

export const config = {
  matcher: ['/dashboard/:path*'],
}
