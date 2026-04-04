import { useState, useEffect, useCallback } from 'react';
import { sanityClient } from '../lib/sanity';

export interface GalleryEvent {
  _id: string;
  _type: 'gallery';
  title: string;
  date: string;
  term: 'term1' | 'term2' | 'term3' | 'term4';
  description: string;
  coverPhoto: any;
  photos?: any[];
  shortWords?: string;
  highlights?: any[];
  BTS?: any[];
  studentsCollection?: any[];
  miscellaneous?: any[];
  // UI-specific properties added during processing
  id: string;
  bgColor?: string;
  stickerColor?: string;
  rotation?: number;
  color?: string;
  coverImage?: string;
  categories?: GalleryCategory[];
}

export interface GalleryCategory {
  name: string;
  color: string;
  images: { url: string; rot: number }[];
}

export interface TermData {
  term: string;
  theme: string;
  description: string;
  color: string;
  hex: string;
  events: GalleryEvent[];
}

const termThemes: Record<string, Omit<TermData, 'events'>> = {
  term1: {
    term: "Term 1",
    theme: "New Beginnings",
    description: "Kicking off the academic year with energy, new faces, and big dreams.",
    color: "text-accent-red",
    hex: "var(--color-accent-red)"
  },
  term2: {
    term: "Term 2",
    theme: "Building Momentum",
    description: "Finding our rhythm, pushing through challenges, and celebrating our community.",
    color: "text-accent-darkblue",
    hex: "var(--color-accent-darkblue)"
  },
  term3: {
    term: "Term 3",
    theme: "Spring Awakening",
    description: "New projects blossoming and the spirit of giving back taking center stage.",
    color: "text-accent-pink",
    hex: "var(--color-accent-pink)"
  },
  term4: {
    term: "Term 4",
    theme: "The Grand Finale",
    description: "Saying our goodbyes, passing the torch, and leaving a legacy behind.",
    color: "text-accent-red",
    hex: "var(--color-accent-red)"
  }
};

const CARD_COLORS = ['bg-[#ffbd9b]', 'bg-[#b8e6fe]', 'bg-[#fff9ef]', 'bg-[#FFC21A]', 'bg-[#FF1493]'];
const STICKER_COLORS = [
  'bg-[#FFC21A] text-black',
  'bg-[#FF1493] text-white',
  'bg-[#b8e6fe] text-black',
  'bg-[#FFBD9B] text-black'
];

function decorateEvent(event: any, overallIndex: number, lastCardColorIdx: number): { event: GalleryEvent; nextLastIdx: number } {
  const stickerColor = STICKER_COLORS[overallIndex % STICKER_COLORS.length];
  const stickerBgOnly = stickerColor.split(' ')[0].toLowerCase();

  let cardColorIdx = Math.floor(Math.random() * CARD_COLORS.length);
  while (
    (cardColorIdx === lastCardColorIdx ||
      CARD_COLORS[cardColorIdx].toLowerCase() === stickerBgOnly) &&
    CARD_COLORS.length > 2
  ) {
    cardColorIdx = Math.floor(Math.random() * CARD_COLORS.length);
  }

  return {
    event: {
      ...event,
      id: event._id,
      bgColor: CARD_COLORS[cardColorIdx],
      stickerColor,
      rotation: (Math.random() * 6) - 3,
    },
    nextLastIdx: cardColorIdx,
  };
}

function buildTermData(rawEvents: any[]): TermData[] {
  const terms: Record<string, GalleryEvent[]> = { term1: [], term2: [], term3: [], term4: [] };

  let overallIndex = 0;
  let lastCardColorIdx = -1;

  rawEvents.forEach((event: any) => {
    const term = event.term as keyof typeof terms;
    if (terms[term]) {
      const { event: decoratedEvent, nextLastIdx } = decorateEvent(event, overallIndex, lastCardColorIdx);
      lastCardColorIdx = nextLastIdx;
      terms[term].push(decoratedEvent);
      overallIndex++;
    }
  });

  return (
    ['term1', 'term2', 'term3', 'term4'] as const
  ).map(key => ({
    ...termThemes[key],
    events: terms[key],
  })).filter(t => t.events.length > 0) as TermData[];
}

export function useGalleryData() {
  const [galleryData, setGalleryData] = useState<TermData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await sanityClient.fetch(`*[_type == "gallery"] | order(date asc)`);
      setGalleryData(buildTermData(data));
      setError(null);
    } catch (err: any) {
      console.error("Error fetching gallery data:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { galleryData, loading, error, refetch: fetchData };
}

export function useLatestGalleryEvents(count: number = 3) {
  const [events, setEvents] = useState<GalleryEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const data = await sanityClient.fetch(`*[_type == "gallery"] | order(date desc)[0...${count}]`);
      setEvents(data);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching latest events:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [count]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return { events, loading, error, refetch: fetchEvents };
}

import { urlFor } from '../lib/sanity';

export function useGalleryEvent(id: string | undefined) {
  const [event, setEvent] = useState<GalleryEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchEvent = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await sanityClient.fetch(`*[_type == "gallery" && _id == $id][0]`, { id });
      
      if (data) {
        const processedCategories: GalleryCategory[] = [];
        
        if (data.highlights && data.highlights.length > 0) {
          processedCategories.push({
            name: "Highlights",
            color: "text-[#FF1493]",
            images: data.highlights.map((img: any) => ({ url: urlFor(img).url(), rot: (Math.random() * 6) - 3 }))
          });
        }
        if (data.BTS && data.BTS.length > 0) {
          processedCategories.push({
            name: "Behind the Scenes",
            color: "text-[#005986]",
            images: data.BTS.map((img: any) => ({ url: urlFor(img).url(), rot: (Math.random() * 6) - 3 }))
          });
        }
        if (data.studentsCollection && data.studentsCollection.length > 0) {
          processedCategories.push({
            name: "Students Collections",
            color: "text-[#a30037]",
            images: data.studentsCollection.map((img: any) => ({ url: urlFor(img).url(), rot: (Math.random() * 6) - 3 }))
          });
        }
        if (data.miscellaneous && data.miscellaneous.length > 0) {
          processedCategories.push({
            name: "Miscellaneous",
            color: "text-[#1a1a1a]",
            images: data.miscellaneous.map((img: any) => ({ url: urlFor(img).url(), rot: (Math.random() * 6) - 3 }))
          });
        }

        if (processedCategories.length === 0) {
          processedCategories.push({
            name: "No Photos",
            color: "text-[#1a1a1a]",
            images: []
          });
        }

        setEvent({
          ...data,
          id: data._id,
          color: "bg-[#FFC21A]",
          coverImage: data.coverPhoto ? urlFor(data.coverPhoto).url() : '',
          categories: processedCategories
        });
      } else {
        setEvent(null);
      }
      
      setError(null);
    } catch (err: any) {
      console.error("Error fetching gallery event:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  return { event, loading, error, refetch: fetchEvent };
}

// Unified export
export function useGallery() {
  return {
    useData: useGalleryData,
    useLatest: useLatestGalleryEvents,
    useEvent: useGalleryEvent
  };
}
