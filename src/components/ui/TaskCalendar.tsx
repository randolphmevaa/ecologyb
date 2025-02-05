"use client";

import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { cn } from "@/lib/utils";

export const TaskCalendar = () => {
  // Explicitly type the state to allow Date or null.
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <div className="border rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-gray-50 p-4 border-b font-semibold text-gray-600">
        Calendrier des tâches
      </div>
      <div className="p-4">
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          inline
          calendarClassName="w-full"
          dayClassName={(date) =>
            cn(
              "rounded-xl p-2 hover:bg-primary/10 transition-colors",
              date.getDate() === new Date().getDate() &&
                date.getMonth() === new Date().getMonth() &&
                "bg-primary/10 text-primary font-medium"
            )
          }
          renderDayContents={(day) => (
            <div className="flex flex-col items-center">
              <span>{day}</span>
              {day % 5 === 0 && (
                <div className="h-1 w-1 bg-primary rounded-full mt-1" />
              )}
            </div>
          )}
        />
      </div>
    </div>
  );
};
