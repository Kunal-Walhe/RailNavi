
import { Station, Train, User, ServiceType } from './types';

export const MOCK_USERS: User[] = [
  { id: '1', name: 'Admin User', role: 'ADMIN', email: 'Admin@1', password: '1234' },
  { id: '2', name: 'John Doe', role: 'PASSENGER', email: 'john@gmail.com' },
];

const generateFacilities = (platform: number, prefix: string, city: string) => {
  const facilities = [];
  
  facilities.push({ id: `${prefix}_p${platform}_seat`, name: 'Platform Seating Area', type: ServiceType.WAITING, platform, locationDetails: 'Spread across platform' });
  facilities.push({ id: `${prefix}_p${platform}_rr`, name: 'Public Restroom', type: ServiceType.RESTROOM, platform, locationDetails: platform % 2 === 0 ? 'West End' : 'East End' });
  
  const foodStalls = ['IRCTC Food Plaza', 'Comesum', 'Tea & Snacks Corner', 'Amul Parlour', 'Local Flavors Stall', 'Fast Food Kiosk', 'Rail Neer Stand', 'Coffee Stall', 'Snack Bar', 'Dairy Stall'];
  const numFood = Math.floor(Math.random() * 2) + 1; // 1 or 2 food stalls
  
  // Pick random unique food stalls
  const shuffledFood = foodStalls.sort(() => 0.5 - Math.random());
  for (let i = 0; i < numFood; i++) {
    facilities.push({ id: `${prefix}_p${platform}_f${i}`, name: shuffledFood[i], type: ServiceType.FOOD, platform, locationDetails: ['Center', 'Near Stairs', 'South End', 'North End'][Math.floor(Math.random() * 4)] });
  }

  if (Math.random() > 0.4) {
    const shops = ['A.H. Wheeler Book Stall', 'News Stand', 'Handicraft Corner', 'Travel Essentials Kiosk', 'Magazines & Books'];
    const shop = shops[Math.floor(Math.random() * shops.length)];
    facilities.push({ id: `${prefix}_p${platform}_s1`, name: shop, type: ServiceType.SHOP, platform, locationDetails: 'Near Overbridge' });
  }
  
  if (Math.random() > 0.7) {
    facilities.push({ id: `${prefix}_p${platform}_atm`, name: 'SBI ATM', type: ServiceType.ATM, platform, locationDetails: 'Near Exit' });
  }

  // Special services for Platform 1
  if (platform === 1) {
    facilities.push({ id: `${prefix}_p1_med`, name: 'Emergency Medical Center', type: ServiceType.MEDICAL, platform: 1, locationDetails: 'Near Station Master Office' });
    facilities.push({ id: `${prefix}_p1_tkt`, name: 'Unreserved Ticket Counter', type: ServiceType.TICKET, platform: 1, locationDetails: 'Main Concourse' });
    facilities.push({ id: `${prefix}_p1_clk`, name: 'Cloakroom', type: ServiceType.CLOAKROOM, platform: 1, locationDetails: 'Parcel Office Area' });
    if (city === 'Nagpur') facilities.push({ id: `${prefix}_p1_hd`, name: 'Haldirams Mega Outlet', type: ServiceType.FOOD, platform: 1, locationDetails: 'Main Entrance' });
    if (city === 'Mumbai') facilities.push({ id: `${prefix}_p1_csmt`, name: 'Heritage Gallery', type: ServiceType.WAITING, platform: 1, locationDetails: 'Main Concourse' });
  }

  return facilities;
};

const generatePlatforms = (count: number, prefix: string, city: string) => {
  return Array.from({ length: count }, (_, i) => ({
    number: i + 1,
    facilities: generateFacilities(i + 1, prefix, city)
  }));
};

