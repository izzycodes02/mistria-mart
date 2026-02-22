"use client";

import { ROUTES } from "@/routes";
import Link from "next/link";
import { useState } from "react";

export default function QuickLinks() {
  const [isExpanded, setIsExpanded] = useState(true);

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
      aria-labelledby="quick-links-heading"
      className="h-auto rounded-xl border border-zinc-200 bg-bb-surface p-4 transition-colors duration-200 hover:border-zinc-300 lg:h-fit"
    >
      <button
        type="button"
        className="w-full rounded-sm text-left outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--secondary)] focus-visible:ring-offset-2"
        onClick={toggleExpanded}
        onKeyDown={handleKeyDown}
        aria-expanded={isExpanded}
        aria-controls="quick-links-content"
        id="quick-links-heading"
        aria-label={`Quick Links, ${isExpanded ? "expanded" : "collapsed"}. Click to ${isExpanded ? "collapse" : "expand"}`}
      >
        <h2 className="pointer-events-none font-kanit text-2xl font-medium text-[var(--secondary)]">
          Quick Links
        </h2>
      </button>

      <div
        id="quick-links-content"
        role="region"
        aria-labelledby="quick-links-heading"
        aria-hidden={!isExpanded}
        className={`overflow-hidden transition-[max-height,opacity,margin] duration-500 ease-in-out ${
          isExpanded
            ? "mt-3 h-[90px] opacity-100 sm:h-[120px] lg:h-fit lg:max-h-[500px]"
            : "mt-0 h-0 opacity-0 lg:max-h-0"
        }`}
      >
        <div
          className="flex h-full items-center justify-center rounded-xl border-[1.75px] border-dashed border-bb-border-1 bg-bb-panel p-4 lg:block lg:px-5"
          role="list"
          aria-label="Quick links options"
        >
          <Link
            href={ROUTES.EDIT_PROFILE}
            className="block w-fit rounded-lg border border-bb-border-1 bg-white px-4 py-1.5 text-center text-sm font-medium shadow-md shadow-zinc-200 hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--secondary)] focus-visible:ring-offset-2 active:scale-[0.97] lg:w-full lg:px-0"
            aria-label="Set up quick links to customize your homepage"
            title="Set up quick links"
          >
            Set Up Quick Links
          </Link>
        </div>
      </div>
    </section>
  );
}
