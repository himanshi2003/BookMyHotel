import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";
import BookingModal from "./BookingModal";

interface RoomCardProps {
  id: string;
  hotelId: string;
  name: string;
  price: number;
  capacity: number;
  image_urls: string[];
  hotelName: string;
}

const RoomCard = ({
  //   id,
  //   hotelId,
  name,
  price,
  capacity,
  image_urls,
  hotelName,
}: RoomCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === image_urls.length - 1 ? 0 : prev + 1
    );
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? image_urls.length - 1 : prev - 1
    );
  };

  return (
    <>
      <div className="border rounded-lg overflow-hidden bg-white">
        <div className="relative flex justify-center">
          <img
            src={image_urls?.[currentImageIndex]}
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              const target = e.target as HTMLImageElement;
              target.src = "/bed.jpeg";
            }}
            alt={name}
            className="w-[90%] h-60 mt-4 object-cover"
          />
          <button
            onClick={previousImage}
            className="absolute left-5 top-1/2  text-white -translate-y-1/2 p-1 h-60 mt-2 bg-gradient-to-r from-black/40 to-transparent hover:from-black/60"

          >
            <ChevronLeft size={30} />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-5 top-1/2 text-white -translate-y-1/2 p-1 h-60 mt-2 bg-gradient-to-l from-black/40 to-transparent hover:from-black/60"
          >
            <ChevronRight size={30} />
          </button>
        </div>

        <div className="p-4 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-semibold text-black">{name}</h3>
            <div className="flex items-center gap-1">
              <Users size={16} className="text-gray-500" />
              <span className="text-gray-500">{capacity}</span>
            </div>
          </div>
          <div className="flex flex-col justify-between gap-5 items-start">
            <div>
              <span className="text-lg font-semibold text-black">
                ₹ {price}
              </span>
              <span className="text-gray-500 text-sm"> / night</span>
            </div>
            <div className="flex flex-row w-full justify-between items-center">
              <button className="px-4 py-2 border rounded-lg text-blue-600 hover:bg-blue-50">
                View facilities
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-3 block text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Book Now →
              </button>
            </div>
          </div>
        </div>
      </div>

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        roomName={name}
        hotelName={hotelName}
        images={image_urls}
      />
    </>
  );
};

export default RoomCard;