export const MOCK_STATIONS: Station[] = [
  {
    id: 's1',
    name: 'Pune Junction',
    code: 'PUNE',
    city: 'Pune',
    coordinates: { lat: 18.5289, lng: 73.8744 },
    platforms: generatePlatforms(6, 'pune', 'Pune'),
    entryPoints: ['Main Gate (HH Agakhan Rd)', 'Second Entry (Raja Bahadur Mill Rd)'],
    exitPoints: ['Main Gate', 'Second Entry']
  },
  {
    id: 's2',
    name: 'Chhatrapati Shivaji Maharaj Terminus',
    code: 'CSMT',
    city: 'Mumbai',
    coordinates: { lat: 18.9400, lng: 72.8353 },
    platforms: generatePlatforms(18, 'csmt', 'Mumbai'),
    entryPoints: ['Main Terminal Entrance', 'P D\'Mello Road Entry'],
    exitPoints: ['Fort Side Exit', 'P D\'Mello Exit']
  },
  {
    id: 's3',
    name: 'Jalgaon Junction',
    code: 'JL',
    city: 'Jalgaon',
    coordinates: { lat: 21.0183, lng: 75.5631 },
    platforms: generatePlatforms(4, 'jl', 'Jalgaon'),
    entryPoints: ['Main Gate (Station Rd)', 'North Side Entry'],
    exitPoints: ['Main Gate', 'North Side Exit']
  },
  {
    id: 's4',
    name: 'Nagpur Junction',
    code: 'NGP',
    city: 'Nagpur',
    coordinates: { lat: 21.1522, lng: 79.0887 },
    platforms: generatePlatforms(8, 'ngp', 'Nagpur'),
    entryPoints: ['Main West Gate', 'East Gate (Santra Market)'],
    exitPoints: ['Main West Gate', 'East Gate']
  },
  {
    id: 's5',
    name: 'Nashik Road',
    code: 'NK',
    city: 'Nashik',
    coordinates: { lat: 19.9472, lng: 73.8422 },
    platforms: generatePlatforms(4, 'nk', 'Nashik'),
    entryPoints: ['Main Road Entry'],
    exitPoints: ['Main Road Exit']
  },
  {
    id: 's6',
    name: 'Solapur Junction',
    code: 'SUR',
    city: 'Solapur',
    coordinates: { lat: 17.6639, lng: 75.8931 },
    platforms: generatePlatforms(5, 'sur', 'Solapur'),
    entryPoints: ['Main Entrance'],
    exitPoints: ['Main Exit']
  },
  {
    id: 's7',
    name: 'Bhusaval Junction',
    code: 'BSL',
    city: 'Bhusaval',
    coordinates: { lat: 21.0472, lng: 75.7886 },
    platforms: generatePlatforms(8, 'bsl', 'Bhusaval'),
    entryPoints: ['Main City Side'],
    exitPoints: ['Main City Side']
  },
  {
    id: 's8',
    name: 'Manmad Junction',
    code: 'MMR',
    city: 'Manmad',
    coordinates: { lat: 20.2497, lng: 74.4383 },
    platforms: generatePlatforms(6, 'mmr', 'Manmad'),
    entryPoints: ['Main Gate'],
    exitPoints: ['Main Gate']
  },
  {
    id: 's9',
    name: 'Kalyan Junction',
    code: 'KYN',
    city: 'Kalyan',
    coordinates: { lat: 19.2352, lng: 73.1305 },
    platforms: generatePlatforms(7, 'kyn', 'Kalyan'),
    entryPoints: ['West Entrance', 'East Entrance'],
    exitPoints: ['West Exit', 'East Exit']
  },
  {
    id: 's10',
    name: 'Akola Junction',
    code: 'AK',
    city: 'Akola',
    coordinates: { lat: 20.7072, lng: 77.0029 },
    platforms: generatePlatforms(3, 'ak', 'Akola'),
    entryPoints: ['Main Gate'],
    exitPoints: ['Main Gate']
  },
  {
    id: 's11',
    name: 'New Delhi Railway Station',
    code: 'NDLS',
    city: 'Delhi',
    coordinates: { lat: 28.6415, lng: 77.2197 },
    platforms: generatePlatforms(16, 'ndls', 'Delhi'),
    entryPoints: ['Ajmeri Gate Side', 'Paharganj Side'],
    exitPoints: ['Ajmeri Gate', 'Paharganj']
  },
  {
    id: 's12',
    name: 'Howrah Junction',
    code: 'HWH',
    city: 'Kolkata',
    coordinates: { lat: 22.5837, lng: 88.3415 },
    platforms: generatePlatforms(23, 'hwh', 'Kolkata'),
    entryPoints: ['Main Entrance'],
    exitPoints: ['Main Exit']
  },
  {
    id: 's13',
    name: 'Chennai Central',
    code: 'MAS',
    city: 'Chennai',
    coordinates: { lat: 13.0827, lng: 80.2707 },
    platforms: generatePlatforms(11, 'mas', 'Chennai'),
    entryPoints: ['Main Gate'],
    exitPoints: ['Main Gate']
  },
  {
    id: 's14',
    name: 'Jaipur Junction',
    code: 'JP',
    city: 'Jaipur',
    coordinates: { lat: 26.9197, lng: 75.7878 },
    platforms: generatePlatforms(7, 'jp', 'Jaipur'),
    entryPoints: ['Gate 1', 'Gate 2'],
    exitPoints: ['Gate 1', 'Gate 2']
  },
  {
    id: 's15',
    name: 'Ahmedabad Junction',
    code: 'ADI',
    city: 'Ahmedabad',
    coordinates: { lat: 23.0269, lng: 72.5950 },
    platforms: generatePlatforms(12, 'adi', 'Ahmedabad'),
    entryPoints: ['Kalupur Side', 'Saraspur Side'],
    exitPoints: ['Kalupur', 'Saraspur']
  },
  {
    id: 's16',
    name: 'KSR Bengaluru',
    code: 'SBC',
    city: 'Bengaluru',
    coordinates: { lat: 12.9781, lng: 77.5694 },
    platforms: generatePlatforms(10, 'sbc', 'Bengaluru'),
    entryPoints: ['City Station Side', 'Okalipuram Side'],
    exitPoints: ['City Side', 'Okalipuram Side']
  }
];

