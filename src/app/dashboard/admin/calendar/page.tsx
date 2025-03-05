"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { motion } from "framer-motion";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

// Import icons from Heroicons (adjust paths if needed)
import {
  ClipboardIcon,
  ClockIcon,
  UserIcon,
  MapPinIcon,
  CalendarIcon,
  CalendarDaysIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  StarIcon,
  PlusIcon,
  EllipsisHorizontalIcon,
  SunIcon,
  ChartBarIcon,
  PencilIcon,
  TrashIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

// Define a type for custom CSS properties if needed
type CustomCSSProperties = React.CSSProperties;

// Define the different calendar view modes (react-big-calendar uses lowercase strings)
enum Views {
  MONTH = "month",
  WEEK = "week",
  DAY = "day",
  AGENDA = "agenda",
}

interface ConversationMessage {
  sender: string;
  timestamp: number;
  content: string;
}

interface EventDetails {
  id?: number;
  title?: string;
  type?: string;
  start?: Date;
  end?: Date;
  ticket?: string;
  status?: "pending" | "scheduled" | "completed" | string;
  location?: string;
  customerFirstName?: string;
  customerLastName?: string;
  technicianFirstName?: string;
  technicianLastName?: string;
  address?: string;
  notes?: string;
  problem?: string;
  conversation?: ConversationMessage[];
  // add more fields as needed
}


export default function CalendarPage() {
  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<Views>(Views.MONTH);
  const [activeViewTab, setActiveViewTab] = useState<string>("Mois");
  const [ , setShowNewEventModal] = useState(false);

  // Setup localizer for react-big-calendar using moment
  const localizer = momentLocalizer(moment);

  // Dummy calendar events (added optional "participants" property)
  const calendarEvents = [
    {
      id: 0,
      title: "Réunion d'équipe",
      start: new Date(),
      end: new Date(new Date().getTime() + 60 * 60 * 1000),
      type: "réunion",
      location: "Salle 1",
      participants: "John Doe",
    },
    // ...add other events here
  ];

  // Helper function to check if a date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Calendar navigation handlers
  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handlePrev = () => {
    const newDate = new Date(currentDate);
    if (currentView === Views.MONTH) {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (currentView === Views.WEEK) {
      newDate.setDate(newDate.getDate() - 7);
    } else if (currentView === Views.DAY || currentView === Views.AGENDA) {
      newDate.setDate(newDate.getDate() - 1);
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (currentView === Views.MONTH) {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (currentView === Views.WEEK) {
      newDate.setDate(newDate.getDate() + 7);
    } else if (currentView === Views.DAY || currentView === Views.AGENDA) {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  // View tab change handler
  const viewTabs = ["Jour", "Semaine", "Mois", "Listing"];
  const handleViewChange = (view: string) => {
    setActiveViewTab(view);
    if (view === "Mois") {
      setCurrentView(Views.MONTH);
    } else if (view === "Semaine") {
      setCurrentView(Views.WEEK);
    } else if (view === "Jour") {
      setCurrentView(Views.DAY);
    } else if (view === "Listing") {
      setCurrentView(Views.AGENDA);
    }
  };

  // Close the event details popup
  const handleClosePopup = () => {
    setEventDetails(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Main container with Calendar Navigation and Calendar */}
      <div className="flex flex-col">
        {/* Navigation Header */}
        <div className="bg-gradient-to-r from-[#1a365d] to-[#0f2942] p-7 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-white/15 rounded-2xl backdrop-blur-md flex items-center justify-center">
                <CalendarIcon className="h-8 w-8 text-[#e2ffc2]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  Calendrier
                </h2>
                <p className="text-white/90 font-medium mt-1.5">
                  Planifiez, gérez et organisez vos rendez-vous
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <StarIcon className="h-4 w-4 text-white/60" />
                </div>
                <input
                  type="text"
                  placeholder="Rechercher un événement..."
                  className="w-full text-sm border-none bg-white/15 hover:bg-white/20 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all text-white placeholder-white/60"
                />
              </div>
              <button
                onClick={() => setShowNewEventModal(true)}
                className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#e2ffc2] to-[#c5f7a5] hover:opacity-90 text-[#1a365d] rounded-xl text-sm font-semibold transition-colors"
              >
                <PlusIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Nouvel événement</span>
                <span className="sm:hidden">Nouveau</span>
              </button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleToday}
                className="px-5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 transition-colors text-sm font-medium backdrop-blur-md flex items-center gap-2"
              >
                <CalendarDaysIcon className="h-4 w-4" />
                Aujourd&apos;hui
              </button>
              <div className="flex gap-1.5">
                <button
                  onClick={handlePrev}
                  className="p-2.5 rounded-xl bg-white/15 hover:bg-white/25 transition-colors"
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-2.5 rounded-xl bg-white/15 hover:bg-white/25 transition-colors"
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-white whitespace-nowrap">
              {currentDate.toLocaleString("fr-FR", {
                month: "long",
                year: "numeric",
              })}
            </h3>
          </div>
          {/* View Tabs */}
          <div className="px-4 sm:px-7 pt-4 bg-white border-b border-gray-100 overflow-x-auto">
            <div className="flex gap-2 min-w-max">
              {viewTabs.map((view, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleViewChange(view)}
                  className={`px-3 sm:px-5 py-2.5 text-sm font-medium rounded-t-xl transition-colors ${
                    activeViewTab === view
                      ? "bg-blue-50 text-blue-700 border-b-2 border-blue-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {view}
                </motion.button>
              ))}
              <div className="ml-auto flex items-center gap-2">
                <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors">
                  <SunIcon className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors">
                  <ChartBarIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Component */}
        <div className="p-4 sm:p-7 pt-5">
          <motion.div
            className="rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Calendar
              localizer={localizer}
              events={calendarEvents}
              startAccessor="start"
              endAccessor="end"
              date={currentDate}
              view={currentView}
              onNavigate={(date) => setCurrentDate(date)}
              onView={(view) => setCurrentView(view as Views)}
              defaultView={Views.MONTH}
              views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
              messages={{
                month: "Mois",
                week: "Semaine",
                day: "Jour",
                agenda: "Agenda",
                previous: "Précédent",
                next: "Suivant",
                today: "Aujourd'hui",
                showMore: (total) => `+ ${total} autres`,
                allDay: "Toute la journée",
                date: "Date",
                time: "Heure",
                event: "Événement",
                noEventsInRange: "Aucun événement dans cette période",
              }}
              style={
                {
                  height: "75vh",
                  "--c-primary": "#1a365d",
                  "--c-secondary": "#0f2942",
                  "--c-accent": "#c5f7a5",
                } as CustomCSSProperties
              }
              className="calendrier-premium"
              eventPropGetter={(event) => ({
                style: {
                  backgroundColor:
                    event.type === "réunion"
                      ? "var(--c-primary)"
                      : "var(--c-accent)",
                  border: `1px solid ${
                    event.type === "réunion" ? "var(--c-secondary)" : "#b3e19f"
                  }`,
                  borderRadius: "10px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  color:
                    event.type === "réunion" ? "white" : "var(--c-secondary)",
                  padding: "8px 14px",
                  fontSize: "0.875rem",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                },
              })}
              dayPropGetter={(date) => ({
                className:
                  date.getDate() === new Date().getDate()
                    ? "jour-actuel bg-gradient-to-br from-blue-50/70 to-blue-100/40 border-l-4 border-blue-500"
                    : "",
              })}
              components={{
                event: ({ event }) => (
                  <motion.div
                    className="h-full p-2"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.03, y: -1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`h-2.5 w-2.5 rounded-full mt-1.5 ${
                          event.type === "réunion"
                            ? "bg-white/90"
                            : "bg-[#1a365d]/80"
                        }`}
                      />
                      <div className="flex-1">
                        <p className="font-medium truncate">{event.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <ClockIcon
                            className={`h-3.5 w-3.5 ${
                              event.type === "réunion"
                                ? "text-white/80"
                                : "text-gray-600"
                            }`}
                          />
                          <span
                            className={`text-xs font-medium ${
                              event.type === "réunion"
                                ? "text-white/90"
                                : "text-gray-600"
                            }`}
                          >
                            {event.start.toLocaleTimeString("fr-FR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          {event.location && (
                            <>
                              <span
                                className={`${
                                  event.type === "réunion"
                                    ? "text-white/60"
                                    : "text-gray-400"
                                }`}
                              >
                                •
                              </span>
                              <MapPinIcon
                                className={`h-3.5 w-3.5 ${
                                  event.type === "réunion"
                                    ? "text-white/80"
                                    : "text-gray-600"
                                }`}
                              />
                              <span
                                className={`text-xs ${
                                  event.type === "réunion"
                                    ? "text-white/90"
                                    : "text-gray-600"
                                }`}
                              >
                                {event.location}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1 hover:bg-white/10 rounded-full">
                          <EllipsisHorizontalIcon
                            className={`h-4 w-4 ${
                              event.type === "réunion"
                                ? "text-white/90"
                                : "text-gray-600"
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ),
                toolbar: () => (
                  <motion.div
                    className="border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                  ></motion.div>
                ),
                timeGutterHeader: () => (
                  <div className="h-full bg-gray-50 flex items-center justify-center text-sm font-semibold text-gray-600 border-r border-gray-100">
                    <ClockIcon className="h-4 w-4 mr-1.5 text-blue-500" /> Horaire
                  </div>
                ),
                agenda: {
                  event: ({ event }) => (
                    <motion.div
                      className="flex items-center gap-4 p-4 my-2.5 bg-white border-l-4 border-[#1a365d] rounded-xl shadow-sm hover:shadow-md transition-all group"
                      whileHover={{ x: 5, backgroundColor: "#f8fafc" }}
                    >
                      <div
                        className={`h-3.5 w-3.5 rounded-full ${
                          event.type === "réunion" ? "bg-[#c5f7a5]" : "bg-[#1a365d]"
                        }`}
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{event.title}</p>
                        <div className="flex flex-wrap items-center gap-y-2 gap-x-3 mt-1.5">
                          <div className="flex items-center gap-1.5">
                            <ClockIcon className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600">
                              {event.start.toLocaleTimeString("fr-FR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                              {" - "}
                              {event.end.toLocaleTimeString("fr-FR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          <span className="text-gray-400 hidden sm:inline">|</span>
                          <div className="flex items-center gap-1.5">
                            <UserCircleIcon className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600">
                              {event.participants || "Aucun participant"}
                            </span>
                          </div>
                          {event.location && (
                            <>
                              <span className="text-gray-400 hidden sm:inline">|</span>
                              <div className="flex items-center gap-1.5">
                                <MapPinIcon className="h-4 w-4 text-gray-500" />
                                <span className="text-sm text-gray-600">
                                  {event.location}
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <PencilIcon className="h-4 w-4 text-gray-500" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <TrashIcon className="h-4 w-4 text-gray-500" />
                        </button>
                      </div>
                    </motion.div>
                  ),
                  time: ({ label }: { label?: string }) => (
                    <div className="text-sm font-medium text-gray-700 bg-gray-50 p-3 border-b border-gray-100">
                      {label || ""}
                    </div>
                  ),
                },
                week: {
                  header: ({ date }) => (
                    <div className="text-center py-3 bg-gradient-to-b from-blue-50 to-white border-b border-gray-100">
                      <p className="text-sm font-bold text-blue-600 mb-1 uppercase">
                        {date.toLocaleDateString("fr-FR", { weekday: "short" })}
                      </p>
                      <p
                        className={`text-xl ${
                          date.getDate() === new Date().getDate()
                            ? "text-blue-600 font-bold"
                            : "text-gray-800 font-semibold"
                        }`}
                      >
                        {date.getDate()}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {date.toLocaleDateString("fr-FR", { month: "short" })}
                      </p>
                    </div>
                  ),
                },
                day: {
                  header: ({ date }) => (
                    <div className="text-center py-6 bg-blue-50 border-b border-blue-100">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <CalendarDaysIcon className="h-5 w-5 text-blue-600" />
                        <p className="text-lg font-bold text-blue-600">
                          {date.toLocaleDateString("fr-FR", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="flex items-center justify-center text-sm text-blue-700">
                        {isToday(date) && (
                          <span className="px-3 py-1 bg-blue-100 rounded-full font-medium">
                            Aujourd&apos;hui
                          </span>
                        )}
                      </div>
                    </div>
                  ),
                },
              }}
              popup
              selectable
              onSelectEvent={(event) => {
                console.log("Événement sélectionné:", event);
                setEventDetails(event);
              }}
              onSelectSlot={(slotInfo) =>
                console.log("Créneau sélectionné:", slotInfo)
              }
              culture="fr"
            />
          </motion.div>
        </div>
      </div>

      {/* Calendrier S.A.V. Popup Modal */}
      {eventDetails && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Semi-transparent background with blur effect */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClosePopup}
          ></div>

          {/* Popup content */}
          <motion.div
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl z-10 max-w-md w-full mx-4 relative"
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {/* Close Button */}
            <button
              onClick={handleClosePopup}
              className="mt-6 w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-700 dark:hover:bg-blue-600"
            >
              Fermer
            </button>

            {/* Header */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                {eventDetails.title || eventDetails.type || "Détails de l'événement"}
              </h3>
            </div>

            {/* Event Information Grid */}
            <div className="space-y-4">
              {/* Ticket and Status */}
              <div className="grid grid-cols-2 gap-4">
                {eventDetails.ticket && (
                  <div className="flex items-center space-x-2">
                    <ClipboardIcon className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Ticket
                      </p>
                      <p className="font-semibold text-white">
                        {eventDetails.ticket}
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      eventDetails.status === "completed"
                        ? "bg-green-500"
                        : eventDetails.status === "pending"
                        ? "bg-yellow-500"
                        : eventDetails.status === "scheduled"
                        ? "bg-blue-500"
                        : "bg-red-500"
                    }`}
                  ></div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Statut
                    </p>
                    <p className="font-semibold text-white">
                      {eventDetails.status === "pending"
                        ? "en attente"
                        : eventDetails.status === "scheduled"
                        ? "plannifier"
                        : eventDetails.status === "completed"
                        ? "complété"
                        : eventDetails.status}
                    </p>
                  </div>
                </div>
              </div>

              {/* Date and Time */}
              {eventDetails.start && eventDetails.end && (
                <div className="flex items-center space-x-3">
                  <ClockIcon className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Date
                    </p>
                    <p className="font-semibold text-white">
                      {new Date(eventDetails.start).toLocaleString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {" - "}
                      {new Date(eventDetails.end).toLocaleString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              )}

              {/* Customer and Technician */}
              <div className="grid grid-cols-2 gap-4">
                {(eventDetails.customerFirstName ||
                  eventDetails.customerLastName) && (
                  <div className="flex items-center space-x-2">
                    <UserIcon className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Client
                      </p>
                      <p className="font-semibold text-white">
                        {`${eventDetails.customerFirstName} ${eventDetails.customerLastName}`}
                      </p>
                    </div>
                  </div>
                )}
                {(eventDetails.technicianFirstName ||
                  eventDetails.technicianLastName) && (
                  <div className="flex items-center space-x-2">
                    <UserIcon className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Technicien
                      </p>
                      <p className="font-semibold text-white">
                        {`${eventDetails.technicianFirstName} ${eventDetails.technicianLastName}`}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Location */}
              {(eventDetails.address || eventDetails.location) && (
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center space-x-3">
                    <MapPinIcon className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Lieu
                      </p>
                      <p className="font-semibold text-white">
                        {eventDetails.address || eventDetails.location}
                      </p>
                    </div>
                  </div>
                  <iframe
                    title="Map"
                    src={`https://www.google.com/maps?q=${encodeURIComponent(
                      (eventDetails.address || eventDetails.location) as string
                    )}&output=embed`}
                    width="100%"
                    height="300"
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-lg"
                  ></iframe>
                </div>
              )}

              {/* Description */}
              {(eventDetails.notes || eventDetails.problem) && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                    Description
                  </p>
                  <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                    <p className="text-gray-800 dark:text-gray-200">
                      {eventDetails.notes || eventDetails.problem}
                    </p>
                  </div>
                </div>
              )}

              {/* Conversation */}
              {eventDetails.conversation &&
                eventDetails.conversation.length > 0 && (
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <EllipsisHorizontalIcon className="h-5 w-5 text-indigo-500" />
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Conversation
                      </p>
                    </div>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                    {eventDetails.conversation?.map((msg: ConversationMessage, index: number) => (
                        <div
                          key={index}
                          className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg"
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-semibold text-sm text-gray-800 dark:text-gray-200">
                              {msg.sender}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(msg.timestamp).toLocaleString("fr-FR", {
                                hour: "2-digit",
                                minute: "2-digit",
                                day: "numeric",
                                month: "short",
                              })}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {msg.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>

            {/* Close Button */}
            <button
              onClick={handleClosePopup}
              className="mt-6 w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-700 dark:hover:bg-blue-600"
            >
              Fermer
            </button>
          </motion.div>
        </div>
      )}

      {/* Global custom CSS for react-big-calendar */}
      <style jsx global>{`
        .calendrier-premium {
          .rbc-month-view,
          .rbc-time-view {
            border: none;
            background: linear-gradient(to bottom right, #f8fafc, #ffffff);
            border-radius: 12px;
            overflow: hidden;
          }
          .rbc-header {
            padding: 1.25rem 1rem;
            background: #f9fafb;
            color: #4b5563;
            font-weight: 600;
            border-bottom: 1px solid #e5e7eb;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            font-size: 0.875rem;
          }
          .rbc-month-row {
            overflow: visible;
          }
          .rbc-day-bg {
            transition: background 0.3s;
          }
          .rbc-day-bg:hover {
            background: rgba(243, 244, 246, 0.7);
          }
          .rbc-event {
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08);
            transform-origin: center;
            transition: transform 0.2s, box-shadow 0.2s;
          }
          .rbc-event:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
            z-index: 5;
          }
          .rbc-time-content {
            border-top: 0;
          }
          .rbc-timeslot-group {
            border-color: #e5e7eb;
          }
          .rbc-current-time-indicator {
            background: #3b82f6;
            height: 2px;
          }
          .rbc-today {
            background-color: rgba(239, 246, 255, 0.6);
          }
          .rbc-label {
            font-weight: 500;
            color: #4b5563;
          }
          .rbc-time-header-content {
            border-color: #e5e7eb;
          }
          .rbc-agenda-view table.rbc-agenda-table {
            border-radius: 10px;
            overflow: hidden;
            border: 1px solid #e5e7eb;
          }
          .rbc-agenda-view table.rbc-agenda-table thead > tr > th {
            background-color: #f3f4f6;
            color: #4b5563;
            font-weight: 600;
            padding: 12px;
            border-bottom: 1px solid #e5e7eb;
          }
          .rbc-agenda-view table.rbc-agenda-table tbody > tr > td {
            padding: 12px;
            border-bottom: 1px solid #e5e7eb;
          }
          .rbc-agenda-view table.rbc-agenda-table tbody > tr:hover {
            background-color: #f9fafb;
          }
          .rbc-header + .rbc-header {
            border-left: 1px solid #e5e7eb;
          }
          .rbc-off-range-bg {
            background: #f9fafb;
          }
          .rbc-off-range {
            color: #9ca3af;
          }
          .rbc-date-cell {
            padding: 6px 8px;
            text-align: center;
            font-weight: 500;
            color: #4b5563;
          }
          .rbc-date-cell.rbc-now {
            color: #2563eb;
            font-weight: 700;
          }
          .rbc-button-link {
            font-weight: 500;
          }
          @media (max-width: 640px) {
            .rbc-toolbar {
              flex-direction: column;
              align-items: flex-start;
              margin-bottom: 10px;
            }
            .rbc-toolbar-label {
              margin: 8px 0;
            }
            .rbc-btn-group {
              margin-bottom: 8px;
            }
            .rbc-header {
              padding: 0.75rem 0.5rem;
              font-size: 0.75rem;
            }
            .rbc-event {
              padding: 4px 8px !important;
            }
            .rbc-day-slot .rbc-events-container {
              margin-right: 0;
            }
          }
          .rbc-time-header-content .rbc-header {
            background: linear-gradient(to bottom, #eef2ff, #f9fafb);
            padding: 1rem;
            height: auto;
          }
          .rbc-month-header .rbc-header {
            background: linear-gradient(to bottom, #eef2ff, #f9fafb);
            padding: 1rem;
            text-transform: capitalize;
            font-weight: 600;
            font-size: 0.9rem;
          }
        }
        .jour-actuel {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(255,255,255,0) 70%);
          position: relative;
        }
        .jour-actuel::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: #3b82f6;
          border-radius: 3px 3px 0 0;
        }
      `}</style>
    </div>
  );
}
