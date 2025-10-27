import React from 'react';

const iconStyle: React.CSSProperties = { width: '1.25em', height: '1.25em', verticalAlign: 'middle' };

export const PlusIcon = () => (
    <svg style={iconStyle} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="plusGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#4ade80" />
                <stop offset="100%" stopColor="#16a34a" />
            </linearGradient>
            <filter id="plusShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0.5" dy="1" stdDeviation="1" floodColor="#000000" floodOpacity="0.3"/>
            </filter>
        </defs>
        <circle cx="12" cy="12" r="11" fill="url(#plusGradient)" filter="url(#plusShadow)"/>
        <path d="M12 7V17M7 12H17" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const WrenchIcon = () => (
    <svg style={iconStyle} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="wrenchGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#d1d5db" />
                <stop offset="100%" stopColor="#9ca3af" />
            </linearGradient>
                 <filter id="wrenchShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0.5" dy="1" stdDeviation="1" floodColor="#000000" floodOpacity="0.2"/>
                </filter>
        </defs>
        <path filter="url(#wrenchShadow)" d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" fill="url(#wrenchGradient)" stroke="#4b5563" strokeWidth="0.5"/>
    </svg>
);

export const CalculatorIcon = () => (
    <svg style={iconStyle} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="2" width="16" height="20" rx="3" fill="#374151" stroke="#4b5563" strokeWidth="0.5"/>
        <rect x="6" y="10" width="3" height="3" rx="1" fill="#4ade80"/>
        <rect x="10.5" y="10" width="3" height="3" rx="1" fill="#facc15"/>
        <rect x="15" y="10" width="3" height="3" rx="1" fill="#60a5fa"/>
        <rect x="6" y="15" width="3" height="3" rx="1" fill="#f87171"/>
        <rect x="10.5" y="15" width="7.5" height="3" rx="1" fill="#4ade80"/>
        <rect x="6" y="4" width="12" height="4" rx="1" fill="#111827"/>
    </svg>
);

export const DollarSignIcon = () => (
     <svg style={iconStyle} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="dollarGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#facc15" />
                <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>
            <filter id="dollarShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="1" dy="1" stdDeviation="0.5" floodColor="#000000" floodOpacity="0.4"/>
            </filter>
        </defs>
        <path filter="url(#dollarShadow)" d="M12 2.5V21.5M17 5.5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="url(#dollarGradient)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const UserIcon = () => (
    <svg style={iconStyle} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="userGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#93c5fd" />
                <stop offset="100%" stopColor="#60a5fa" />
            </linearGradient>
        </defs>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" fill="url(#userGradient)" fillOpacity="0.3" stroke="url(#userGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="12" cy="7" r="4" fill="url(#userGradient)" stroke="url(#userGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const GaugeIcon = () => (
    <svg style={iconStyle} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="gaugeGradient" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0%" stopColor="#4ade80" />
                <stop offset="50%" stopColor="#facc15" />
                <stop offset="100%" stopColor="#f87171" />
            </linearGradient>
        </defs>
        <path d="M5.93 18.07A9 9 0 1 1 18.07 5.93" stroke="url(#gaugeGradient)" strokeWidth="4" strokeLinecap="round"/>
        <circle cx="12" cy="12" r="1.5" fill="#f3f4f6"/>
        <path d="M12 12 L16.5 7.5" stroke="#f3f4f6" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

export const RoadIcon = () => (
    <svg style={iconStyle} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 21L11 3H13L16 21" fill="#4b5563" />
        <path d="M12 4V8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M12 11V15" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M12 18V22" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
);

export const CloseIcon = ({size = 24}: {size?: number}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="11" fill="#374151" fillOpacity="0.8"/>
        <path d="M16 8L8 16M8 8L16 16" stroke="#e5e7eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const SparklesIcon = () => (
    <svg style={{width: '1em', height: '1em'}} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="sparkleGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#a78bfa" />
                <stop offset="100%" stopColor="#f472b6" />
            </linearGradient>
        </defs>
        <path d="M12 2L9.5 7L4 8L9.5 9L12 14L14.5 9L20 8L14.5 7L12 2Z" fill="url(#sparkleGradient)"/>
        <path d="M5 16L6.5 19L9 19.5L6.5 20L5 23L3.5 20L1 19.5L3.5 19L5 16Z" fill="url(#sparkleGradient)" fillOpacity="0.7"/>
        <path d="M20 15L19 18L16 18.5L19 19L20 22L21 19L24 18.5L21 18L20 15Z" fill="url(#sparkleGradient)" fillOpacity="0.7"/>
    </svg>
);

export const SearchIcon = () => (
    <svg style={{width: '1em', height: '1em'}} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="searchGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#93c5fd" />
                <stop offset="100%" stopColor="#60a5fa" />
            </linearGradient>
        </defs>
        <circle cx="10.5" cy="10.5" r="7.5" fill="url(#searchGradient)" fillOpacity="0.3" stroke="url(#searchGradient)" strokeWidth="2"/>
        <path d="M16 16L21 21" stroke="#93c5fd" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
);

export const EditIcon = ({size = 20}: {size?: number}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" fill="#a78bfa" stroke="#8b5cf6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const LoadingSpinner = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <defs>
            <linearGradient id="spinnerGradient" x1="1" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#4ade80" />
                <stop offset="100%" stopColor="#1f2937" stopOpacity="0" />
            </linearGradient>
        </defs>
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#4b5563" strokeWidth="4"></circle>
        <path className="opacity-75" fill="url(#spinnerGradient)" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
    </svg>
);

export const ExportIcon = () => (
     <svg style={iconStyle} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 3v12m-4-4l4 4 4-4" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7 3H17" fill="#374151" stroke="#4b5563"/>
    </svg>
);

export const OilCanIcon = () => (
    <svg style={iconStyle} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-5" stroke="#facc15" strokeWidth="2"/>
        <path d="M20 13h-4.2c-.3 0-.5-.2-.6-.4l-1.4-3.5c-.2-.4-.1-.8.2-1.1L18 5" stroke="#facc15" strokeWidth="2"/>
        <path d="M12 11h8" stroke="#facc15" strokeWidth="2"/>
        <path d="M4 11V9a2 2 0 0 1 2-2h4" stroke="#facc15" strokeWidth="2" strokeLinecap="round"/>
        <path d="M10 7L8 4" stroke="#facc15" strokeWidth="2" strokeLinecap="round"/>
    </svg>
);

export const TireIcon = () => (
    <svg style={iconStyle} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="#9ca3af" strokeWidth="2"/>
        <circle cx="12" cy="12" r="4" stroke="#9ca3af" strokeWidth="2"/>
        <path d="M12 2v4M12 18v4M22 12h-4M6 12H2" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"/>
    </svg>
);

export const EngineIcon = () => (
    <svg style={iconStyle} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 18H3v-2h2v2zM5 14H3v-2h2v2zM12 12V9" stroke="#f87171" strokeWidth="2" strokeLinecap="round" />
        <path d="M21 10V8a2 2 0 0 0-2-2h-2" stroke="#f87171" strokeWidth="2" strokeLinecap="round" />
        <path d="M12 18h-2a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h2v8zM17 18h-5v-8h5a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2z" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const FuelPumpIcon = ({ size = 64, className = '' }: { size?: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
            <linearGradient id="pumpBodyGradient" x1="0.5" y1="0" x2="0.5" y2="1">
                <stop offset="0%" stopColor="#22c55e"/>
                <stop offset="100%" stopColor="#15803d"/>
            </linearGradient>
            <linearGradient id="pumpHandleGradient" x1="0.5" y1="0" x2="0.5" y2="1">
                <stop offset="0%" stopColor="#4b5563"/>
                <stop offset="100%" stopColor="#1f2937"/>
            </linearGradient>
            <filter id="pumpShadow" x="-10%" y="-10%" width="120%" height="130%">
                <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.4"/>
            </filter>
        </defs>
        <g filter="url(#pumpShadow)">
            {/* Main Body */}
            <path d="M12 8C12 5.79086 13.7909 4 16 4H36C38.2091 4 40 5.79086 40 8V44H48V48C48 50.2091 46.2091 52 44 52H20C17.7909 52 16 50.2091 16 48V44H12V8Z" fill="url(#pumpBodyGradient)"/>
            {/* Screen */}
            <rect x="16" y="10" width="20" height="12" rx="2" fill="#111827" stroke="#4b5563" strokeWidth="1"/>
             {/* Screen glare */}
            <path d="M17 10 L 26 22" stroke="white" strokeOpacity="0.1" strokeWidth="1.5" />
            {/* Handle */}
            <path d="M40 28H54C55.1046 28 56 28.8954 56 30V38C56 39.1046 55.1046 40 54 40H40V28Z" fill="url(#pumpHandleGradient)"/>
            {/* Hose */}
            <path d="M56 34H60V48C60 51.3137 57.3137 54 54 54H50" stroke="#374151" strokeWidth="5" strokeLinecap="round"/>
        </g>
    </svg>
);
