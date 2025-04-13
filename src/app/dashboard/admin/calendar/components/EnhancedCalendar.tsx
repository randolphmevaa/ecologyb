import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckIcon,
  CalendarIcon,
//   UserGroupIcon,
//   MapPinIcon,
//   WrenchScrewdriverIcon,
//   ShoppingBagIcon,
//   ArrowLongRightIcon,
  PlusCircleIcon,
  MinusCircleIcon,
//   ArrowPathIcon,
//   StarIcon,
//   CubeIcon,
//   UserIcon,
  ClockIcon,
//   DevicePhoneMobileIcon,
//   BuildingOfficeIcon,
  ArrowsPointingOutIcon,
  PlusIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
//   ArrowTopRightOnSquareIcon,
//   Bars3Icon,
  TrashIcon,
  PencilIcon,
//   EllipsisVerticalIcon
} from "@heroicons/react/24/outline";
import { 
//   ShieldCheckIcon, 
//   CheckCircleIcon,
//   TruckIcon,
//   FireIcon,
//   LightBulbIcon,
//   BoltIcon as BoltSolidIcon,
  CalendarDaysIcon,
//   Cog8ToothIcon,
  ListBulletIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  SunIcon
} from "@heroicons/react/24/solid";

// TypeScript interfaces for our data models
interface TimeSlot {
  id: string;
  time: string;
  duration: number; // in minutes
  available: boolean;
  installerCount?: number; // Number of available installers
  title?: string;
  type?: string;
  color?: string;
  isAllDay?: boolean; // New property for all-day events
}

interface AvailableSlot {
  id: number;
  date: string;
  times: string[];
  timeSlots?: TimeSlot[]; // Detailed info for enhanced UI
}

// Right after the imports:

interface EnhancedCalendarProps {
    // This callback sends the parent the date + time the user clicked
    onTimeSlotSelect: (date: string, time: string) => void;
  }
  

// interface CalendarDay {
//   date: Date;
//   dateString: string;
//   isCurrentMonth: boolean;
//   hasSlots?: boolean;
// }

// interface DraggableAppointment {
//   id: string;
//   startTime: string;
//   endTime: string;
//   duration: number;
//   title: string;
//   content?: string;
//   color: string;
//   isAllDay?: boolean; // New property for all-day events
// }

interface NewSlotFormData {
  title: string;
  startTime: string;
  duration: number;
  type: string;
  installerCount: number;
  notes: string;
  isAllDay: boolean; // New property for all-day events
}

// Available installation slots for the agenda
const availableSlots: AvailableSlot[] = [
  { 
    id: 1, 
    date: "2025-04-15", 
    times: ["08:00", "11:00", "14:00", "16:00"],
    timeSlots: [
      { id: "slot-1-1", time: "08:00", duration: 120, available: true, installerCount: 3, title: "Installation", type: "installation" },
      { id: "slot-1-2", time: "11:00", duration: 120, available: true, installerCount: 1, title: "Installation", type: "installation" },
      { id: "slot-1-3", time: "14:00", duration: 120, available: true, installerCount: 2, title: "Installation", type: "installation" },
      { id: "slot-1-4", time: "16:00", duration: 120, available: true, installerCount: 3, title: "Installation", type: "installation" }
    ]
  },
  { 
    id: 2, 
    date: "2025-04-16", 
    times: ["09:00", "13:00", "15:00"],
    timeSlots: [
      { id: "slot-2-1", time: "09:00", duration: 120, available: true, installerCount: 2, title: "Installation", type: "installation" },
      { id: "slot-2-2", time: "13:00", duration: 120, available: true, installerCount: 4, title: "Installation", type: "installation" },
      { id: "slot-2-3", time: "15:00", duration: 120, available: true, installerCount: 1, title: "Installation", type: "installation" }
    ]
  },
  { 
    id: 3, 
    date: "2025-04-17", 
    times: ["08:30", "10:30", "14:30", "16:30"],
    timeSlots: [
      { id: "slot-3-1", time: "08:30", duration: 120, available: true, installerCount: 5, title: "Installation", type: "installation" },
      { id: "slot-3-2", time: "10:30", duration: 120, available: true, installerCount: 3, title: "Installation", type: "installation" },
      { id: "slot-3-3", time: "14:30", duration: 120, available: true, installerCount: 2, title: "Installation", type: "installation" },
      { id: "slot-3-4", time: "16:30", duration: 120, available: true, installerCount: 1, title: "Installation", type: "installation" }
    ]
  },
  { 
    id: 4, 
    date: "2025-04-18", 
    times: ["08:00", "12:00", "15:00"],
    timeSlots: [
      { id: "slot-4-1", time: "08:00", duration: 120, available: true, installerCount: 4, title: "Installation", type: "installation" },
      { id: "slot-4-2", time: "12:00", duration: 120, available: true, installerCount: 3, title: "Installation", type: "installation" },
      { id: "slot-4-3", time: "15:00", duration: 120, available: true, installerCount: 2, title: "Installation", type: "installation" }
    ]
  },
  { 
    id: 5, 
    date: "2025-04-19", 
    times: ["10:00", "14:00"],
    timeSlots: [
      { id: "slot-5-1", time: "10:00", duration: 120, available: true, installerCount: 3, title: "Installation", type: "installation" },
      { id: "slot-5-2", time: "14:00", duration: 120, available: true, installerCount: 2, title: "Installation", type: "installation" },
      { id: "slot-5-3", time: "00:00", duration: 1440, available: true, installerCount: 5, title: "Journée entière", type: "installation", isAllDay: true }
    ]
  },
  { 
    id: 6, 
    date: "2025-04-22", 
    times: ["09:00", "13:30", "16:00"],
    timeSlots: [
      { id: "slot-6-1", time: "09:00", duration: 120, available: true, installerCount: 1, title: "Installation", type: "installation" },
      { id: "slot-6-2", time: "13:30", duration: 120, available: true, installerCount: 3, title: "Installation", type: "installation" },
      { id: "slot-6-3", time: "16:00", duration: 120, available: true, installerCount: 2, title: "Installation", type: "installation" }
    ]
  },
  { 
    id: 7, 
    date: "2025-04-23", 
    times: ["08:00", "10:30", "14:00", "15:30"],
    timeSlots: [
      { id: "slot-7-1", time: "08:00", duration: 120, available: true, installerCount: 4, title: "Installation", type: "installation" },
      { id: "slot-7-2", time: "10:30", duration: 120, available: true, installerCount: 2, title: "Installation", type: "installation" },
      { id: "slot-7-3", time: "14:00", duration: 120, available: true, installerCount: 3, title: "Installation", type: "installation" },
      { id: "slot-7-4", time: "15:30", duration: 120, available: true, installerCount: 1, title: "Installation", type: "installation" }
    ]
  },
  { 
    id: 8, 
    date: "2025-04-24", 
    times: ["09:30", "13:00", "16:30"],
    timeSlots: [
      { id: "slot-8-1", time: "09:30", duration: 120, available: true, installerCount: 2, title: "Installation", type: "installation" },
      { id: "slot-8-2", time: "13:00", duration: 120, available: true, installerCount: 5, title: "Installation", type: "installation" },
      { id: "slot-8-3", time: "16:30", duration: 120, available: true, installerCount: 1, title: "Installation", type: "installation" }
    ]
  },
  { 
    id: 9, 
    date: "2025-04-25", 
    times: ["08:30", "11:30", "14:30"],
    timeSlots: [
      { id: "slot-9-1", time: "08:30", duration: 120, available: true, installerCount: 3, title: "Installation", type: "installation" },
      { id: "slot-9-2", time: "11:30", duration: 120, available: true, installerCount: 2, title: "Installation", type: "installation" },
      { id: "slot-9-3", time: "14:30", duration: 120, available: true, installerCount: 1, title: "Installation", type: "installation" }
    ]
  },
  { 
    id: 10, 
    date: "2025-04-26", 
    times: ["10:00", "14:00"],
    timeSlots: [
      { id: "slot-10-1", time: "10:00", duration: 120, available: true, installerCount: 4, title: "Installation", type: "installation" },
      { id: "slot-10-2", time: "14:00", duration: 120, available: true, installerCount: 1, title: "Installation", type: "installation" }
    ]
  }
];

// Define preset appointment slots for the advanced calendar
// const presetAppointments: DraggableAppointment[] = [
//   {
//     id: "appt-1",
//     startTime: "09:00",
//     endTime: "11:00",
//     duration: 120,
//     title: "Installation PAC",
//     content: "Installation complète avec test",
//     color: "bg-blue-100 border-blue-300 text-blue-800"
//   },
//   {
//     id: "appt-2",
//     startTime: "13:00",
//     endTime: "15:00",
//     duration: 120,
//     title: "Maintenance syst.",
//     content: "Vérification annuelle",
//     color: "bg-green-100 border-green-300 text-green-800"
//   },
//   {
//     id: "appt-3",
//     startTime: "15:30",
//     endTime: "17:00",
//     duration: 90,
//     title: "Dépannage",
//     content: "Intervention urgente",
//     color: "bg-red-100 border-red-300 text-red-800"
//   },
//   {
//     id: "appt-4",
//     startTime: "00:00",
//     endTime: "23:59",
//     duration: 1440,
//     title: "Réunion d'équipe",
//     content: "Toute la journée",
//     color: "bg-purple-100 border-purple-300 text-purple-800",
//     isAllDay: true
//   }
// ];

// Hour markers for time grid
const hourMarkers = Array.from({ length: 11 }, (_, i) => {
  const hour = i + 8; // Start at 8 AM
  return `${hour}:00`;
});

// Available appointment types
const appointmentTypes = [
  { id: "installation", name: "Installation", color: "bg-blue-100 border-blue-300 text-blue-800", duration: 120 },
  { id: "maintenance", name: "Maintenance", color: "bg-green-100 border-green-300 text-green-800", duration: 120 },
  { id: "repair", name: "Dépannage", color: "bg-red-100 border-red-300 text-red-800", duration: 90 },
  { id: "consultation", name: "Consultation", color: "bg-purple-100 border-purple-300 text-purple-800", duration: 60 }
];

// Props for TimeSlotAppointment
// interface TimeSlotAppointmentProps {
//     appointment: DraggableAppointment;
//     isSelected: boolean;
//     onSelect: () => void;
//     onResize: (appointmentId: string, newDuration: number) => void;
//     onEdit: (appointment: DraggableAppointment) => void;
//     onDelete: (appointmentId: string) => void;
//   }
  
  // Props for ResizableTimeSlot
  interface ResizableTimeSlotProps {
    slot: TimeSlot;
    dateString: string;
    isSelected: boolean;
    onSelect: (dateString: string, time: string, slot: TimeSlot) => void;
    onEdit: (slot: TimeSlot) => void;
    onDelete: (slotId: string) => void;
    onResize: (slotId: string, newDuration: number, dateString: string) => void;
  }
  
  // Props for NewSlotFormModal
  interface NewSlotFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (dateString: string, formData: NewSlotFormData) => void;
    clickedDate: string | null;
    clickedTime: string | null;
  }
  
  // Props for Tooltip
  interface TooltipProps {
    children: React.ReactNode;
    content: string;
    position?: "top" | "bottom" | "left" | "right";
  }

