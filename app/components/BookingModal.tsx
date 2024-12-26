import { useState, useEffect } from 'react';
import {  X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '~/components/ui/alert';
import { useSearchParams } from '@remix-run/react';

const BookingModal = ({ isOpen, onClose, roomName, images, hotelName }) => {
  const [searchParams] = useSearchParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [persons, setPersons] = useState([
    { name: '', age: '', gender: '' },
  ]);
  const [dates, setDates] = useState({
    checkIn: '',
    checkOut: ''
  });
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  // Initialize from URL params if coming from search
  useEffect(() => {
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    const personCount = searchParams.get('persons');

    if (checkIn && checkOut) {
      setDates({
        checkIn,
        checkOut
      });
    }

    if (personCount) {
      setPersons(Array(parseInt(personCount)).fill().map(() => ({
        name: '',
        age: '',
        gender: ''
      })));
    }
  }, [searchParams]);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors = {};

    if (!dates.checkIn) newErrors.checkIn = 'Check-in date is required';
    if (!dates.checkOut) newErrors.checkOut = 'Check-out date is required';
    if (dates.checkIn && dates.checkOut && new Date(dates.checkIn) >= new Date(dates.checkOut)) {
      newErrors.dates = 'Check-out date must be after check-in date';
    }

    persons.forEach((person, index) => {
      if (!person.name) newErrors[`person${index}Name`] = 'Name is required';
      if (!person.age) newErrors[`person${index}Age`] = 'Age is required';
      else if (parseInt(person.age) < 1 || parseInt(person.age) > 120) {
        newErrors[`person${index}Age`] = 'Please enter a valid age';
      }
      if (!person.gender) newErrors[`person${index}Gender`] = 'Gender is required';
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddPerson = () => {
    if (persons.length < 4) {
      setPersons([...persons, { name: '', age: '', gender: '' }]);
    }
  };

  const handleRemovePerson = (index) => {
    if (persons.length > 1) {
      setPersons(persons.filter((_, i) => i !== index));
    }
  };

  const handlePersonChange = (index, field, value) => {
    const updatedPersons = [...persons];
    updatedPersons[index] = { ...updatedPersons[index], [field]: value };
    setPersons(updatedPersons);
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Success Alert */}
        {showSuccess && (
          <div className="absolute top-4 right-4 z-50">
            <Alert className="bg-green-50 border-green-200">
              <AlertTitle>Success!</AlertTitle>
              <AlertDescription>Your booking has been confirmed.</AlertDescription>
            </Alert>
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center gap-2">
            <span className="text-base font-normal">{hotelName}</span>
            <span className="text-gray-400 text-lg">›</span>
            <span className="text-base font-medium">{roomName}</span>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col md:flex-row flex-1 overflow-auto">
          {/* Left Section */}
          <div className="w-full md:w-1/2 p-4">
            <div className="relative aspect-video">
              <img
                src={images?.[currentImageIndex]}
                alt={`${roomName} ${currentImageIndex + 1}`}
                className="w-full h-full object-cover rounded"
                onError={(e) => { e.target.src = '/bed.jpeg'; }}
              />
              <button 
                onClick={() => setCurrentImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1)}
                className="absolute left-0 top-1/2 -translate-y-1/2 p-1 h-full bg-gradient-to-r from-black/40 to-transparent hover:from-black/60"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <button 
                onClick={() => setCurrentImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1)}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-1 h-full bg-gradient-to-l from-black/40 to-transparent hover:from-black/60"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Room Details */}
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-4">{roomName}</h2>
              <div className="flex flex-wrap gap-2 mb-6">
                {['Free Wi-Fi', 'TV', 'Air Conditioning', 'Private Bathroom'].map(amenity => (
                  <span key={amenity} className="px-4 py-2 rounded-full border border-blue-200 text-gray-600 text-sm">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
            <div className="space-y-2 text-sm mt-6 px-2 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">👥 Persons:</span>
                  <span className="text-blue-600 font-medium">{persons.length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">📅 Check-in:</span>
                  <span className="text-gray-600">
                    {dates.checkIn ? new Date(dates.checkIn).toLocaleDateString('en-GB') : 'Not selected'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">📅 Check-out:</span>
                  <span className="text-gray-600">
                    {dates.checkOut ? new Date(dates.checkOut).toLocaleDateString('en-GB') : 'Not selected'}
                  </span>
                </div>
                {dates.checkIn && dates.checkOut && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">🌙 Nights:</span>
                    <span className="text-blue-600 font-medium">
                      {Math.ceil((new Date(dates.checkOut) - new Date(dates.checkIn)) / (1000 * 60 * 60 * 24))}
                    </span>
                  </div>
                )}
              </div>
            
          </div>

          {/* Right Section - Form */}
          <div className="w-full md:w-1/2 p-4 md:border-l border-gray-200">
            {/* Date Selection */}
            <div className="space-y-4 mb-6">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <input
                  type="text"
                    onFocus={(e) => (e.target.type = "date")}
                    placeholder='Check-In'
                    onBlur={(e) => (e.target.type = "text")}
                    className={`w-full p-3 border rounded ${errors.checkIn ? 'border-red-500' : 'border-gray-200'}`}
                    value={dates.checkIn}
                    onChange={(e) => setDates(prev => ({ ...prev, checkIn: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  {errors.checkIn && <p className="text-red-500 text-sm mt-1">{errors.checkIn}</p>}
                </div>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    onFocus={(e) => (e.target.type = "date")}
                    onBlur={(e) => (e.target.type = "text")}
                    placeholder='Check-Out'
                    className={`w-full p-3 border rounded ${errors.checkOut ? 'border-red-500' : 'border-gray-200'}`}
                    value={dates.checkOut}
                    onChange={(e) => setDates(prev => ({ ...prev, checkOut: e.target.value }))}
                    min={dates.checkIn || new Date().toISOString().split('T')[0]}
                  />
                  {errors.checkOut && <p className="text-red-500 text-sm mt-1">{errors.checkOut}</p>}
                </div>
              </div>
              {errors.dates && <p className="text-red-500 text-sm">{errors.dates}</p>}
            </div>

            {/* Person Details */}
            {persons.map((person, index) => (
              <div key={index} className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-medium">Person {index + 1}</h3>
                  {persons.length > 1 && (
                    <button
                      onClick={() => handleRemovePerson(index)}
                      className="text-red-500 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  <div>
                    <input
                      type="text"
                      placeholder="Name"
                      className={`w-full border rounded p-2 ${errors[`person${index}Name`] ? 'border-red-500' : 'border-gray-200'}`}
                      value={person.name}
                      onChange={(e) => handlePersonChange(index, 'name', e.target.value)}
                    />
                    {errors[`person${index}Name`] && (
                      <p className="text-red-500 text-sm mt-1">{errors[`person${index}Name`]}</p>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <div className="w-24">
                      <input
                        type="number"
                        placeholder="Age"
                        className={`w-full border rounded p-2 ${errors[`person${index}Age`] ? 'border-red-500' : 'border-gray-200'}`}
                        value={person.age}
                        onChange={(e) => handlePersonChange(index, 'age', e.target.value)}
                      />
                      {errors[`person${index}Age`] && (
                        <p className="text-red-500 text-sm mt-1">{errors[`person${index}Age`]}</p>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex gap-2">
                        {['Male', 'Female'].map((gender) => (
                          <button
                            key={gender}
                            className={`flex-1 py-2 rounded text-sm ${
                              person.gender === gender.toLowerCase()
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100'
                            }`}
                            onClick={() => handlePersonChange(index, 'gender', gender.toLowerCase())}
                          >
                            {gender}
                          </button>
                        ))}
                      </div>
                      {errors[`person${index}Gender`] && (
                        <p className="text-red-500 text-sm mt-1">{errors[`person${index}Gender`]}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Add Person Button */}
            {persons.length < 4 && (
              <button
                onClick={handleAddPerson}
                className="text-blue-600 text-sm font-medium mb-6"
              >
                + ADD PERSON
              </button>
            )}

            {/* Book Button */}
            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition-colors"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;