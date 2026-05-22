import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  hrefLabel?: string;
  align?: "left" | "center";
  className?: string;
}

export default function SectionHeader({
  eyebrow,
  title,
  description,
  href,
  hrefLabel = "View all",
  align = "left",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 md:flex-row md:items-end md:justify-between mb-6 md:mb-8",
        align === "center" && "md:flex-col md:items-center md:text-center",
        className,
      )}
    >
      <div>
        {eyebrow && (
          <p className="text-xs uppercase tracking-[0.22em] text-primary font-semibold mb-2">
            {eyebrow}
          </p>
        )}
        <h2 className="text-2xl md:text-3xl lg:text-[2.25rem] font-black leading-tight">
          {title}
        </h2>
        {description && (
          <p className="text-sm md:text-base text-muted-foreground mt-2 max-w-xl">
            {description}
          </p>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-accent transition-colors group/link self-start md:self-end"
        >
          {hrefLabel}
          <ArrowRight className="size-4 transition-transform group-hover/link:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
