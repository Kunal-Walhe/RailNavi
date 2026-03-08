
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Station } from "../types";

import { MOCK_TRAINS, MOCK_STATIONS } from "../mockData";

const getMockResponse = async (query: string, currentStation: Station): Promise<string> => {
  try {
    if (!currentStation) return "System Error: No station data available.";

    const lowerQuery = query.toLowerCase();

    // 0. Handle Greetings
    if (lowerQuery.match(/^(hi|hello|hey|greetings|namaste)\b/i)) {
      const greetings = [
        "Hello there! I'm RailNavi AI. How may I assist you with your journey today?",
        "Greetings! I am the RailNavi assistant. What information do you need?",
        "Welcome! How can I help you navigate the station or check train schedules today?",
        "Hi! I'm here to help with live train statuses, station navigation, and more. What would you like to know?"
      ];
      const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
      return randomGreeting;
    }

    // 1. List all stations
    if (lowerQuery.includes('list stations') || lowerQuery.includes('all stations') || lowerQuery.includes('which stations')) {
      return `I have real-time data for the following stations:\n` +
        MOCK_STATIONS.map(s => `- **${s.name}** (${s.code})`).join('\n');
    }

    // 1. Identify Target Station
    const mentionedStation = MOCK_STATIONS.find(s =>
      lowerQuery.includes(s.city.toLowerCase()) ||
      lowerQuery.includes(s.name.toLowerCase()) ||
      lowerQuery.includes(s.code.toLowerCase())
    );

    const targetStation = mentionedStation || currentStation;

    const contextPrefix = mentionedStation ? `[Context: ${targetStation.name}] ` : '';

    // 2. Train Status Queries (Global search)
    const trainQuery = MOCK_TRAINS.find(t =>
      lowerQuery.includes(t.number) || lowerQuery.includes(t.name.toLowerCase())
    );

    if (trainQuery) {
      return `**Train ${trainQuery.name} (${trainQuery.number})**\n` +
        `- Status: ${trainQuery.status === 'ON_TIME' ? 'On Time' : `Delayed by ${trainQuery.delayInMinutes} mins`}\n` +
        `- Platform: ${trainQuery.platform}\n` +
        `- Arrival: ${trainQuery.arrivalTime}\n` +
        `- Departure: ${trainQuery.departureTime}`;
    }

    // 3. Facility/Amenity Queries
    if (lowerQuery.includes('where is') || lowerQuery.includes('find') || lowerQuery.includes('location') || lowerQuery.includes('search') || lowerQuery.includes('available')) {
      const facilities: string[] = [];
      if (targetStation.platforms) {
        targetStation.platforms.forEach(p => {
          if (p.facilities) {
            p.facilities.forEach(f => {
              const q = lowerQuery;
              const t = f.type.toLowerCase();
              const n = f.name.toLowerCase();

              let isMatch = q.includes(n) || q.includes(t);
              if (!isMatch) {
                if (q.includes('waiting') && t.includes('waiting')) isMatch = true;
                if (q.includes('food') && t.includes('food')) isMatch = true;
                if (q.includes('restroom') && t.includes('restroom')) isMatch = true;
                if (q.includes('med') && t.includes('medical')) isMatch = true;
                if (q.includes('shop') && t.includes('shop')) isMatch = true;
                if (q.includes('atm') && t.includes('atm')) isMatch = true;
                if (q.includes('cloak') && t.includes('cloak')) isMatch = true;
              }

              if (isMatch) {
                facilities.push(`- **${f.name}** (${f.type}) on Platform ${p.number}, ${f.locationDetails}`);
              }
            });
          }
        });
      }

      if (facilities.length > 0) {
        return `${contextPrefix}Here are the matching facilities:\n${facilities.join('\n')}`;
      } else if (mentionedStation) {
        return `I couldn't find that facility at ${targetStation.name}. Try asking for "waiting room", "food", or "atm".`;
      }
    }

    // 4. Station/Platform Info
    if (lowerQuery.includes('platform') || lowerQuery.includes('how many platform')) {
      return `${contextPrefix}**${targetStation.name}** has ${targetStation.platforms?.length || 0} platforms.\n` +
        `Entry points: ${targetStation.entryPoints?.join(', ') || 'N/A'}.`;
    }

    // 5. General Help
    if (lowerQuery.includes('help') || lowerQuery.includes('what can you do')) {
      return "I can help you with:\n" +
        "- **Train Status**: 'Status of 12123'\n" +
        "- **Station Details**: 'How many platforms in Mumbai?' or 'List all stations'\n" +
        "- **Facilities**: 'Where is the food court in Pune?'";
    }

    // Default Fallback
    return `I couldn't find specific data for that query at ${targetStation.name}. Try asking about Train Numbers, Amenities, or specific Stations (e.g., "in Mumbai").`;
  } catch (error: any) {
    console.error("Mock AI Error:", error);
    return `DEBUG: Internal logic error: ${error.message}`;
  }
};

