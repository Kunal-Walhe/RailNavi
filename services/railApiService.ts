const API_KEY = import.meta.env.VITE_RAIL_API_KEY || 'demo_key';

export const fetchLiveStation = async (stationCode: string, hours: number = 4) => {
  try {
    const url = `https://indianrailapi.com/api/v2/LiveStation/apikey/${API_KEY}/StationCode/${stationCode}/hours/${hours}/`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch live station data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Live Station data:', error);
    throw error;
  }
};

export const fetchTrainSchedule = async (trainNumber: string) => {
  try {
    const url = `https://indianrailapi.com/api/v2/TrainSchedule/apikey/${API_KEY}/TrainNumber/${trainNumber}/`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch train schedule');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Train Schedule data:', error);
    throw error;
  }
};
