import React from "react";
import { motion } from "motion/react";
import { Tape } from "./Tape";
import { cn } from "../lib/utils";

// ─── Shared sub-components ────────────────────────────────────────────────────

/** Sticker label, pops in with a rotate animation */
export const CardSticker = ({
  text,
  color,
  className,
  enabled = true,
}: {
  text: string;
  color: string;
  className?: string;
  enabled?: boolean;
}) => (
  <motion.div
    initial={enabled ? { scale: 0, rotate: -20 } : false}
    whileInView={enabled ? { scale: 1, rotate: Math.random() * 20 - 10 } : undefined}
    viewport={{ once: true }}
    transition={enabled ? { duration: 0.4 } : { duration: 0 }}
    className={`px-4 py-2 ${color} border-2 border-black font-hand text-sm font-bold shadow-[4px_4px_0px_rgba(0,0,0,1)] whitespace-nowrap ${className ?? ""}`}
  >
    {text}
  </motion.div>
);

// ─── Core Card ─────────────────────────────────────────────────────────────────

export interface CardProps {
  /** Background color class, e.g. "bg-[#fff9ef]" */
  color?: string;
  /** Rotation in degrees applied to the card surface */
  rotation?: number;
  /** Shadow size variant */
  shadowSize?: "sm" | "md" | "lg";
  /** Extra classes on the outer motion wrapper */
  className?: string;
  /** Extra classes on the inner card surface div */
  surfaceClassName?: string;
  /** Tape strip above the card */
  tape?: boolean;
  /** Rotation passed to the Tape component (defaults to -rotation * 2) */
  tapeRotation?: number;
  /** Tape width class, e.g. "w-24" */
  tapeWidth?: string;
  /** Children rendered inside the card surface */
  children: React.ReactNode;
  /** Optional sticker label rendered inside the card */
  sticker?: {
    text: string;
    color: string;
    className?: string;
    enabled?: boolean;
  };
  /** onClick handler forwarded to the outermost wrapper */
  onClick?: () => void;
}

const shadowMap = {
  sm: "shadow-[8px_8px_0px_rgba(0,0,0,0.1)]",
  md: "shadow-[12px_12px_0px_rgba(0,0,0,0.1)]",
  lg: "shadow-[20px_20px_0px_rgba(0,0,0,0.1)]",
};

/**
 * Base card component.
 *
 * Renders a paper-style card surface with an optional tape strip, sticker,
 * and hover lift effect. Children are placed inside the card body.
 *
 * @example
 * <Card color="bg-[#fff9ef]" rotation={-2} tape>
 *   <h3>Hello</h3>
 * </Card>
 */
export const Card = ({
  color = "bg-[#fff9ef]",
  rotation = 0,
  shadowSize = "md",
  className = "",
  surfaceClassName = "",
  tape = false,
  tapeRotation,
  tapeWidth = "w-24",
  children,
  sticker,
  onClick,
}: CardProps) => {
  const resolvedTapeRotation = tapeRotation ?? rotation * -2;

  return (
    <div className={`relative group ${className}`} onClick={onClick}>
      <div
        className={`relative ${color} border-2 border-black ${shadowMap[shadowSize]} transition-transform duration-300 group-hover:-translate-y-2 group-hover:${shadowMap["lg"]} ${surfaceClassName}`}
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        {tape && (
          <Tape
            rotation={resolvedTapeRotation}
            className={`absolute -top-4 left-1/2 -translate-x-1/2 ${tapeWidth} opacity-80`}
          />
        )}

        {children}

        {sticker && (
          <CardSticker
            text={sticker.text}
            color={sticker.color}
            className={sticker.className}
            enabled={sticker.enabled}
          />
        )}
      </div>
    </div>
  );
};

// ─── Convenience variant: Blog preview card (used in Blogs.tsx component) ─────

export interface BlogPreviewCardProps {
  color: string;
  rotation: number;
  date: string;
  author: string;
  title: string;
  excerpt: string;
}

