import React, { useState, useEffect } from 'react';
import { Filter, X } from 'lucide-react';
import { FilterSection } from './FilterSection';

interface Filters {
  priceRanges: string[];
  ratings: number[];
  cities: string[];
}

interface FilterSidebarProps {
  onFilterChange?: (filters: Filters) => void;
  cities?: string[];
  initialFilters?: Filters;
}

const defaultFilters: Filters = {
  priceRanges: [],
  ratings: [],
  cities: []
};

const FilterSidebar: React.FC<FilterSidebarProps> = ({ 
  onFilterChange = () => {},
  cities = [],
  initialFilters = defaultFilters
}) => {
  const [selectedFilters, setSelectedFilters] = useState(initialFilters);
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setSelectedFilters(initialFilters);
  }, [initialFilters]);

  const handleFilterSelect = (type: keyof Filters, value: string | number) => {
    const newFilters = {
      ...selectedFilters,
      [type]: type === 'priceRanges'
        ? selectedFilters[type].includes(value) ? [] : [value]
        : selectedFilters[type].includes(value)
          ? selectedFilters[type].filter(item => item !== value)
          : [...selectedFilters[type], value]
    };
    
    setSelectedFilters(newFilters);
    onFilterChange(newFilters);
  };
  const handleClearAll = () => {
    setSelectedFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  console.log("Jo Bhi Selected Filter h: ", selectedFilters);

  const hasSelectedFilters = Object.values(selectedFilters).some(arr => arr.length > 0);

  const sidebarContent = (
    <div className="flex flex-col h-full w-full">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold text-gray-900">Filters</h2>
          {hasSelectedFilters && (
            <button 
              className="text-blue-600 text-sm hover:text-blue-700"
              onClick={handleClearAll}
            >
              CLEAR ALL
            </button>
          )}
        </div>
        {hasSelectedFilters && (
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedFilters.priceRanges.map((range) => (
              <div
                key={`price-${range}`}
                className="flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm"
              >
                {range}
                <button
                  onClick={() => handleFilterSelect('priceRanges', range)}
                  className="ml-1 hover:text-blue-800"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            {selectedFilters.ratings.map((rating) => (
              <div
                key={`rating-${rating}`}
                className="flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm"
              >
                {`${rating} - ${rating + 1} Star`}
                <button
                  onClick={() => handleFilterSelect('ratings', rating)}
                  className="ml-1 hover:text-blue-800"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            {selectedFilters.cities.map((city) => (
              <div
                key={`city-${city}`}
                className="flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm"
              >
                {city}
                <button
                  onClick={() => handleFilterSelect('cities', city)}
                  className="ml-1 hover:text-blue-800"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <FilterSection title="PRICE RANGE" isMobile={isMobile}>
        {['Up to Rs. 1000', 'Rs. 1001 to Rs. 2000', 'Rs. 2001 to Rs. 5000', 'Above Rs. 5000'].map(range => (
          <label key={range} className="flex items-center gap-2 py-1">
            <input 
              type="checkbox" 
              className="accent-blue-600 bg-white"
              checked={selectedFilters.priceRanges.includes(range)}
              onChange={() => handleFilterSelect('priceRanges', range)}
            />
            <span className="text-sm text-gray-900">{range}</span>
          </label>
        ))}
      </FilterSection>

      <FilterSection title="RATING" isMobile={isMobile}>
        {[4, 3, 2, 1, 0].map(rating => (
          <label key={rating} className="flex items-center gap-2 py-1">
            <input 
              type="checkbox" 
              className="accent-blue-600"
              checked={selectedFilters.ratings.includes(rating)}
              onChange={() => handleFilterSelect('ratings', rating)}
            />
            <span className="text-sm text-gray-900">{`${rating} - ${rating + 1} Star`}</span>
          </label>
        ))}
      </FilterSection>

      <FilterSection title="CITY" isMobile={isMobile}>
        {(cities.length > 0 ? cities : ['Mumbai', 'Kolkata', 'Bangalore', 'Jaipur']).map(city => (
          <label key={city} className="flex items-center gap-2 py-1">
            <input 
              type="checkbox" 
              className="accent-blue-600 bg-white"
              checked={selectedFilters.cities.includes(city)}
              onChange={() => handleFilterSelect('cities', city)}
            />
            <span className="text-sm text-gray-900">{city}</span>
          </label>
        ))}
      </FilterSection>
    </div>
  );

  if (isMobile) {
    return (
      <>
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="md:hidden fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg flex items-center justify-center z-50"
        >
          <Filter size={24} />
        </button>

        <div className={`fixed inset-0 z-40 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
        <div 
            role="button"
            tabIndex={0}
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsSidebarOpen(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setIsSidebarOpen(false);
              }
            }}
            aria-label="Close sidebar overlay"
          />
          <div className="absolute top-0 left-0 h-full w-64 bg-white shadow-xl">
            <div className="h-full overflow-y-auto p-4">
              {sidebarContent}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <aside className="hidden md:block w-64 flex-shrink-0 border-r bg-white ">
      {sidebarContent}
    </aside>
  );
};

export default FilterSidebar;