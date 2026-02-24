'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { createClient } from '../supabase/client';

export type Profile = {
  id: string;
  username: string;
  email: string;
  avatar_url: string | null;
  display_name: string | null;
  role: 'user' | 'admin' | 'super-admin';
  updated_at: string | null;
};

interface UserProfileContextType {
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
  updateProfile: (
    updates: Partial<Profile>,
  ) => Promise<{ success: boolean; error?: string }>;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  logout: () => Promise<void>;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(
  undefined,
);

export function UserProfileProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoize supabase client to prevent unnecessary effect triggers
  const supabase = useMemo(() => createClient(), []);

  // Wrapped in useCallback to satisfy useEffect dependency requirements
  const fetchProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setProfile(null);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              email: user.email,
              username:
                user.user_metadata?.username ||
                user.email?.split('@')[0] ||
                'user',
              display_name: user.user_metadata?.display_name || null,
              role: 'user',
              updated_at: new Date().toISOString(),
            })
            .select()
            .single();

          if (createError) throw createError;
          setProfile(newProfile as Profile);
        } else {
          throw fetchError;
        }
      } else {
        setProfile(data as Profile);
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unknown error occurred';
      console.error('Error in fetchProfile:', err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Use underscore to indicate 'id' is intentionally ignored (destructured but not used)
      const { id: _id, ...safeUpdates } = updates;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          ...safeUpdates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setProfile((prev) => (prev ? { ...prev, ...safeUpdates } : null));
      return { success: true };
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to update profile';
      return { success: false, error: errorMessage };
    }
  };

  useEffect(() => {
    fetchProfile();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      fetchProfile();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchProfile, supabase]); // All dependencies now included

  // Logout function
  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setProfile(null); // Clear the state immediately
  }, [supabase]);

  const isAdmin = profile?.role === 'admin' || profile?.role === 'super-admin';
  const isSuperAdmin = profile?.role === 'super-admin';

  return (
    <UserProfileContext.Provider
      value={{
        profile,
        isLoading,
        error,
        refreshProfile: fetchProfile,
        updateProfile,
        isAdmin,
        isSuperAdmin,
        logout,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
}
