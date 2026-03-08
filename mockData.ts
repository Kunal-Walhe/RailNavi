
import { Station, Train, User, ServiceType } from './types';

export const MOCK_USERS: User[] = [
  { id: '1', name: 'Admin User', role: 'ADMIN', email: 'Admin@1', password: '1234' },
  { id: '2', name: 'John Doe', role: 'PASSENGER', email: 'john@gmail.com' },
];

export const MOCK_STATIONS: Station[] = [
  {
    id: 's1',
    name: 'Pune Junction',
    code: 'PUNE',
    city: 'Pune',
    coordinates: { lat: 18.5289, lng: 73.8744 },
    platforms: [
      {
        number: 1,
        facilities: [
          { id: 'p1f1', name: 'Comesum Food Plaza', type: ServiceType.FOOD, platform: 1, locationDetails: 'Main Entrance Side' },
          { id: 'p1f2', name: 'Executive Waiting Lounge', type: ServiceType.WAITING, platform: 1, locationDetails: 'Near Clock Tower' },
          { id: 'p1f3', name: 'SBI ATM', type: ServiceType.ATM, platform: 1, locationDetails: 'Beside Ticket Window' },
          { id: 'p1f4', name: 'Drinking Water', type: ServiceType.RESTROOM, platform: 1, locationDetails: 'Every 50m' }
        ]
      },
      {
        number: 2,
        facilities: [
          { id: 'p2f1', name: 'Amul Parlour', type: ServiceType.FOOD, platform: 2, locationDetails: 'Middle of Platform' },
          { id: 'p2f2', name: 'General Restroom', type: ServiceType.RESTROOM, platform: 2, locationDetails: 'End of Platform (Mumbai side)' },
          { id: 'p2f3', name: 'Book Stall', type: ServiceType.SHOP, platform: 2, locationDetails: 'Near Overbridge' }
        ]
      },
      {
        number: 3,
        facilities: [
          { id: 'p3f1', name: 'Medical Room', type: ServiceType.MEDICAL, platform: 3, locationDetails: 'Near Station Master Office' },
          { id: 'p3f2', name: 'Tea Stall', type: ServiceType.FOOD, platform: 3, locationDetails: 'Daund End' }
        ]
      },
      {
        number: 4,
        facilities: [
          { id: 'p4f1', name: 'Waiting Hall', type: ServiceType.WAITING, platform: 4, locationDetails: 'Center' },
          { id: 'p4f2', name: 'Water Cooler', type: ServiceType.RESTROOM, platform: 4, locationDetails: 'Near Stairs' }
        ]
      },
      {
        number: 5,
        facilities: [
          { id: 'p5f1', name: 'Snack Bar', type: ServiceType.FOOD, platform: 5, locationDetails: 'Mumbai End' }
        ]
      },
      {
        number: 6,
        facilities: [
          { id: 'p6f1', name: 'Parcel Office', type: ServiceType.OTHER, platform: 6, locationDetails: 'Rear Entrance' }
        ]
      }
    ],
    entryPoints: ['Main Gate (HH Agakhan Rd)', 'Second Entry (Raja Bahadur Mill Rd)'],
    exitPoints: ['Main Gate', 'Second Entry']
  },
  {
    id: 's2',
    name: 'Chhatrapati Shivaji Maharaj Terminus',
    code: 'CSMT',
    city: 'Mumbai',
    coordinates: { lat: 18.9400, lng: 72.8353 },
    platforms: Array.from({ length: 18 }, (_, i) => ({
      number: i + 1,
      facilities: [
        { id: `px${i}f1`, name: 'Digital Display', type: ServiceType.OTHER, platform: i + 1, locationDetails: 'Center' },
        { id: `px${i}f2`, name: 'Water Vending', type: ServiceType.RESTROOM, platform: i + 1, locationDetails: 'Near Stairs' },
        ...(i === 0 ? [
          { id: 'c1f1', name: 'Heritage Gallery', type: ServiceType.WAITING, platform: 1, locationDetails: 'Main Concourse' },
          { id: 'c1f2', name: 'Emergency Medical Center', type: ServiceType.MEDICAL, platform: 1, locationDetails: 'Platform 1 Start' }
        ] : [])
      ]
    })),
    entryPoints: ['Main Terminal Entrance', 'P D\'Mello Road Entry'],
    exitPoints: ['Fort Side Exit', 'P D\'Mello Exit']
  },
  {
    id: 's3',
    name: 'Jalgaon Junction',
    code: 'JL',
    city: 'Jalgaon',
    coordinates: { lat: 21.0183, lng: 75.5631 },
    platforms: [
      {
        number: 1,
        facilities: [
          { id: 'j1f1', name: 'Jalgaon Refreshment Room', type: ServiceType.FOOD, platform: 1, locationDetails: 'Near Main Entrance' },
          { id: 'j1f2', name: 'Ticket Counter', type: ServiceType.TICKET, platform: 1, locationDetails: 'Entry Hall' },
          { id: 'j1f3', name: 'Cloak Room', type: ServiceType.OTHER, platform: 1, locationDetails: 'Far Left' }
        ]
      },
      {
        number: 2,
        facilities: [
          { id: 'j2f1', name: 'Fruit Stall', type: ServiceType.FOOD, platform: 2, locationDetails: 'Center' }
        ]
      },
      {
        number: 3,
        facilities: [
          { id: 'j3f1', name: 'Waiting Hall', type: ServiceType.WAITING, platform: 3, locationDetails: 'Center of Platform' },
          { id: 'j3f2', name: 'Help Desk', type: ServiceType.OTHER, platform: 3, locationDetails: 'Stairs Base' }
        ]
      },
      {
        number: 4,
        facilities: [
          { id: 'j4f1', name: 'Water Cooler', type: ServiceType.RESTROOM, platform: 4, locationDetails: 'End' }
        ]
      }
    ],
    entryPoints: ['Main Gate (Station Rd)', 'North Side Entry'],
    exitPoints: ['Main Gate', 'North Side Exit']
  },
  {
    id: 's4',
    name: 'Nagpur Junction',
    code: 'NGP',
    city: 'Nagpur',
    coordinates: { lat: 21.1522, lng: 79.0887 },
    platforms: Array.from({ length: 8 }, (_, i) => ({
      number: i + 1,
      facilities: [
        { id: `n${i}f1`, name: 'Haldirams Outlet', type: ServiceType.FOOD, platform: i + 1, locationDetails: 'Center' },
        { id: `n${i}f2`, name: 'Orange City Stall', type: ServiceType.SHOP, platform: i + 1, locationDetails: 'Near Bridge' }
      ]
    })),
    entryPoints: ['Main West Gate', 'East Gate (Santra Market)'],
    exitPoints: ['Main West Gate', 'East Gate']
  },
  {
    id: 's5',
    name: 'Nashik Road',
    code: 'NK',
    city: 'Nashik',
    coordinates: { lat: 19.9472, lng: 73.8422 },
    platforms: [
      { number: 1, facilities: [{ id: 'nk1f1', name: 'VIP Lounge', type: ServiceType.WAITING, platform: 1, locationDetails: 'Entry' }] },
      { number: 2, facilities: [{ id: 'nk2f1', name: 'Book Store', type: ServiceType.SHOP, platform: 2, locationDetails: 'Mid' }] },
      { number: 3, facilities: [{ id: 'nk3f1', name: 'Tea Stall', type: ServiceType.FOOD, platform: 3, locationDetails: 'Mid' }] },
      { number: 4, facilities: [{ id: 'nk4f1', name: 'Water Tap', type: ServiceType.RESTROOM, platform: 4, locationDetails: 'End' }] }
    ],
    entryPoints: ['Main Road Entry'],
    exitPoints: ['Main Road Exit']
  },
  {
    id: 's6',
    name: 'Solapur Junction',
    code: 'SUR',
    city: 'Solapur',
    coordinates: { lat: 17.6639, lng: 75.8931 },
    platforms: [
      { number: 1, facilities: [{ id: 'su1f1', name: 'Siddheshwar Canteen', type: ServiceType.FOOD, platform: 1, locationDetails: 'Entry' }] },
      { number: 2, facilities: [{ id: 'su2f1', name: 'Waiting Room', type: ServiceType.WAITING, platform: 2, locationDetails: 'Mid' }] },
      { number: 3, facilities: [{ id: 'su3f1', name: 'Dairy Stall', type: ServiceType.FOOD, platform: 3, locationDetails: 'End' }] }
    ],
    entryPoints: ['Main Entrance'],
    exitPoints: ['Main Exit']
  },
  {
    id: 's7',
    name: 'Bhusaval Junction',
    code: 'BSL',
    city: 'Bhusaval',
    coordinates: { lat: 21.0472, lng: 75.7886 },
    platforms: Array.from({ length: 8 }, (_, i) => ({
      number: i + 1,
      facilities: [
        { id: `bsl${i}f1`, name: 'Rail Neer Stand', type: ServiceType.FOOD, platform: i + 1, locationDetails: 'Center' },
        { id: `bsl${i}f2`, name: 'Waiting Hall', type: ServiceType.WAITING, platform: i + 1, locationDetails: 'Near Stairs' }
      ]
    })),
    entryPoints: ['Main City Side'],
    exitPoints: ['Main City Side']
  },
  {
    id: 's8',
    name: 'Manmad Junction',
    code: 'MMR',
    city: 'Manmad',
    coordinates: { lat: 20.2497, lng: 74.4383 },
    platforms: Array.from({ length: 6 }, (_, i) => ({
      number: i + 1,
      facilities: [
        { id: `mmr${i}f1`, name: 'Food Plaza', type: ServiceType.FOOD, platform: i + 1, locationDetails: 'Near Bridge' }
      ]
    })),
    entryPoints: ['Main Gate'],
    exitPoints: ['Main Gate']
  },
  {
    id: 's9',
    name: 'Kalyan Junction',
    code: 'KYN',
    city: 'Kalyan',
    coordinates: { lat: 19.2352, lng: 73.1305 },
    platforms: Array.from({ length: 7 }, (_, i) => ({
      number: i + 1,
      facilities: [
        { id: `kyn${i}f1`, name: 'Suburban Ticketing', type: ServiceType.TICKET, platform: i + 1, locationDetails: 'Entry' },
        { id: `kyn${i}f2`, name: 'Vada Pav Stall', type: ServiceType.FOOD, platform: i + 1, locationDetails: 'Mid Platform' }
      ]
    })),
    entryPoints: ['West Entrance', 'East Entrance'],
    exitPoints: ['West Exit', 'East Exit']
  },
  {
    id: 's10',
    name: 'Akola Junction',
    code: 'AK',
    city: 'Akola',
    coordinates: { lat: 20.7072, lng: 77.0029 },
    platforms: [
      { number: 1, facilities: [{ id: 'ak1f1', name: 'Waiting Room', type: ServiceType.WAITING, platform: 1, locationDetails: 'Main Building' }] },
      { number: 2, facilities: [{ id: 'ak2f1', name: 'Tea Stall', type: ServiceType.FOOD, platform: 2, locationDetails: 'Center' }] }
    ],
    entryPoints: ['Main Gate'],
    exitPoints: ['Main Gate']
  }
];

