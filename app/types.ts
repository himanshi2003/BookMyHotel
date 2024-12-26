export interface HotelCardProps {
    id?: string;
    name: string;
    location: string;
    rating: number;
    price: string;
    imageUrl?: string;
  }
  
  export interface FilterSection {
    title: string;
    children: React.ReactNode;
  }

  // types.ts
export interface Room {
  id: string;
  name: string;
  price: number;
  description?: string;
}

export interface Hotel {
  id: string;
  name: string;
  city: string;
  rating: number;
  rooms: Room[];
}

export interface Filters {
  priceRanges: string[];
  ratings: number[];
  cities: string[];
}

export interface HotelGridProps {
  filters: Filters;
}

export interface HotelFiltersProps {
  onFilterChange: (filters: Filters) => void;
}