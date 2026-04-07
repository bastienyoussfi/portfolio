"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";


export interface ArticleCardProps {
  headline: string;
  excerpt: string;
  cover?: string;
  tag?: string;
  readingTime?: number; // in seconds
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
  tag,
  readingTime,
  headline,
  excerpt,
  writer,
  publishedAt,
  clampLines,
  href,
  className,
}) => {
  const hasMeta = tag || readingTime;
  const hasFooter = writer || publishedAt;

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
          <div className="mb-4 flex items-center text-sm text-[var(--text-3)]">
            {tag && (
            <Badge className="rounded-full bg-[var(--fill-1)] px-3 py-1 text-sm text-[var(--text-3)] hover:text-[var(--text-1)]">
              {tag}
            </Badge>

            )}
            {tag && readingTime && <span className="mx-2">•</span>}
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
