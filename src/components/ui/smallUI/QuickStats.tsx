"use client";

import { useState } from "react";

export default function QuickStats() {
  const [isExpanded, setIsExpanded] = useState(true);

  const statsData = [
    { statLabel: "Currently Reading", value: 12 },
    { statLabel: "Completed Stories", value: 6 },
    { statLabel: "On Hold Stories", value: 22 },
    { statLabel: "Added This Month", value: 3 },
  ];

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleExpanded();
    }
  };

  return (
    <section
      className="h-auto rounded-xl border border-zinc-200 bg-bb-surface p-4 transition-colors duration-200 hover:border-zinc-300 lg:h-fit"
      aria-labelledby="quick-stats-heading"
    >
      <button
        type="button"
        className="w-full rounded-sm text-left outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--secondary)] focus-visible:ring-offset-2"
        onClick={toggleExpanded}
        onKeyDown={handleKeyDown}
        aria-expanded={isExpanded}
        aria-controls="quick-stats-content"
        id="quick-stats-heading"
        aria-label={`Quick Stats, ${isExpanded ? "expanded" : "collapsed"}. Click to ${isExpanded ? "collapse" : "expand"}`}
      >
        <h2 className="pointer-events-none font-kanit text-2xl font-medium text-[var(--secondary)]">
          Quick Stats
        </h2>
      </button>

      <div
        id="quick-stats-content"
        role="region"
        aria-labelledby="quick-stats-heading"
        aria-hidden={!isExpanded}
        className={`overflow-hidden transition-[max-height,opacity,margin] duration-500 ease-in-out ${
          isExpanded
            ? "mt-3 h-[95px] opacity-100 sm:h-[120px] lg:h-fit lg:max-h-[500px]"
            : "mt-0 h-0 opacity-0 lg:max-h-0"
        }`}
      >
        <div
          className="grid h-[110px] w-full grid-cols-4 gap-2 pb-1 sm:h-full sm:gap-3 lg:grid-cols-2 lg:grid-rows-2"
          role="list"
          aria-label="Story statistics overview"
        >
          {statsData.map((stat) => (
            <div
              key={stat.statLabel}
              role="listitem"
              className="flex h-[90px] w-full cursor-default flex-col items-center justify-center rounded-lg border border-zinc-200 bg-white p-4 py-5 shadow-sm shadow-zinc-200 sm:h-full sm:rounded-xl"
              tabIndex={0}
              aria-label={`${stat.statLabel}: ${stat.value}`}
              aria-describedby={`stat-${stat.statLabel.replace(/\s+/g, "-").toLowerCase()}-desc`}
            >
              <span
                className="text-2xl font-semibold sm:text-3xl"
                aria-hidden="true"
              >
                {stat.value}
              </span>
              <p
                id={`stat-${stat.statLabel.replace(/\s+/g, "-").toLowerCase()}-desc`}
                className="mt-1 w-16 px-1 text-center text-xxxs text-neutral-500 sm:px-0 sm:text-xs"
              >
                {stat.statLabel}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
