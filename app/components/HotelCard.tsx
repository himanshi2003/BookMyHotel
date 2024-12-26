import { Link } from "@remix-run/react";

interface HotelCardProps {
    id: number;  // Change to number type
    name: string;
    location: string;
    rating: number;
    price: string;
    imageUrl?: string;
  }
  
  const HotelCard = ({ id, name, location, rating, price }: HotelCardProps) => (
    <Link to={`/hotels/${id}`} className="block">
  <article className="flex flex-col justify-center items-center border rounded overflow-hidden shadow-sm hover:shadow-md transition-shadow">
    <img 
      src={"/s1.jpeg"} 
      alt={name} 
      className="w-[90%] h-44 object-cover mt-3"
    />
    <div className="py-5 flex flex-col w-[90%]">
      <div className="flex flex-row justify-between items-center">
        <div>
          <h3 className="font-semibold text-lg text-black">{name}</h3>
          <p className="text-gray-600 text-sm text-black">{location}</p>
        </div>
        <div className="flex items-center">
          <span className="text-sm text-black">★ {rating}</span>
        </div>
      </div>
      <div className="flex justify-between items-center mt-4">
        <span className="font-semibold text-black ">₹ {price}</span>
        <button className="bg-blue-600 text-white px-4 py-1 rounded  text-sm hover:bg-blue-700">
          View →
        </button>
      </div>
    </div>
  </article>
  </Link>
);

export default HotelCard;