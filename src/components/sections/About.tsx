import React from 'react';
import { WordReveal } from '../ui/WordReveal';

export const About = () => {
  return (
    <section id="about" className="py-32 md:py-48 px-6 md:px-20 max-w-7xl mx-auto relative">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-4 flex flex-col justify-start">
          <h2 className="font-serif text-5xl md:text-7xl font-bold tracking-tighter mb-6">Our<br/>Vision.</h2>
          <div className="w-20 h-1 bg-[#a30037] mb-8" />
          <p className="font-hand text-3xl text-gray-600 rotate-[-2deg]">More than just a council.</p>
        </div>
        <div className="md:col-span-8">
          <WordReveal 
            text="We are the bridge between the student body and the faculty. A collective of passionate individuals dedicated to creating a vibrant, inclusive, and unforgettable high school experience. We don't just plan events; we build culture."
            className="font-serif text-3xl md:text-5xl leading-tight md:leading-[1.2]"
          />
        </div>
      </div>
    </section>
  );
};
