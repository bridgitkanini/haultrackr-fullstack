import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import RouteDetailsPage from './pages/RouteDetailsPage';
import EldLogsPage from './pages/EldLogsPage';
import { TripData } from './types/tripTypes';

export function App() {
  const [tripData, setTripData] = useState<TripData | null>(null);

  const handleTripSubmit = (data: TripData) => {
    setTripData(data);
  };

  // Authentication is not required for any routes
  // This function is kept for compatibility but always returns true

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Routes>
            <Route
              path="/"
              element={
                !tripData ? (
                  <HomePage onTripSubmit={handleTripSubmit} />
                ) : (
                  <RouteDetailsPage tripData={tripData} />
                )
              }
            />
            <Route
              path="/route-details"
              element={
                tripData ? (
                  <RouteDetailsPage tripData={tripData} />
                ) : (
                  <div className="flex justify-center items-center h-64 text-lg text-red-600">
                    No trip data found. Please create a trip first.
                  </div>
                )
              }
            />
            <Route
              path="/eld-logs"
              element={
                tripData ? (
                  <EldLogsPage tripData={tripData} />
                ) : (
                  <div className="flex justify-center items-center h-64 text-lg text-red-600">
                    No trip data found. Please create a trip first.
                  </div>
                )
              }
            />
          </Routes>
        </main>
        <footer className="py-4 text-center text-sm text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800">
          &copy; {new Date().getFullYear()} Trip Route & ELD Log Generator
        </footer>
      </div>
    </Router>
  );
}
