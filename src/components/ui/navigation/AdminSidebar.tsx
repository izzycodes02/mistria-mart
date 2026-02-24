'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import clsx from 'clsx';
import {
  Boxes,
  Carrot,
  ChefHat,
  Fish,
  Milk,
  ChevronLeft,
  ChevronRight,
  Search as IconSearch,
} from 'lucide-react';
import {
  IconHome2,
  IconLogout,
  IconUser,
  IconUserBolt,
  IconUsers,
} from '@tabler/icons-react';
import {
  useUserProfile,
  type Profile,
} from 'utils/providers/UserProfileProvider';

// --- Types ---
interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

// --- Constants ---
const DISPLAY_NAME = 'IsabelleZen';
const PROFILE_IMAGE_URL =
  'https://i.pinimg.com/1200x/09/82/a0/0982a02c7590f58ba0891a951276d964.jpg';

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

// --- Sub-Components ---
const Logo = ({ isCollapsed }: { isCollapsed: boolean }) => (
  <Link
    href="/"
    className={clsx(
      'flex gap-2 items-center justify-center w-full mb-3 transition-all duration-300',
      isCollapsed && 'flex-col',
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

const UserProfile = ({
  isCollapsed,
  profile,
}: {
  isCollapsed: boolean;
  profile: Profile | null;
}) => (
  <div
    className={clsx(
      'flex w-full p-2 border border-zinc-300 rounded-md items-center shadow-sm bg-white transition-all duration-300',
      isCollapsed ? 'justify-center' : 'gap-3',
    )}
  >
    <Image
      src={PROFILE_IMAGE_URL}
      alt="Avatar"
      width={20}
      height={20}
      className={clsx('rounded-full', isCollapsed ? 'w-10 h-10' : 'w-12 h-12')}
    />
    {!isCollapsed && (
      <div className="flex flex-col">
        <p className="font-semibold">{DISPLAY_NAME}</p>
        <p className="text-black/50 text-sm">
          @{profile?.username || 'Loading...'}
        </p>
      </div>
    )}
  </div>
);

// --- Main Export ---
export function AdminSidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const [searchValue, setSearchValue] = useState('');
  const { profile, isLoading } = useUserProfile();

  return (
    <nav
      className={clsx(
        'h-full flex gap-3 flex-col transition-all duration-300 relative',
        isCollapsed ? 'w-20' : 'w-60',
      )}
    >
      {/* Toggle Button */}
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

      <div
        className={clsx(
          'flex-1 flex flex-col py-3 pt-7',
          isCollapsed ? 'px-2' : 'pl-3 pr-2',
        )}
      >
        <div>
          <Logo isCollapsed={isCollapsed} />

          {isLoading ? (
            <div className="p-2 border border-zinc-300 rounded-md bg-white animate-pulse">
              <div className="h-12 w-full bg-gray-200 rounded"></div>
            </div>
          ) : (
            <UserProfile isCollapsed={isCollapsed} profile={profile} />
          )}

          {/* Search Bar */}
          <div className="w-full relative mt-3">
            <input
              type="text"
              placeholder={isCollapsed ? '' : 'Search...'}
              value={isCollapsed ? '' : searchValue}
              readOnly={isCollapsed}
              onChange={(e) => setSearchValue(e.target.value)}
              onClick={() => isCollapsed && setIsCollapsed(false)}
              className={clsx(
                'w-full relative rounded-md border border-zinc-300 focus:ring-2 focus:ring-mm-blue-mid bg-white outline-none transition-all duration-300 text-sm',
                isCollapsed ? 'p-3 py-1.5 cursor-pointer' : 'pr-3 pl-7 py-1.5',
              )}
            />
            <IconSearch
              className={clsx(
                'absolute text-slate-400',
                isCollapsed
                  ? 'left-5.5 top-1.5 w-5 h-5'
                  : 'left-2 top-2 w-3.5 h-3.5',
              )}
            />
          </div>

          {/* Navigation Sections */}
          <div className="mt-3">
            <Link
              href="/admin"
              className={clsx(
                'leftSideBarItems',
                isCollapsed && 'justify-center px-2',
              )}
            >
              <IconHome2 className={isCollapsed ? 'w-5.5' : 'w-4.5'} />
              {!isCollapsed && <p className="font-medium">Main Dashboard</p>}
            </Link>
          </div>

          <div className="mt-3">
            {!isCollapsed ? (
              <div className="flex gap-1 text-zinc-500/60 mb-1 text-sm items-center pl-2">
                <Boxes className="w-4" />{' '}
                <p className="font-bold uppercase tracking-wider text-[10px]">
                  Game Data
                </p>
              </div>
            ) : (
              <div className="border-t border-zinc-200 my-2" />
            )}
            {GAME_DATA_ITEMS.map(({ icon: Icon, label, href }) => (
              <Link
                key={label}
                href={href}
                className={clsx(
                  'leftSideBarItems',
                  isCollapsed && 'justify-center px-2',
                )}
              >
                <Icon className={isCollapsed ? 'w-5.5' : 'w-4.5'} />
                {!isCollapsed && <p className="font-medium">{label}</p>}
              </Link>
            ))}
          </div>

          <div className="mt-3">
            {!isCollapsed ? (
              <div className="flex gap-1 text-zinc-500/60 mb-1 text-sm items-center pl-2">
                <IconUsers className="w-4" />{' '}
                <p className="font-bold uppercase tracking-wider text-[10px]">
                  Users
                </p>
              </div>
            ) : (
              <div className="border-t border-zinc-200 my-2" />
            )}
            {USER_ITEMS.map(({ icon: Icon, label, url }) => (
              <Link
                key={label}
                href={url}
                className={clsx(
                  'leftSideBarItems',
                  isCollapsed && 'justify-center px-2',
                )}
              >
                <Icon className={isCollapsed ? 'w-5.5' : 'w-4.5'} />
                {!isCollapsed && <p className="font-medium">{label}</p>}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-4">
          <Link href="/">
            <div
              className={clsx(
                'leftSideBarItems logOut',
                isCollapsed && 'justify-center px-2',
              )}
            >
              <IconLogout className="w-4.5" />
              {!isCollapsed && <p className="font-medium">Log out</p>}
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
}
