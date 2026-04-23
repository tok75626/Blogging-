import { NextResponse } from 'next/server';

export function middleware(request) {
  const refreshToken = request.cookies.get('refreshToken')?.value;
  const { pathname } = request.nextUrl;

  // Protected routes
  const isProtectedRoute = pathname.startsWith('/dashboard') || 
                          pathname.startsWith('/posts/create') || 
                          pathname.startsWith('/posts/edit');

  if (isProtectedRoute && !refreshToken) {
    const url = new URL('/login', request.url);
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  // Redirect to dashboard if logged in and trying to access auth pages
  const isAuthPage = pathname === '/login' || pathname === '/register';
  if (isAuthPage && refreshToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/posts/create', '/posts/edit/:path*', '/login', '/register'],
};
