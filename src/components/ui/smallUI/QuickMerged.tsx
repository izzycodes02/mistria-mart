"use client";

import { useState } from "react";
import QuickStats from "./QuickStats";
import QuickLinks from "./QuickLinks";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

export default function QuickMerged() {
  const [activeTab, setActiveTab] = useState<"stats" | "links">("stats");
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  return (
    <section className="relative -mt-1 rounded-xl md:hidden">
      {/* Header */}
      <div
        className="absolute right-4 top-4 flex gap-2"
        role="tablist"
        aria-label="Quick view tabs"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "stats"}
          aria-controls="quick-stats-content"
          className={`flex w-8 items-center justify-center gap-1 rounded-lg border border-bb-border-1 bg-white p-[2px] shadow-sm shadow-zinc-200 sm:w-fit sm:p-1 sm:px-3 sm:pr-4 ${activeTab !== "stats" ? "opacity-100" : "opacity-50"}`}
          onClick={() => setActiveTab("stats")}
        >
          <IconChevronLeft
            stroke={1.5}
            className="w-[18px]"
            aria-hidden="true"
          />
          <span className="hidden text-sm sm:block">Stats</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "links"}
          aria-controls="quick-links-content"
          className={`flex w-8 items-center justify-center gap-1 rounded-lg border border-bb-border-1 bg-white p-[2px] shadow-sm shadow-zinc-200 sm:w-fit sm:px-3 sm:pl-4 ${activeTab !== "links" ? "opacity-100" : "opacity-50"}`}
          onClick={() => setActiveTab("links")}
        >
          <span className="hidden text-sm sm:block">Links</span>
          <IconChevronRight
            stroke={1.5}
            className="w-[18px]"
            aria-hidden="true"
          />
        </button>
      </div>

      {/* Collapsible container */}
      <div
        className={`overflow-hidden transition-[height,opacity,margin] duration-500 ease-in-out ${
          isExpanded
            ? "mt-3 max-h-[700px] opacity-100"
            : "mt-0 max-h-0 opacity-0"
        }`}
        aria-expanded={isExpanded}
      >
        {/* Active content with proper ARIA relationships */}
        <div
          className="overflow-visible px-[2px] pb-1"
          id="quick-stats-content"
          role="tabpanel"
          aria-labelledby="stats-tab"
          hidden={activeTab !== "stats"}
        >
          {activeTab === "stats" && <QuickStats />}
        </div>
        <div
          className="overflow-visible px-[2px] pb-1"
          id="quick-links-content"
          role="tabpanel"
          aria-labelledby="links-tab"
          hidden={activeTab !== "links"}
        >
          {activeTab === "links" && <QuickLinks />}
        </div>
      </div>
    </section>
  );
}
