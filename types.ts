
export type UserRole = 'PASSENGER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  password?: string;
}

export enum ServiceType {
  FOOD = 'Food & Dining',
  RESTROOM = 'Restroom',
  TICKET = 'Ticket Counter',
  MEDICAL = 'Medical Room',
  ATM = 'ATM',
  CLOAKROOM = 'Cloakroom',
  WAITING = 'Waiting Area',
  SHOP = 'Shops & Kiosks',
  OTHER = 'Other Services'
}

export interface Facility {
  id: string;
  name: string;
  type: ServiceType;
  platform: number;
  locationDetails: string;
}

export interface Platform {
  number: number;
  facilities: Facility[];
}

export interface Station {
  id: string;
  name: string;
  code: string;
  city: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  platforms: Platform[];
  entryPoints: string[];
  exitPoints: string[];
}

export interface Train {
  id: string;
  number: string;
  name: string;
  arrivalTime: string;
  departureTime: string;
  platform: number;
  status: 'ON_TIME' | 'DELAYED' | 'CANCELLED';
  delayInMinutes?: number;
}
