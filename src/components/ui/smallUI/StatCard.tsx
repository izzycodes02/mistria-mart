// components/admin/StatCard.jsx
import {
  IconArrowBigUpLine,
  IconArrowBigDownLine,
  IconCircleDot,
} from '@tabler/icons-react';
import Link from 'next/link';
import { ReactNode } from 'react';

type ChangeType = 'increase' | 'decrease' | 'neutral';

interface StatCardProps {
  icon: string;
  title: string;
  total: number;
  change: number;
  changeLabel: string;
  href: string;
  changeType?: ChangeType;
}

export default function StatCard({
  icon,
  title,
  total,
  change,
  changeLabel,
  href,
  changeType = 'increase',
}: StatCardProps) {
  const changeIcon: Record<ChangeType, ReactNode> = {
    increase: <IconArrowBigUpLine className="h-4 w-4 text-gray-500" />,
    decrease: <IconArrowBigDownLine className="h-4 w-4 text-gray-500" />,
    neutral: <IconCircleDot className="h-4 w-4 text-gray-500" />,
  };

  return (
    <Link
      href={href}
      className="block bg-mm-blue-lighter border border-mm-blue-light/20 rounded-lg shadow-sm p-[3px] transition duration-300 relative group hover:scale-105"
    >
      <div className="w-full rounded-md bg-white border border-mm-blue-light/30 shadow-sm px-2 py-2 ">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
          {title}
        </h3>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-gray-900">
            {total.toLocaleString()}
          </span>
          <span className="text-xl">{icon}</span>
        </div>
      </div>

      <div
        className={`text-sm flex items-center gap-1 px-2 py-2 justify-between`}
      >
        <span className="" aria-hidden="true">
          {changeIcon[changeType]}
        </span>
        <span
          className={
            change > 0
              ? 'text-mm-green-dark-mid font-semibold'
              : change < 0
                ? 'text-red-600 font-semibold'
                : 'text-gray-500 font-semibold'
          }
        >
          {change > 0 ? '+' : ''}
          {change} {changeLabel}
        </span>
      </div>
    </Link>
  );
}
