"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
// import { Sidebar } from "@/components/ui/Sidebar";
import { Header } from "@/components/Header";
import {
  CalendarIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

// Advanced calendar settings
const containerHeight = 600; // Height of the calendar timeline in pixels
const startOfDay = 8 * 60; // 8:00 in minutes (480)
const endOfDay = 18 * 60; // 18:00 in minutes (1080)
const totalMinutes = endOfDay - startOfDay; // 600 minutes
const timeSlots = Array.from({ length: 11 }, (_, i) => 8 + i); // 8:00 to 18:00

// Days of the week
const days = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche",
];

// Sample advanced events with day, start and end times (in HH:MM format)
const advancedEvents = [
  { id: 1, day: "Lundi", title: "Réunion d'équipe", start: "09:00", end: "10:30" },
  { id: 2, day: "Mardi", title: "Formation produit", start: "11:00", end: "12:00" },
  { id: 3, day: "Mercredi", title: "Visite client", start: "14:00", end: "15:30" },
  { id: 4, day: "Vendredi", title: "Débriefing projet", start: "16:00", end: "17:00" },
  { id: 5, day: "Samedi", title: "Planification stratégique", start: "10:00", end: "11:00" },
];

//
// AdvancedTeamCalendar Component
// Renders a week view timeline with time slots in the left column and one column per day.
// Each event is absolutely positioned based on its start time and duration.
//
function AdvancedTeamCalendar() {
  // Helper to convert "HH:MM" to minutes
  const timeToMinutes = (timeStr: string): number => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  };

  return (
    <motion.div
      className="bg-white/90 backdrop-blur-sm rounded-2xl shadow border border-[#d2fcb2]/30 p-4 mb-8 overflow-auto"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <CalendarIcon className="h-6 w-6 text-[#2a8547]" />
        <h2 className="text-xl font-semibold text-[#1a4231]">Calendrier d&apos;équipe avancé</h2>
      </div>
      <div className="grid grid-cols-8">
        {/* Time labels column */}
        <div className="relative border-r border-gray-200" style={{ height: containerHeight }}>
          {timeSlots.map((hour) => {
            const top = ((hour * 60 - startOfDay) / totalMinutes) * containerHeight;
            return (
              <div
                key={hour}
                className="absolute left-0 right-0 border-t border-gray-200 text-xs text-gray-500"
                style={{ top }}
              >
                {hour}:00
              </div>
            );
          })}
        </div>
        {/* Day columns */}
        {days.map((day) => (
          <div
            key={day}
            className="relative border-r border-gray-200"
            style={{ height: containerHeight }}
          >
            {/* Day header */}
            <div className="absolute top-0 left-0 w-full bg-gray-50 text-center text-sm font-bold text-[#1a365d] py-1 border-b border-gray-200">
              {day}
            </div>
            {/* Events */}
            {advancedEvents
              .filter((e) => e.day === day)
              .map((event) => {
                const startMinutes = timeToMinutes(event.start);
                const endMinutes = timeToMinutes(event.end);
                const top = ((startMinutes - startOfDay) / totalMinutes) * containerHeight;
                const height = ((endMinutes - startMinutes) / totalMinutes) * containerHeight;
                return (
                  <motion.div
                    key={event.id}
                    className="absolute left-1 right-1 bg-[#2a75c7] text-white rounded-md p-1 text-xs shadow hover:shadow-lg transition-all duration-300 cursor-pointer"
                    style={{ top, height }}
                    whileHover={{ scale: 1.03 }}
                  >
                    <p className="font-bold">{event.title}</p>
                    <p>
                      {event.start} - {event.end}
                    </p>
                  </motion.div>
                );
              })}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

//
// MeetingScheduler Component
// Provides a modal form to schedule a new meeting with intuitive inputs and validations.
//
function MeetingScheduler() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    date: "",
    time: "",
    participants: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSchedule = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    // Here you would integrate your meeting scheduling logic.
    console.log("Meeting scheduled", form);
    setForm({ title: "", date: "", time: "", participants: "" });
    setOpen(false);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Planifier une réunion</Button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 w-full max-w-md shadow-lg relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                aria-label="Close scheduler"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
              <h2 className="text-xl font-semibold text-[#1a365d] mb-4">
                Planifier une réunion
              </h2>
              <form onSubmit={handleSchedule} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Titre</label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2a75c7] focus:ring focus:ring-[#2a75c7]/30 bg-white/90"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2a75c7] focus:ring focus:ring-[#2a75c7]/30 bg-white/90"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Heure</label>
                  <input
                    type="time"
                    name="time"
                    value={form.time}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2a75c7] focus:ring focus:ring-[#2a75c7]/30 bg-white/90"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Participants
                  </label>
                  <input
                    type="text"
                    name="participants"
                    value={form.participants}
                    onChange={handleChange}
                    placeholder="Emails séparés par des virgules"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2a75c7] focus:ring focus:ring-[#2a75c7]/30 bg-white/90"
                  />
                </div>
                <div className="flex justify-end">
                  <Button type="submit">Planifier</Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

//
// CalendarPage Component
// Combines the Sidebar, Header, AdvancedTeamCalendar, and MeetingScheduler components for a premium Calendar UI.
//
export default function CalendarPage() {
  return (
    <div className="flex h-screen bg-[#ffffff]">
      {/* Sidebar Area */}
      <motion.div
        className="relative border-r border-[#bfddf9]/30 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* <Sidebar role="admin" /> */}
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-8 space-y-8 bg-gradient-to-b from-[#bfddf9]/10 to-[#d2fcb2]/05">
          <h1 className="text-3xl font-bold text-[#1a365d] mb-8">Calendrier</h1>
          <AdvancedTeamCalendar />
          <MeetingScheduler />
        </main>
      </div>
    </div>
  );
}