export const BlogPreviewCard = ({
  color,
  rotation,
  date,
  author,
  title,
  excerpt,
}: BlogPreviewCardProps) => (
  <Card color={color} rotation={rotation} tape tapeWidth="w-24" surfaceClassName="p-8">
    <div className="font-sans text-xs uppercase tracking-widest font-bold opacity-60 mb-4">
      <p>{date}</p>
      <p>By {author}</p>
    </div>

    <h3 className="font-serif text-2xl font-bold mb-4 leading-tight border-b-2 border-black/10 pb-4">
      {title}
    </h3>

    <p className="font-hand text-xl text-gray-700 leading-relaxed mb-6 line-clamp-4">
      {excerpt}
    </p>

    <div className="inline-flex items-center gap-2 font-sans text-sm uppercase tracking-widest font-bold text-[#a30037] group-hover:text-accent-pink transition-colors">
      Read More{" "}
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </svg>
    </div>
  </Card>
);

// ─── Convenience variant: Full blog grid card (used in Blog.tsx page) ─────────

import { Calendar, Tag, ArrowRight } from "lucide-react";

export interface BlogGridCardProps {
  color: string;
  rotation: number;
  image: string;
  imageAlt?: string;
  date: string;
  category: string;
  title: string;
  excerpt: string;
  /** Whether to animate in on mount */
  animate?: boolean;
  animationDelay?: number;
  enabled?: boolean;
  onImageClick?: (data: { src: string; alt: string }) => void;
}

export const BlogGridCard = ({
  color,
  rotation,
  image,
  imageAlt = "",
  date,
  category,
  title,
  excerpt,
  animate = true,
  animationDelay = 0,
  enabled = true,
  onImageClick,
}: BlogGridCardProps) => (
  <Card
    color={color}
    rotation={rotation}
    tape
    tapeWidth="w-24"
    surfaceClassName="h-full flex flex-col p-6 z-10"
    shadowSize="md"
  >
    <div 
      className={cn(
        "w-full aspect-video overflow-hidden border-2 border-black mb-6 relative",
        onImageClick && "cursor-zoom-in"
      )}
      onClick={(e) => {
        if (onImageClick) {
          e.preventDefault();
          e.stopPropagation();
          onImageClick({ src: image, alt: imageAlt || title });
        }
      }}
    >
      <img
        src={image}
        alt={imageAlt}
        className="w-full h-full object-cover transition-all duration-700"
        referrerPolicy="no-referrer"
      />
    </div>

    <div className="flex flex-col flex-1">
      <div className="flex items-center justify-between mb-3 font-sans text-[9px] uppercase tracking-widest font-bold opacity-60">
        <span className="flex items-center gap-1">
          <Calendar size={10} /> {date}
        </span>
        <span className="flex items-center gap-1">
          <Tag size={10} /> {category}
        </span>
      </div>

      <h3 className="font-serif text-2xl font-bold mb-3 leading-tight group-hover:text-accent-darkblue transition-colors text-ink">
        {title}
      </h3>

      <p className="font-hand text-xl leading-snug mb-6 text-black/70 flex-1 line-clamp-4">
        {excerpt}
      </p>

      <div className="mt-auto pt-4 border-t border-black/10 flex items-center justify-between">
        <span className="font-sans text-xs uppercase tracking-widest font-black">Read</span>
        <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
      </div>
    </div>
  </Card>
);

// ─── Convenience variant: Board member card (used in Members.tsx) ─────────────

export interface BoardMemberCardProps {
  color: string;
  rotation: number;
  imageUrl: string;
  name: string;
  role: string;
  bio: string;
  events: string[];
  twoWords?: string;
  stickerColor?: string;
  stickerClassName?: string;
  onImageClick?: (data: { src: string; alt: string }) => void;
}

