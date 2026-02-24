import { createClient } from '../supabase/client';

export type UserRole = 'user' | 'admin' | 'super-admin';

export interface UserWithRole {
  id: string;
  email: string;
  role: UserRole;
  username: string;
}

/**
 * Get the current user's role from the profiles table
 */
export async function getCurrentUserRole(): Promise<UserRole | null> {
  try {
    const supabase = createClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    // Get user's profile with role
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (error || !profile) {
      console.error('Error fetching user role:', error);
      return null;
    }

    return profile.role as UserRole;
  } catch (error) {
    console.error('Error in getCurrentUserRole:', error);
    return null;
  }
}

/**
 * Check if current user has admin access (admin or super-admin)
 */
export async function isAdmin(): Promise<boolean> {
  const role = await getCurrentUserRole();
  return role === 'admin' || role === 'super-admin';
}

/**
 * Check if current user is super-admin
 */
export async function isSuperAdmin(): Promise<boolean> {
  const role = await getCurrentUserRole();
  return role === 'super-admin';
}

/**
 * Get user's role by email (useful for login flow)
 */
export async function getUserRoleByEmail(
  email: string,
): Promise<UserRole | null> {
  try {
    const supabase = createClient();

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('email', email)
      .single();

    if (error || !profile) {
      console.error('Error fetching user role by email:', error);
      return null;
    }

    return profile.role as UserRole;
  } catch (error) {
    console.error('Error in getUserRoleByEmail:', error);
    return null;
  }
}

/**
 * Get complete user profile with role
 */
export async function getUserWithRole(
  userId?: string,
): Promise<UserWithRole | null> {
  try {
    const supabase = createClient();

    let targetUserId = userId;

    // If no userId provided, get current user
    if (!targetUserId) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return null;
      targetUserId = user.id;
    }

    // Get user profile with role
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, username, email, role')
      .eq('id', targetUserId)
      .single();

    if (error || !profile) {
      console.error('Error fetching user with role:', error);
      return null;
    }

    return {
      id: profile.id,
      email: profile.email,
      username: profile.username,
      role: profile.role as UserRole,
    };
  } catch (error) {
    console.error('Error in getUserWithRole:', error);
    return null;
  }
}

/**
 * Require admin access - redirects if not admin
 * Use this in admin pages/layouts
 */
export async function requireAdmin(
  redirectTo: string = '/auth/admin-login',
): Promise<boolean> {
  const admin = await isAdmin();

  if (!admin) {
    if (typeof window !== 'undefined') {
      window.location.href = redirectTo;
    }
    return false;
  }

  return true;
}

/**
 * Check if a specific user has admin role
 */
export async function checkUserRole(userId: string): Promise<{
  isAdmin: boolean;
  isSuperAdmin: boolean;
  role: UserRole | null;
}> {
  try {
    const supabase = createClient();

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (error || !profile) {
      return { isAdmin: false, isSuperAdmin: false, role: null };
    }

    const role = profile.role as UserRole;
    return {
      role,
      isAdmin: role === 'admin' || role === 'super-admin',
      isSuperAdmin: role === 'super-admin',
    };
  } catch (error) {
    console.error('Error in checkUserRole:', error);
    return { isAdmin: false, isSuperAdmin: false, role: null };
  }
}
