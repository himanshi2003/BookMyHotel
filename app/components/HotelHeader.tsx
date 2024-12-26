import { ArrowLeft, Star } from 'lucide-react';
import { Link } from '@remix-run/react';

const HotelHeader = ({ hotelData }) => {
  if (!hotelData) return null;

  const { name = 'Hotel Name', city = 'Location', rating = 4.5, images = [] } = hotelData;
  const defaultImage = "/bg-ex.png";
  const displayRating = typeof rating === 'number' ? rating.toFixed(1) : '4.5';

  return (
    <header className="relative h-[400px] text-white">
      <img 
        src={images[0] || defaultImage} 
        alt={`${name} Exterior`} 
        className="w-full h-full object-cover brightness-75" 
      />
      
      <div className="absolute top-4 left-4 flex ">
        <Link to="/" className="p-2 bg-white/20  rounded-full hover:bg-white/30 transition">
          <ArrowLeft size={24} />
        </Link>
      </div>
      
      <div className="absolute top-40 left-0 w-full text-center">
        <h1 className="text-4xl font-semibold mb-4">{name}</h1>
        <div className="flex items-center justify-center gap-4">
          <span>{city}, India</span>
          <div className="flex items-center gap-1">
            <Star size={16} fill="white" />
            <span>{displayRating}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HotelHeader;