// TimeSlot component for draggable appointments
// const TimeSlotAppointment: React.FC<TimeSlotAppointmentProps> = ({ 
//   appointment,
//   isSelected,
//   onSelect,
//   onResize,
//   onEdit,
//   onDelete
// }) => {
//   const dragControls = useRef(null);
//   const [isDragging, setIsDragging] = useState(false);
//   const [isResizing, setIsResizing] = useState(false);
//   const [currentHeight, setCurrentHeight] = useState(appointment.duration);
  
//   // Calculate position in the grid
//   const startHour = parseInt(appointment.startTime.split(':')[0], 10);
//   const startMinute = parseInt(appointment.startTime.split(':')[1], 10);
//   const topPosition = (startHour - 8) * 60 + startMinute; // 8 AM is our 0 position
  
//   // If it's an all-day event, render differently
//   if (appointment.isAllDay) {
//     return (
//       <motion.div
//         drag="y"
//         dragControls={dragControls}
//         dragConstraints={{ top: 0, bottom: 20 }}
//         dragElastic={0.1}
//         dragMomentum={false}
//         whileDrag={{ zIndex: 10 }}
//         onDragStart={() => setIsDragging(true)}
//         onDragEnd={() => setIsDragging(false)}
//         style={{ 
//           top: `0px`,
//           height: `32px` // Fixed height for all-day events
//         }}
//         className={`absolute left-0 right-0 rounded-md px-2 py-1.5 border shadow-sm cursor-move z-20
//           ${appointment.color} ${isSelected ? 'ring-2 ring-offset-1 ring-blue-500' : ''} 
//           ${isDragging ? 'opacity-70' : ''}
//         `}
//         onClick={(e) => {
//           e.stopPropagation();
//           onSelect();
//         }}
//       >
//         <div className="flex items-start justify-between">
//           <div className="flex items-center">
//             <SunIcon className="h-3.5 w-3.5 mr-1.5" />
//             <div className="font-medium text-sm">{appointment.title} <span className="text-xs font-normal">(Toute la journée)</span></div>
//           </div>
//           {isSelected && (
//             <div className="flex space-x-1">
//               <button 
//                 className="p-0.5 hover:bg-white/20 rounded"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   onEdit(appointment);
//                 }}
//               >
//                 <PencilIcon className="h-3 w-3" />
//               </button>
//               <button 
//                 className="p-0.5 hover:bg-white/20 rounded"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   onDelete(appointment.id);
//                 }}
//               >
//                 <TrashIcon className="h-3 w-3" />
//               </button>
//             </div>
//           )}
//         </div>
//       </motion.div>
//     );
//   }
  
//   return (
//     <motion.div
//       drag="y"
//       dragControls={dragControls}
//       dragConstraints={{ top: 0, bottom: 600 }}
//       dragElastic={0.1}
//       dragMomentum={false}
//       whileDrag={{ zIndex: 10 }}
//       onDragStart={() => setIsDragging(true)}
//       onDragEnd={() => setIsDragging(false)}
//       style={{ 
//         top: `${topPosition}px`,
//         height: `${currentHeight}px`
//       }}
//       className={`absolute left-16 right-4 rounded-md px-2 py-1.5 border shadow-sm cursor-move
//         ${appointment.color} ${isSelected ? 'ring-2 ring-offset-1 ring-blue-500' : ''} 
//         ${isDragging ? 'opacity-70' : ''}
//       `}
//       onClick={(e) => {
//         e.stopPropagation();
//         onSelect();
//       }}
//     >
//       <div className="flex items-start justify-between">
//         <div>
//           <div className="font-medium text-sm">{appointment.title}</div>
//           <div className="text-xs opacity-90">{appointment.startTime} - {appointment.endTime}</div>
//           {appointment.content && (
//             <div className="text-xs mt-1 opacity-80">{appointment.content}</div>
//           )}
//         </div>
//         {isSelected && (
//           <div className="flex space-x-1">
//             <button 
//               className="p-0.5 hover:bg-white/20 rounded"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 onEdit(appointment);
//               }}
//             >
//               <PencilIcon className="h-3 w-3" />
//             </button>
//             <button 
//               className="p-0.5 hover:bg-white/20 rounded"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 onDelete(appointment.id);
//               }}
//             >
//               <TrashIcon className="h-3 w-3" />
//             </button>
//           </div>
//         )}
//       </div>
      
//       {/* Resize handle */}
//       <div 
//         className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize flex items-center justify-center"
//         onMouseDown={(e) => {
//           e.stopPropagation();
//           setIsResizing(true);
          
//           const startY = e.clientY;
//           const startHeight = currentHeight;
          
//           const handleMouseMove = (moveEvent) => {
//             const deltaY = moveEvent.clientY - startY;
//             const newHeight = Math.max(30, Math.min(720, startHeight + deltaY)); // Increased max to allow for longer durations
//             setCurrentHeight(newHeight);
//           };
          
//           const handleMouseUp = () => {
//             setIsResizing(false);
//             document.removeEventListener('mousemove', handleMouseMove);
//             document.removeEventListener('mouseup', handleMouseUp);
            
//             // Call the resize callback with the new duration
//             onResize(currentHeight);
//           };
          
//           document.addEventListener('mousemove', handleMouseMove);
//           document.addEventListener('mouseup', handleMouseUp);
//         }}
//       >
//         <div className="h-1 w-10 bg-current opacity-30 rounded-full" />
//       </div>
//     </motion.div>
//   );
// };

// TimeSlot component with resize handler
const ResizableTimeSlot: React.FC<ResizableTimeSlotProps> = ({ 
  slot,
  dateString,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onResize
}) => {
  const [ , setIsResizing] = useState(false);
  const [currentHeight, setCurrentHeight] = useState(slot.duration);
  
  // Calculate position in the grid
  const startHour = parseInt(slot.time.split(':')[0], 10);
  const startMinute = parseInt(slot.time.split(':')[1], 10);
  const topPosition = (startHour - 8) * 60 + startMinute; // 8 AM is our 0 position
  
  // If it's an all-day event, render differently
  if (slot.isAllDay) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            onSelect(dateString, slot.time, slot);
          }}
        className={`absolute left-0 right-0 top-0 h-8 px-2 py-1 rounded-md shadow-md border z-20
          ${isSelected ? 'bg-blue-100 border-blue-300 text-blue-800 ring-2 ring-blue-500' : 
            (slot.color || "bg-indigo-100 border-indigo-300 text-indigo-800")}
        `}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <SunIcon className="h-3.5 w-3.5 mr-1.5" />
            <div className="font-medium text-sm truncate">{slot.title} <span className="text-xs font-normal">(Journée entière)</span></div>
          </div>
          <div className="text-xs px-1.5 py-0.5 bg-white/50 rounded-full">
            {slot.installerCount} installateurs
          </div>
        </div>
        
        {isSelected && (
          <div className="absolute right-1 top-1 flex space-x-1">
            <button 
              className="p-0.5 hover:bg-white/20 rounded"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(slot);
              }}
            >
              <PencilIcon className="h-3 w-3" />
            </button>
            <button 
              className="p-0.5 hover:bg-white/20 rounded"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(slot.id);
              }}
            >
              <TrashIcon className="h-3 w-3" />
            </button>
          </div>
        )}
      </motion.div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={(e: React.MouseEvent) => {
        e.stopPropagation();
        onSelect(dateString, slot.time, slot);
      }}
      style={{ 
        top: `${topPosition}px`,
        height: `${currentHeight}px`
      }}
      className={`absolute left-1 right-1 rounded-md border shadow-md px-2 py-1.5 cursor-pointer
        ${isSelected ? 'bg-blue-100 border-blue-300 text-blue-800 z-10 ring-2 ring-blue-500/50' :
          (slot.color || "bg-green-50 border-green-200 text-green-700") + " hover:bg-opacity-80"}
      `}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="font-medium text-sm">{slot.title || "Installation"}</div>
          <div className="text-xs">{slot.time} - {
            (() => {
              const [hours, minutes] = slot.time.split(':').map(Number);
              const endTime = new Date(2025, 0, 1, hours, minutes);
              endTime.setMinutes(endTime.getMinutes() + slot.duration);
              return endTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
            })()
          }</div>
        </div>
        <div className="text-xs bg-white/60 px-1.5 py-0.5 rounded-full">
          {slot.installerCount} installateurs
        </div>
      </div>
      
      {isSelected && (
        <div className="absolute right-1 top-1 flex space-x-1">
          <button 
            className="p-0.5 hover:bg-white/20 rounded"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(slot);
            }}
          >
            <PencilIcon className="h-3 w-3" />
          </button>
          <button 
            className="p-0.5 hover:bg-white/20 rounded"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(slot.id);
            }}
          >
            <TrashIcon className="h-3 w-3" />
          </button>
        </div>
      )}
      
      {isSelected && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-0 left-0 right-0 h-6 bg-blue-500/10 flex items-center justify-center rounded-b-md"
        >
          <CheckIcon className="h-3.5 w-3.5 text-blue-700" />
          <span className="text-xs font-medium text-blue-700 ml-1">Sélectionné</span>
        </motion.div>
      )}
      
      {/* Resize handle */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize flex items-center justify-center"
        onMouseDown={(e: React.MouseEvent) => {
          e.stopPropagation();
          setIsResizing(true);
          
          const startY = e.clientY;
          const startHeight = currentHeight;
          
          const handleMouseMove = (moveEvent: MouseEvent) => {
            const deltaY = moveEvent.clientY - startY;
            const newHeight = Math.max(30, Math.min(720, startHeight + deltaY));
            setCurrentHeight(newHeight);
          };
          
          const handleMouseUp = () => {
            setIsResizing(false);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            
            // Calculate new duration in minutes
            const newDuration = Math.round(currentHeight);
            
            // Call the resize callback with the new duration
            onResize(slot.id, newDuration, dateString);
          };
          
          document.addEventListener('mousemove', handleMouseMove);
          document.addEventListener('mouseup', handleMouseUp);
        }}
      >
        <div className="h-1 w-10 bg-current opacity-30 rounded-full hover:opacity-70" />
      </div>
    </motion.div>
  );
};

