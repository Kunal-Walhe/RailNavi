# RailNavi - Next-Gen Station Intelligence System

**RailNavi** is a modern, responsive web application designed to revolutionize the railway station experience. It provides real-time tracking, smart facility navigation, and AI-powered assistance for major railway junctions. The platform serves both passengers and official station administrators with tailored interfaces and features.

## 🚀 Key Features

### 🌍 For Passengers & Officials
- **Real-Time Dashboard**: Live status of active trains, platform utilization, and passenger footfall.
- **Smart Station Map**: Interactive spatial view of station layouts, platforms, and facilities.
- **Facility Locator**: Quickly find essential amenities like ATMs, food courts, waiting halls, and restrooms.
- **Live Schedule**: Real-time train arrival and departure information with status updates (On Time / Delayed).
- **AI Assistant**: An intelligent virtual guide to assist with navigation and queries (powered by Google GenAI).
- **Multi-Language Support**: Seamlessly switch between **English** and **Hindi** for better accessibility.

### 🛡️ For Administrators (Official Access)
- **Restricted Access**: Secure login for authorized station masters and staff.
- **Operational Control**: Access to detailed station parameters and operational metrics.
- **Notices Management**: Post official updates regarding infrastructure maintenance and passenger amenities.

### 🎨 UI/UX Highlights
- **Dark Mode by Default**: A sleek, modern dark theme optimized for readability in all lighting conditions.
- **Responsive Design**: Fully responsive layout that works seamlessly on desktops, tablets, and mobile devices.
- **Interactive Elements**: Smooth animations and transitions powered by modern CSS and React best practices.

## 🛠️ Tech Stack

- **Frontend**: [React](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Internationalization**: [i18next](https://www.i18next.com/) & [react-i18next](https://react.i18next.com/)
- **AI Integration**: [Google GenAI SDK](https://ai.google.dev/)

## 📦 Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/railnavi.git
    cd railnavi
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Start the development server**
    ```bash
    npm run dev
    ```

4.  **Build for production**
    ```bash
    npm run build
    ```

## 🔑 Access Credentials

To access the **Official Staff Dashboard**, use the following default credentials in the development environment:

| Role | Email / User ID | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Admin** | `Admin@1` | `1234` | Full Access (Dashboard, Map, Schedule) |
| **Guest** | N/A | N/A | Public Features Only |

> **Note**: For security, the login placeholders in the UI are hidden. Please use the credentials above.

## 📂 Project Structure

```
railnavi/
├── src/
│   ├── components/       # UI Components (Dashboard, Layout, Home, etc.)
│   ├── locales/          # Translation files (en.json, hi.json)
│   ├── App.tsx           # Main application component
│   ├── main.tsx          # Entry point
│   ├── mockData.ts       # Mock data for stations and trains
│   ├── types.ts          # TypeScript interfaces
│   └── index.css         # Global styles (Tailwind imports)
├── public/               # Static assets
└── package.json          # Project dependencies and scripts
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a customizable Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

*RailNavi - Simplifying Rail Travel with Intelligence.*
