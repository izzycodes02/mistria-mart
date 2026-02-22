import { Boxes, Carrot, ChefHat, Fish, Milk } from 'lucide-react';
import Image from 'next/image';
import {
  IconHome2,
  IconLogout,
  IconUser,
  IconUserBolt,
  IconUsers,
} from '@tabler/icons-react';
import '@/styles/navigation.scss';
import Link from 'next/link';

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

/**
 * Logo section with app icon and title
 */
const Logo = () => (
  <Link href="/" className="flex gap-2 items-center justify-center w-full mb-3">
    <Image
      src="/icons/mistriamart_x192.png"
      alt="icon"
      width={26}
      height={26}
      className="mb-1"
    />
    <p className="text-xl font-bold text-mm-blue-mid">MistriaMart Admin</p>
  </Link>
);

/**
 * User profile card showing avatar, name and username
 */
const UserProfile = () => (
  <div className="flex gap-3 w-full p-2 border border-zinc-300 rounded-md items-center shadow-sm bg-white">
    <Image
      src={PROFILE_IMAGE_URL}
      alt="User's profile image"
      width={20}
      height={20}
      className="w-12 h-12 rounded-full"
    />
    <div className="flex flex-col">
      <p className="font-semibold">{DISPLAY_NAME}</p>
      <p className="text-black/50">{USERNAME}</p>
    </div>
  </div>
);

// ============================================================================
// NAVIGATION ITEMS DATA
// ============================================================================

/* App Datatables navigation items */
const APP_DATATABLES_ITEMS = [
  { icon: Carrot, label: 'Crops', href: '/admin/crops' },
  { icon: Fish, label: 'Fish', href: '/admin/fish' },
  { icon: Milk, label: 'Ingredients', href: '/admin/ingredients' },
  { icon: ChefHat, label: 'Recipes', href: '/admin/recipes' },
] as const;

/*  Users navigation items */
const USER_ITEMS = [
  { icon: IconUser, label: 'All Users', url: '/admin/users' },
  { icon: IconUserBolt, label: 'Admins', url: '/admin/admins' },
] as const;

// ============================================================================
// NAVIGATION SECTION COMPONENTS
// ============================================================================

const DashboardHomeSection = () => (
  <div className="mt-3">
    {/* Section Header */}
    <div className="flex flex-col">
      <Link href="/admin" className="leftSideBarItems">
        <IconHome2 className="stroke-[1.5] w-4.5" />
        <p className="font-medium">Main Dasboard</p>
      </Link>
    </div>
  </div>
);

/* App Datatables section with all data-related navigation items */
const AppDatatablesSection = () => (
  <div className="mt-3 pl-2">
    {/* Section Header */}
    <div className="flex gap-1 text-zinc-500/60 mb-1 text-sm items-center">
      <Boxes className="stroke-[1.75] w-4" />
      <p className="font-bold">App Datatables</p>
    </div>

    {/* Navigation Items */}
    <div className="flex flex-col">
      {APP_DATATABLES_ITEMS.map(({ icon: Icon, label, href }) => (
        <Link href={href} key={label} className="leftSideBarItems">
          <Icon className="stroke-[1.5] w-4.5" />
          <p className="font-medium">{label}</p>
        </Link>
      ))}
    </div>
  </div>
);

/* Users section with user management navigation items */
const UsersSection = () => (
  <div className="mt-3 pl-2">
    {/* Section Header */}
    <div className="flex gap-1 text-zinc-500/60 mb-1 text-sm items-center">
      <IconUsers className="stroke-[2] w-4" />
      <p className="font-bold">Users</p>
    </div>

    {/* Navigation Items */}
    <div className="flex flex-col">
      {USER_ITEMS.map(({ icon: Icon, label, url }) => (
        <Link href={url} key={label} className="leftSideBarItems">
          <Icon className="stroke-[1.5] w-4.5" />
          <p className="font-medium">{label}</p>
        </Link>
      ))}
    </div>
  </div>
);

/* Logout button at the bottom of the sidebar */
const LogoutButton = () => (
  <Link href="/">
    <div className="leftSideBarItems logOut justify-center">
      <IconLogout className="stroke-[2] w-4.5" />
      <p className="font-medium">Log out</p>
    </div>
  </Link>
);

// ============================================================================
// LAYOUT COMPONENT
// ============================================================================

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="h-dvh w-full bg-mm-blue-lighter flex p-2">
      {/* Left Side - Navigation (Static across all admin pages) */}
      <nav className="h-full w-60 pl-3 py-3 pr-2 flex gap-3 flex-col">
        <div>
          <Logo />
          <UserProfile />
          <DashboardHomeSection />
          <AppDatatablesSection />
          <UsersSection />
        </div>

        <LogoutButton />
      </nav>

      {/* Right Side - Dynamic Page Content */}
      <main className="grow h-full p-3">
        <div className="bg-white border border-zinc-200 h-full rounded-lg shadow-sm p-2">
          {children}
        </div>
      </main>
    </div>
  );
}
