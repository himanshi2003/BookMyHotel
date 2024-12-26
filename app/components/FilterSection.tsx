import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  isMobile?: boolean;
}

export function FilterSection({ title, children, isMobile = false }: FilterSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!isMobile) {
    return (
      <div className="border-t pb-3 md:pb-4 pt-3">
        <h3 className="font-semibold mb-2 text-xs md:text-sm text-black">{title}</h3>
        {children}
      </div>
    );
  }

  return (
    <div className="border-t pb-3">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex justify-between items-center py-2 group"
      >
        <h3 className="font-semibold text-xs text-black">{title}</h3>
        <div className="text-gray-500 group-hover:text-gray-700">
          {isExpanded ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </div>
      </button>
      <div className={`
        overflow-hidden transition-all duration-300 ease-in-out
        ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
      `}>
        {children}
      </div>
    </div>
  );
}