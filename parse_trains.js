import fs from 'fs';
import readline from 'readline';

const IMPLEMENTED_CITIES = [
  "Pune", "Mumbai", "Jalgaon", "Nagpur", "Nashik", "Solapur", 
  "Bhusaval", "Manmad", "Kalyan", "Akola", "Delhi", "Kolkata", 
  "Chennai", "Jaipur", "Ahmedabad", "Bengaluru"
].map(c => c.toLowerCase());

// Additional keywords to match cities in station names
const CITY_KEYWORDS = {
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

function matchesImplementedCity(stationName, stationCode) {
  const nameLower = (stationName || "").toLowerCase();
  const codeLower = (stationCode || "").toLowerCase();
  
  for (const city of IMPLEMENTED_CITIES) {
    if (nameLower.includes(city)) return city;
    const keywords = CITY_KEYWORDS[city] || [];
    if (keywords.some(k => nameLower.includes(k) || codeLower.includes(k))) return city;
  }
  return null;
}

async function processCSV() {
  const filePath = './isl_wise_train_detail_03082015_v1.csv';
  const outPath = './services/trainsDB.json';
  
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const allTrains = {};
  const cityMapping = {};

  let isFirstLine = true;

  for await (const line of rl) {
    if (isFirstLine) {
      isFirstLine = false;
      continue;
    }

    const parts = line.split(',');
    if (parts.length < 12) continue;

    let trainNo = parts[0].replace(/'/g, '').trim();
    let trainName = parts[1].trim();
    let islno = parseInt(parts[2].trim(), 10);
    let stationCode = parts[3].trim();
    let stationName = parts[4].trim();
    let arrivalTime = parts[5].replace(/'/g, '').trim();
    let departureTime = parts[6].replace(/'/g, '').trim();
    let distance = parts[7].trim();
    let sourceCode = parts[8].trim();
    let sourceName = parts[9].trim();
    let destCode = parts[10].trim();
    let destName = parts[11].trim();

    const matchedCity = matchesImplementedCity(stationName, stationCode);

    if (!allTrains[trainNo]) {
      allTrains[trainNo] = {
        trainNo,
        trainName,
        sourceCode,
        sourceName,
        destCode,
        destName,
        schedule: [],
        relevantCities: new Set()
      };
    }

    allTrains[trainNo].schedule.push({
      islno,
      stationCode,
      stationName,
      arrivalTime,
      departureTime,
      distance
    });

    if (matchedCity) {
      allTrains[trainNo].relevantCities.add(matchedCity);
      
      if (!cityMapping[matchedCity]) {
        cityMapping[matchedCity] = new Set();
      }
      cityMapping[matchedCity].add(trainNo);
    }
  }

  // Filter trains to only those that stop at our implemented cities
  const filteredTrains = {};
  for (const trainNo in allTrains) {
    if (allTrains[trainNo].relevantCities.size > 0) {
      filteredTrains[trainNo] = allTrains[trainNo];
      // Cleanup temporary set
      delete filteredTrains[trainNo].relevantCities;
      filteredTrains[trainNo].schedule.sort((a, b) => a.islno - b.islno);
    }
  }

  const finalCityMapping = {};
  for (const [city, trainSet] of Object.entries(cityMapping)) {
    finalCityMapping[city] = Array.from(trainSet);
  }

  const db = {
    trains: filteredTrains,
    cityMapping: finalCityMapping
  };

  fs.writeFileSync(outPath, JSON.stringify(db));
  console.log(`Successfully generated ${outPath} with ${Object.keys(filteredTrains).length} trains and ${Object.keys(finalCityMapping).length} cities.`);
}

processCSV().catch(console.error);
