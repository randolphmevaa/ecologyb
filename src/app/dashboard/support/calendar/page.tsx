"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { motion } from "framer-motion";

// Sample events data
const events = [
  {
    id: 1,
    date: "2025-03-10",
    title: "Réunion: Pompe à chaleur - Client A",
    solution: "Pompes a chaleur",
  },
  {
    id: 2,
    date: "2025-03-15",
    title: "Suivi: Chauffe-eau solaire individuel - Client B",
    solution: "Chauffe-eau solaire individuel",
  },
  {
    id: 3,
    date: "2025-03-20",
    title: "Maintenance: Chauffe-eau thermodynamique - Client C",
    solution: "Chauffe-eau thermodynamique",
  },
  {
    id: 4,
    date: "2025-03-25",
    title: "Installation: Système Solaire Combiné - Client D",
    solution: "Système Solaire Combiné",
  },
];

// Helper function to generate an array of dates (or null for blank cells)
// for the given year and month.
function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay(); // Sunday = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const calendarDays = [];

  // Fill in the blank cells before the first day of the month.
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  // Fill in each day of the month.
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(new Date(year, month, day));
  }

  // Pad the end of the grid to complete the final week.
  while (calendarDays.length % 7 !== 0) {
    calendarDays.push(null);
  }

  return calendarDays;
}

export default function SupportCalendarDashboard() {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0-indexed (0 = January)

  // Generate the calendar days for the current year and month.
  const calendarDays = getCalendarDays(currentYear, currentMonth);

  // Filter events for the currently viewed month.
  const eventsThisMonth = events.filter((event) => {
    const eventDate = new Date(event.date);
    return (
      eventDate.getFullYear() === currentYear &&
      eventDate.getMonth() === currentMonth
    );
  });

  // Handlers to navigate between months.
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
      {/* Common Header */}
      <Header />

      <main className="max-w-7xl mx-auto p-6">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <h1 className="text-3xl font-bold text-gray-800">Calendrier</h1>
          <p className="mt-2 text-lg text-gray-600">
            Visualisez et gérez vos rendez-vous et événements pour nos solutions
            énergétiques spécialisées.
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"].map((d) => (
              <div
                key={d}
                className="text-center font-semibold text-gray-600"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((date, index) => {
              if (!date) {
                return (
                  <div key={index} className="h-16 border border-gray-200"></div>
                );
              }
              // Filter events that occur on this day.
              const dayEvents = eventsThisMonth.filter(
                (e) => new Date(e.date).getDate() === date.getDate()
              );
              return (
                <div
                  key={index}
                  className="h-16 border border-gray-200 p-1 relative"
                >
                  <div className="text-sm font-medium text-gray-800">
                    {date.getDate()}
                  </div>
                  {dayEvents.length > 0 && (
                    <div className="absolute bottom-1 left-1 right-1">
                      {dayEvents.map((e, i) => (
                        <span
                          key={i}
                          className="block text-xs text-green-600 truncate"
                        >
                          {e.title}
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
