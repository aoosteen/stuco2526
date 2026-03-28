import React from 'react';
import { cn } from '../../lib/utils';

export const Tape = ({ className, rotation = -3 }: { className?: string, rotation?: number }) => (
  <div 
    className={cn("tape w-24 h-6", className)} 
    style={{ transform: `rotate(${rotation}deg)` }}
  >
    <div className="w-full h-full bg-white/40 backdrop-blur-sm border-t border-b border-white/20 shadow-sm" />
  </div>
);
