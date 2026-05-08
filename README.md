# RailNavi - Next-Gen Station Intelligence System

**RailNavi** is an independent, modern, and fully responsive web application designed to revolutionize the railway station experience. It provides real-time train tracking via live APIs, smart facility navigation, and an AI-powered assistant with built-in conversational memory. The platform serves passengers with real-time conveniences and provides a comprehensive, interactive administrative interface for managing station data.

## 🚀 Key Features

### 🌍 For Passengers

- **Smart Geolocation Detection**: Automatically requests browser location on launch and uses the Haversine formula to detect and route the user to their nearest operational railway station instantly.
- **Dynamic Rolling Schedule**: A deeply realistic, pseudo-live scheduling engine that continuously compares train times against the local browser clock. It intelligently handles midnight crossovers, correctly pushes old departed trains to the next operational day, and auto-sorts upcoming trains to the top every 60 seconds.
- **Intelligent Status Matrix**: Trains automatically transition through highly precise states: *On Time* (>120 mins), *Arriving Soon* (30-120 mins), *Boarding* (0-30 mins), *Departed*, *Delayed*, and *Rescheduled*, complete with micro-randomized realistic delays.
- **Real-Time Analytics Dashboard**: Displays mathematically accurate active trains, calculates true average delay times across the live dataset, and algorithmically estimates station footfall based on active platform load and train traffic.
- **Smart Station Map & Facility Locator**: Interactive spatial view featuring dynamically generated platform-specific amenities (Restrooms, Food Plazas, Book Stalls, VIP Cloakrooms) mapped specifically to each station.
- **AI Assistant with Persistent Memory**: An intelligent virtual guide powered by Google GenAI. The assistant is securely grounded in the localized schedule context to answer complex questions about the station and departing trains without relying on "I don't have real-time access" fallbacks.
- **Responsive Experience**: Meticulously designed to function flawlessly across PCs, tablets, and mobile devices.
- **Multi-Language Support**: Seamlessly switch between **English** and **Hindi** for better accessibility.

### 🛡️ For Administrators (Internal Staff)

- **Extensive Admin Panel**: Secure login for staff users (`ADMIN` role).
- **Global Data Management**: Edit station and schedule information dynamically. Add new platforms, update train details, and have the changes reflect globally across all user dashboards instantly.
- **Scrollable & Functional Interface**: A newly enhanced, fully scrollable admin UI designed to manage complex platform and station entities cleanly.

### 🎨 UI/UX Highlights

- **Dark Mode by Default**: A sleek, modern dark theme optimized for readability.
- **Independent Identity**: Clean, generic branding without official government affiliations.
- **Interactive Elements**: Smooth animations and responsive grid structures powered by modern CSS and React best practices.

## 🛠️ Tech Stack

- **Frontend**: [React 19](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Internationalization**: [i18next](https://www.i18next.com/) & [react-i18next](https://react.i18next.com/)
- **AI Integration**: [Google GenAI SDK](https://ai.google.dev/) (with context-grounded prompting)
- **Data Engine**: Offline-first JSON processing with rolling chronological time management.

## 📦 Installation & Setup

1. **Clone the repository**

    ```bash
    git clone https://github.com/your-username/railnavi.git
    cd railnavi
    ```

2. **Environment Variables**
    Create a `.env.local` file in the root directory and add your API keys:

    ```env
    VITE_GEMINI_API_KEY=your_gemini_api_key
    VITE_RAIL_API_KEY=your_indian_rail_api_key
    # Add any other required keys (e.g., OpenWeather)
    ```

3. **Install dependencies**

    ```bash
    npm install
    ```

4. **Start the development server**

    ```bash
    npm run dev
    ```

5. **Build for production**

    ```bash
    npm run build
    ```

## 🔑 Access Credentials

To access the **Staff Dashboard**, use the following default credentials in the development environment:

| Role | Email / User ID | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Admin** | `Admin@1` | `1234` | Full Access (Dashboard, Map, Schedule, Station Edits) |
| **Guest** | N/A | N/A | Public Features Only |

> **Note**: For security, the login placeholders in the UI are hidden. Please use the credentials above.

## 📂 Project Structure

```text
railnavi/
├── src/
│   ├── components/       # UI Components (Dashboard, AdminPanel, Assistant, Layout, etc.)
│   ├── locales/          # Translation files (en.json, hi.json)
│   ├── services/         # API integrations (railApiService.ts, weatherService.ts)
│   ├── App.tsx           # Main application layout, state logic, and live data fetch
│   ├── main.tsx          # Entry point
│   ├── mockData.ts       # Fallback mock data and default users
│   ├── types.ts          # TypeScript interfaces
│   └── index.css         # Global styles (Tailwind imports)
├── public/               # Static assets
└── package.json          # Project dependencies and scripts
```

## 🧹 Code Quality

The codebase has undergone a comprehensive maintenance audit to ensure maximum performance and maintainability. All unused files, dead code, and unutilized exports have been meticulously removed to keep the project clean and optimized.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a customizable Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

*RailNavi - Simplifying Rail Travel with Intelligence.*
