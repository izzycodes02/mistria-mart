import { checkUserRole } from '../helpers/rolesHelper';
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  console.log('MIDDLEWARE RUNNING FOR PATH:', request.nextUrl.pathname);
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANT: Do not move this. getUser() refreshes the session.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // --- ADMIN PROTECTED ROUTES LOGIC ---
  const isPathAdmin = request.nextUrl.pathname.startsWith('/admin');

  // Don't redirect if already on the login page to avoid redirect loops
  const isLoginPage = request.nextUrl.pathname === '/login/admin';

  if (isPathAdmin && !isLoginPage) {
    // 1. If not logged in at all, kick to admin login
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/login/admin';
      return NextResponse.redirect(url);
    }

    // 2. Check Role
    const { isAdmin } = await checkUserRole(user.id);

    // 3. If logged in but not an admin, kick to admin login with error
    if (!isAdmin) {
      const url = request.nextUrl.clone();
      url.pathname = '/login/admin';
      url.searchParams.set('error', 'unauthorized');
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
