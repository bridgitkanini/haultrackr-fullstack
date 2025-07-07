import React, { useState } from 'react';
import { MapPin, Navigation, Flag, Clock } from 'lucide-react';
import { TripData } from '../types/tripTypes';
import { createTrip, planTrip, getTrip } from '../lib/api';

interface TripFormProps {
  onSubmit: (data: TripData) => void;
}
const TripForm: React.FC<TripFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<TripData>({
    currentLocation: '',
    pickupLocation: '',
    dropoffLocation: '',
    currentCycleHours: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'currentCycleHours' ? parseFloat(value) || 0 : value,
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Map formData to backend snake_case keys
      const payload = {
        current_location: formData.currentLocation,
        pickup_location: formData.pickupLocation,
        dropoff_location: formData.dropoffLocation,
        current_cycle_hours: formData.currentCycleHours,
      };
      // 1. Create the trip
      const tripRes = await createTrip(payload);
      const tripId = tripRes.data.id;
      // 2. Plan the trip (generate route, stops, etc.)
      const plannedTripRes = await planTrip(tripId);
      setIsLoading(false);
      onSubmit(plannedTripRes.data); // Pass the planned trip data up
    } catch (err: any) {
      setIsLoading(false);
      // Log the backend error for debugging
      if (err.response && err.response.data && err.response.data.error) {
        alert('Failed to create and plan trip: ' + err.response.data.error);
        console.error('Backend error:', err.response.data.error);
      } else {
        alert('Failed to create and plan trip. Please try again.');
        console.error(err);
      }
    }
  };
  const detectCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, you would reverse geocode these coordinates
          setFormData((prev) => ({
            ...prev,
            currentLocation: `${position.coords.latitude.toFixed(
              4
            )}, ${position.coords.longitude.toFixed(4)}`,
          }));
          setIsLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLoading(false);
          alert('Unable to detect location. Please enter manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };
  const isFormValid =
    formData.currentLocation &&
    formData.pickupLocation &&
    formData.dropoffLocation &&
    formData.currentCycleHours >= 0;
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 md:p-8"
    >
      <h2 className="text-2xl font-bold mb-6 text-center text-slate-900 dark:text-white">
        Plan Your Trip
      </h2>
      <div className="space-y-6">
        <div className="relative">
          <label
            htmlFor="currentLocation"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
          >
            Current Location
          </label>
          <div className="flex">
            <div className="relative flex-grow">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <Navigation className="h-5 w-5" />
              </span>
              <input
                type="text"
                id="currentLocation"
                name="currentLocation"
                value={formData.currentLocation}
                onChange={handleChange}
                placeholder="Enter your current location"
                className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-l-md focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                required
              />
            </div>
            <button
              type="button"
              onClick={detectCurrentLocation}
              className="px-3 py-2 bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-r-md hover:bg-slate-300 dark:hover:bg-slate-500 focus:outline-none"
              title="Detect current location"
            >
              <MapPin className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="relative">
          <label
            htmlFor="pickupLocation"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
          >
            Pickup Location
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
              <MapPin className="h-5 w-5" />
            </span>
            <input
              type="text"
              id="pickupLocation"
              name="pickupLocation"
              value={formData.pickupLocation}
              onChange={handleChange}
              placeholder="Enter pickup location"
              className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              required
            />
          </div>
        </div>
        <div className="relative">
          <label
            htmlFor="dropoffLocation"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
          >
            Drop-off Location
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
              <Flag className="h-5 w-5" />
            </span>
            <input
              type="text"
              id="dropoffLocation"
              name="dropoffLocation"
              value={formData.dropoffLocation}
              onChange={handleChange}
              placeholder="Enter drop-off location"
              className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              required
            />
          </div>
        </div>
        <div className="relative">
          <label
            htmlFor="currentCycleHours"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
          >
            Current Cycle Used (Hrs)
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
              <Clock className="h-5 w-5" />
            </span>
            <input
              type="number"
              id="currentCycleHours"
              name="currentCycleHours"
              value={formData.currentCycleHours}
              onChange={handleChange}
              min="0"
              max="70"
              step="0.5"
              placeholder="Enter hours used in current cycle"
              className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              required
            />
          </div>
        </div>
      </div>
      <div className="mt-8">
        <button
          type="submit"
          disabled={!isFormValid || isLoading}
          className={`w-full py-3 px-4 flex justify-center items-center rounded-md text-white font-medium ${
            isFormValid && !isLoading
              ? 'bg-teal-600 hover:bg-teal-700 focus:ring-2 focus:ring-offset-2 focus:ring-teal-500'
              : 'bg-slate-400 cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </span>
          ) : (
            'Generate Route & Log'
          )}
        </button>
      </div>
    </form>
  );
};
export default TripForm;
