'use client';

import '@/styles/auth.scss';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { IconEye, IconEyeOff, IconLock, IconMail } from '@tabler/icons-react';
import { LoaderCircle } from 'lucide-react';
import Image from 'next/image';
import { createClient } from 'utils/supabase/client';
import { getUserRoleByEmail, UserRole } from 'utils/helpers/rolesHelper';

// Input Components (keep these the same)
function EmailInput({
  email,
  setEmail,
  hasError,
}: {
  email: string;
  setEmail: (value: string) => void;
  hasError: boolean;
  errorMessage: string | null;
}) {
  return (
    <section className="flex flex-col gap-1">
      <label htmlFor="email" className="font-semibold text-gray-500 text-sm">
        Email
      </label>
      <div className="relative">
        <input
          id="email"
          type="text"
          placeholder="name@example.com"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`authInput peer ${hasError ? 'error' : ''}`}
          aria-describedby={hasError ? 'email-error' : undefined}
          onFocus={(e) =>
            e.currentTarget.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            })
          }
        />
        <span
          className={`icon left ${hasError ? 'error' : ''}`}
          aria-hidden="true"
        >
          <IconMail size={16} className="stroke-current" focusable={false} />
        </span>
      </div>
    </section>
  );
}

function PasswordInput({
  password,
  setPassword,
  pwRevealed,
  toggleRevealPw,
  hasError,
}: {
  password: string;
  setPassword: (value: string) => void;
  pwRevealed: boolean;
  toggleRevealPw: () => void;
  hasError: boolean;
}) {
  return (
    <section className="flex flex-col gap-1">
      <label
        htmlFor="password"
        className="font-semibold text-gray-500  text-sm"
      >
        Password
      </label>
      <div className="relative">
        <input
          id="password"
          value={password}
          placeholder="enter your password"
          type={pwRevealed ? 'text' : 'password'}
          onChange={(e) => setPassword(e.target.value)}
          className={`authInput password peer ${hasError ? 'error' : ''}`}
          aria-describedby={hasError ? 'password-help' : undefined}
          onFocus={(e) =>
            e.currentTarget.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            })
          }
        />
        <span
          className={`icon left ${hasError ? 'error' : ''}`}
          aria-hidden="true"
        >
          <IconLock size={16} className="stroke-current" focusable={false} />
        </span>

        <button
          type="button"
          onClick={toggleRevealPw}
          className={`icon right rounded-md pl-3 outline-2 outline-blue-500 ${hasError ? 'error' : ''}`}
          aria-label={pwRevealed ? 'Hide password' : 'Show password'}
          title={pwRevealed ? 'Hide password' : 'Show password'}
          aria-pressed={pwRevealed}
        >
          {pwRevealed ? (
            <IconEye size={16} className="stroke-current" />
          ) : (
            <IconEyeOff size={16} className="stroke-current" />
          )}
        </button>
      </div>
    </section>
  );
}

function Header() {
  return (
    <section className="mb-8 flex flex-col items-center gap-1">
      <p className="text-gray-600">Admin Access Only</p>
      <Link
        href="/"
        className="rounded-md outline-blue-500 flex gap-3 items-center"
      >
        <Image
          src="/icons/mistriamart_x192.png"
          alt="icon"
          width={32}
          height={32}
          className="mb-[2px]"
        />
        <h2 className="text-4xl font-black text-mm-blue-mid">Mistria Mart</h2>
      </Link>
    </section>
  );
}

// Main Function to render
export default function AdminLogin() {
  const router = useRouter();

  // State Management
  const [pwRevealed, setPwRevealed] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Error States
  const [emailError, setEmailError] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  // mini functions
  const toggleRevealPw = () => {
    setPwRevealed((prev) => !prev);
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setAuthError(null);
    setEmailError(null);
    setError(null);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setAuthError(null);
    setError(null);
  };

  const hasEmailError = emailError !== null;
  const hasAuthError = authError !== null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setAuthError(null);

    // Basic Validation
    if (!email || !password) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    try {
      // Initialize Supabase client
      const supabase = createClient();

      // Step 1: Check if user has admin role BEFORE attempting login
      // This saves an unnecessary auth attempt if they're not an admin
      const userRole = await getUserRoleByEmail(email);

      // If user doesn't exist or isn't an admin, show error
      if (!userRole) {
        setError('No account found with this email.');
        setLoading(false);
        return;
      }

      if (userRole !== 'admin' && userRole !== 'super-admin') {
        setError('Access denied. This area is for administrators only.');
        setLoading(false);
        return;
      }

      // Step 2: Attempt to sign in (now we know they're an admin)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Handle specific auth errors
        if (error.message.includes('Invalid login credentials')) {
          setError('Invalid email or password.');
        } else {
          setError(error.message);
        }
        throw error;
      }

      // Step 3: Double-check the role after login (extra security)
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profileError || !profile) {
        console.error('Error fetching profile after login:', profileError);
        // Still log them out for security
        await supabase.auth.signOut();
        setError('Account configuration error. Please contact support.');
        setLoading(false);
        return;
      }

      const finalRole = profile.role as UserRole;

      // Final role verification
      if (finalRole !== 'admin' && finalRole !== 'super-admin') {
        // User's role was changed after login check? Sign them out
        await supabase.auth.signOut();
        setError(
          'Your account no longer has admin access. Please contact support.',
        );
        setLoading(false);
        return;
      }

      // Log admin login for audit purposes (optional)
      console.log(
        `Admin login successful: ${email} (${finalRole}) at ${new Date().toISOString()}`,
      );

      // Redirect based on role (maybe different dashboards for admin vs super-admin)
      if (finalRole === 'super-admin' || finalRole === 'admin') {
        router.push('/admin');
      }

      router.refresh(); // Refresh to update server components
    } catch (err: any) {
      // Error already set in specific cases, this is for unexpected errors
      if (!error) {
        setError('An unexpected error occurred. Please try again.');
      }
      console.error('Admin login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4">
      <div className="w-full flex flex-col items-center">
        <Header />

        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-4"
        >
          <EmailInput
            email={email}
            setEmail={handleEmailChange}
            hasError={hasEmailError || hasAuthError || !!error}
            errorMessage={emailError}
          />

          <PasswordInput
            password={password}
            setPassword={handlePasswordChange}
            pwRevealed={pwRevealed}
            toggleRevealPw={toggleRevealPw}
            hasError={hasAuthError || !!error}
          />

          {/* Error Display */}
          {error && (
            <div className="text-sm text-red-500 text-center p-2 bg-red-50 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="submitBtn mt-2 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <>
                <LoaderCircle
                  className="h-5 w-5 animate-spin"
                  aria-hidden="true"
                />
                <span>Verifying admin access...</span>
              </>
            ) : (
              'Access Admin Area'
            )}
          </button>

          <p className="mt-4 text-center text-sm text-gray-600">
            Regular user?{' '}
            <Link
              href="/login"
              className="font-medium text-mm-blue-mid hover:text-mm-blue-mid-dark hover:underline"
            >
              Go to user login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