// New slot form modal
const NewSlotFormModal: React.FC<NewSlotFormModalProps> = ({ isOpen, onClose, onSave, clickedDate, clickedTime }) => {
    const [formData, setFormData] = useState<NewSlotFormData>({
      title: "Installation",
      startTime: clickedTime || "08:00",
      duration: 120,
      type: "installation",
      installerCount: 2,
      notes: "",
      isAllDay: false // New field for all-day events
    });
  
    useEffect(() => {
      // Update start time when clicked time changes
      if (clickedTime) {
        setFormData(prev => ({ ...prev, startTime: clickedTime }));
      }
    }, [clickedTime]);
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        // Use type narrowing to safely access the 'checked' property
        let inputValue: string | number | boolean = value;
        
        // Handle checkbox input
        if (e.target instanceof HTMLInputElement && e.target.type === 'checkbox') {
          inputValue = e.target.checked;
        } 
        // Handle number inputs
        else if (name === "installerCount" || name === "duration") {
          inputValue = parseInt(value);
        }
        
        setFormData(prev => ({ ...prev, [name]: inputValue }));
      };
  
    const handleTypeChange = (typeId: string) => {
      const selectedType = appointmentTypes.find(type => type.id === typeId);
      setFormData(prev => ({ 
        ...prev, 
        type: typeId, 
        duration: prev.isAllDay ? 1440 : selectedType?.duration || 120,
        title: selectedType?.name || "Rendez-vous"
      }));
    };
    
    // Handle all-day toggle
    const handleAllDayToggle = (isAllDay: boolean) => {
      setFormData(prev => ({ 
        ...prev, 
        isAllDay: isAllDay,
        duration: isAllDay ? 1440 : appointmentTypes.find(type => type.id === prev.type)?.duration || 120,
        startTime: isAllDay ? "00:00" : prev.startTime
      }));
    };
  
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (clickedDate) {
        onSave(clickedDate, formData);
      } else {
        // Fallback to current date if no date is provided
        const currentDate = new Date().toISOString().split('T')[0];
        onSave(currentDate, formData);
      }
      onClose();
    };
  
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-30 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-lg shadow-xl max-w-md w-full m-3"
        >
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 rounded-t-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-white">Ajouter un créneau</h3>
              <button onClick={onClose} className="text-white hover:text-gray-200">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            {clickedDate && (
              <p className="text-blue-100 text-sm mt-1">
                {new Date(clickedDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="p-4">
            {/* All day toggle */}
            <div className="mb-4">
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    name="isAllDay"
                    checked={formData.isAllDay}
                    onChange={(e) => handleAllDayToggle(e.target.checked)}
                    className="sr-only"
                  />
                  <div className="w-10 h-5 bg-gray-200 rounded-full shadow-inner"></div>
                  <div className={`absolute w-5 h-5 rounded-full shadow transition ${formData.isAllDay ? 'transform translate-x-5 bg-blue-600' : 'bg-white'} top-0`}></div>
                </div>
                <div className="ml-3 text-sm font-medium text-gray-700">
                  Journée entière
                </div>
              </label>
            </div>
            
            {/* Appointment type selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Type de rendez-vous</label>
              <div className="grid grid-cols-2 gap-2">
                {appointmentTypes.map(type => (
                  <button
                    key={type.id}
                    type="button"
                    className={`py-2 px-3 rounded-md text-sm font-medium flex items-center ${
                      formData.type === type.id ? 
                      type.color + " ring-2 ring-offset-1 ring-blue-500" : 
                      "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => handleTypeChange(type.id)}
                  >
                    <div className={`w-3 h-3 rounded-full ${type.color.replace('bg-', 'bg-').replace('text-', '')} mr-2`}></div>
                    {type.name}
                  </button>
                ))}
              </div>
            </div>

          {/* Title */}
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Time and duration */}
          <div className={`grid ${formData.isAllDay ? 'grid-cols-1' : 'grid-cols-2'} gap-4 mb-4`}>
            {!formData.isAllDay && (
              <div>
                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">Heure de début</label>
                <input
                  type="time"
                  id="startTime"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">Durée</label>
              <select
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                disabled={formData.isAllDay}
              >
                <option value="30">30 minutes</option>
                <option value="60">1 heure</option>
                <option value="90">1 heure 30</option>
                <option value="120">2 heures</option>
                <option value="180">3 heures</option>
                <option value="240">4 heures</option>
                <option value="300">5 heures</option>
                <option value="360">6 heures</option>
                <option value="480">8 heures</option>
                <option value="720">12 heures</option>
                <option value="1440">24 heures (toute la journée)</option>
              </select>
            </div>
          </div>

          {/* Installer count */}
          <div className="mb-4">
            <label htmlFor="installerCount" className="block text-sm font-medium text-gray-700 mb-1">Nombre d&apos;installateurs</label>
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, installerCount: Math.max(1, prev.installerCount - 1) }))}
                className="px-2 py-1 border border-gray-300 rounded-l-md bg-gray-50 text-gray-700"
              >
                <MinusCircleIcon className="w-5 h-5" />
              </button>
              <input
                type="number"
                id="installerCount"
                name="installerCount"
                min="1"
                max="10"
                value={formData.installerCount}
                onChange={handleChange}
                className="w-16 px-3 py-2 border-t border-b border-gray-300 text-center"
              />
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, installerCount: Math.min(10, prev.installerCount + 1) }))}
                className="px-2 py-1 border border-gray-300 rounded-r-md bg-gray-50 text-gray-700"
              >
                <PlusCircleIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Notes */}
          <div className="mb-4">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Détails supplémentaires..."
            />
          </div>

          {/* Form actions */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Ajouter
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// Tooltip component for better UX
const Tooltip: React.FC<TooltipProps> = ({ children, content, position = "bottom" }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  const positionClasses = {
    top: "bottom-full mb-2",
    bottom: "top-full mt-2",
    left: "right-full mr-2",
    right: "left-full ml-2"
  };
  
  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: position === "top" ? 5 : position === "bottom" ? -5 : 0, x: position === "left" ? 5 : position === "right" ? -5 : 0 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          className={`absolute ${positionClasses[position]} z-50 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded whitespace-nowrap`}
        >
          {content}
          <div className={`absolute ${
            position === "top" ? "bottom-0 left-1/2 -mb-1 transform -translate-x-1/2 border-t-gray-900" : 
            position === "bottom" ? "top-0 left-1/2 -mt-1 transform -translate-x-1/2 border-b-gray-900" :
            position === "left" ? "right-0 top-1/2 -mr-1 transform -translate-y-1/2 border-l-gray-900" :
            "left-0 top-1/2 -ml-1 transform -translate-y-1/2 border-r-gray-900"
          } w-2 h-2 rotate-45 bg-gray-900`}></div>
        </motion.div>
      )}
    </div>
  );
};

// Enhanced Installation Calendar Component
const EnhancedCalendar: React.FC<EnhancedCalendarProps> = ({onTimeSlotSelect}) => {
  // Explicitly define state types to prevent type mismatches
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(2025, 3)); 
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [calendarView, setCalendarView] = useState<"jour" | "semaine" | "mois" | "schedule" | "liste">("schedule");
//   const [selectedAppointment, setSelectedAppointment] = useState<DraggableAppointment | null>(null);
//   const [appointments, setAppointments] = useState<DraggableAppointment[]>(presetAppointments);
  const [slots, setSlots] = useState<AvailableSlot[]>(availableSlots);
  
  // UI state
  const [showMiniMonth, setShowMiniMonth] = useState<boolean>(true);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(new Date(2025, 3, 14));
  const [filter, setFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // New slot form state
  const [showNewSlotForm, setShowNewSlotForm] = useState<boolean>(false);
  const [clickedDateTime, setClickedDateTime] = useState<{ date: string | null; time: string | null }>({ date: null, time: null });
  
  
  // Get days in month for calendar
  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  // Get day of week (0-6) for the first day of the month
  const getFirstDayOfMonth = (year: number, month: number): number => {
    return new Date(year, month, 1).getDay();
  };
  
  // Adjust first day to make Monday the first day of the week (0 = Monday, 6 = Sunday)
  const adjustFirstDay = (day: number): number => {
    return day === 0 ? 6 : day - 1;
  };
  
  // Check if a date has available slots
  const hasAvailableSlots = (dateString: string): boolean => {
    return slots.some(slot => slot.date === dateString);
  };
  
  // Get available slot count for a date
  const getAvailableSlotCount = (dateString: string): number => {
    const slot = slots.find(slot => slot.date === dateString);
    return slot ? (slot.timeSlots ? slot.timeSlots.length : slot.times.length) : 0;
  };
  
  // Get time slots for a specific date with detailed information
  const getTimeSlots = (dateString: string): TimeSlot[] => {
    const slot = slots.find(slot => slot.date === dateString);
    return slot?.timeSlots || [];
  };

  // Format month name
  const formatMonth = (date: Date): string => {
    return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  };
  
  // Generate calendar days for current month view
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = adjustFirstDay(getFirstDayOfMonth(year, month));
    
    // Previous month days (for filling the first row)
    const prevMonthDays = [];
    if (firstDay > 0) {
      const prevMonth = new Date(year, month, 0);
      const prevMonthDaysCount = prevMonth.getDate();
      for (let i = prevMonthDaysCount - firstDay + 1; i <= prevMonthDaysCount; i++) {
        const date = new Date(year, month - 1, i);
        prevMonthDays.push({
          date,
          dateString: date.toISOString().split('T')[0],
          isCurrentMonth: false
        });
      }
    }
    
    // Current month days
    const currentMonthDays = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dateString = date.toISOString().split('T')[0];
      currentMonthDays.push({
        date,
        dateString,
        isCurrentMonth: true,
        hasSlots: hasAvailableSlots(dateString)
      });
    }
    
    // Next month days (for filling the last row)
    const nextMonthDays = [];
    const totalDays = prevMonthDays.length + currentMonthDays.length;
    const remainingCells = 42 - totalDays; // 6 rows * 7 days = 42 cells
    
    for (let i = 1; i <= remainingCells; i++) {
      const date = new Date(year, month + 1, i);
      nextMonthDays.push({
        date,
        dateString: date.toISOString().split('T')[0],
        isCurrentMonth: false
      });
    }
    
    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  };
  
  // Generate days for the week view
  const generateWeekDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(currentWeekStart);
      day.setDate(currentWeekStart.getDate() + i);
      days.push(day);
    }
    return days;
  };
  
  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };
  
  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };
  
  // Navigate to previous week
  const goToPreviousWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeekStart(newDate);
  };
  
  // Navigate to next week
  const goToNextWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeekStart(newDate);
  };

  // Navigate to today
  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth()));
    
    // Set currentWeekStart to the beginning of the current week
    const startOfWeek = new Date(today);
    const day = today.getDay(); // 0 for Sunday
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    startOfWeek.setDate(diff);
    setCurrentWeekStart(startOfWeek);
    
    // If today has slots, select it
    const todayString = today.toISOString().split('T')[0];
    if (hasAvailableSlots(todayString)) {
      setSelectedDate(todayString);
    }
  };
  
  // Handle appointment resize
