import { useState, useEffect } from 'react';
import { sanityClient, urlFor } from '../lib/sanity';

export interface Member {
  _id: string;
  name: string;
  position: string;
  description?: string;
  events?: string[];
  image?: any;
  twoWords?: string;
  // Transformed properties
  role?: string;
  bio?: string;
  grade?: string;
  color?: string;
  rotation?: number;
  imageUrl?: string;
}

const MAJOR_ORDER = [
  "StuCo Advisor",
  "President",
  "Vice-President",
  "Secretary General",
  "Finance and Logistics Officer",
  "Public Relations Officer",
];

const REP_ORDER = [
  "JC2 Level Representative",
  "JC1 Level Representative",
  "Sec 4 Level Representative",
  "Sec 3 Level Representative",
  "Sec 2 Level Representative",
  "Sec 1 Level Representative",
];

const FULL_ORDER = [...MAJOR_ORDER, ...REP_ORDER];

const COLOR_MAP = [
  "bg-[#b8e6fe]",
  "bg-[#ffbd9b]",
  "bg-[#ffffff]",
  "bg-[#b8e6fe]",
  "bg-[#ffbd9b]",
];
const ROTATION_MAP = [-2, 3, -1, 2, -3];

const REP_COLOR_MAP = [
  "bg-[#ffffff]",
  "bg-[#b8e6fe]",
  "bg-[#ffbd9b]",
  "bg-[#ffffff]",
];
const REP_ROTATION_MAP = [1, -2, 2, -1];

export const useMember = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [boardMembers, setBoardMembers] = useState<Member[]>([]); // For Members.tsx "The Council"
  const [levelReps, setLevelReps] = useState<Member[]>([]); // For Members.tsx "Level Representatives"
  const [allSortedMembers, setAllSortedMembers] = useState<Member[]>([]); // For Board.tsx
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    sanityClient.fetch('*[_type == "members"]').then((data: Member[]) => {
      setMembers(data);

      const majors = MAJOR_ORDER.map((role, index) => {
        const found = data.find((m) => m.position === role);
        return found
          ? {
              ...found,
              role: found.position,
              bio: found.description || "",
              events: found.events || [],
              color: COLOR_MAP[index % COLOR_MAP.length],
              rotation: ROTATION_MAP[index % ROTATION_MAP.length],
              imageUrl: found.image
                ? urlFor(found.image).url()
                : "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=800&auto=format&fit=crop",
            }
          : null;
      }).filter(Boolean) as Member[];

      const reps = REP_ORDER.map((role, index) => {
        const found = data.find((m) => m.position === role);
        const gradeMatch = role.match(/^(.*?) Level Representative$/);
        return found
          ? {
              ...found,
              grade: gradeMatch ? gradeMatch[1] : role,
              bio: found.description || "",
              events: found.events || [],
              color: REP_COLOR_MAP[index % REP_COLOR_MAP.length],
              rotation: REP_ROTATION_MAP[index % REP_ROTATION_MAP.length],
              imageUrl: found.image
                ? urlFor(found.image).url()
                : "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
            }
          : null;
      }).filter(Boolean) as Member[];

      // For Board.tsx: Sorted list of all members
      const sortedFull = FULL_ORDER.map((role) => {
        return data.find(m => m.position === role);
      }).filter(Boolean) as Member[];

      const otherMembers = data.filter(m => !FULL_ORDER.includes(m.position));
      
      setBoardMembers(majors);
      setLevelReps(reps);
      setAllSortedMembers([...sortedFull, ...otherMembers]);
      setLoading(false);
    }).catch(err => {
      console.error("Error fetching members:", err);
      setLoading(false);
    });
  }, []);

  return {
    members,
    boardMembers,
    levelReps,
    allSortedMembers,
    loading
  };
};
