import Link from "next/link";

export default function QuickActions() {
  const actions = [
    {
      icon: '🌾',
      label: 'Add Crop',
      href: '/admin/crops/new',
      color: 'bg-green-50 hover:bg-green-100',
    },
    {
      icon: '🐟',
      label: 'Add Fish',
      href: '/admin/fish/new',
      color: 'bg-blue-50 hover:bg-blue-100',
    },
    {
      icon: '🥚',
      label: 'Add Ingredient',
      href: '/admin/ingredients/new',
      color: 'bg-yellow-50 hover:bg-yellow-100',
    },
    {
      icon: '📝',
      label: 'Add Recipe',
      href: '/admin/recipes/new',
      color: 'bg-purple-50 hover:bg-purple-100',
    },
    {
      icon: '📤',
      label: 'Bulk Import',
      href: '/admin/import',
      color: 'bg-indigo-50 hover:bg-indigo-100',
    },
    {
      icon: '🔍',
      label: 'Search Database',
      href: '/admin/search',
      color: 'bg-gray-50 hover:bg-gray-100',
    },
  ];

  return (
      <div className="grid grid-cols-4 gap-4">
        {actions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className={`${action.color} p-4 rounded-lg text-center transition hover:scale-105 duration-200 flex flex-col items-center justify-center shadow-sm`}
          >
            <div className="text-2xl mb-2">{action.icon}</div>
            <div className="text-sm font-medium">{action.label}</div>
          </Link>
        ))}
      </div>
  );
};
