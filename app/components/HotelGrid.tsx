import { useState, useEffect } from 'react';
import HotelCard from './HotelCard';
import { Filters } from '../pages';

interface Hotel {
  id: string;
  name: string;
  city: string;
  rating: number;
  rooms: Array<{
    price: number;
  }>;
}

interface HotelGridProps {
  filters?: Filters;
}

const defaultFilters: Filters = {
  priceRanges: [],
  ratings: [],
  cities: []
};

const HotelGrid = ({ filters = defaultFilters }) => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalHotels, setTotalHotels] = useState(0);
  const [sortBy, setSortBy] = useState('');
  const [loading, setLoading] = useState(true);
  const pageSize = 6;

  console.log(filters , "filters pass hua bhi h kya");

  useEffect(() => {
    fetchHotels();
    setCurrentPage(1);
  }, [filters]);

  useEffect(() => {
    fetchHotels();
  }, [currentPage, sortBy]);

  const getPriceRange = (rangeLabel: string): [number, number] => {
    const ranges: { [key: string]: [number, number] } = {
      'Up to Rs. 1000': [0, 1000],
      'Rs. 1001 to Rs. 2000': [1001, 2000],
      'Rs. 2001 to Rs. 5000': [2001, 5000],
      'Above Rs. 5000': [5001, Infinity]
    };
    return ranges[rangeLabel] || [0, Infinity];
  };

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        'https://www.gocomet.com/api/assignment/hotels?page=1&size=100'
      );

      if (!response.ok) throw new Error('Failed to fetch hotels');

      const data = await response.json();
      let filteredHotels = data.hotels || [];

      console.log(filteredHotels)

      if (filters && Object.values(filters).some(f => f.length > 0)) {
        filteredHotels = filteredHotels.filter(hotel => {
          const priceMatch = !filters.priceRanges.length || filters.priceRanges.some(range => {
            const [min, max] = getPriceRange(range);
            const maxRoomPrice = Math.max(...(hotel.rooms?.map(r => Number(r.price) || 0) || [0]));
            return maxRoomPrice >= min && maxRoomPrice <= max;
          });

          const ratingMatch = !filters.ratings.length || 
            filters.ratings.some(rating => {
              const hotelRating = Number(hotel.rating) || 0;
              return hotelRating >= rating && hotelRating < rating + 1;
            });

          const cityMatch = !filters.cities.length || 
            filters.cities.some(city => 
              hotel.city.toLowerCase() === city.toLowerCase()
            );

          return priceMatch && ratingMatch && cityMatch;
        });
      }

      setHotels(filteredHotels);
      console.log( "Filetered Hotels",filteredHotels);
      setTotalHotels(filteredHotels.length);
      setTotalPages(Math.ceil(filteredHotels.length / pageSize));
    } catch (error) {
      console.error('Error fetching hotels:', error);
    } finally {
      setLoading(false);
    }
  };


  const calculatePriceRange = (rooms: Array<{ price: number }> = []): string => {
    if (!rooms || !rooms.length) return "N/A";
    const prices = rooms.map(room => Number(room.price) || 0);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    return `₹${minPrice.toLocaleString()} - ₹${maxPrice.toLocaleString()}`;
  };

  const sortHotels = (hotelsList: Hotel[], sortType: string): Hotel[] => {
    switch (sortType) {
      case 'price-low':
        return [...hotelsList].sort((a, b) => {
          const aMin = Math.min(...(a.rooms?.map(r => Number(r.price) || 0) || [0]));
          const bMin = Math.min(...(b.rooms?.map(r => Number(r.price) || 0) || [0]));
          return aMin - bMin;
        });
      case 'price-high':
        return [...hotelsList].sort((a, b) => {
          const aMax = Math.max(...(a.rooms?.map(r => Number(r.price) || 0) || [0]));
          const bMax = Math.max(...(b.rooms?.map(r => Number(r.price) || 0) || [0]));
          return bMax - aMax;
        });
      case 'rating':
        return [...hotelsList].sort((a, b) => 
          (Number(b.rating) || 0) - (Number(a.rating) || 0)
        );
      default:
        return hotelsList;
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo(0, 0);
    }
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 3;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded text-black ${
            i === currentPage ? 'bg-blue-600 text-white' : 'border hover:bg-gray-50'
          }`}
        >
          {i}
        </button>
      );
    }

    return buttons;
  };

  return (
    <section className="flex-1">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
        <h2 className="text-xl font-semibold text-black">
          Explore Hotels
        </h2>
        <select 
          className="w-full sm:w-auto p-2 border rounded"
          value={sortBy}
          onChange={handleSortChange}
        >
          <option value="">Sort by</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Rating</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading hotels...</div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {hotels
              .slice((currentPage - 1) * pageSize, currentPage * pageSize)
              .map((hotel) => (
                <HotelCard
                  key={hotel.id}
                  id={hotel.id}
                  name={hotel.name}
                  location={hotel.city}
                  rating={Number(hotel.rating) || 0}
                  price={calculatePriceRange(hotel.rooms)}
                />
              ))}
          </div>
          
          {totalHotels > pageSize && (
            <nav className="flex flex-wrap justify-center gap-2 mt-8" aria-label="Pagination">
              <button 
                className={`px-3 py-1 border rounded hover:bg-gray-50 text-gray-700 ${
                  currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Prev
              </button>
              
              <div className="flex flex-wrap gap-2 justify-center">
                {renderPaginationButtons()}
              </div>
              
              <button 
                className={`px-3 py-1 border rounded hover:bg-gray-50 text-black ${
                  currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </nav>
          )}
        </>
      )}
    </section>
  );
};

export default HotelGrid;