//   const handleAppointmentResize = (appointmentId, newDuration) => {
//     setAppointments(appointments.map(appointment => {
//       if (appointment.id === appointmentId) {
//         const startHour = parseInt(appointment.startTime.split(':')[0], 10);
//         const startMinute = parseInt(appointment.startTime.split(':')[1], 10);
        
//         // Calculate new end time based on duration
//         const durationHours = Math.floor(newDuration / 60);
//         const durationMinutes = newDuration % 60;
        
//         let endHour = startHour + durationHours;
//         let endMinute = startMinute + durationMinutes;
        
//         if (endMinute >= 60) {
//           endHour += 1;
//           endMinute -= 60;
//         }
        
//         const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
        
//         return {
//           ...appointment,
//           duration: newDuration,
//           endTime
//         };
//       }
//       return appointment;
//     }));
//   };

  // Handle time slot resize with explicit type annotations
  const handleTimeSlotResize = (
    slotId: string, 
    newDuration: number, 
    dateString: string
  ): void => {
    setSlots(slots.map(dateSlot => {
      if (dateSlot.date === dateString && dateSlot.timeSlots) {
        return {
          ...dateSlot,
          timeSlots: dateSlot.timeSlots.map(slot => 
            slot.id === slotId 
              ? { ...slot, duration: newDuration } 
              : slot
          )
        };
      }
      return dateSlot;
    }));
  };

  // Handle slot creation
  const handleAddSlot = (dateString: string, formData: NewSlotFormData): void => {
    // Find if the date already exists in the slots array
    const dateExists = slots.some(s => s.date === dateString);
    
    if (dateExists) {
      // Add new time slot to existing date
      setSlots(slots.map(slot => {
        if (slot.date === dateString) {
          // Create a unique ID for the new slot
          const newId = `slot-${slot.id}-${slot.timeSlots ? slot.timeSlots.length + 1 : 1}`;
          
          // Create the new time slot
          const newTimeSlot = {
            id: newId,
            time: formData.startTime,
            duration: formData.duration,
            available: true,
            installerCount: formData.installerCount,
            title: formData.title,
            type: formData.type,
            color: appointmentTypes.find(t => t.id === formData.type)?.color,
            isAllDay: formData.isAllDay
          };
          
          // Add the new time slot
          return {
            ...slot,
            times: [...(slot.times || []), formData.startTime],
            timeSlots: [...(slot.timeSlots || []), newTimeSlot]
          };
        }
        return slot;
      }));
    } else {
      // Create a new date with the new time slot
      const newSlotId = slots.length + 1;
      const newTimeSlot = {
        id: `slot-${newSlotId}-1`,
        time: formData.startTime,
        duration: formData.duration,
        available: true,
        installerCount: formData.installerCount,
        title: formData.title,
        type: formData.type,
        color: appointmentTypes.find(t => t.id === formData.type)?.color,
        isAllDay: formData.isAllDay
      };
      
      const newDateSlot = {
        id: newSlotId,
        date: dateString,
        times: [formData.startTime],
        timeSlots: [newTimeSlot]
      };
      
      setSlots([...slots, newDateSlot]);
    }
    
    // Show toast notification (would be implemented in a real app)
    const toastMessage = formData.isAllDay 
      ? `Nouveau créneau journée entière ajouté le ${dateString}` 
      : `Nouveau créneau ajouté le ${dateString} à ${formData.startTime}`;
    console.log(toastMessage);
  };

  // Handle editing an appointment
//   const handleEditAppointment = (appointment) => {
//     // In a real app, you'd open an edit form here
//     alert(`Modification de l'événement "${appointment.title}"`);
//   };
  
