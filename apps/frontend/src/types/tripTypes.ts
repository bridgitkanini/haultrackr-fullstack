export interface TripData {
  currentLocation: string;
  pickupLocation: string;
  dropoffLocation: string;
  currentCycleHours: number;
  startTime?: Date;
  truckNumber?: string;
  odometerStart?: number;
  odometerEnd?: number;
  distance?: number;
  driverName?: string;
  driverId?: string;
  isCertified?: boolean;
  route_data?: any;
  stops?: any[];
}
export interface RoutePoint {
  type: 'pickup' | 'dropoff' | 'rest' | 'fuel';
  location: string;
  coordinates: [number, number];
  time: Date;
  duration?: number; // in minutes
}
export interface RouteData {
  points: RoutePoint[];
  totalDistance: number;
  totalDuration: number;
}
