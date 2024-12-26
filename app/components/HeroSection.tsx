import { useState, useEffect } from "react";
import { MapPin, Send, Calendar, Users } from "lucide-react";

const HeroSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [persons, setPersons] = useState("2");
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch('https://www.gocomet.com/api/assignment/hotels?page=1&size=100');
        const data = await response.json();
        setHotels(data.hotels || []); 
      } catch (error) {
        console.error('Hotels nhi mil rhe kya karu :( ', error);
        setHotels([]); 
      }
    };
    fetchHotels();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = hotels.filter(hotel => 
        hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotel.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredHotels(filtered);
      setShowDropdown(true);
    } else {
      setFilteredHotels([]);
      setShowDropdown(false);
    }
  }, [searchTerm, hotels]);

  const handleSearch = () => {
    if (!selectedHotel || !checkIn || !checkOut || !persons) {
      setError("Please fill properly");
      return;
    }
    
    setError("");
    window.location.href = `/hotels/${selectedHotel.id}?checkIn=${checkIn}&checkOut=${checkOut}&persons=${persons}`;
  };

  const selectHotel = (hotel) => {
    setSelectedHotel(hotel);
    setSearchTerm(hotel.name);
    setShowDropdown(false);
  };

  return (
    <section className="bg-white w-full py-12 relative">
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative z-10">
          <div
            className="absolute inset-0 right-0 -z-10"
            style={{
              backgroundImage: "url('/hero.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              maskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
              opacity: 0.5,
            }}
          />
          <div className="max-w-4xl">
            <h1 className="text-2xl md:text-3xl font-light mb-4 text-black">
              Find the Perfect deal, always.
            </h1>
            <p className="text-sm md:text-base text-gray-600 mb-6">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde non
              officiis soluta mollitia est optio nobis ipsa delectus quam nemo
              laborum ipsum, quod veniam enim, at numquam aliquid nihil
              reprehenderit accusantium laboriosam vel iure. Consequuntur, culpa?
              Distinctio error illum ab.
            </p>

            {/* Search Form Container */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 py-8 md:py-20">
              {/* Location Search */}
              <div className="bg-white w-full md:w-64 px-3 border border-black/10 relative">
                <div className="flex items-center gap-2">
                  <MapPin size={20} className="text-blue-500" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Type city, place..."
                    className="w-full p-2 outline-none bg-white text-gray-400"
                  />
                  <Send size={16} className="text-blue-500 absolute right-3" />
                </div>
                {showDropdown && filteredHotels.length > 0 && (
                  <div className="absolute top-full left-0 w-full bg-white border border-gray-200 mt-1 max-h-48 overflow-y-auto z-50">
                    {filteredHotels.map((hotel) => (
                      <div
                        key={hotel.id}
                        onClick={() => selectHotel(hotel)}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                      >
                        <div className="font-medium">{hotel.name}</div>
                        <div className="text-sm text-gray-500">{hotel.city}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Date Selection */}
              <div className="flex bg-white border px-2 border-black/10 items-center gap-2 w-full md:w-auto">
                <Calendar size={20} className="text-blue-500" strokeWidth={1.5} />
                <div className="border-l border-r  flex-1 md:flex-none">
                  <input
                    type="text"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    onFocus={(e) => (e.target.type = "date")}
                    onBlur={(e) => (e.target.type = "text")}
                    placeholder="Check-in"
                    className="p-2 bg-white text-gray-500 outline-none w-full min-w-[140px] md:w-24"
                  />
                </div>
                <div className="px-2 flex-1 md:flex-none">
                  <input
                    type="text"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    onFocus={(e) => (e.target.type = "date")}
                    onBlur={(e) => (e.target.type = "text")}
                    placeholder="Check-out"
                    className="p-2 bg-white text-gray-500 outline-none w-full min-w-[140px] md:w-24"
                  />
                </div>
              </div>

              {/* Persons Selection */}
              <div className="bg-white flex items-center gap-2 px-4 border border-black/10 w-full md:w-auto">
                <Users size={20} className="text-blue-500" strokeWidth={1.5} />
                <select 
                  value={persons}
                  onChange={(e) => setPersons(e.target.value)}
                  className="p-2 outline-none bg-white text-gray-400 appearance-none w-full md:w-8"
                >
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                </select>
              </div>

              {/* Search Button */}
              <button 
                onClick={handleSearch}
                className="bg-blue-600 text-white px-6 py-3 md:py-2 rounded hover:bg-blue-700 w-full md:w-auto"
              >
                Search
              </button>
            </div>
            {error && (
              <div className="text-red-500 mt-2">{error}</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;