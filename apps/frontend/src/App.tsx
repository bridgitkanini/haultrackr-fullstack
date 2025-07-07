import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import RouteDetailsPage from "./pages/RouteDetailsPage";
import EldLogsPage from "./pages/EldLogsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { TripData } from "./types/tripTypes";
import { getTrips } from "./lib/api";

export function App() {
  const [tripData, setTripData] = useState<TripData | null>(null);
  const [loadingTrip, setLoadingTrip] = useState(false);

  // Fallback: fetch latest trip if tripData is missing and user is authenticated
  useEffect(() => {
    async function fetchLatestTrip() {
      if (!tripData && isAuthenticated()) {
        setLoadingTrip(true);
        try {
          const res = await getTrips();
          if (res.data && res.data.length > 0) {
            setTripData(res.data[res.data.length - 1]); // Use the latest trip
          }
        } catch {
          /* ignore error */
        }
        setLoadingTrip(false);
      }
    }
    fetchLatestTrip();
    // eslint-disable-next-line
  }, []);

  const handleTripSubmit = (data: TripData) => {
    setTripData(data);
  };

  function isAuthenticated() {
    return !!localStorage.getItem("access_token");
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/"
              element={
                isAuthenticated() ? (
                  <HomePage onTripSubmit={handleTripSubmit} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/route-details"
              element={
                isAuthenticated() ? (
                  tripData ? (
                    <RouteDetailsPage tripData={tripData} />
                  ) : loadingTrip ? (
                    <div className="flex justify-center items-center h-64 text-lg">
                      Loading trip data...
                    </div>
                  ) : (
                    <div className="flex justify-center items-center h-64 text-lg text-red-600">
                      No trip data found.
                    </div>
                  )
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/eld-logs"
              element={
                isAuthenticated() ? (
                  tripData ? (
                    <EldLogsPage tripData={tripData} />
                  ) : loadingTrip ? (
                    <div className="flex justify-center items-center h-64 text-lg">
                      Loading trip data...
                    </div>
                  ) : (
                    <div className="flex justify-center items-center h-64 text-lg text-red-600">
                      No trip data found.
                    </div>
                  )
                ) : (
                  <Navigate to="/login" />
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