//   // Handle deleting an appointment
//   const handleDeleteAppointment = (appointmentId) => {
//     if (confirm('Êtes-vous sûr de vouloir supprimer ce rendez-vous ?')) {
//       setAppointments(appointments.filter(a => a.id !== appointmentId));
//       setSelectedAppointment(null);
//     }
//   };
  
  // Handle grid click to add a new slot
  const handleGridClick = (dateString: string, time: string | null = null): void => {
    setClickedDateTime({ date: dateString, time });
    setShowNewSlotForm(true);
  };

  // Calculate time from y coordinate in the grid
  const calculateTimeFromPosition = (y: number, gridTop: number, cellHeight: number = 60): string => {
    const relativeY = y - gridTop;
    const totalMinutes = Math.floor(relativeY / cellHeight * 60);
    const hours = Math.floor(totalMinutes / 60) + 8; // 8 AM is the start time
    const minutes = totalMinutes % 60;
    
    // Round to nearest 15 minutes
    const roundedMinutes = Math.round(minutes / 15) * 15;
    
    return `${hours.toString().padStart(2, '0')}:${roundedMinutes === 60 ? '00' : roundedMinutes.toString().padStart(2, '0')}`;
  };

  // Filter time slots based on search and filter criteria 
  const getFilteredTimeSlots = (): AvailableSlot[] => {
    let filteredDates = [...slots];
    
    if (searchQuery) {
      filteredDates = filteredDates
        .map(dateSlot => {
          if (!dateSlot.timeSlots) return dateSlot;
          
          const filteredTimeSlots = dateSlot.timeSlots.filter(slot => 
            (slot.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
            slot.type?.toLowerCase().includes(searchQuery.toLowerCase()))
          );
          
          return filteredTimeSlots.length > 0 
            ? { ...dateSlot, timeSlots: filteredTimeSlots }
            : null;
        })
        .filter((slot): slot is AvailableSlot => slot !== null);
    }
    
    if (filter) {
      filteredDates = filteredDates
        .map(dateSlot => {
          if (!dateSlot.timeSlots) return dateSlot;
          
          const filteredTimeSlots = dateSlot.timeSlots.filter(slot => 
            slot.type === filter
          );
          
          return filteredTimeSlots.length > 0
            ? { ...dateSlot, timeSlots: filteredTimeSlots }
            : null;
        })
        .filter((slot): slot is AvailableSlot => slot !== null);
    }
    
    return filteredDates;
  };

  // Get all dates that have slots for list view
  const getDatesWithSlots = (): AvailableSlot[] => {
    const filteredSlots = getFilteredTimeSlots();
    return filteredSlots.sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
      {/* Calendar Toolbar */}
      <div className="px-4 py-3 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center flex-wrap gap-2">
          <button 
            onClick={() => setCalendarView("jour")}
            className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              calendarView === "jour" 
                ? "bg-blue-100 text-blue-700 shadow-sm"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <ClockIcon className="w-4 h-4 mr-1.5" />
            Jour
          </button>
          <button 
            onClick={() => setCalendarView("semaine")}
            className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              calendarView === "semaine" 
                ? "bg-blue-100 text-blue-700 shadow-sm"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <AdjustmentsHorizontalIcon className="w-4 h-4 mr-1.5" />
            Semaine
          </button>
          <button 
            onClick={() => setCalendarView("mois")}
            className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              calendarView === "mois" 
                ? "bg-blue-100 text-blue-700 shadow-sm"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <CalendarDaysIcon className="w-4 h-4 mr-1.5" />
            Mois
          </button>
          <button 
            onClick={() => setCalendarView("schedule")}
            className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              calendarView === "schedule" 
                ? "bg-blue-100 text-blue-700 shadow-sm"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <CalendarIcon className="w-4 h-4 mr-1.5" />
            Planning
          </button>
          <button 
            onClick={() => setCalendarView("liste")}
            className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              calendarView === "liste" 
                ? "bg-blue-100 text-blue-700 shadow-sm"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <ListBulletIcon className="w-4 h-4 mr-1.5" />
            Liste
          </button>
        </div>
        
        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2">
          <Tooltip content="Aller à aujourd'hui">
            <button 
              onClick={goToToday}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow transition-shadow"
            >
              Aujourd&apos;hui
            </button>
          </Tooltip>
          
          <div className="flex items-center space-x-1">
            <Tooltip content={calendarView === "mois" ? "Mois précédent" : "Semaine précédente"}>
              <button 
                onClick={calendarView === "mois" ? goToPreviousMonth : goToPreviousWeek}
                className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
            </Tooltip>
            
            <div className="text-sm font-medium text-gray-900 px-1 whitespace-nowrap">
              {calendarView === "mois" ? formatMonth(currentMonth) : 
                calendarView === "semaine" || calendarView === "schedule" || calendarView === "liste" ? 
                `${new Date(currentWeekStart).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })} - ${
                  new Date(new Date(currentWeekStart).setDate(currentWeekStart.getDate() + 6))
                  .toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })
                }` : 
                selectedDate ? 
                new Date(selectedDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) :
                "Sélectionnez une date"
              }
            </div>
            
            <Tooltip content={calendarView === "mois" ? "Mois suivant" : "Semaine suivante"}>
              <button 
                onClick={calendarView === "mois" ? goToNextMonth : goToNextWeek}
                className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </Tooltip>
          </div>
          
          <div className="hidden sm:flex items-center pl-2 space-x-1.5 ml-2 border-l border-gray-200">
            <div className="relative">
              <input 
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
              <MagnifyingGlassIcon className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            
            <div className="relative">
              <select
                value={filter || ""}
                onChange={(e) => setFilter(e.target.value || null)}
                className="pl-8 pr-8 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none"
              >
                <option value="">Tout afficher</option>
                {appointmentTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
              <FunnelIcon className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <ChevronLeftIcon className="absolute right-2.5 top-1/2 transform -translate-y-1/2 rotate-270 h-4 w-4 text-gray-400" />
            </div>
            
            <Tooltip content={showMiniMonth ? "Masquer le mini-calendrier" : "Afficher le mini-calendrier"}>
              <button 
                onClick={() => setShowMiniMonth(!showMiniMonth)}
                className={`p-1.5 rounded-md transition-colors ${showMiniMonth ? "bg-blue-100 text-blue-700" : "text-gray-500 hover:bg-gray-100"}`}
              >
                <ArrowsPointingOutIcon className="h-4 w-4" />
              </button>
            </Tooltip>
          </div>
        </div>
      </div>
      
      {/* Calendar body */}
      <div className="flex max-h-[70vh]">
        {/* Side mini month calendar when enabled */}
        {showMiniMonth && (calendarView === "schedule" || calendarView === "jour" || calendarView === "semaine") && (
          <div className="w-64 p-3 border-r border-gray-200 bg-gray-50 overflow-y-auto">
            {/* Mini month view */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-500 uppercase">
                  {currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                </span>
                <div className="flex space-x-1">
                  <button 
                    onClick={goToPreviousMonth}
                    className="p-1 rounded-full text-gray-500 hover:bg-gray-200"
                  >
                    <ChevronLeftIcon className="h-3 w-3" />
                  </button>
                  <button 
                    onClick={goToNextMonth}
                    className="p-1 rounded-full text-gray-500 hover:bg-gray-200"
                  >
                    <ChevronRightIcon className="h-3 w-3" />
                  </button>
                </div>
              </div>
              
              {/* Mini calendar days */}
              <div className="grid grid-cols-7 gap-1 text-center">
                {["L", "M", "M", "J", "V", "S", "D"].map((day, i) => (
                  <div key={`day-label-${i}`} className="text-xs text-gray-500 font-medium py-1">
                    {day}
                  </div>
                ))}
                
                {generateCalendarDays().map((day, index) => {
                  const isSelected = selectedDate === day.dateString;
                  const isToday = new Date().toDateString() === day.date.toDateString();
                  
                  return (
                    <motion.button
                      key={`mini-day-${index}`}
                      whileHover={day.isCurrentMonth ? { scale: 1.2 } : {}}
                      whileTap={day.isCurrentMonth ? { scale: 0.9 } : {}}
                      onClick={() => {
                        setSelectedDate(day.dateString);
                        // Update the currentWeekStart to contain this date
                        const newWeekStart = new Date(day.date);
                        const dayOfWeek = newWeekStart.getDay(); // 0 = Sunday, 1 = Monday, ...
                        newWeekStart.setDate(newWeekStart.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
                        setCurrentWeekStart(newWeekStart);
                        
                        // If in day view, switch to the selected date
                        if (calendarView === "jour") {
                          // Already in day view
                        } else {
                          setCalendarView("jour");
                        }
                      }}
                      className={`h-7 w-7 flex items-center justify-center text-xs rounded-full relative transition-all
                        ${!day.isCurrentMonth ? "text-gray-400" : 
                          isSelected ? "bg-blue-600 text-white shadow-md" : 
                          isToday ? "bg-blue-100 text-blue-800 shadow-sm" : 
                          day.hasSlots ? "hover:bg-blue-50 text-gray-800" : 
                          "text-gray-800 hover:bg-gray-200"}`}
                    >
                      {day.date.getDate()}
                      {day.hasSlots && !isSelected && (
                        <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-green-500"></span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
            
            {/* Available appointment types */}
            <div>
              <h6 className="text-xs font-medium text-gray-500 uppercase mb-2">Types de Rendez-vous</h6>
              <div className="space-y-2">
                {appointmentTypes.map((type) => (
                  <motion.div 
                    key={type.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center text-sm p-2 rounded-md cursor-pointer transition-colors
                      ${filter === type.id ? 
                        type.color + " shadow-sm" : 
                        "hover:bg-gray-100"
                      }`}
                    onClick={() => setFilter(filter === type.id ? null : type.id)}
                  >
                    <div className={`w-3 h-3 rounded-full bg-${type.color.split(' ')[0].replace('bg-', '')} mr-2`}></div>
                    <span>{type.name} ({type.duration}m)</span>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Create new appointment button */}
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleGridClick(selectedDate || new Date().toISOString().split('T')[0])}
              className="w-full mt-4 py-2 px-3 flex items-center justify-center rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
            >
              <PlusIcon className="h-4 w-4 mr-1.5" />
              Nouveau créneau
            </motion.button>
          </div>
        )}
        
        {/* Main calendar content area */}
        <div className="flex-1 overflow-auto">
          {/* Day View */}
          {calendarView === "jour" && selectedDate && (
            <div className="bg-white h-full flex flex-col">
              {/* Day header */}
              <div className="flex border-b border-gray-200 bg-gray-50 p-3 items-center justify-between sticky top-0 z-10">
                <div className="flex items-center">
                  <div className="h-8 w-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-2">
                    <CalendarIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <h6 className="text-sm font-medium text-gray-800 capitalize">
                      {new Date(selectedDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </h6>
                    <div className="text-xs text-gray-500">
                      {getTimeSlots(selectedDate).length} créneaux disponibles
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  <button 
                    onClick={() => {
                      const currentDate = new Date(selectedDate);
                      currentDate.setDate(currentDate.getDate() - 1);
                      setSelectedDate(currentDate.toISOString().split('T')[0]);
                    }}
                    className="p-1.5 rounded-md text-gray-500 hover:bg-gray-200"
                  >
                    <ChevronLeftIcon className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={() => {
                      const currentDate = new Date(selectedDate);
                      currentDate.setDate(currentDate.getDate() + 1);
                      setSelectedDate(currentDate.toISOString().split('T')[0]);
                    }}
                    className="p-1.5 rounded-md text-gray-500 hover:bg-gray-200"
                  >
                    <ChevronRightIcon className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={() => setCalendarView("semaine")}
                    className="p-1.5 rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100"
                  >
                    <ArrowsPointingOutIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              {/* Advanced time grid with draggable appointments */}
              <div 
                className="relative flex-1 min-h-[600px] overflow-y-auto"
                onClick={(e) => {
                  // Only trigger if clicking directly on the grid, not on appointments
                  if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('grid-hour')) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const time = calculateTimeFromPosition(e.clientY, rect.top);
                    handleGridClick(selectedDate, time);
                  }
                }}
              >
                {/* Hour markers */}
                <div className="flex h-full">
                  <div className="w-16 flex-shrink-0 border-r border-gray-200 bg-gray-50 sticky left-0 z-10">
                    {/* All-day section */}
                    <div className="h-8 flex items-center justify-center text-xs text-gray-500 border-b border-gray-200 bg-gray-100">
                      <span>Jour</span>
                    </div>
                  
                    {hourMarkers.map((hour, idx) => (
                      <div 
                        key={`day-hour-${idx}`}
                        className="h-[60px] flex items-center justify-center text-xs text-gray-500 border-b border-gray-200"
                      >
                        {hour}
                      </div>
                    ))}
                  </div>
                  
                  {/* Appointment grid */}
                  <div className="flex-1 relative h-full">
                    {/* All-day section */}
                    <div className="h-8 border-b border-gray-200 bg-gray-50/50 relative">
                      {/* All-day slots */}
                      {getTimeSlots(selectedDate)
                        .filter(slot => slot.isAllDay)
                        .filter(slot => !filter || slot.type === filter)
                        .map((slot, idx) => {
                          const isSelected = selectedTime === slot.time && selectedTimeSlot?.id === slot.id;
                          
                          return (
                            <ResizableTimeSlot
                              key={`all-day-slot-${idx}`}
                              slot={slot}
                              dateString={selectedDate}
                              isSelected={isSelected}
                              onSelect={(dateString, time, slot) => {
                                setSelectedDate(dateString);
                                setSelectedTime(time);
                                setSelectedTimeSlot(slot);
                                onTimeSlotSelect(dateString, time);
                              }}
                              onEdit={(slot) => {
                                // Implement edit functionality
                                alert(`Modifier: ${slot.title}`);
                              }}
                              onDelete={(slotId) => {
                                if (confirm('Supprimer ce créneau ?')) {
                                  // Remove this time slot
                                  setSlots(slots.map(s => {
                                    if (s.date === selectedDate) {
                                      return {
                                        ...s,
                                        timeSlots: s.timeSlots ? s.timeSlots.filter(ts => ts.id !== slotId) : [],
                                      times: s.timeSlots ? s.timeSlots.filter(ts => ts.id !== slotId).map(ts => ts.time) : []
                                      };
                                    }
                                    return s;
                                  }));
                                  setSelectedTime(null);
                                  setSelectedTimeSlot(null);
                                }
                              }}
                              onResize={handleTimeSlotResize}
                            />
                          );
                        })}
                    </div>
                    
                    {/* Hour grid lines */}
                    {hourMarkers.map((_, idx) => (
                      <div 
                        key={`day-grid-${idx}`}
                        className="h-[60px] border-b border-gray-100 grid-hour"
                      ></div>
                    ))}
                    
                    {/* Current time indicator */}
                    <div 
                      className="absolute left-0 right-0 h-0.5 bg-red-500 z-10"
                      style={{ top: "180px" }} // 3 hours from 8AM = 11AM
                    >
                      <div className="absolute -left-1 -top-1.5 h-3 w-3 rounded-full bg-red-500"></div>
                    </div>
                    
                    {/* Time slots */}
                    {getTimeSlots(selectedDate)
                      .filter(slot => !slot.isAllDay) // Skip all-day events
                      .filter(slot => !filter || slot.type === filter)
                      .map((slot, idx) => {
                        const isSelected = selectedTime === slot.time && selectedTimeSlot?.id === slot.id;
                        
                        return (
                          <ResizableTimeSlot
                            key={`day-slot-${idx}`}
                            slot={slot}
                            dateString={selectedDate}
                            isSelected={isSelected}
                            onSelect={(dateString, time, slot) => {
                              setSelectedDate(dateString);
                              setSelectedTime(time);
                              setSelectedTimeSlot(slot);
                              onTimeSlotSelect(dateString, time);
                            }}
                            onEdit={(slot) => {
                              // Implement edit functionality
                              alert(`Modifier: ${slot.title}`);
                            }}
                            onDelete={(slotId) => {
                              if (confirm('Supprimer ce créneau ?')) {
                                // Remove this time slot
                                setSlots(slots.map(s => {
                                  if (s.date === selectedDate) {
                                    return {
                                      ...s,
                                      timeSlots: s.timeSlots ? s.timeSlots.filter(ts => ts.id !== slotId) : [],
                                      times: s.timeSlots ? s.timeSlots.filter(ts => ts.id !== slotId).map(ts => ts.time) : []
                                    };
                                  }
                                  return s;
                                }));
                                setSelectedTime(null);
                                setSelectedTimeSlot(null);
                              }
                            }}
                            onResize={handleTimeSlotResize}
                          />
                        );
                      })}
                    
                    {/* Add appointment button (fixed at the bottom right) */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGridClick(selectedDate);
                      }}
                      className="fixed right-8 bottom-8 h-12 w-12 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
                    >
                      <PlusIcon className="h-6 w-6" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Week View */}
          {calendarView === "semaine" && (
            <div className="bg-white h-full flex flex-col">
              {/* Week header */}
              <div className="flex border-b border-gray-200 sticky top-0 z-10">
                <div className="w-16 flex-shrink-0 p-3 border-r border-gray-200 bg-gray-50"></div>
                {generateWeekDays().map((date, idx) => {
                  const dateString = date.toISOString().split('T')[0];
                  const isToday = new Date().toDateString() === date.toDateString();
                  const isSelected = selectedDate === dateString;
                  
                  return (
                    <motion.div 
                      key={`week-header-${idx}`}
                      whileHover={{ backgroundColor: "rgba(243, 244, 246, 0.5)" }}
                      className={`flex-1 p-3 text-center cursor-pointer transition-colors
                        ${isToday ? "bg-blue-50" : ""}
                        ${isSelected ? "bg-blue-100" : ""}
                      `}
                      onClick={() => {
                        setSelectedDate(dateString);
                        setCalendarView("jour");
                      }}
                    >
                      <div className="text-xs font-medium text-gray-500 uppercase">
                        {date.toLocaleDateString('fr-FR', { weekday: 'short' })}
                      </div>
                      <div className={`inline-flex items-center justify-center h-7 w-7 mt-1 transition-colors ${
                        isSelected
                          ? "bg-blue-600 text-white rounded-full shadow-md"
                          : isToday
                          ? "bg-blue-100 text-blue-800 rounded-full shadow-sm"
                          : ""
                      }`}>
                        {date.getDate()}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              
              {/* Week Time Grid */}
              <div className="flex flex-1 overflow-auto">
                {/* Time column */}
                <div className="w-16 flex-shrink-0 border-r border-gray-200 bg-gray-50 sticky left-0 z-10">
                  {/* All-day section */}
                  <div className="h-8 flex items-center justify-center text-xs text-gray-500 border-b border-gray-200 bg-gray-100">
                    <span>Jour</span>
                  </div>
                  
                  {hourMarkers.map((hour, idx) => (
                    <div 
                      key={`time-marker-${idx}`}
                      className="h-[60px] flex items-center justify-center text-xs text-gray-500 border-b border-gray-100"
                    >
                      {hour}
                    </div>
                  ))}
                </div>
                
                {/* Day columns */}
                <div className="flex flex-1 relative">
                  {generateWeekDays().map((date, dayIdx) => {
                    const dateString = date.toISOString().split('T')[0];
                    const isToday = new Date().toDateString() === date.toDateString();
                    
                    return (
                      <div
                        key={`week-col-${dayIdx}`}
                        className={`flex-1 relative border-r border-gray-100 min-w-[100px] ${isToday ? "bg-blue-50/20" : ""}`}
                        onClick={(e) => {
                          // Calculate the clicked time
                          const rect = e.currentTarget.getBoundingClientRect();
                          const time = calculateTimeFromPosition(e.clientY, rect.top);
                          handleGridClick(dateString, time);
                        }}
                      >
                        {/* All-day section */}
                        <div className="h-8 border-b border-gray-200 bg-gray-50/50 relative">
                          {/* All-day slots */}
                          {getTimeSlots(dateString)
                            .filter(slot => slot.isAllDay)
                            .filter(slot => !filter || slot.type === filter)
                            .map((slot, idx) => {
                              const isSelected = selectedDate === dateString && selectedTime === slot.time && selectedTimeSlot?.id === slot.id;
                              
                              return (
                                <motion.div
                                  key={`week-all-day-${dayIdx}-${idx}`}
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedDate(dateString);
                                    setSelectedTime(slot.time);
                                    setSelectedTimeSlot(slot);
                                  }}
                                  className={`absolute left-0 right-0 top-0 h-8 px-2 py-1 border shadow-sm rounded-sm
                                    ${isSelected ? 'bg-blue-100 border-blue-300 text-blue-800 z-10 ring-1 ring-blue-500' :
                                      (slot.color || "bg-indigo-100 border-indigo-300 text-indigo-800")}
                                  `}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                      <SunIcon className="h-3 w-3 mr-1" />
                                      <div className="font-medium text-xs truncate">{slot.title}</div>
                                    </div>
                                    
                                    {isSelected && (
                                      <div className="absolute right-1 top-1 flex space-x-1">
                                        <button 
                                          className="p-0.5 hover:bg-white/20 rounded"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            alert(`Modifier: ${slot.title}`);
                                          }}
                                        >
                                          <PencilIcon className="h-2.5 w-2.5" />
                                        </button>
                                        <button 
                                          className="p-0.5 hover:bg-white/20 rounded"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            if (confirm('Supprimer ce créneau ?')) {
                                              setSlots(slots.map(s => {
                                                if (s.date === dateString) {
                                                  return {
                                                    ...s,
                                                    timeSlots: s.timeSlots ? s.timeSlots.filter(ts => ts.id !== slot.id) : [],
                                                    times: s.timeSlots ? s.timeSlots.filter(ts => ts.id !== slot.id).map(ts => ts.time) : []
                                                  };
                                                }
                                                return s;
                                              }));
                                              setSelectedTime(null);
                                              setSelectedTimeSlot(null);
                                            }
                                          }}
                                        >
                                          <TrashIcon className="h-2.5 w-2.5" />
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </motion.div>
                              );
                            })}
                        </div>
                        
                        {/* Hour grid */}
                        {hourMarkers.map((_, hourIdx) => (
                          <div
                            key={`grid-${dayIdx}-${hourIdx}`}
                            className="h-[60px] border-b border-gray-100"
                          ></div>
                        ))}
                        
                        {/* Current time indicator for today */}
                        {isToday && (
                          <div 
                            className="absolute left-0 right-0 h-0.5 bg-red-500 z-10"
                            style={{ top: "180px" }} // Example position
                          >
                            <div className="absolute -left-1 -top-1.5 h-3 w-3 rounded-full bg-red-500"></div>
                          </div>
                        )}
                        
                        {/* Appointment slots for this day */}
                        {getTimeSlots(dateString)
                          .filter(slot => !slot.isAllDay) // Skip all-day events
                          .filter(slot => !filter || slot.type === filter)
                          .map((slot, slotIdx) => {
                            const isSelected = selectedDate === dateString && selectedTime === slot.time && selectedTimeSlot?.id === slot.id;
                            const hour = parseInt(slot.time.split(':')[0], 10);
                            const minute = parseInt(slot.time.split(':')[1], 10);
                            const topPosition = (hour - 8) * 60 + minute;
                            const heightPosition = slot.duration;
                            
                            return (
                              <motion.div
                                key={`week-slot-${dayIdx}-${slotIdx}`}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedDate(dateString);
                                  setSelectedTime(slot.time);
                                  setSelectedTimeSlot(slot);
                                }}
                                style={{ 
                                  top: `${topPosition + 8}px`, // Add 8px for all-day section
                                  height: `${heightPosition}px`
                                }}
                                className={`absolute left-0.5 right-0.5 px-2 py-1 rounded shadow-sm border ${
                                  isSelected 
                                    ? "bg-blue-100 border-blue-300 text-blue-800 z-20 ring-1 ring-blue-500"
                                    : (slot.color || "bg-green-50 border-green-200 text-green-700") + " hover:bg-opacity-80"
                                }`}
                              >
                                <div className="text-xs font-medium truncate">
                                  {slot.title || "Installation"}
                                </div>
                                <div className="text-xs opacity-70 truncate">
                                  {slot.time}
                                </div>
                                
                                {isSelected && (
  <div className="absolute top-0.5 right-0.5 flex space-x-1">
    <button 
      className="p-0.5 hover:bg-white/20 rounded"
      onClick={(e) => {
        e.stopPropagation();
        // Implement edit functionality
        alert(`Modifier: ${slot.title}`);
      }}
    >
      <PencilIcon className="h-2.5 w-2.5" />
    </button>
    <button 
      className="p-0.5 hover:bg-white/20 rounded"
      onClick={(e) => {
        e.stopPropagation();
        if (confirm('Supprimer ce créneau ?')) {
          // Remove this time slot
          setSlots(slots.map(s => {
            if (s.date === dateString) {
              return {
                ...s,
                timeSlots: s.timeSlots ? s.timeSlots.filter(ts => ts.id !== slot.id) : [],
                times: s.timeSlots ? s.timeSlots.filter(ts => ts.id !== slot.id).map(ts => ts.time) : []
              };
            }
            return s;
          }));
          setSelectedTime(null);
          setSelectedTimeSlot(null);
        }
      }}
    >
      <TrashIcon className="h-2.5 w-2.5" />
    </button>
  </div>
)}

{isSelected && (
  <div className="absolute bottom-0 left-0 right-0 h-4 bg-blue-200/40 flex items-center justify-center">
    <span className="text-[10px] font-medium text-blue-700">Sélectionné</span>
  </div>
)}

{/* Resize handle */}
<div 
  className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize flex items-center justify-center"
  onMouseDown={(e: React.MouseEvent) => {
    e.stopPropagation();
    
    const startY = e.clientY;
    const initialHeight = heightPosition;
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaY = moveEvent.clientY - startY;
      const newHeight = Math.max(30, Math.min(720, initialHeight + deltaY));
      
      // Update visual height instantly
      const element = e.currentTarget.parentElement;
      if (element) {
        element.style.height = `${newHeight}px`;
      }
    };
    
    const handleMouseUp = (upEvent: MouseEvent) => {
      const deltaY = upEvent.clientY - startY;
      const newHeight = Math.max(30, Math.min(720, initialHeight + deltaY));
      
      // Calculate new duration in minutes
      const newDuration = Math.round(newHeight);
      
      // Update slot duration
      handleTimeSlotResize(slot.id, newDuration, dateString);
      
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }}
>
  <div className="h-1 w-10 bg-current opacity-30 rounded-full hover:opacity-70" />
</div>
                              </motion.div>
                            );
                          })}
                      </div>
                    );
                  })}
                  
                  {/* Add appointment button (fixed at the bottom right) */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleGridClick(new Date().toISOString().split('T')[0])}
                    className="fixed right-8 bottom-8 h-12 w-12 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
                  >
                    <PlusIcon className="h-6 w-6" />
                  </motion.button>
                </div>
              </div>
            </div>
          )}
          
          {/* Month View */}
          {calendarView === "mois" && (
            <div className="bg-white p-4">
              {/* Week days */}
              <div className="grid grid-cols-7 mb-2">
                {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day, i) => (
                  <div key={i} className="text-center py-2">
                    <span className="text-xs font-medium text-gray-500">{day}</span>
                  </div>
                ))}
              </div>
              
              {/* Calendar days grid - Enhanced with animations and better visuals */}
              <div className="grid grid-cols-7 gap-1">
                {generateCalendarDays().map((day, index) => {
                  const isSelected = selectedDate === day.dateString;
                  const slotCount = day.isCurrentMonth && day.hasSlots ? 
                    getAvailableSlotCount(day.dateString) : 0;
                  
                  // Today's date for highlighting
                  const isToday = new Date().toISOString().split('T')[0] === day.dateString;
                  
                  return (
                    <motion.button
                      key={index}
                      whileHover={day.isCurrentMonth ? { scale: 1.02, zIndex: 5 } : {}}
                      whileTap={day.isCurrentMonth ? { scale: 0.98 } : {}}
                      onClick={() => {
                        if (day.isCurrentMonth) {
                          setSelectedDate(day.dateString);
                          setSelectedTime(null);
                          setSelectedTimeSlot(null);
                          setCalendarView("jour");
                        }
                      }}
                      disabled={!day.isCurrentMonth}
                      className={`relative h-28 sm:h-32 rounded-lg border p-1 text-center transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                        !day.isCurrentMonth
                          ? "border-transparent bg-white text-gray-300"
                          : isSelected
                          ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md ring-1 ring-blue-500/30"
                          : isToday
                          ? "cursor-pointer border-blue-300 bg-blue-50/30 text-blue-700 shadow-sm"
                          : day.hasSlots
                          ? "cursor-pointer border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 hover:shadow-sm"
                          : "cursor-pointer border-gray-100 bg-gray-50/50 text-gray-500 hover:bg-gray-100"
                      }`}
                    >
                      {/* Add button (visible on hover) */}
                      {day.isCurrentMonth && (
                        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 hover:opacity-100">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleGridClick(day.dateString);
                            }}
                            className="p-1 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
                          >
                            <PlusIcon className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                      
                      <div className="flex flex-col h-full">
                        {/* Date header */}
                        <div className="flex justify-between items-center mb-1">
                          {/* Date with special indicator for today */}
                          {isToday ? (
                            <div className={`flex items-center justify-center h-6 w-6 rounded-full ${
                              isSelected 
                                ? "bg-blue-500 text-white"
                                : "bg-blue-500 text-white"
                            }`}>
                              <span className="text-xs font-bold">{day.date.getDate()}</span>
                            </div>
                          ) : (
                            <span className={`text-sm ${isSelected ? "font-medium" : ""} px-1`}>
                              {day.date.getDate()}
                            </span>
                          )}
                          
                          {/* Slot count indicator */}
                          {day.isCurrentMonth && day.hasSlots && (
                            <span className={`text-xs rounded-full px-1.5 ${
                              isSelected
                                ? "bg-blue-200 text-blue-800"
                                : "bg-green-100 text-green-700"
                            }`}>
                              {slotCount}
                            </span>
                          )}
                        </div>
                        
                        {/* All day events first */}
                        {day.isCurrentMonth && day.hasSlots && getTimeSlots(day.dateString)
                          .filter(slot => slot.isAllDay)
                          .filter(slot => !filter || slot.type === filter)
                          .slice(0, 1).map((slot, idx) => (
                            <div 
                              key={`all-day-${idx}`} 
                              className={`text-xs px-1.5 py-0.5 mb-1 rounded-sm truncate ${
                                isSelected
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-indigo-100 text-indigo-800"
                              }`}
                            >
                              <div className="flex items-center">
                                <SunIcon className="h-2.5 w-2.5 mr-0.5" />
                                <span className="truncate">{slot.title || "Journée entière"}</span>
                              </div>
                            </div>
                          ))
                        }
                        
                        {/* Time slot indicators */}
                        {day.isCurrentMonth && day.hasSlots && (
                          <div className="flex flex-col space-y-1 mt-1 text-left">
                            {getTimeSlots(day.dateString)
                              .filter(slot => !slot.isAllDay)
                              .filter(slot => !filter || slot.type === filter)
                              .slice(0, 2).map((slot, idx) => (
                                <div 
                                  key={`time-${idx}`} 
                                  className={`text-xs px-1.5 py-0.5 rounded truncate ${
                                    isSelected
                                      ? "bg-blue-100 text-blue-800"
                                      : (slot.color || "bg-gray-100 text-gray-700")
                                  }`}
                                >
                                  {slot.time} - {slot.title || "Installation"}
                                </div>
                              ))
                            }
                            {getTimeSlots(day.dateString)
                              .filter(slot => !filter || slot.type === filter).length > 3 && (
                              <div className="text-xs text-gray-500 pl-1.5">
                                +{getTimeSlots(day.dateString)
                                  .filter(slot => !filter || slot.type === filter).length - 3} autres
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* Enhanced hover effect */}
                      {day.isCurrentMonth && !isSelected && (
                        <div className="absolute inset-0 rounded-lg border-2 border-blue-500/70 opacity-0 hover:opacity-100 transition-opacity" />
                      )}
                    </motion.button>
                  );
                })}
              </div>
              
              {/* Add appointment button (fixed at the bottom right) */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleGridClick(new Date().toISOString().split('T')[0])}
                className="fixed right-8 bottom-8 h-12 w-12 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
              >
                <PlusIcon className="h-6 w-6" />
              </motion.button>
            </div>
          )}
          
          {/* Schedule view (Google Calendar inspired) */}
          {calendarView === "schedule" && (
            <div className="flex-1 overflow-auto">
              {/* Week days header */}
              <div className="flex border-b border-gray-200 bg-gray-50 sticky top-0 z-10">
                <div className="w-16 flex-shrink-0 border-r border-gray-200 py-2"></div>
                {generateWeekDays().map((date, idx) => {
                  const dateString = date.toISOString().split('T')[0];
                  const isToday = new Date().toDateString() === date.toDateString();
                  const isSelectedDay = selectedDate === dateString;
                  
                  return (
                    <div 
                      key={`weekday-${idx}`} 
                      className={`flex-1 text-center p-2 min-w-[100px] ${isToday ? "bg-blue-50" : ""}`}
                      onClick={() => {
                        setSelectedDate(dateString);
                        setCalendarView("jour");
                      }}
                    >
                      <div className={`text-sm font-medium ${isToday ? "text-blue-700" : "text-gray-700"}`}>
                        {date.toLocaleDateString('fr-FR', { weekday: 'short' })}
                      </div>
                      <div className={`flex items-center justify-center h-7 w-7 mx-auto ${
                        isSelectedDay 
                          ? "bg-blue-600 text-white rounded-full" 
                          : isToday 
                          ? "bg-blue-100 text-blue-800 rounded-full" 
                          : ""
                      }`}>
                        {date.getDate()}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Time grid */}
              <div className="relative" style={{ minHeight: "660px" }}>
                {/* Time markers */}
                <div className="flex">
                  <div className="w-16 flex-shrink-0 border-r border-gray-200 sticky left-0 z-10 bg-gray-50">
                    {/* All-day section */}
                    <div className="h-8 flex items-center justify-center text-xs text-gray-500 border-b border-gray-200 bg-gray-100">
                      <span>Jour</span>
                    </div>
                    
                    {hourMarkers.map((hour, idx) => (
                      <div 
                        key={`hour-${idx}`} 
                        className="h-[60px] flex items-center justify-center text-xs text-gray-500"
                      >
                        {hour}
                      </div>
                    ))}
                  </div>
                  
                  {/* Day columns with grid lines */}
                  <div className="flex-1 flex">
                    {generateWeekDays().map((date, dayIdx) => {
                      const dateString = date.toISOString().split('T')[0];
                      const isToday = new Date().toDateString() === date.toDateString();
                      
                      return (
                        <div 
                          key={`day-col-${dayIdx}`}
                          className={`flex-1 border-r border-gray-100 relative min-w-[100px] ${isToday ? "bg-blue-50/30" : ""}`}
                          onClick={(e) => {
                            // Calculate the clicked time
                            const rect = e.currentTarget.getBoundingClientRect();
                            const time = calculateTimeFromPosition(e.clientY, rect.top);
                            handleGridClick(dateString, time);
                          }}
                        >
                          {/* All-day section */}
                          <div className="h-8 border-b border-gray-200 bg-gray-50/50 relative">
                            {/* All-day slots */}
                            {getTimeSlots(dateString)
                              .filter(slot => slot.isAllDay)
                              .filter(slot => !filter || slot.type === filter)
                              .map((slot, idx) => {
                                const isSelected = selectedDate === dateString && selectedTime === slot.time && selectedTimeSlot?.id === slot.id;
                                
                                return (
                                  <motion.div
                                    key={`schedule-all-day-${dayIdx}-${idx}`}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedDate(dateString);
                                      setSelectedTime(slot.time);
                                      setSelectedTimeSlot(slot);
                                    }}
                                    className={`absolute left-0 right-0 top-0 h-8 px-2 py-1 border shadow-sm rounded-none
                                      ${isSelected ? 'bg-blue-100 border-blue-300 text-blue-800 z-10 ring-1 ring-blue-500' :
                                        (slot.color || "bg-indigo-100 border-indigo-300 text-indigo-800")}
                                    `}
                                  >
                                    <div className="flex items-center">
                                      <SunIcon className="h-3 w-3 mr-1" />
                                      <div className="font-medium text-xs truncate">{slot.title}</div>
                                    </div>
                                  </motion.div>
                                );
                              })}
                          </div>
                          
                          {/* Horizontal time grid lines */}
                          {hourMarkers.map((_, idx) => (
                            <div 
                              key={`grid-${dayIdx}-${idx}`}
                              className="h-[60px] border-b border-gray-100"
                            ></div>
                          ))}
                          
                          {/* Time slots */}
                          {getTimeSlots(dateString)
                            .filter(slot => !slot.isAllDay) // Skip all-day events
                            .filter(slot => !filter || slot.type === filter)
                            .map((slot, slotIdx) => {
                              const isSelected = selectedDate === dateString && selectedTime === slot.time && selectedTimeSlot?.id === slot.id;
                            //   const startHour = parseInt(slot.time.split(':')[0], 10);
                            //   const startMinute = parseInt(slot.time.split(':')[1], 10);
                            //   const topPosition = (startHour - 8) * 60 + startMinute; // 8AM is our start
                              
                              return (
                                <ResizableTimeSlot
                                  key={`schedule-slot-${dayIdx}-${slotIdx}`}
                                  slot={slot}
                                  dateString={dateString}
                                  isSelected={isSelected}
                                  onSelect={(dateString, time, slot) => {
                                    setSelectedDate(dateString);
                                    setSelectedTime(time);
                                    setSelectedTimeSlot(slot);
                                    onTimeSlotSelect(dateString, time);
                                  }}
                                  onEdit={(slot) => {
                                    // Implement edit functionality
                                    alert(`Modifier: ${slot.title}`);
                                  }}
                                  onDelete={(slotId) => {
                                    if (confirm('Supprimer ce créneau ?')) {
                                      // Remove this time slot
                                      setSlots(slots.map(s => {
                                        if (s.date === dateString) {
                                          return {
                                            ...s,
                                            timeSlots: s.timeSlots ? s.timeSlots.filter(ts => ts.id !== slotId) : [],
                                      times: s.timeSlots ? s.timeSlots.filter(ts => ts.id !== slotId).map(ts => ts.time) : []
                                          };
                                        }
                                        return s;
                                      }));
                                      setSelectedTime(null);
                                      setSelectedTimeSlot(null);
                                    }
                                  }}
                                  onResize={handleTimeSlotResize}
                                />
                              );
                            })}
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {/* Add appointment button (fixed at the bottom right) */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleGridClick(new Date().toISOString().split('T')[0])}
                  className="fixed right-8 bottom-8 h-12 w-12 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
                >
                  <PlusIcon className="h-6 w-6" />
                </motion.button>
              </div>
            </div>
          )}
          
          {/* List View */}
          {calendarView === "liste" && (
            <div className="bg-white">
              <div className="p-4 flex justify-between items-center border-b border-gray-200 bg-gray-50 sticky top-0 z-10">
                <h3 className="text-base font-medium text-gray-900">Créneaux disponibles</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setCurrentWeekStart(prev => {
                        const newDate = new Date(prev);
                        newDate.setDate(newDate.getDate() - 7);
                        return newDate;
                      });
                    }}
                    className="p-1 rounded-md text-gray-700 hover:bg-gray-100"
                  >
                    <ChevronDoubleLeftIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      setCurrentWeekStart(prev => {
                        const newDate = new Date(prev);
                        newDate.setDate(newDate.getDate() + 7);
                        return newDate;
                      });
                    }}
                    className="p-1 rounded-md text-gray-700 hover:bg-gray-100"
                  >
                    <ChevronDoubleRightIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleGridClick(new Date().toISOString().split('T')[0])}
                    className="flex items-center px-3 py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                  >
                    <PlusIcon className="w-4 h-4 mr-1" />
                    Nouveau
                  </button>
                </div>
              </div>
              
              <div className="p-4 divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                {getDatesWithSlots().map((dateSlot) => {
                  const date = new Date(dateSlot.date);
                  const isToday = new Date().toDateString() === date.toDateString();
                  
                  // Check if this date is in the visible range
                  const startOfRange = new Date(currentWeekStart);
                  const endOfRange = new Date(currentWeekStart);
                  endOfRange.setDate(endOfRange.getDate() + 13); // Two weeks range
                  
                  if (date < startOfRange || date > endOfRange) {
                    return null;
                  }
                  
                  return (
                    <div key={dateSlot.id} className="py-4 first:pt-0">
                      <div className={`flex items-center mb-2 ${isToday ? 'text-blue-600' : 'text-gray-800'}`}>
                        <CalendarIcon className="w-5 h-5 mr-2" />
                        <h4 className="text-base font-medium">
                          {date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                          {isToday && <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Aujourd&apos;hui</span>}
                        </h4>
                      </div>
                      
                      <div className="space-y-2 pl-7">
                        {/* All-day slots first */}
                        {dateSlot.timeSlots && dateSlot.timeSlots
                          .filter(slot => slot.isAllDay)
                          .filter(slot => !filter || slot.type === filter)
                          .map((slot) => {
                            const isSelected = selectedDate === dateSlot.date && selectedTime === slot.time && selectedTimeSlot?.id === slot.id;
                            
                            return (
                              <motion.div 
                                key={`all-day-${slot.id}`}
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ scale: 1.01, y: -2 }}
                                whileTap={{ scale: 0.99 }}
                                className={`flex items-center justify-between p-3 rounded-lg border ${
                                  isSelected 
                                    ? "border-blue-300 bg-blue-50 ring-1 ring-blue-500 shadow-md"
                                    : (slot.color || "border-indigo-200 bg-indigo-50 shadow-sm hover:shadow")
                                }`}
                                onClick={() => {
                                  setSelectedDate(dateSlot.date);
                                  setSelectedTime(slot.time);
                                  setSelectedTimeSlot(slot);
                                }}
                              >
                                <div className="flex items-center">
                                  <div className="flex items-center justify-center w-8 h-8 bg-indigo-100 rounded-lg mr-3">
                                    <SunIcon className="w-5 h-5 text-indigo-600" />
                                  </div>
                                  <div>
                                    <div className="font-medium text-sm">{slot.title || "Journée entière"}</div>
                                    <div className="text-xs text-gray-500">
                                      Toute la journée ({slot.duration} min)
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center space-x-3">
                                  <span className="text-xs bg-white px-2 py-1 rounded-full shadow-inner">
                                    {slot.installerCount} installateurs
                                  </span>
                                  
                                  <div className="flex items-center">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        // Implement edit functionality
                                        alert(`Modifier: ${slot.title}`);
                                      }}
                                      className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                                    >
                                      <PencilIcon className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (confirm('Supprimer ce créneau ?')) {
                                          // Remove this time slot
                                          setSlots(slots.map(s => {
                                            if (s.date === dateSlot.date) {
                                              return {
                                                ...s,
                                                timeSlots: s.timeSlots ? s.timeSlots.filter(ts => ts.id !== slot.id) : [],
                                                times: s.timeSlots ? s.timeSlots.filter(ts => ts.id !== slot.id).map(ts => ts.time) : []
                                              };
                                            }
                                            return s;
                                          }));
                                          setSelectedTime(null);
                                          setSelectedTimeSlot(null);
                                        }
                                      }}
                                      className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                                    >
                                      <TrashIcon className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
                        
                        {/* Regular time slots */}
                        {dateSlot.timeSlots && dateSlot.timeSlots
                          .filter(slot => !slot.isAllDay)
                          .filter(slot => !filter || slot.type === filter)
                          .map((slot) => {
                            const isSelected = selectedDate === dateSlot.date && selectedTime === slot.time && selectedTimeSlot?.id === slot.id;
                            
                            return (
                              <motion.div 
                                key={slot.id}
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ scale: 1.01, y: -2 }}
                                whileTap={{ scale: 0.99 }}
                                className={`flex items-center justify-between p-3 rounded-lg border ${
                                  isSelected 
                                    ? "border-blue-300 bg-blue-50 ring-1 ring-blue-500 shadow-md"
                                    : (slot.color || "border-gray-200 bg-white hover:bg-gray-50 hover:shadow")
                                }`}
                                onClick={() => {
                                  setSelectedDate(dateSlot.date);
                                  setSelectedTime(slot.time);
                                  setSelectedTimeSlot(slot);
                                }}
                              >
                                <div className="flex items-center">
                                  <div className={`w-3 h-3 rounded-full mr-3 ${
                                    slot.type === "installation" ? "bg-blue-500" :
                                    slot.type === "maintenance" ? "bg-green-500" :
                                    slot.type === "repair" ? "bg-red-500" :
                                    "bg-purple-500"
                                  }`} />
                                  <div>
                                    <div className="font-medium text-sm">{slot.title || "Installation"}</div>
                                    <div className="text-xs text-gray-500">
                                      {slot.time} - {
                                        (() => {
                                          const [hours, minutes] = slot.time.split(':').map(Number);
                                          const endTime = new Date(2025, 0, 1, hours, minutes);
                                          endTime.setMinutes(endTime.getMinutes() + slot.duration);
                                          return endTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
                                        })()
                                      } ({slot.duration} min)
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center space-x-3">
                                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                                    {slot.installerCount} installateurs
                                  </span>
                                  
                                  <div className="flex items-center">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        // Implement edit functionality
                                        alert(`Modifier: ${slot.title}`);
                                      }}
                                      className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                                    >
                                      <PencilIcon className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (confirm('Supprimer ce créneau ?')) {
                                          // Remove this time slot
                                          setSlots(slots.map(s => {
                                            if (s.date === dateSlot.date) {
                                              return {
                                                ...s,
                                                ttimeSlots: s.timeSlots ? s.timeSlots.filter(ts => ts.id !== slot.id) : [],
                                                times: s.timeSlots ? s.timeSlots.filter(ts => ts.id !== slot.id).map(ts => ts.time) : []
                                              };
                                            }
                                            return s;
                                          }));
                                          setSelectedTime(null);
                                          setSelectedTimeSlot(null);
                                        }
                                      }}
                                      className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                                    >
                                      <TrashIcon className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
                        
                        {/* Add new slot for this date */}
                        <motion.button
                          whileHover={{ scale: 1.01, backgroundColor: "rgba(243, 244, 246, 0.8)" }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => handleGridClick(dateSlot.date)}
                          className="flex items-center justify-center w-full p-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:bg-gray-50 hover:text-blue-600 hover:border-blue-300 transition-colors"
                        >
                          <PlusIcon className="w-4 h-4 mr-1.5" />
                          Ajouter un créneau le {date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                        </motion.button>
                      </div>
                    </div>
                  );
                })}

                {getDatesWithSlots().length === 0 && (
                  <div className="py-10 text-center">
                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-3">
                      <CalendarIcon className="w-8 h-8" />
                    </div>
                    <h3 className="text-gray-800 font-medium mb-1">Aucun créneau disponible</h3>
                    <p className="text-gray-500 mb-4">Aucun créneau ne correspond à vos critères de recherche.</p>
                    <button
                      onClick={() => {
                        setFilter(null);
                        setSearchQuery("");
                      }}
                      className="text-sm text-blue-600 hover:text-blue-800 mr-4"
                    >
                      Réinitialiser les filtres
                    </button>
                    <button
                      onClick={() => handleGridClick(new Date().toISOString().split('T')[0])}
                      className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      <PlusIcon className="w-4 h-4 mr-1.5" />
                      Ajouter un nouveau créneau
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Selected time summary */}
          {selectedDate && selectedTime && (
            <div className="border-t border-gray-100 bg-gray-50 p-4 sticky bottom-0 z-10">
              <div className="flex items-center">
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-3">
                  <CheckIcon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Créneau sélectionné
                  </span>
                  <p className="font-medium text-gray-800">
                    {selectedTimeSlot?.isAllDay ? 
                      `${new Date(selectedDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })} - Journée entière` : 
                      `${new Date(selectedDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })} à ${selectedTime}`}
                    {selectedTimeSlot && ` - ${selectedTimeSlot.title || "Installation"}`}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => {
                      alert(`Modifier: ${selectedTimeSlot?.title || "Installation"}`);
                    }}
                    className="px-2.5 py-1.5 text-xs font-medium rounded text-blue-600 bg-blue-50 hover:bg-blue-100"
                  >
                    Modifier
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedDate(null);
                      setSelectedTime(null);
                      setSelectedTimeSlot(null);
                    }}
                    className="px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                  >
                    Effacer
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* New Slot Form Modal */}
      <AnimatePresence>
        {showNewSlotForm && (
          <NewSlotFormModal
            isOpen={showNewSlotForm}
            onClose={() => setShowNewSlotForm(false)}
            onSave={handleAddSlot}
            clickedDate={clickedDateTime.date}
            clickedTime={clickedDateTime.time}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedCalendar;