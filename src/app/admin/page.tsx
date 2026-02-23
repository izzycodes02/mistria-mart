import QuickActions from '@/components/ui/smallUI/QuickActions';
import StatCard from '@/components/ui/smallUI/StatCard';
import '@/styles/admin.scss';
import { IconBell, IconCalendar } from '@tabler/icons-react';

export default function DashboardPage() {
  const displayName = 'Isabelle';
  const role = 'Admin';

  const notifications = [
    {
      id: 1,
      type: 'pending_approval',
      title: 'New user verification',
      description: '3 users waiting for email verification',
      time: '10 min ago',
      priority: 'medium',
      link: '/admin/users?status=pending',
    },
    {
      id: 2,
      type: 'content_review',
      title: 'Crop data needs review',
      description: '2 crops have missing season information',
      time: '1 hour ago',
      priority: 'high',
      link: '/admin/crops?issues=missing-season',
    },
    {
      id: 3,
      type: 'system_alert',
      title: 'Database backup completed',
      description: 'Automatic backup successful - 2.4GB stored',
      time: '3 hours ago',
      priority: 'low',
      link: '/admin/settings/backups',
    },
    {
      id: 4,
      type: 'user_report',
      title: 'Spam user detected',
      description: 'User "FarmBot123" flagged for suspicious activity',
      time: '5 hours ago',
      priority: 'high',
      link: '/admin/users/reported',
    },
    {
      id: 5,
      type: 'content_flag',
      title: 'Duplicate entry found',
      description: '"Blueberry" exists in both crops and forage items',
      time: '1 day ago',
      priority: 'medium',
      link: '/admin/crops/duplicates',
    },
  ];

  const unreadNotificationsCount = notifications.filter(
    (n) => n.priority === 'high' || n.priority === 'medium',
  ).length;

  const stats = [
    {
      icon: '🌾',
      title: 'Crops',
      total: 24,
      change: 2,
      changeLabel: 'this week',
      href: '/admin/crops',
      changeType: 'increase' as const,
    },
    {
      icon: '🐟',
      title: 'Fish',
      total: 86,
      change: 1,
      changeLabel: 'this week',
      href: '/admin/fish',
      changeType: 'increase' as const,
    },
    {
      icon: '🥚',
      title: 'Ingredients',
      total: 18,
      change: 0,
      changeLabel: 'this week',
      href: '/admin/ingredients',
      changeType: 'neutral' as const,
    },
    {
      icon: '🧑‍🍳',
      title: 'Recipes',
      total: 42,
      change: 3,
      changeLabel: 'this week',
      href: '/admin/recipes',
      changeType: 'increase' as const,
    },
  ];


  return (
    <div className="Dashboard">
      <div className="flex justify-between items-center">
        {/* The Left hand Side */}
        <div className="flex items-end gap-2">
          <h1 className="text-4xl font-semibold text-slate-700">
            Welcome back, {displayName}! 👋
          </h1>
          <div className="miniStats mb-1">
            <p className="text-gray-700">{role}</p>
          </div>
        </div>

        {/* Right Hand Side */}
        <div className="flex gap-1">
          <button className="notifyBell">
            <span className="text-xl">
              <IconBell className="stroke-[1.5]" />
            </span>
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-0 right-0 bg-mm-pink-75 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Date */}
          <div className="flex items-center text-gray-600 border-l pl-4 ml-2">
            <IconCalendar className="mr-1 stroke-[1.5]" />
            <span className="text-sm"> Feb 22, 2025</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-neutral-500 mt-3">
        Get a complete overview of the web app&#39;s game database with
        real-time stats and quick access to all content types.
      </p>

      <hr className="border-slate-300 my-5" />

      {/* Quick Stats */}
      <h1 className="text-2xl font-bold text-slate-700 mb-4">Quick Stats</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <hr className="border-slate-100 my-10" />

      {/* Quick Actions */}
      <h1 className="text-2xl font-bold text-slate-700 mb-4">Quick Actions</h1>
      <div className="w-full">
        <QuickActions />
      </div>

      <hr className="border-slate-100 my-10" />
    </div>
  );
}