export const MOCK_TRAINS: Train[] = [
  { id: 't1', number: '12123', name: 'Deccan Queen', arrivalTime: '07:15 AM', departureTime: '07:35 AM', platform: 1, status: 'ON_TIME' },
  { id: 't2', number: '12127', name: 'Intercity Express', arrivalTime: '08:15 AM', departureTime: '08:20 AM', platform: 2, status: 'DELAYED', delayInMinutes: 15 },
  { id: 't3', number: '11008', name: 'Deccan Express', arrivalTime: '03:15 PM', departureTime: '03:30 PM', platform: 3, status: 'ON_TIME' },
  { id: 't4', number: '22221', name: 'Rajdhani Express', arrivalTime: '04:00 PM', departureTime: '04:05 PM', platform: 1, status: 'ON_TIME' },
  { id: 't5', number: '11301', name: 'Udyan Express', arrivalTime: '11:45 AM', departureTime: '12:00 PM', platform: 4, status: 'DELAYED', delayInMinutes: 45 },
  { id: 't6', number: '12157', name: 'Hutatma Express', arrivalTime: '06:00 PM', departureTime: '06:10 PM', platform: 5, status: 'ON_TIME' },
  { id: 't7', number: '11019', name: 'Konark Express', arrivalTime: '10:30 PM', departureTime: '10:45 PM', platform: 2, status: 'ON_TIME' },
  { id: 't8', number: '12779', name: 'Goa Express', arrivalTime: '04:30 AM', departureTime: '04:45 AM', platform: 3, status: 'DELAYED', delayInMinutes: 120 },
  { id: 't9', number: '22685', name: 'Duronto Express', arrivalTime: '09:00 AM', departureTime: '09:10 AM', platform: 1, status: 'ON_TIME' },
  { id: 't10', number: '11077', name: 'Jhelum Express', arrivalTime: '05:20 PM', departureTime: '05:40 PM', platform: 4, status: 'ON_TIME' }
];
