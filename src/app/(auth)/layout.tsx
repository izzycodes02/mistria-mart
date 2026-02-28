// app/(auth)/layout.tsx
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          return (await cookieStore).get(name)?.value;
        },
        set() {
          // Not needed in server components
        },
        remove() {
          // Not needed in server components
        },
      },
    },
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If user is logged in, redirect to home
  if (session) {
    redirect('/home');
  }

  return <>{children}</>;
}
