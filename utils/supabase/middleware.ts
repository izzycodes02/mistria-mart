import { checkUserRole } from '../helpers/rolesHelper';
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';


export async function updateSession(request: NextRequest) {
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

  if (isPathAdmin) {
    // 1. If not logged in at all, kick to login
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/auth/admin-login';
      return NextResponse.redirect(url);
    }

    // 2. Check Role
    const { isAdmin } = await checkUserRole(user.id);

    // 3. If logged in but not an admin, kick to login with error
    if (!isAdmin) {
      const url = request.nextUrl.clone();
      url.pathname = '/auth/admin-login';
      url.searchParams.set('error', 'unauthorized');
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
