import { Mail } from 'lucide-react';
import { FaInstagram, FaTiktok } from "react-icons/fa";
import { AiOutlineYoutube } from "react-icons/ai";

export const NAV_ITEMS = [
  {
    name: "Home",
    path: "/",
    color: "#FF1493",
    desc: "Back to start",
    isHash: false,
  },
  {
    name: "Members",
    path: "/members",
    color: "#024a70",
    desc: "Meet the team",
    isHash: false,
  },
  {
    name: "Blog",
    path: "/blog",
    color: "#8b0836",
    desc: "Read our stories",
    isHash: false,
  },
  {
    name: "Gallery",
    path: "/gallery",
    color: "#FFC21A",
    desc: "See our memories",
    isHash: false,
  },
  {
    name: "Contact",
    path: "contact",
    color: "#ffbd9b",
    desc: "Get in touch",
    isHash: true,
  },
];

export const FOOTER_LINKS = {
  email: {
    label: 'studentcouncil@jny.sch.id',
    href: 'mailto:studentcouncil@jny.sch.id',
    icon: Mail,
    hoverColor: '#8b0836'
  },
  socials: [
    {
      label: 'Instagram',
      handle: '@jnystudentcouncil',
      href: 'https://www.instagram.com/jnystudentcouncil',
      icon: FaInstagram,
      hoverColor: '#FF1493'
    },
    {
      label: 'YouTube',
      handle: '@jnystudentcouncil',
      href: 'https://www.youtube.com/@jnystudentcouncil',
      icon: AiOutlineYoutube,
      hoverColor: '#c4302b' // Changed to a redder shade for YT
    },
    {
      label: 'TikTok',
      handle: '@jnystudentcouncil',
      href: 'https://www.tiktok.com/@jnystudentcouncil',
      icon: FaTiktok,
      hoverColor: '#00F2EA' // Cyan for TikTok
    }
  ]
};