export const BoardMemberCard = ({
  color,
  rotation,
  imageUrl,
  name,
  role,
  bio,
  events,
  twoWords,
  stickerColor,
  stickerClassName,
  onImageClick,
}: BoardMemberCardProps) => (
  <Card
    className="max-w-[480px] mx-auto w-full"
    color={color}
    rotation={rotation}
    tape
    tapeRotation={rotation * -3}
    tapeWidth="w-24 md:w-32"
    shadowSize="md"
    surfaceClassName="p-6 md:p-8"
    sticker={
      twoWords
        ? { text: twoWords, color: stickerColor ?? "bg-white", className: stickerClassName }
        : undefined
    }
  >
    <div className="flex flex-col gap-6">
      <div 
        className={cn(
          "w-full aspect-square overflow-hidden border-2 border-black shadow-[8px_8px_0px_rgba(0,0,0,0.1)]",
          onImageClick && "cursor-zoom-in"
        )}
        onClick={(e) => {
          if (onImageClick) {
            e.preventDefault();
            e.stopPropagation();
            onImageClick({ src: imageUrl, alt: name });
          }
        }}
      >
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover transition-all duration-700 hover:scale-[1.03]"
          referrerPolicy="no-referrer"
        />
      </div>

      <div>
        <div className="flex items-center gap-4 mb-4">
          <div className="h-px flex-1 bg-black/10" />
        </div>
        <h3 className="font-serif text-3xl md:text-4xl font-bold mb-2">{name}</h3>
        <p className="font-sans text-xs uppercase tracking-[0.2em] font-black text-accent-red mb-4">
          {role}
        </p>
        <p className="font-hand text-xl md:text-2xl leading-relaxed mb-6">"{bio}"</p>

        <div className="pt-6 border-t border-black/10">
          <h4 className="font-sans text-[10px] uppercase tracking-widest font-bold opacity-40 mb-4">
            Academic Year Events
          </h4>
          <div className="flex flex-wrap gap-3">
            {events.map((event) => (
              <span
                key={event}
                className="px-4 py-2 bg-white/40 border border-black/10 rounded-full text-xs font-bold"
              >
                {event}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  </Card>
);

// ─── Convenience variant: Level rep card (used in Members.tsx) ────────────────

export interface LevelRepCardProps {
  color: string;
  rotation: number;
  imageUrl: string;
  grade: string;
  name: string;
  bio: string;
  events: string[];
  twoWords?: string;
  stickerColor?: string;
  stickerClassName?: string;
  onImageClick?: (data: { src: string; alt: string }) => void;
}

export const LevelRepCard = ({
  color,
  rotation,
  imageUrl,
  grade,
  name,
  bio,
  events,
  twoWords,
  stickerColor,
  stickerClassName,
  onImageClick,
}: LevelRepCardProps) => (
  <Card
    color={color}
    rotation={rotation}
    tape
    tapeRotation={rotation * -5}
    tapeWidth="w-32"
    shadowSize="md"
    surfaceClassName="p-6 md:p-8 text-[#1a1a1a] shadow-[15px_15px_0px_rgba(255,255,255,0.1)]"
    sticker={
      twoWords
        ? { text: twoWords, color: stickerColor ?? "bg-white", className: stickerClassName }
        : undefined
    }
  >
    <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
      <div 
        className={cn(
          "w-32 h-32 md:w-40 md:h-40 shrink-0 overflow-hidden border-2 border-black shadow-[8px_8px_0px_rgba(0,0,0,0.1)] transition-all duration-500",
          onImageClick && "cursor-zoom-in"
        )}
        onClick={(e) => {
          if (onImageClick) {
            e.preventDefault();
            e.stopPropagation();
            onImageClick({ src: imageUrl, alt: name });
          }
        }}
      >
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="text-center sm:text-left">
        <div className="font-sans text-[10px] uppercase tracking-widest font-black text-accent-red mb-2">
          {grade}
        </div>
        <h3 className="font-serif text-3xl font-bold mb-3">{name}</h3>
        <p className="font-hand text-xl md:text-2xl line-clamp-3 leading-tight mb-4">"{bio}"</p>

        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
          {events.map((event) => (
            <span
              key={event}
              className="px-3 py-1 bg-black/5 border border-black/10 rounded-full text-[10px] font-bold uppercase tracking-tighter"
            >
              {event}
            </span>
          ))}
        </div>
      </div>
    </div>
  </Card>
);
