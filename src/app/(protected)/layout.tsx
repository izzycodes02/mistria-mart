import { createClient } from '../../../utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // Check for error or no user
  if (error || !user) {
    redirect('/login');
  }

  return (
    <div className="flex h-screen">
      <nav>
        {/* Sidebar with user info */}
        <div>Welcome, {user.email}</div>
      </nav>
      <main className="flex-1">{children}</main>
    </div>
  );
}
