// components/ui/StatsCard.tsx

import { cn } from '@/lib/utils'; // Add this import

export function StatsCard({ stat, className }) {
  return (
    <div className={cn(
      "bg-white p-6 rounded-xl shadow-sm border border-gray-100",
      className // Add this line to pass through className
    )}>
      <dt className="font-body text-gray-500">{stat.name}</dt>
      <dd className="mt-2 font-header text-3xl font-semibold text-gray-900">
        {stat.value}
      </dd>
    </div>
  )
}
