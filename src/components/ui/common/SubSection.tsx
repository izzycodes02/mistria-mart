import { ROUTES } from "@/routes";
import Link from "next/link";

type SubSectionProps = {
  title: string;
  linkTo: string;
  children: React.ReactNode;
};

export default function SubSection({
  title,
  children,
  linkTo,
}: SubSectionProps) {
  const chosenHref = linkTo == "library" ? ROUTES.LIBRARY : ROUTES.COLLECTIONS;

  const headingId = `${title.toLowerCase().replace(/\s+/g, "-")}-subsection-heading`;

  return (
    <section className="h-fit w-full" aria-labelledby={headingId}>
      <header className="mb-4 flex w-full items-center justify-between gap-4">
        <h2
          id={headingId}
          className="whitespace-nowrap font-kanit text-3xl font-semibold text-[var(--secondary)]"
        >
          {title}
        </h2>

        {/* line divider */}
        <div className="mx-4 hidden h-[2px] flex-1 bg-border1 sm:flex" />

        <Link
          href={chosenHref}
          className="viewAllBtn shrink-0 whitespace-nowrap"
          aria-label={`View all in ${title}`}
        >
          view all
        </Link>
      </header>
      <div className="w-full">{children}</div>
    </section>
  );
}