const generateMockTrains = (stationCode: string, count = 6): Train[] => {
  const trains: Train[] = [];

  for (let i = 0; i < count; i++) {
    const trainNum = 12000 + Math.floor(Math.random() * 1000);
    const isDelayed = Math.random() > 0.7;

    trains.push({
      id: `mock-${stationCode}-${trainNum}-${i}`,
      number: `${trainNum}`,
      name: `Express ${i + 1}`,
      arrivalTime: `${8 + i}:${Math.floor(Math.random() * 60).toString().padStart(2, "0")} AM`,
      departureTime: `${8 + i}:${Math.floor(Math.random() * 60).toString().padStart(2, "0")} AM`,
      platform: Math.ceil(Math.random() * 6),
      status: isDelayed ? 'DELAYED' : 'ON_TIME',
      delayInMinutes: isDelayed ? 10 : 0
    });
  }

  return trains;
};

export const MOCK_TRAINS_BY_CITY: Record<string, Train[]> = {
  "Pune": [
    { id: 'p1', number: '12123', name: 'DECCAN QUEEN', arrivalTime: '07:15 AM', departureTime: '07:35 AM', platform: (12123 % 10) + 1, status: 'ON_TIME' },
    { id: 'p2', number: '11008', name: 'DECCAN EXPRESS', arrivalTime: '03:15 PM', departureTime: '03:30 PM', platform: (11008 % 10) + 1, status: 'ON_TIME' },
    { id: 'p3', number: '12157', name: 'HUTATMA EXPRESS', arrivalTime: '06:00 PM', departureTime: '06:10 PM', platform: (12157 % 10) + 1, status: 'ON_TIME' }
  ],
  "Mumbai": [
    { id: 'm1', number: '12102', name: 'JNANESWARI EXP', arrivalTime: '10:15 AM', departureTime: '10:30 AM', platform: (12102 % 10) + 1, status: 'DELAYED', delayInMinutes: 20 },
    { id: 'm2', number: '12002', name: 'SHATABDI EXPRESS', arrivalTime: '06:00 AM', departureTime: '06:15 AM', platform: (12002 % 10) + 1, status: 'ON_TIME' },
    { id: 'm3', number: '12951', name: 'NDLS TEJAS RAJ', arrivalTime: '05:00 PM', departureTime: '05:15 PM', platform: (12951 % 10) + 1, status: 'ON_TIME' }
  ],
  "Delhi": [
    { id: 'd1', number: '12951', name: 'NDLS TEJAS RAJ', arrivalTime: '08:32 AM', departureTime: '08:45 AM', platform: (12951 % 10) + 1, status: 'ON_TIME' },
    { id: 'd2', number: '12002', name: 'SHATABDI EXPRESS', arrivalTime: '08:00 AM', departureTime: '08:15 AM', platform: (12002 % 10) + 1, status: 'ON_TIME' },
    { id: 'd3', number: '12301', name: 'HOWRAH RAJDHANI', arrivalTime: '09:55 AM', departureTime: '10:10 AM', platform: (12301 % 10) + 1, status: 'ON_TIME' }
  ],
  "Nagpur": [
    { id: 'n1', number: '12160', name: 'JABALPUR EXP', arrivalTime: '09:15 PM', departureTime: '09:30 PM', platform: (12160 % 10) + 1, status: 'ON_TIME' },
    { id: 'n2', number: '12655', name: 'NAVJEEVAN EXP', arrivalTime: '07:20 AM', departureTime: '07:35 AM', platform: (12655 % 10) + 1, status: 'ON_TIME' },
    { id: 'n3', number: '12106', name: 'VIDARBHA EXP', arrivalTime: '04:30 PM', departureTime: '04:45 PM', platform: (12106 % 10) + 1, status: 'ON_TIME' }
  ],
  "Nashik": generateMockTrains("NK"),
  "Kalyan": generateMockTrains("KYN"),
  "Jalgaon": generateMockTrains("JL"),
  "Solapur": generateMockTrains("SUR"),
  "Bhusaval": generateMockTrains("BSL"),
  "Manmad": generateMockTrains("MMR"),
  "Akola": generateMockTrains("AK"),
  "Kolkata": generateMockTrains("HWH"),
  "Chennai": generateMockTrains("MAS"),
  "Jaipur": generateMockTrains("JP"),
  "Ahmedabad": generateMockTrains("ADI"),
  "Bengaluru": generateMockTrains("SBC")
};

// Default generic fallback
export const MOCK_TRAINS: Train[] = [
  ...MOCK_TRAINS_BY_CITY["Pune"],
  ...MOCK_TRAINS_BY_CITY["Mumbai"]
];
