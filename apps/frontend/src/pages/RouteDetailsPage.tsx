import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Ruler, Truck, Calendar, Coffee } from 'lucide-react';
import { TripData, RouteData, RoutePoint } from '../types/tripTypes';
import RouteMap from '../components/RouteMap';

interface RouteDetailsPageProps {
  tripData: TripData;
}

function mapBackendRouteData(
  route_data: any,
  tripData: any,
  stops: any[]
): RouteData {
  // Build the points array: pickup, stops, dropoff
  const points: RoutePoint[] = [];

  // Pickup point
  points.push({
    type: 'pickup',
    location: tripData.trip?.pickup_location || tripData.pickup_location,
    coordinates: [0, 0], // You can improve this if you have coordinates
    time: new Date(), // You can improve this if you have times
  });

  // Stops (rest/fuel)
  for (const stop of stops) {
    points.push({
      type: stop.type.toLowerCase(), // "rest" or "fuel"
      location: stop.location,
      coordinates: [0, 0], // You can improve this if you have coordinates
      time: new Date(stop.planned_arrival),
      duration: stop.duration ? stop.duration * 60 : undefined, // hours to minutes
    });
  }

  // Dropoff point
  points.push({
    type: 'dropoff',
    location: tripData.trip?.dropoff_location || tripData.dropoff_location,
    coordinates: [0, 0], // You can improve this if you have coordinates
    time: new Date(), // You can improve this if you have times
  });

  return {
    points,
    totalDistance: route_data.distance,
    totalDuration: Math.round(route_data.duration / 3600), // seconds to hours
  };
}

const RouteDetailsPage: React.FC<RouteDetailsPageProps> = ({ tripData }) => {
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (tripData && tripData.route_data) {
      const mapped = mapBackendRouteData(
        tripData.route_data,
        tripData,
        tripData.stops || []
      );
      setRouteData(mapped);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [tripData]);
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
          <p className="mt-4 text-lg text-slate-700 dark:text-slate-300">
            Calculating optimal route...
          </p>
        </div>
      </div>
    );
  }
  if (!routeData) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="text-center">
          <p className="text-lg text-red-600 dark:text-red-400">
            Error generating route data. Please try again.
          </p>
          <Link
            to="/"
            className="mt-4 inline-block px-4 py-2 bg-teal-600 text-white rounded-md"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }
  // Format the date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  // Count stops by type
  const restStops = routeData.points.filter(
    (point) => point.type === 'rest'
  ).length;
  const fuelStops = routeData.points.filter(
    (point) => point.type === 'fuel'
  ).length;
  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Route Details
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            From {tripData.pickupLocation} to {tripData.dropoffLocation}
          </p>
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden h-[500px] md:h-[600px]">
              <RouteMap routeData={routeData} />
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">
                Trip Summary
              </h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Ruler className="h-5 w-5 text-teal-600 dark:text-teal-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Total Distance
                    </p>
                    <p className="text-lg font-medium text-slate-900 dark:text-white">
                      {routeData.totalDistance.toLocaleString()} miles
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Clock className="h-5 w-5 text-teal-600 dark:text-teal-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Estimated Duration
                    </p>
                    <p className="text-lg font-medium text-slate-900 dark:text-white">
                      {routeData.totalDuration} hours
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Calendar className="h-5 w-5 text-teal-600 dark:text-teal-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Schedule
                    </p>
                    <div>
                      <p className="text-slate-900 dark:text-white">
                        <span className="font-medium">Pickup:</span>{' '}
                        {formatDate(routeData.points[0].time)}
                      </p>
                      <p className="text-slate-900 dark:text-white">
                        <span className="font-medium">Drop-off:</span>{' '}
                        {formatDate(
                          routeData.points[routeData.points.length - 1].time
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Coffee className="h-5 w-5 text-teal-600 dark:text-teal-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Rest Stops
                    </p>
                    <p className="text-lg font-medium text-slate-900 dark:text-white">
                      {restStops}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-5 w-5 text-teal-600 dark:text-teal-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Fuel Stops
                    </p>
                    <p className="text-lg font-medium text-slate-900 dark:text-white">
                      {fuelStops}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold mb-3 text-slate-900 dark:text-white">
                  Route Points
                </h3>
                <div className="space-y-4">
                  {routeData.points.map((point, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        {point.type === 'pickup' && (
                          <MapPin className="h-5 w-5 text-green-600" />
                        )}
                        {point.type === 'dropoff' && (
                          <MapPin className="h-5 w-5 text-red-600" />
                        )}
                        {point.type === 'rest' && (
                          <Coffee className="h-5 w-5 text-blue-600" />
                        )}
                        {point.type === 'fuel' && (
                          <div className="h-5 w-5 text-yellow-600" />
                        )}
                      </div>
                      <div className="ml-3">
                        <p className="text-slate-900 dark:text-white font-medium">
                          {point.location}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {formatDate(point.time)}
                          {point.duration &&
                            ` (${
                              point.duration >= 60
                                ? `${point.duration / 60} hr`
                                : `${point.duration} min`
                            })`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-8 flex justify-between">
                <Link
                  to="/"
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600"
                >
                  Back to Home
                </Link>
                <Link
                  to="/eld-logs"
                  className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
                >
                  View ELD Logs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default RouteDetailsPage;
