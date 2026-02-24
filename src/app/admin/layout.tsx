'use client';

import '@/styles/navigation.scss';
import Link from 'next/link';
import { useState } from 'react';
import {
  UserProfileProvider,
} from 'utils/providers/UserProfileProvider';
import { AdminSidebar } from '@/components/ui/navigation/AdminSidebar';

// ============================================================================
// MAIN CONTENT COMPONENT (uses the profile hook)
// ============================================================================

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="h-dvh w-full bg-mm-blue-lighter flex p-2">
      <AdminSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <main className="grow h-full p-3">
        <div className="bg-white border border-zinc-200 h-full rounded-lg shadow-sm px-8 pt-6 pb-10 overflow-auto hide-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
}

// ============================================================================
// LAYOUT COMPONENT (wraps with provider)
// ============================================================================

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <UserProfileProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </UserProfileProvider>
  );
}
