import { useState, useEffect, useCallback } from 'react';
import FilterSidebar from "../components/FilterSidebar";
import HotelGrid from "../components/HotelGrid";

// import Hotels from '~/components/Hotels';
export interface Filters {
  priceRanges: string[];
  ratings: number[];
  cities: string[];
}

const defaultFilters: Filters = {
  priceRanges: [],
  ratings: [],
  cities: []
};

export default function Home() {
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [cities, setCities] = useState<string[]>([]);
  const handleFilterChange = useCallback((newFilters: Filters) => {
    setFilters(newFilters);
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch(
          "https://www.gocomet.com/api/assignment/hotels?page=1&size=100"
        );
        if (!response.ok) throw new Error('Failed to fetch cities');
        const data = await response.json();
        const uniqueCities = Array.from(
          new Set(data.hotels.map((hotel: any) => hotel.city))
        ).sort();
        setCities(uniqueCities);
      } catch (error) {
        console.error('Error fetching cities:', error);
        setCities([]);
      }
    };

    fetchCities();
  }, []);

  return (
        <div className="max-w-7xl mx-auto  py-8 flex gap-8">
          <FilterSidebar 
            onFilterChange={handleFilterChange} 
            cities={cities}
            initialFilters={filters}
          />
          <HotelGrid key={JSON.stringify(filters)} filters={filters} />

        
    </div>
  );
}
