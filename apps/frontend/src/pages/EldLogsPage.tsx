import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Download,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  Truck,
  Info,
} from "lucide-react";
import { TripData } from "../types/tripTypes";
import { getLogs, generateLogs, getLog, getLogGrid } from "../lib/api";
import api from "../lib/api";

interface EldLogsPageProps {
  tripData: TripData;
}

interface LogEntry {
  start: string;
  end: string;
  status: string;
  location: string;
  notes: string;
}

const EldLogsPage: React.FC<EldLogsPageProps> = ({ tripData }) => {
  const [logs, setLogs] = useState<any[]>([]);
  const [logGrids, setLogGrids] = useState<(string | null)[]>([]);
  const [currentDay, setCurrentDay] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true);
      setError(null);
      setSuccess(null);
      try {
        // Generate logs for the trip (if not already generated)
        await generateLogs((tripData as any).id);
        // Fetch all logs for this trip
        const allLogsRes = await getLogs();
        // Filter logs for this trip
        const tripLogs = allLogsRes.data.filter(
          (log: any) => log.trip === (tripData as any).id
        );
        setLogs(tripLogs);
        // Fetch log grid images for each log
        const gridPromises = tripLogs.map(async (log: any) => {
          try {
            const res = await getLog(log.id);
            if (res.data && res.data.id) {
              const gridRes = await getLogGrid(res.data.id);
              const blob = new Blob([gridRes.data], {
                type: gridRes.headers["content-type"],
              });
              return URL.createObjectURL(blob);
            }
          } catch {
            return null;
          }
        });
        const grids = await Promise.all(gridPromises);
        setLogGrids(grids);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        setError("Failed to fetch ELD logs.");
      }
    };
    if ((tripData as any).id) {
      fetchLogs();
    }
  }, [tripData]);

  const handlePreviousDay = () => {
    setCurrentDay((prev) => Math.max(0, prev - 1));
  };
  const handleNextDay = () => {
    setCurrentDay((prev) => Math.min(logs.length - 1, prev + 1));
  };

  const log = logs[currentDay];
  const logGrid = logGrids[currentDay];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Driving":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "On Duty":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Off Duty":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "Sleeper":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200";
    }
  };

  // PDF Download
  const handleDownloadPdf = async () => {
    if (!log) return;
    setDownloading(true);
    setError(null);
    setSuccess(null);
    try {
      // Try to fetch PDF from backend (assume /logs/{id}/pdf/ endpoint)
      const res = await api.get(`/logs/${log.id}/pdf/`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(
        new Blob([res.data], { type: "application/pdf" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `eld-log-${log.date}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      setSuccess("PDF downloaded successfully.");
    } catch {
      setError("PDF download not available.");
    }
    setDownloading(false);
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Error/Success Feedback */}
        {error && <div className="mb-4 text-red-600 text-center">{error}</div>}
        {success && (
          <div className="mb-4 text-green-600 text-center">{success}</div>
        )}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              ELD Daily Logs
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Trip from {tripData.pickupLocation} to {tripData.dropoffLocation}
            </p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div className="flex items-center mb-4 md:mb-0">
              <button
                onClick={handlePreviousDay}
                disabled={currentDay === 0}
                className={`p-2 rounded-md ${
                  currentDay === 0
                    ? "bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                    : "bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600"
                }`}
                title="Previous Day"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="flex items-center ml-4">
                <Calendar className="h-5 w-5 text-teal-600 dark:text-teal-500 mr-2" />
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Day {currentDay + 1} of {logs.length} - {log?.date}
                </h2>
                <span
                  className="ml-2"
                  title="Each day represents a separate log sheet."
                >
                  <Info className="h-4 w-4 text-slate-400" />
                </span>
              </div>
              <button
                onClick={handleNextDay}
                disabled={currentDay === logs.length - 1}
                className={`ml-4 p-2 rounded-md ${
                  currentDay === logs.length - 1
                    ? "bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                    : "bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600"
                }`}
                title="Next Day"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            <button
              onClick={handleDownloadPdf}
              disabled={downloading || !log}
              className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-60 disabled:cursor-not-allowed"
              title="Download this day's log as PDF"
            >
              {downloading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin h-4 w-4 mr-2"
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
                  Downloading...
                </span>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </>
              )}
            </button>
          </div>
          <div className="mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-full max-w-3xl h-16 bg-slate-200 dark:bg-slate-700 rounded-lg relative">
                {/* Visual representation of HOS */}
                <div
                  className="absolute inset-y-0 left-0 bg-green-500 dark:bg-green-600"
                  style={{
                    width: "29%",
                  }}
                ></div>
                <div
                  className="absolute inset-y-0 bg-yellow-500 dark:bg-yellow-600"
                  style={{
                    left: "29%",
                    width: "12%",
                  }}
                ></div>
                <div
                  className="absolute inset-y-0 bg-green-500 dark:bg-green-600"
                  style={{
                    left: "41%",
                    width: "25%",
                  }}
                ></div>
                <div
                  className="absolute inset-y-0 bg-purple-500 dark:bg-purple-600"
                  style={{
                    left: "66%",
                    width: "34%",
                  }}
                ></div>
                {/* Time markers */}
                <div className="absolute top-full left-0 text-xs text-slate-600 dark:text-slate-400 mt-1">
                  00:00
                </div>
                <div className="absolute top-full left-1/4 text-xs text-slate-600 dark:text-slate-400 mt-1">
                  06:00
                </div>
                <div className="absolute top-full left-1/2 text-xs text-slate-600 dark:text-slate-400 mt-1">
                  12:00
                </div>
                <div className="absolute top-full left-3/4 text-xs text-slate-600 dark:text-slate-400 mt-1">
                  18:00
                </div>
                <div className="absolute top-full right-0 text-xs text-slate-600 dark:text-slate-400 mt-1">
                  24:00
                </div>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              <div className="flex items-center px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                Driving
              </div>
              <div className="flex items-center px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full text-sm">
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                On Duty
              </div>
              <div className="flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                Off Duty
              </div>
              <div className="flex items-center px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm">
                <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                Sleeper
              </div>
            </div>
          </div>
          {/* Log Grid Visualization */}
          {logGrid && (
            <div className="flex justify-center mb-8">
              <img
                src={logGrid}
                alt="ELD Log Grid"
                className="w-full max-w-3xl rounded shadow border border-slate-200 dark:border-slate-700"
              />
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-700">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                    Time Period
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                    Location
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody>
                {log?.entries.map((entry: LogEntry, index: number) => (
                  <tr
                    key={index}
                    className={
                      index % 2 === 0
                        ? "bg-white dark:bg-slate-800"
                        : "bg-slate-50 dark:bg-slate-750"
                    }
                  >
                    <td className="px-4 py-3 text-sm text-slate-900 dark:text-slate-200">
                      {entry.start} - {entry.end}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(
                          entry.status
                        )}`}
                      >
                        {entry.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900 dark:text-slate-200">
                      {entry.location}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900 dark:text-slate-200">
                      {entry.notes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">
              Daily Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
                <div className="flex items-center text-slate-900 dark:text-white mb-2">
                  <Clock className="h-5 w-5 text-teal-600 dark:text-teal-500 mr-2" />
                  <h4 className="text-sm font-medium">Hours of Service</h4>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    <span className="font-medium">Driving:</span>{" "}
                    {log?.drivingHours || 0} hrs
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    <span className="font-medium">On Duty:</span>{" "}
                    {log?.onDutyHours || 0} hrs
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    <span className="font-medium">Off Duty:</span>{" "}
                    {log?.offDutyHours || 0} hrs
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    <span className="font-medium">Sleeper:</span>{" "}
                    {log?.sleeperHours || 0} hrs
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    <span className="font-medium">Cycle Remaining:</span>{" "}
                    {log?.cycleRemaining || 0} hrs
                  </p>
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
                <div className="flex items-center text-slate-900 dark:text-white mb-2">
                  <Truck className="h-5 w-5 text-teal-600 dark:text-teal-500 mr-2" />
                  <h4 className="text-sm font-medium">Vehicle Information</h4>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    <span className="font-medium">Carrier Name:</span>{" "}
                    {log?.carrier_name || "N/A"}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    <span className="font-medium">Carrier Address:</span>{" "}
                    {log?.carrier_address || "N/A"}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    <span className="font-medium">Odometer Start:</span>{" "}
                    {log?.starting_odometer ?? "N/A"}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    <span className="font-medium">Odometer End:</span>{" "}
                    {log?.ending_odometer ?? "N/A"}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    <span className="font-medium">Total Miles:</span>{" "}
                    {log?.total_miles ?? "N/A"}
                  </p>
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
                <div className="flex items-center text-slate-900 dark:text-white mb-2">
                  <Calendar className="h-5 w-5 text-teal-600 dark:text-teal-500 mr-2" />
                  <h4 className="text-sm font-medium">Certification</h4>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    <span className="font-medium">Driver:</span> N/A
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    <span className="font-medium">Driver ID:</span> N/A
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    <span className="font-medium">Certified:</span> N/A
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    <span className="font-medium">Driver Signature:</span>{" "}
                    {log?.driver_signature || "N/A"}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    <span className="font-medium">Notes:</span>{" "}
                    {log?.notes || "N/A"}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    <span className="font-medium">Timestamp:</span> {log?.date}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Duty Status Changes Table */}
          <div className="overflow-x-auto mt-8">
            <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">
              Duty Status Changes
            </h3>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-700">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                    Start Time
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                    End Time
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                    Location
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                    Odometer
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                    Remarks
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                    Duration (hrs)
                  </th>
                </tr>
              </thead>
              <tbody>
                {log?.duty_status_changes?.map((change: any, idx: number) => (
                  <tr
                    key={idx}
                    className={
                      idx % 2 === 0
                        ? "bg-white dark:bg-slate-800"
                        : "bg-slate-50 dark:bg-slate-750"
                    }
                  >
                    <td className="px-4 py-3 text-sm text-slate-900 dark:text-slate-200">
                      {change.status_display || change.status}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900 dark:text-slate-200">
                      {change.start_time}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900 dark:text-slate-200">
                      {change.end_time}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900 dark:text-slate-200">
                      {change.location}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900 dark:text-slate-200">
                      {change.odometer}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900 dark:text-slate-200">
                      {change.remarks}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900 dark:text-slate-200">
                      {change.duration_hours}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-8 flex justify-between">
            <Link
              to="/route-details"
              className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600"
            >
              Back to Route
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EldLogsPage;
