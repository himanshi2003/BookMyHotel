import { useEffect, useState } from 'react';

const HotelDescription = ({ hotelId }) => {
    const [description, setDescription] = useState(null);
   
    useEffect(() => {
      const fetchHotelDetails = async () => {
        try {
          const response = await fetch(`https://www.gocomet.com/api/assignment/hotels/${hotelId}`);
          const { hotel } = await response.json();
          setDescription(hotel);
        } catch (error) {
          console.error('Error:', error);
        }
      };
      fetchHotelDetails();
    }, [hotelId]);
   
    if (!description) return null;
   
    return (
      <section className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-4 text-black">About {description.name}</h2>
        <p className="text-gray-700 leading-relaxed">{description.description}</p>
      </section>
    );
   };
   
   export default HotelDescription;