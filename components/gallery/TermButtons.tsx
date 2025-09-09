"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface TermButtonsProps {
  terms: string[];
}

const TermButtons: React.FC<TermButtonsProps> = ({ terms }) => {
  const scrollToTerm = (term: string) => {
    const termId = term.toLowerCase().replace(/\s+/g, '');
    const element = document.getElementById(termId);
    
    if (element) {
      // Get the element's position relative to the viewport
      const elementRect = element.getBoundingClientRect();
      
      // Calculate the scroll position to center the element in the viewport
      const scrollTop = window.pageYOffset + elementRect.top - (window.innerHeight / 2) + (elementRect.height / 2);
      
      // Scroll the window instead of the container
      window.scrollTo({
        top: scrollTop,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="flex gap-1 pl-12">
      {terms.map((term) => (
        <Button
          key={term}
          variant="yellowOutline"
          onClick={() => scrollToTerm(term)}
          className="cursor-pointer"
        >
          {term}
        </Button>
      ))}
    </div>
  );
};

export default TermButtons;
