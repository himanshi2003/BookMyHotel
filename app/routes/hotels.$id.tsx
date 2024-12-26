import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import HotelHeader from "~/components/HotelHeader";
import Navbar from "~/components/Header";
import RoomCard from "~/components/RoomCard";
import HotelDescription from "~/components/HotelDescription";

export const loader = async ({ params }) => {
  const { id } = params;
  console.log("Hotel ID:", id);
  try {
    const response = await fetch(
      `https://www.gocomet.com/api/assignment/hotels/${id}`
    );
    if (!response.ok) throw new Error("Hotel not found");
    const data = await response.json();
    console.log("Loader data:", data);
    return json(data);
  } catch (error) {
    console.error("Loader error:", error);
    throw error;
  }
};

export default function HotelDetail() {
  const { hotel } = useLoaderData();

  console.log(hotel.id + "id");

  if (!hotel) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <HotelHeader hotelData={hotel} />
      <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {hotel.rooms.map((room) => (
            <RoomCard
              key={room.id}
              {...room}
              hotelId={hotel.id}
              hotelName={hotel.name}
              showBookButton={true}
            />
          ))}
        </div>
      </div>
      <HotelDescription hotelId={hotel.id} />
    </div>
  );
}
