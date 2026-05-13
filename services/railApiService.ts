import trainsDB from './trainsDB.json';



const parseTimeToMins = (timeStr: string): number => {
  if (!timeStr || timeStr === 'None' || timeStr === '--:--') return -1;
  const parts = timeStr.split(':');
  if (parts.length >= 2) {
    return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
  }
  return -1;
};

export const fetchTrainSchedule = async (trainNumber: string) => {
  const train = (trainsDB as any).trains[trainNumber];
  if (train && train.schedule) {
    let currentDay = 1;
    let prevMins = -1;

    const mappedSchedule = train.schedule.map((stop: any) => {
      let arrMins = parseTimeToMins(stop.arrivalTime);
      let depMins = parseTimeToMins(stop.departureTime);

      if (arrMins !== -1 && prevMins !== -1 && arrMins < prevMins) {
        currentDay++;
      }
      if (arrMins !== -1) prevMins = arrMins;

      // Keep track of day at arrival time so that if arrival is 23:59 (Day 1) and departure is 00:01 (Day 2), 
      // the stop itself can display the day of arrival, or maybe the day of departure? 
      // Usually, the stop's primary day is the arrival day, but if arrival is None, we use departure day.
      const stopDay = currentDay;

      if (depMins !== -1 && prevMins !== -1 && depMins < prevMins) {
        currentDay++;
      }
      if (depMins !== -1) prevMins = depMins;

      return {
        source_stn_code: stop.stationCode,
        source_stn_name: stop.stationName,
        arrive: stop.arrivalTime,
        depart: stop.departureTime,
        day: stopDay
      };
    });
    return { success: true, data: mappedSchedule };
  }
  return { success: true, data: [] };
};

const CITY_KEYWORDS: Record<string, string[]> = {
  "delhi": ["delhi", "nizamuddin", "ndls", "nzm", "rohilla"],
  "mumbai": ["mumbai", "bandra", "cst", "csmt", "lokmanyatilak", "ltt", "central", "bct", "mmct", "bdts", "dadar"],
  "nagpur": ["nagpur", "ngp"],
  "pune": ["pune"],
  "kolkata": ["kolkata", "howrah", "sealdah", "hwh", "sdah"],
  "chennai": ["chennai", "central", "egmore", "mas"],
  "jaipur": ["jaipur", "jp"],
  "ahmedabad": ["ahmedabad", "adi"],
  "bengaluru": ["bengaluru", "bangalore", "sbc", "ypr"]
};

const matchesCity = (stationName: string, stationCode: string, searchCity: string) => {
  const nameLower = (stationName || "").toLowerCase();
  const codeLower = (stationCode || "").toLowerCase();
  const cityLower = searchCity.toLowerCase();

  if (nameLower.includes(cityLower)) return true;
  const keywords = CITY_KEYWORDS[cityLower] || [];
  return keywords.some(k => nameLower.includes(k) || codeLower.includes(k));
};

const fetchTrainDetails = async (trainNumber: string | number, searchCity?: string) => {

  const train = (trainsDB as any).trains[String(trainNumber)];
  if (train) {
    let arrivalTime = train.schedule[0]?.departureTime || "00:00";
    let departureTime = train.schedule[train.schedule.length - 1]?.arrivalTime || "00:00";

    if (searchCity) {
      // Find the specific stop in this city
      const stop = train.schedule.find((s: any) => matchesCity(s.stationName, s.stationCode, searchCity));
      if (stop) {
        arrivalTime = stop.arrivalTime !== "None" ? stop.arrivalTime : stop.departureTime;
        departureTime = stop.departureTime !== "None" ? stop.departureTime : arrivalTime;
      }
    }

    return { 
      success: true, 
      data: {
        train_no: train.trainNo,
        train_name: train.trainName,
        from_stn_name: train.sourceName,
        from_stn_code: train.sourceCode,
        to_stn_name: train.destName,
        to_stn_code: train.destCode,
        from_time: arrivalTime,
        to_time: departureTime,
        travel_time: "N/A",
        running_days: "1111111",
        type: "MAIL_EXPRESS",
        train_id: train.trainNo,
        distance_from_to: train.schedule[train.schedule.length - 1]?.distance || "0",
        average_speed: "0"
      }
    };
  }
  return { success: false, error: 'Train not found in local database' };
};

export const fetchTrainsForCity = async (city: string) => {
  const cityMapping = (trainsDB as any).cityMapping;
  const searchCity = city.toLowerCase();
  
  let trainNumbers: string[] = [];
  let matchedCityKey = "";
  
  for (const [key, trains] of Object.entries(cityMapping)) {
    if (key.toLowerCase().includes(searchCity)) {
      matchedCityKey = key;
      for (const t of (trains as string[])) {
        if (!trainNumbers.includes(t)) {
          trainNumbers.push(t);
        }
      }
    }
  }

  if (trainNumbers.length === 0) return [];

  const results = [];
  for (const no of trainNumbers) {
    const res = await fetchTrainDetails(no, matchedCityKey || searchCity);
    if (res && res.success) {
      results.push(res);
    }
  }
  return results;
};
