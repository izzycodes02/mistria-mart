'use client';

import '@/styles/auth.scss';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { createClient } from '../../../../utils/supabase/client';
import {
  IconEye,
  IconEyeOff,
  IconLock,
  IconMail,
  IconUser,
} from '@tabler/icons-react';
import { LoaderCircle, Check, X, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// --- Helper Components (Outside main render) ---

const CheckItem = ({
  condition,
  text,
  password,
}: {
  condition: boolean;
  text: string;
  password: string;
}) => (
  <span
    className={`pwCheck flex items-center gap-1 text-xs ${
      password
        ? condition
          ? 'text-green-600'
          : 'text-red-500'
        : 'text-gray-400'
    }`}
  >
    {password ? (
      condition ? (
        <Check size={14} strokeWidth={2.5} />
      ) : (
        <X size={14} strokeWidth={2.5} />
      )
    ) : (
      <ChevronRight size={14} />
    )}
    {text}
  </span>
);

function PasswordStrengthIndicator({ password }: { password: string }) {
  const passwordChecks = {
    hasLength: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSymbol: /[^A-Za-z0-9]/.test(password),
  };

  return (
    <div
      id="password-help"
      aria-live="polite"
      className="mt-1.5 flex flex-col gap-0.5 text-sm"
    >
      <CheckItem
        condition={passwordChecks.hasLength}
        text="At least 8 characters"
        password={password}
      />
      <CheckItem
        condition={passwordChecks.hasUpper}
        text="1 uppercase letter"
        password={password}
      />
      <CheckItem
        condition={passwordChecks.hasLower}
        text="1 lowercase letter"
        password={password}
      />
      <CheckItem
        condition={passwordChecks.hasNumber}
        text="1 number"
        password={password}
      />
      <CheckItem
        condition={passwordChecks.hasSymbol}
        text="1 symbol"
        password={password}
      />
    </div>
  );
}

function ValidationBox({
  message,
  id,
}: {
  message: string | null;
  id?: string;
}) {
  if (!message) return null;
  return (
    <div
      id={id}
      role="alert"
      aria-live="polite"
      className="text-sm text-red-500 mt-1"
    >
      <p>{message}</p>
    </div>
  );
}

function Header() {
  return (
    <section className="mb-8 flex flex-col items-center gap-1">
      <p className="text-gray-600">Create an account for</p>
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

// --- Input Components (for better organization) ---

function EmailInput({
  email,
  onChange,
  error,
}: {
  email: string;
  onChange: (value: string) => void;
  error: string | null;
}) {
  return (
    <section className="flex flex-col gap-1">
      <label className="font-semibold text-gray-500 text-sm">Email</label>
      <div className="relative">
        <input
          type="email"
          value={email}
          onChange={(e) => onChange(e.target.value)}
          className={`authInput ${error ? 'error' : ''}`}
          placeholder="name@example.com"
        />
        <span className="icon left">
          <IconMail size={16} />
        </span>
      </div>
      <ValidationBox message={error} />
    </section>
  );
}

function UsernameInput({
  username,
  onChange,
  error,
}: {
  username: string;
  onChange: (value: string) => void;
  error: string | null;
}) {
  return (
    <section className="flex flex-col gap-1">
      <label className="font-semibold text-gray-500 text-sm">Username</label>
      <div className="relative">
        <input
          type="text"
          value={username}
          onChange={(e) => onChange(e.target.value.toLowerCase())}
          className={`authInput ${error ? 'error' : ''}`}
          placeholder="cooluser123"
        />
        <span className="icon left">
          <IconUser size={16} />
        </span>
      </div>
      <ValidationBox message={error} />
    </section>
  );
}

function PasswordInput({
  password,
  onChange,
  error,
  pwRevealed,
  toggleReveal,
}: {
  password: string;
  onChange: (value: string) => void;
  error: string | null;
  pwRevealed: boolean;
  toggleReveal: () => void;
}) {
  return (
    <section className="flex flex-col gap-1">
      <label className="font-semibold text-gray-500 text-sm">Password</label>
      <div className="relative">
        <input
          type={pwRevealed ? 'text' : 'password'}
          value={password}
          onChange={(e) => onChange(e.target.value)}
          className={`authInput ${error ? 'error' : ''}`}
          placeholder="strong password"
        />
        <span className="icon left">
          <IconLock size={16} />
        </span>
        <button type="button" onClick={toggleReveal} className="icon right">
          {pwRevealed ? <IconEye size={16} /> : <IconEyeOff size={16} />}
        </button>
      </div>
      <PasswordStrengthIndicator password={password} />
      <ValidationBox message={error} />
    </section>
  );
}

// --- Validation Logic ---

const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return 'Email is required';
  if (!emailRegex.test(email)) return 'Please enter a valid email address';
  return null;
};

const validateUsername = (username: string): string | null => {
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  if (!username) return 'Username is required';
  if (username.length < 3) return 'Username must be at least 3 characters';
  if (username.length > 30) return 'Username must be less than 30 characters';
  if (!usernameRegex.test(username))
    return 'Only letters, numbers, and underscores';
  return null;
};

const validatePassword = (password: string): string | null => {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(password))
    return 'Password must contain an uppercase letter';
  if (!/[a-z]/.test(password))
    return 'Password must contain a lowercase letter';
  if (!/[0-9]/.test(password)) return 'Password must contain a number';
  if (!/[^A-Za-z0-9]/.test(password)) return 'Password must contain a symbol';
  return null;
};

// --- Main Component ---

export default function SignUp() {
  const router = useRouter();

  const [pwRevealed, setPwRevealed] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [emailError, setEmailError] = useState<string | null>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const eErr = validateEmail(email);
    const uErr = validateUsername(username);
    const pErr = validatePassword(password);
    setEmailError(eErr);
    setUsernameError(uErr);
    setPasswordError(pErr);
    return !eErr && !uErr && !pErr;
  };

  const isFormValid = () => {
    return (
      email &&
      username &&
      password &&
      !validateEmail(email) &&
      !validateUsername(username) &&
      !validatePassword(password)
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setGeneralError(null);

    try {
      const supabase = createClient();

      // Step 1: Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        // options: {
        //   data: {
        //     username,
        //     display_name: username,
        //   },
        // },
      });

      if (error) throw error;

      // Step 2: If user was created successfully, create profile
      if (data.user) {
        const { error: profileError } = await supabase.from('profiles').insert({
          id: data.user.id,
          username,
          email,
          role: 'user', // Default role
          updated_at: new Date().toISOString(),
        });

        if (profileError) {
          console.error('Profile creation error details:', {
            message: profileError.message,
            details: profileError.details,
            hint: profileError.hint,
            code: profileError.code,
          });

          // Show more specific error message
          if (
            profileError.message?.includes('relation "profiles" does not exist')
          ) {
            setGeneralError(
              'Database setup incomplete. Please run the SQL setup first.',
            );
          } else if (profileError.code === '23505') {
            // Unique violation
            setGeneralError('Username already taken. Please choose another.');
          } else if (profileError.code === '23502') {
            // Not null violation
            setGeneralError('Missing required profile information.');
          } else {
            setGeneralError(
              'Account created but profile setup failed. Please contact support.',
            );
          }
        }
      }

      // Step 3: Handle redirect based on email confirmation
      if (data.user && !data.session) {
        // Email confirmation required
        router.push('/auth/verify-email?email=' + encodeURIComponent(email));
      } else {
        // Auto-confirmed or already have session
        // router.push('/dashboard');
        // router.refresh();
        console.log('Signup successful, but email confirmation status is unclear. Please check your email for confirmation link if required.');
      }
    } catch (err: unknown) {
      console.error('Signup error:', err);

      // Handle specific error types
      if (err instanceof Error) {
        if (err.message.includes('User already registered')) {
          setEmailError(
            'This email is already registered. Please log in instead.',
          );
        } else if (err.message.includes('password')) {
          setPasswordError(err.message);
        } else {
          setGeneralError(err.message || 'Signup failed. Please try again.');
        }
      } else {
        setGeneralError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setEmailError(null);
    setGeneralError(null);
  };

  const handleUsernameChange = (value: string) => {
    setUsername(value);
    setUsernameError(null);
    setGeneralError(null);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setPasswordError(null);
    setGeneralError(null);
  };

  const togglePasswordReveal = () => {
    setPwRevealed(!pwRevealed);
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md flex flex-col items-center">
        <Header />

        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-4 w-fit"
        >
          <EmailInput
            email={email}
            onChange={handleEmailChange}
            error={emailError}
          />

          <UsernameInput
            username={username}
            onChange={handleUsernameChange}
            error={usernameError}
          />

          <PasswordInput
            password={password}
            onChange={handlePasswordChange}
            error={passwordError}
            pwRevealed={pwRevealed}
            toggleReveal={togglePasswordReveal}
          />

          {generalError && (
            <div className="text-sm text-red-500 text-center p-2 bg-red-50 rounded">
              {generalError}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !isFormValid()}
            className="submitBtn mt-4 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <LoaderCircle className="h-5 w-5 animate-spin" />
                <span>Creating account...</span>
              </>
            ) : (
              'Sign up'
            )}
          </button>

          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              href="/auth/login"
              className="font-medium text-mm-blue-mid hover:text-mm-blue-mid-dark hover:underline"
            >
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
