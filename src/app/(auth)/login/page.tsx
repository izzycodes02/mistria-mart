'use client';

import '@/styles/auth.scss';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { createClient } from '../../../../utils/supabase/client';
import { IconEye, IconEyeOff, IconLock, IconMail } from '@tabler/icons-react';
import { LoaderCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Input Components
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
          className={`authInput peer ${hasError ? "error" : ""}`}
          aria-describedby={hasError ? "email-error" : undefined}
          onFocus={(e) =>
            e.currentTarget.scrollIntoView({
              behavior: "smooth",
              block: "center",
            })
          }
        />
        <span
          className={`icon left ${hasError ? "error" : ""}`}
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
          className={`icon right rounded-md pl-3 outline-2 outline-bb-leaf ${hasError ? 'error' : ''}`}
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
      <p className="text-gray-600">Log in to</p>
      <Link
        href="/"
        className="rounded-md outline-mm-blue-mid flex gap-3 items-center"
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
export default function Login() {
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
  // const [serverError, setServerError] = useState<string | null>(null);
  // const error = searchParams.get('error');

  // mini functions
  const toggleRevealPw = () => {
    setPwRevealed((prev) => !prev);
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (authError) {
      setAuthError(null);
    }

    if (emailError) {
      setEmailError(null);
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (authError) {
      setAuthError(null);
    }
  };

  const hasEmailError = emailError !== null;
  const hasAuthError = authError !== null;



  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic Validation
    if (!email || !password) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    try {
      // Initialize Supabase client
      const supabase = createClient();

      // Attempt to sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      // Successful login - redirect to dashboard or home
      router.push('/dashboard');
      router.refresh(); // Refresh to update server components
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-dvh flex p-40 flex-col items-center">
      <Header />

      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex w-fit flex-col gap-4"
      >
        <EmailInput
          email={email}
          setEmail={handleEmailChange}
          hasError={hasEmailError || hasAuthError}
          errorMessage={emailError}
        />

        <PasswordInput
          password={password}
          setPassword={handlePasswordChange}
          pwRevealed={pwRevealed}
          toggleRevealPw={toggleRevealPw}
          hasError={hasAuthError}
        />

        <button
          type="submit"
          className="submitBtn mt-4 flex items-center justify-center gap-2"
          disabled={loading}
        >
          {loading ? (
            <>
              <LoaderCircle
                className="h-6 w-6 animate-spin"
                aria-hidden="true"
              />
              <span className="sr-only">Logging in...</span>
            </>
          ) : (
            'Log in'
          )}
        </button>
      </form>
    </div>
  );
}
