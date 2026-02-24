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

    if (!email || !password) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();

      // STEP 1: Attempt Login First
      // This establishes the session so RLS will now let us read the profile
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (authError) {
        if (authError.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password.');
        }
        throw authError;
      }

      // STEP 2: Now that we are authed, check the role using the UID
      // Use the ID, not the email, for better performance/security
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authData.user.id)
        .single();

      if (profileError || !profile) {
        await supabase.auth.signOut();
        throw new Error('Account configuration error. Please contact support.');
      }

      const role = profile.role as UserRole;

      // STEP 3: Verify Admin Status
      if (role !== 'admin' && role !== 'super-admin') {
        // Not an admin? Kick them out immediately
        await supabase.auth.signOut();
        throw new Error('Access denied. This area is for administrators only.');
      }

      // Success! Redirect
      router.push('/admin');
      router.refresh();
    } catch (err) {
      // Defaults to 'unknown' in modern TS
      // Error already set in specific cases, this is for unexpected errors
      if (!error) {
        // Check if it's a standard Error object to get the message
        const message =
          err instanceof Error ? err.message : 'An unexpected error occurred.';
        setError(message);
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