export const getSmartNavigationStream = async (query: string, currentStation: Station) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  // Fallback to Mock AI if API Key is missing or placeholder
  if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') {
    const mockResponse = await getMockResponse(query, currentStation);

    // Simulate streaming
    return (async function* () {
      const chunkSize = 5;
      for (let i = 0; i < mockResponse.length; i += chunkSize) {
        await new Promise(resolve => setTimeout(resolve, 30)); // Typing effect delay
        yield { text: mockResponse.slice(i, i + chunkSize) } as GenerateContentResponse;
      }
    })();
  }

  const ai = new GoogleGenAI({ apiKey });

  const stationContext = `
    Station: ${currentStation.name} (${currentStation.code})
    City: ${currentStation.city}

    LIVE TRAIN SCHEDULE (Real-time Data):
    ${MOCK_TRAINS.map(t =>
    `- ${t.name} (${t.number}): PF ${t.platform}, Arr: ${t.arrivalTime}, Dep: ${t.departureTime}, Status: ${t.status === 'ON_TIME' ? 'On Time' : `Delayed by ${t.delayInMinutes} mins`}`
  ).join('\n')}

    Layout Overview: 
    ${currentStation.platforms.map(p => `
      Platform ${p.number}:
      Assets: ${p.facilities.map(f => `${f.name} (${f.type}) at ${f.locationDetails}`).join(', ')}
    `).join('\n')}
    Entry Points: ${currentStation.entryPoints.join(', ')}
    Exit Points: ${currentStation.exitPoints.join(', ')}
  `;

  const systemPrompt = `
    You are "RailNavi AI", a Station Assistant for ${currentStation.name}.
    
    CAPABILITIES:
    1. Navigation: Give precise directions to platforms and facilities.
    2. Schedules: Check the PROVIDED "LIVE TRAIN SCHEDULE" to answer queries about train times, platforms, and delays.
    3. Website and Platform Info: Answer questions related to this website and the platform information.
    
    RULES:
    - If asked about a specific train, LOOK IT UP in the provided schedule.
    - If a train isn't in the list, say "I don't have live data for that train currently."
    - If the user says a greeting (like "Hello", "Hi", "Hey"), respond with a friendly yet professional greeting, varying the response.
    - If asked a question NOT related to the topic (railways, navigation, schedules, or website/platform information), politely decline and state that the chatbot is still growing and cannot answer off-topic questions.
    - Be formal, polite, and helpful.
    - Keep responses concise (bullet points preferred).
  `;

  try {
    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-3-flash-preview',
      contents: `Context: ${stationContext}\n\nUser Question: ${query}`,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.4, // Lower temperature for more consistent, accurate directions
        thinkingConfig: { thinkingBudget: 0 }, // Disable thinking for maximum speed on free tier
      },
    });

    return responseStream;
  } catch (error) {
    console.error("AI Assistant stream error:", error);
    throw error;
  }
};
