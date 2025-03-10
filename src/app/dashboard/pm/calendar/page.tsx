"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { motion } from "framer-motion";

// Sample events data for PM events (e.g., project meetings, site visits)
const events = [
  {
    id: 1,
    date: "2025-04-05",
    title: "Réunion d'installation - Pompe à chaleur - Client X",
    solution: "Pompes a chaleur",
  },
  {
    id: 2,
    date: "2025-04-12",
    title: "Planification - Chauffe-eau solaire individuel - Client Y",
    solution: "Chauffe-eau solaire individuel",
  },
  {
    id: 3,
    date: "2025-04-18",
    title: "Visite de site - Chauffe-eau thermodynamique - Client Z",
    solution: "Chauffe-eau thermodynamique",
  },
  {
    id: 4,
    date: "2025-04-22",
    title: "Conférence - Système Solaire Combiné - Partenaires",
    solution: "Système Solaire Combiné",
  },
];

// Helper function to generate calendar days (with null for blank cells)
function getCalendarDays(year: number, month: number) {
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // Sunday = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const calendarDays = [];

  // Fill blank cells before the first day
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push(null);
  }

  // Fill in each day of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(new Date(year, month, day));
  }

  // Pad the grid at the end to complete the final week
  while (calendarDays.length % 7 !== 0) {
    calendarDays.push(null);
  }

  return calendarDays;
}

export default function PMCalendarDashboard() {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0-indexed

  // Generate calendar days for current month/year
  const calendarDays = getCalendarDays(currentYear, currentMonth);

  // Filter events for the current month
  const eventsThisMonth = events.filter((event) => {
    const eventDate = new Date(event.date);
    return (
      eventDate.getFullYear() === currentYear &&
      eventDate.getMonth() === currentMonth
    );
  });

  // Handlers to navigate between months
  const goToPreviousMonth = () => {
    let newMonth = currentMonth - 1;
    let newYear = currentYear;
    if (newMonth < 0) {
      newMonth = 11;
      newYear = currentYear - 1;
    }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const goToNextMonth = () => {
    let newMonth = currentMonth + 1;
    let newYear = currentYear;
    if (newMonth > 11) {
      newMonth = 0;
      newYear = currentYear + 1;
    }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      {/* Common Header */}
      <Header />

      <main className="max-w-7xl mx-auto p-6">
        {/* Hero Section */}
        <motion.div
          className="mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-800">Calendrier</h1>
          <p className="mt-2 text-lg text-gray-600">
            Visualisez vos réunions, visites de site et sessions de planification pour nos solutions énergétiques spécialisées.
          </p>
        </motion.div>

        {/* Calendar Navigation */}
        <motion.div
          className="flex justify-center items-center gap-4 mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={goToPreviousMonth}
            className="px-4 py-2 bg-green-600 text-white rounded-full"
          >
            Précédent
          </button>
          <div className="text-lg font-semibold text-gray-800">
            {new Date(currentYear, currentMonth).toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </div>
          <button
            onClick={goToNextMonth}
            className="px-4 py-2 bg-green-600 text-white rounded-full"
          >
            Suivant
          </button>
        </motion.div>

        {/* Calendar Grid */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"].map((day) => (
              <div key={day} className="text-center font-semibold text-gray-600">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((date, index) => {
              if (!date) {
                return (
                  <div
                    key={index}
                    className="h-16 border border-gray-200 bg-white/50"
                  ></div>
                );
              }

              // Get events scheduled for this day
              const dayEvents = eventsThisMonth.filter(
                (event) => new Date(event.date).getDate() === date.getDate()
              );

              return (
                <div
                  key={index}
                  className="h-16 border border-gray-200 p-1 relative bg-white/80 backdrop-blur-sm rounded"
                >
                  <div className="text-sm font-medium text-gray-800">
                    {date.getDate()}
                  </div>
                  {dayEvents.length > 0 && (
                    <div className="absolute bottom-1 left-1 right-1">
                      {dayEvents.map((event, i) => (
                        <span
                          key={i}
                          className="block text-xs text-green-600 truncate"
                        >
                          {event.title}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
