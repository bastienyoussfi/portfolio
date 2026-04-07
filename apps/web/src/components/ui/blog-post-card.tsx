"use client";

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getTechIcon } from "@/utils/techIcons";
import { cn } from "@/lib/utils";

const MAX_VISIBLE_AVATARS = 4;

export interface ArticleCardProps {
  headline: string;
  excerpt: string;
  cover?: string;
  technologies?: string[];
  readingTime?: number;
  writer?: string;
  publishedAt?: Date;
  clampLines?: number;
  href?: string;
  className?: string;
}

// Human-friendly read time: seconds -> "X min read"
export function formatReadTime(seconds: number): string {
  if (!seconds || seconds < 60) return "Less than 1 min read";
  const minutes = Math.ceil(seconds / 60);
  return `${minutes} min read`;
}

// Date -> "Aug 15, 2025" (localized but concise)
export function formatPostDate(date: Date): string {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  cover,
  technologies,
  readingTime,
  headline,
  excerpt,
  writer,
  publishedAt,
  clampLines,
  href,
  className,
}) => {
  const hasMeta = (technologies && technologies.length > 0) || readingTime;
  const hasFooter = writer || publishedAt;

  const visibleTechs = technologies?.slice(0, MAX_VISIBLE_AVATARS) ?? [];
  const overflowCount = (technologies?.length ?? 0) - MAX_VISIBLE_AVATARS;

  const content = (
    <Card className={cn("flex w-full flex-col gap-3 overflow-hidden rounded-[var(--r)] border-[var(--sep)] p-3", className)}>
      {cover && (
        <CardHeader className="p-0">
          <div className="relative h-56 w-full overflow-hidden rounded-[var(--r-inner)]">
            <img
              src={cover}
              alt={headline}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
        </CardHeader>
      )}

      <CardContent className="flex-grow p-3">
        {hasMeta && (
          <div className="mb-4 flex items-center gap-3 text-sm text-[var(--text-3)]">
            {visibleTechs.length > 0 && (
              <div className="flex -space-x-2">
                {visibleTechs.map((tech) => {
                  const { icon, initials } = getTechIcon(tech);
                  return (
                    <Avatar key={tech} className="size-8">
                      <AvatarImage
                        src={icon || undefined}
                        alt={tech}
                        className="border-2 border-[var(--card)] bg-[var(--card)] p-1 hover:z-10"
                      />
                      <AvatarFallback className="text-[10px]">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  );
                })}
                {overflowCount > 0 && (
                  <div className="relative flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-[var(--card)] bg-[var(--fill-1)] text-xs font-semibold text-[var(--text-3)]">
                    +{overflowCount}
                  </div>
                )}
              </div>
            )}
            {visibleTechs.length > 0 && readingTime && <span>•</span>}
            {readingTime && <span>{formatReadTime(readingTime)}</span>}
          </div>
        )}

        <h2 className="mb-2 text-2xl font-bold leading-tight text-[var(--text-1)]">
          {headline}
        </h2>

        <p
          className={cn("text-[var(--text-3)]", {
            "overflow-hidden text-ellipsis [-webkit-box-orient:vertical] [display:-webkit-box]":
              clampLines && clampLines > 0,
          })}
          style={{
            WebkitLineClamp: clampLines,
          }}
        >
          {excerpt}
        </p>
      </CardContent>
    </Card>
  );

  if (href) {
    return (
      <a href={href} className="group block" aria-label={`Learn more about ${headline}`}>
        {content}
      </a>
    );
  }

  return content;
};
