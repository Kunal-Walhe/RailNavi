import { Station } from '../types';

const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c; // Distance in km
};

export const getNearestStation = (lat: number, lng: number, stations: Station[]): Station | null => {
  if (!stations || stations.length === 0) return null;
  
  let nearest = stations[0];
  let minDistance = getDistance(lat, lng, nearest.coordinates.lat, nearest.coordinates.lng);
  
  for (let i = 1; i < stations.length; i++) {
    const dist = getDistance(lat, lng, stations[i].coordinates.lat, stations[i].coordinates.lng);
    if (dist < minDistance) {
      minDistance = dist;
      nearest = stations[i];
    }
  }
  
  return nearest;
};
