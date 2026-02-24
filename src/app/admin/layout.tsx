'use client';

import {
  Boxes,
  Carrot,
  ChefHat,
  Fish,
  Milk,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Image from 'next/image';
import {
  IconHome2,
  IconLogout,
  IconSearch,
  IconUser,
  IconUserBolt,
  IconUsers,
} from '@tabler/icons-react';
import '@/styles/navigation.scss';
import Link from 'next/link';
import { useState } from 'react';
import clsx from 'clsx';

// ============================================================================
// CONSTANTS & CONFIG
// ============================================================================

const DISPLAY_NAME = 'IsabelleZen';
const USERNAME = 'Username0000';
const PROFILE_IMAGE_URL =
  'https://i.pinimg.com/1200x/09/82/a0/0982a02c7590f58ba0891a951276d964.jpg';

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

const Logo = ({ isCollapsed }: { isCollapsed: boolean }) => (
  <Link
    href="/"
    className={clsx(
      'flex gap-2 items-center justify-center w-full mb-3 transition-all duration-300',
      isCollapsed ? 'flex-col' : '',
    )}
  >
    <Image
      src="/icons/mistriamart_x192.png"
      alt="icon"
      width={isCollapsed ? 32 : 26}
      height={isCollapsed ? 32 : 26}
      className="mb-1"
    />
    {!isCollapsed && (
      <p className="text-xl font-bold text-mm-blue-mid">MistriaMart Admin</p>
    )}
  </Link>
);

const UserProfile = ({ isCollapsed }: { isCollapsed: boolean }) => (
  <div
    className={clsx(
      'flex w-full p-2 border border-zinc-300 rounded-md items-center shadow-sm bg-white transition-all duration-300',
      isCollapsed ? 'justify-center' : 'gap-3',
    )}
  >
    <Image
      src={PROFILE_IMAGE_URL}
      alt="User's profile image"
      width={20}
      height={20}
      className={clsx('rounded-full', isCollapsed ? 'w-10 h-10' : 'w-12 h-12')}
    />
    {!isCollapsed && (
      <div className="flex flex-col">
        <p className="font-semibold">{DISPLAY_NAME}</p>
        <p className="text-black/50">{USERNAME}</p>
      </div>
    )}
  </div>
);

// ============================================================================
// NAVIGATION DATA & SECTIONS
// ============================================================================

const GAME_DATA_ITEMS = [
  { icon: Carrot, label: 'Crops', href: '/admin/crops' },
  { icon: Fish, label: 'Fish', href: '/admin/fish' },
  { icon: Milk, label: 'Ingredients', href: '/admin/ingredients' },
  { icon: ChefHat, label: 'Recipes', href: '/admin/recipes' },
] as const;

const USER_ITEMS = [
  { icon: IconUser, label: 'All Users', url: '/admin/users' },
  { icon: IconUserBolt, label: 'Admins', url: '/admin/admins' },
] as const;

const DashboardHomeSection = ({ isCollapsed }: { isCollapsed: boolean }) => (
  <div className="mt-3">
    <Link
      href="/admin"
      title={isCollapsed ? 'Dashboard' : undefined}
      className={clsx('leftSideBarItems', isCollapsed && 'justify-center px-2')}
    >
      <IconHome2
        className={`${isCollapsed ? 'stroke-[1.75] w-5.5' : 'stroke-[1.5] w-4.5'}`}
      />
      {!isCollapsed && <p className="font-medium">Main Dashboard</p>}
    </Link>
  </div>
);

const GameDataSection = ({ isCollapsed }: { isCollapsed: boolean }) => (
  <div className="mt-3">
    <div className="relative">
      {!isCollapsed ? (
        <div className="flex gap-1 text-zinc-500/60 mb-1 text-sm items-center pl-2">
          <Boxes className="stroke-[1.75] w-4" />
          <p className="font-bold">Game Data</p>
        </div>
      ) : (
        <div className="border-t border-zinc-200 my-2" />
      )}
    </div>
    <div className={`flex flex-col ${isCollapsed ? 'gap-4' : 'gap-0.5'}`}>
      {GAME_DATA_ITEMS.map(({ icon: Icon, label, href }) => (
        <Link
          href={href}
          key={label}
          className={clsx(
            'leftSideBarItems',
            isCollapsed && 'justify-center px-2',
          )}
          title={isCollapsed ? label : undefined}
        >
          <Icon
            className={`${isCollapsed ? 'stroke-[1.75] w-5.5' : 'stroke-[1.5] w-4.5'}`}
          />
          {!isCollapsed && <p className="font-medium">{label}</p>}
        </Link>
      ))}
    </div>
  </div>
);

const UsersSection = ({ isCollapsed }: { isCollapsed: boolean }) => (
  <div className="mt-3">
    <div className="relative">
      {!isCollapsed ? (
        <div className="flex gap-1 text-zinc-500/60 mb-1 text-sm items-center pl-2">
          <IconUsers className="stroke-[2] w-4" />
          <p className="font-bold">Users</p>
        </div>
      ) : (
        <div className="border-t border-zinc-200 my-2" />
      )}
    </div>
    <div className={`flex flex-col ${isCollapsed ? 'gap-4' : 'gap-0.5'}`}>
      {USER_ITEMS.map(({ icon: Icon, label, url }) => (
        <Link
          href={url}
          key={label}
          className={clsx(
            'leftSideBarItems',
            isCollapsed && 'justify-center px-2',
          )}
          title={isCollapsed ? label : undefined}
        >
          <Icon
            className={`${isCollapsed ? 'stroke-[1.75] w-5.5' : 'stroke-[1.5] w-4.5'}`}
          />
          {!isCollapsed && <p className="font-medium">{label}</p>}
        </Link>
      ))}
    </div>
  </div>
);

const LogoutButton = ({ isCollapsed }: { isCollapsed: boolean }) => (
  <Link href="/">
    <div
      className={clsx(
        'leftSideBarItems logOut',
        isCollapsed && 'justify-center px-2',
      )}
    >
      <IconLogout className="stroke-[2] w-4.5" />
      {!isCollapsed && <p className="font-medium">Log out</p>}
    </div>
  </Link>
);

const ToggleNavButton = ({
  isCollapsed,
  setIsCollapsed,
}: {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}) => (
  <button
    onClick={() => setIsCollapsed(!isCollapsed)}
    className="absolute -right-7 top-8 z-10 bg-white border border-zinc-300 rounded-full p-1 shadow-md hover:bg-mm-blue-lightest transition-all duration-300"
  >
    {isCollapsed ? (
      <ChevronRight className="w-4 h-4" />
    ) : (
      <ChevronLeft className="w-4 h-4" />
    )}
  </button>
);

const SearchBar = ({
  isCollapsed,
  searchValue,
  setSearchValue,
  setIsCollapsed,
}: {
  isCollapsed: boolean;
  searchValue: string;
  setSearchValue: (value: string) => void;
  setIsCollapsed: (value: boolean) => void;
}) => (
  <div className={`w-full relative ${isCollapsed ? 'NavSearchBar' : ''}`}>
    <input
      type="text"
      placeholder={isCollapsed ? '' : 'Search...'}
      value={isCollapsed ? '' : searchValue}
      readOnly={isCollapsed}
      onChange={(e) => setSearchValue(e.target.value)}
      className={`w-full relative rounded-md border border-zinc-300 bg-white/60 focus:bg-white focus:shadow-sm mt-3 transition-all outline-none placeholder:text-slate-400 duration-300 text-sm ${isCollapsed ? 'p-3 py-1.5 cursor-pointer hover:bg-white hover:shadow-sm' : 'pr-3 pl-7 py-1.5'}`}
      onClick={() => isCollapsed && setIsCollapsed(false)}
    />
    <IconSearch
      className={`absolute ${isCollapsed ? 'left-5.5 top-4.5 w-5 h-5 cursor-pointer' : 'left-2 top-5.5 w-3.5 h-3.5 text-slate-400'}`}
      onClick={() => isCollapsed && setIsCollapsed(false)}
    />
  </div>
);

// ============================================================================
// LAYOUT COMPONENT
// ============================================================================

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  // No more async auth checks here!
  // Middleware handles the redirect before this component even loads.

  return (
    <div className="h-dvh w-full bg-mm-blue-lighter flex p-2">
      <nav
        className={clsx(
          'h-full flex gap-3 flex-col transition-all duration-300 relative',
          isCollapsed ? 'w-20' : 'w-60',
        )}
      >
        <ToggleNavButton
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />

        <div
          className={clsx(
            'flex-1 flex flex-col py-3 pt-7',
            isCollapsed ? 'px-2' : 'pl-3 pr-2',
          )}
        >
          <div>
            <Logo isCollapsed={isCollapsed} />
            <UserProfile isCollapsed={isCollapsed} />
            <SearchBar
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
              searchValue={searchValue}
              setSearchValue={setSearchValue}
            />
            <DashboardHomeSection isCollapsed={isCollapsed} />
            <GameDataSection isCollapsed={isCollapsed} />
            <UsersSection isCollapsed={isCollapsed} />
          </div>

          <div className="mt-auto pt-4">
            <LogoutButton isCollapsed={isCollapsed} />
          </div>
        </div>
      </nav>

      <main className="grow h-full p-3">
        <div className="bg-white border border-zinc-200 h-full rounded-lg shadow-sm px-8 pt-6 pb-10 overflow-auto hide-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
}
