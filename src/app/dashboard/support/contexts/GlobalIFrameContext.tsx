"use client";

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { AnimatePresence, motion } from "framer-motion";
import {
  XMarkIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";
import { 
  MinimizeIcon, 
  MaximizeIcon,
  ChevronUp,
} from "lucide-react";

type IFrameWindowParams = {
  isMaximized: boolean;
  isMinimized: boolean;
  isVisible: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
};

// Extended to include id for multiple iframes
type IFrameData = {
  id: string;
  projectId: string;
  projectNumber?: string;
  window: IFrameWindowParams;
};

type GlobalIFrameContextType = {
  frames: IFrameData[];
  activeFrameId: string | null;
  openIframe: (projectId: string, projectNumber?: string) => void;
  closeIframe: (id: string) => void;
  maximizeIframe: (id: string) => void;
  minimizeIframe: (id: string) => void;
  focusIframe: (id: string) => void;
  isInIframe: () => boolean;
};

const defaultIFrameWindow: IFrameWindowParams = {
  isMaximized: false,
  isMinimized: false,
  isVisible: true,
  position: { x: 50, y: 50 },
  size: { width: 1000, height: 600 },
  zIndex: 50
};

const GlobalIFrameContext = createContext<GlobalIFrameContextType>({
  frames: [],
  activeFrameId: null,
  openIframe: () => {},
  closeIframe: () => {},
  maximizeIframe: () => {},
  minimizeIframe: () => {},
  focusIframe: () => {},
  isInIframe: () => false,
});

export const useGlobalIFrame = () => useContext(GlobalIFrameContext);

export const GlobalIFrameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [frames, setFrames] = useState<IFrameData[]>([]);
  const [activeFrameId, setActiveFrameId] = useState<string | null>(null);
  const [maxZIndex, setMaxZIndex] = useState<number>(50);

  // Refs for dragging & resizing
  const frameRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const previousSizeRefs = useRef<{ [key: string]: { width: number; height: number } }>({});
  const previousPositionRefs = useRef<{ [key: string]: { x: number; y: number } }>({});

  const [isDragging, setIsDragging] = useState<{ [key: string]: boolean }>({});
  const [isResizing, setIsResizing] = useState<{ [key: string]: boolean }>({});
  const [resizeDirection, setResizeDirection] = useState<{ [key: string]: string }>({});
  const [isHovering, setIsHovering] = useState<{ [key: string]: boolean }>({});

  const isInIframe = () => {
    try {
      return window.self !== window.top;
    } catch {
      return true;
    }
  };

  useEffect(() => {
    // Don't restore if we're already inside an iframe
    if (isInIframe()) return;

    const savedIframeState = localStorage.getItem('iframeState');
    if (savedIframeState) {
      try {
        const savedFrames = JSON.parse(savedIframeState);
        if (Array.isArray(savedFrames) && savedFrames.length > 0) {
          setFrames(savedFrames);
          setActiveFrameId(savedFrames[savedFrames.length - 1].id);
          
          // Set maxZIndex to highest zIndex + 1
          const highestZIndex = Math.max(...savedFrames.map(frame => frame.window.zIndex));
          setMaxZIndex(highestZIndex + 1);
        }
      } catch (e) {
        console.error('Error restoring iframe state:', e);
        localStorage.removeItem('iframeState');
      }
    }
  }, []);

  useEffect(() => {
    // Save to localStorage only if we have frames and not inside an iframe
    if (frames.length > 0 && !isInIframe()) {
      localStorage.setItem('iframeState', JSON.stringify(frames));
    } else if (localStorage.getItem('iframeState') && frames.length === 0) {
      localStorage.removeItem('iframeState');
    }
  }, [frames]);

  const generateFrameId = () => {
    return `frame-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  };

  const openIframe = (projectId: string, projectNumber?: string) => {
    if (isInIframe()) {
      try {
        if (window.top) {
          window.top.location.href = `/dashboard/sales/leads/${projectId}`;
        } else {
          window.location.href = `/dashboard/sales/leads/${projectId}`;
        }
      } catch {
        window.location.href = `/dashboard/sales/leads/${projectId}`;
      }
      return;
    }

    // Check if a frame with this projectId already exists
    const existingFrameIndex = frames.findIndex(frame => frame.projectId === projectId);
    
    if (existingFrameIndex >= 0) {
      // If it exists, focus it and update the project number if provided
      const updatedFrames = [...frames];
      const frameId = updatedFrames[existingFrameIndex].id;
      
      // Update project number if provided
      if (projectNumber) {
        updatedFrames[existingFrameIndex].projectNumber = projectNumber;
      }
      
      // Ensure it's visible and not minimized
      updatedFrames[existingFrameIndex].window.isVisible = true;
      updatedFrames[existingFrameIndex].window.isMinimized = false;
      
      // Bring to front
      const newZIndex = maxZIndex;
      updatedFrames[existingFrameIndex].window.zIndex = newZIndex;
      
      setFrames(updatedFrames);
      setActiveFrameId(frameId);
      setMaxZIndex(newZIndex + 1);
    } else {
      // Create a new frame
      const newFrameId = generateFrameId();
      const newZIndex = maxZIndex;
      
      // Calculate offset for new window position (staggered)
      const offset = frames.length * 30;
      const position = { 
        x: 50 + offset, 
        y: 50 + offset 
      };
      
      // Avoid going too far off-screen
      if (position.x > 200) position.x = 50;
      if (position.y > 200) position.y = 50;
      
      const newFrame: IFrameData = {
        id: newFrameId,
        projectId,
        projectNumber,
        window: {
          ...defaultIFrameWindow,
          position,
          zIndex: newZIndex
        }
      };
      
      setFrames([...frames, newFrame]);
      setActiveFrameId(newFrameId);
      setMaxZIndex(newZIndex + 1);
      
      // Initialize refs
      previousSizeRefs.current[newFrameId] = { ...defaultIFrameWindow.size };
      previousPositionRefs.current[newFrameId] = { ...position };
    }
  };

  const closeIframe = (id: string) => {
    const newFrames = frames.filter(frame => frame.id !== id);
    setFrames(newFrames);
    
    // Set active frame to the last remaining frame or null if none left
    if (newFrames.length > 0) {
      setActiveFrameId(newFrames[newFrames.length - 1].id);
    } else {
      setActiveFrameId(null);
    }
  };

  const focusIframe = (id: string) => {
    // Bring the frame to the front
    const frameIndex = frames.findIndex(frame => frame.id === id);
    if (frameIndex >= 0) {
      const updatedFrames = [...frames];
      const newZIndex = maxZIndex;
      updatedFrames[frameIndex].window.zIndex = newZIndex;
      setFrames(updatedFrames);
      setActiveFrameId(id);
      setMaxZIndex(newZIndex + 1);
    }
  };

  const maximizeIframe = (id: string) => {
    const frameIndex = frames.findIndex(frame => frame.id === id);
    if (frameIndex < 0) return;

    const updatedFrames = [...frames];
    const frame = updatedFrames[frameIndex];
    
    if (frame.window.isMaximized) {
      // Restore previous size and position
      updatedFrames[frameIndex].window = {
        ...frame.window,
        isMaximized: false,
        isMinimized: false,
        size: previousSizeRefs.current[id] || defaultIFrameWindow.size,
        position: previousPositionRefs.current[id] || defaultIFrameWindow.position
      };
    } else {
      // Save current size and position before maximizing
      previousSizeRefs.current[id] = { ...frame.window.size };
      previousPositionRefs.current[id] = { ...frame.window.position };
      
      // Maximize
      updatedFrames[frameIndex].window = {
        ...frame.window,
        isMaximized: true,
        isMinimized: false,
        position: { x: 0, y: 0 },
        size: { 
          width: typeof window !== 'undefined' ? window.innerWidth : 1000,
          height: typeof window !== 'undefined' ? window.innerHeight : 600
        }
      };
    }
    
    // Focus the frame
    const newZIndex = maxZIndex;
    updatedFrames[frameIndex].window.zIndex = newZIndex;
    setFrames(updatedFrames);
    setActiveFrameId(id);
    setMaxZIndex(newZIndex + 1);
  };

  const minimizeIframe = (id: string) => {
    const frameIndex = frames.findIndex(frame => frame.id === id);
    if (frameIndex < 0) return;

    const updatedFrames = [...frames];
    const frame = updatedFrames[frameIndex];
    
    if (frame.window.isMinimized) {
      // Restore from minimized state
      updatedFrames[frameIndex].window = {
        ...frame.window,
        isMinimized: false,
        position: previousPositionRefs.current[id] || defaultIFrameWindow.position,
        size: previousSizeRefs.current[id] || defaultIFrameWindow.size
      };
    } else {
      // Save current position and size before minimizing
      previousPositionRefs.current[id] = { ...frame.window.position };
      previousSizeRefs.current[id] = { ...frame.window.size };
      
      // Calculate bottom-right position for the minimized window
      // Stagger minimized windows horizontally
      const minimizedIndex = updatedFrames.filter(f => f.window.isMinimized).length;
      const rightPosition = typeof window !== 'undefined' 
        ? window.innerWidth - 400 - (minimizedIndex * 340) 
        : 600 - (minimizedIndex * 340);
      const bottomPosition = typeof window !== 'undefined' ? window.innerHeight - 48 : 500;
      
      updatedFrames[frameIndex].window = {
        ...frame.window,
        isMinimized: true,
        isMaximized: false,
        position: { x: Math.max(rightPosition, 10), y: bottomPosition }
      };
    }
    
    setFrames(updatedFrames);
  };

  // Handle DRAG
  const handleDragStart = (e: React.MouseEvent<HTMLDivElement>, frameId: string) => {
    const frameIndex = frames.findIndex(frame => frame.id === frameId);
    if (frameIndex < 0 || frames[frameIndex].window.isMaximized) return;
    
    e.preventDefault();

    // Focus frame
    focusIframe(frameId);
    
    setIsDragging(prev => ({ ...prev, [frameId]: true }));
    if (!frameRefs.current[frameId]) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const dragOffsetX = e.clientX - rect.left;
    const dragOffsetY = e.clientY - rect.top;

    const handleDragMove = (moveEvent: MouseEvent) => {
      moveEvent.preventDefault();
      const newX = moveEvent.clientX - dragOffsetX;
      const newY = moveEvent.clientY - dragOffsetY;

      const maxX = window.innerWidth - 100; 
      const maxY = window.innerHeight - 50;

      setFrames(prev => {
        const frameIndex = prev.findIndex(frame => frame.id === frameId);
        if (frameIndex < 0) return prev;
        
        const updatedFrames = [...prev];
        updatedFrames[frameIndex] = {
          ...updatedFrames[frameIndex],
          window: {
            ...updatedFrames[frameIndex].window,
            position: {
              x: Math.max(0, Math.min(newX, maxX)),
              y: Math.max(0, Math.min(newY, maxY))
            }
          }
        };
        return updatedFrames;
      });
    };

    const handleDragEnd = () => {
      setIsDragging(prev => ({ ...prev, [frameId]: false }));
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
    };

    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
  };

  // Handle RESIZE
  const handleResizeStart = (e: React.MouseEvent<HTMLDivElement>, frameId: string, direction: string) => {
    const frameIndex = frames.findIndex(frame => frame.id === frameId);
    if (frameIndex < 0 || frames[frameIndex].window.isMaximized) return;
    
    e.preventDefault();
    e.stopPropagation();

    // Focus frame
    focusIframe(frameId);
    
    setIsResizing(prev => ({ ...prev, [frameId]: true }));
    setResizeDirection(prev => ({ ...prev, [frameId]: direction }));

    const frame = frames[frameIndex];
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = frame.window.size.width;
    const startHeight = frame.window.size.height;
    const startLeft = frame.window.position.x;
    const startTop = frame.window.position.y;

    const handleResizeMove = (moveEvent: MouseEvent) => {
      moveEvent.preventDefault();
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;
      let newLeft = startLeft;
      let newTop = startTop;

      switch(direction) {
        case "se": // Bottom right
          newWidth = Math.max(400, startWidth + dx);
          newHeight = Math.max(300, startHeight + dy);
          break;
        case "sw": // Bottom left
          newWidth = Math.max(400, startWidth - dx);
          newHeight = Math.max(300, startHeight + dy);
          newLeft = startLeft + dx;
          break;
        case "ne": // Top right
          newWidth = Math.max(400, startWidth + dx);
          newHeight = Math.max(300, startHeight - dy);
          newTop = startTop + dy;
          break;
        case "nw": // Top left
          newWidth = Math.max(400, startWidth - dx);
          newHeight = Math.max(300, startHeight - dy);
          newLeft = startLeft + dx;
          newTop = startTop + dy;
          break;
        case "e": // Right edge
          newWidth = Math.max(400, startWidth + dx);
          break;
        case "w": // Left edge
          newWidth = Math.max(400, startWidth - dx);
          newLeft = startLeft + dx;
          break;
        case "s": // Bottom edge
          newHeight = Math.max(300, startHeight + dy);
          break;
        case "n": // Top edge
          newHeight = Math.max(300, startHeight - dy);
          newTop = startTop + dy;
          break;
      }

      newLeft = Math.max(0, newLeft);
      newTop = Math.max(0, newTop);

      // Horizontal bounds
      if (direction.includes('e') || direction.includes('w')) {
        const maxX = window.innerWidth - 50;
        if (newLeft + newWidth > maxX) {
          if (direction.includes('w')) {
            newLeft = Math.max(0, maxX - newWidth);
          } else {
            newWidth = Math.min(newWidth, maxX - newLeft);
          }
        }
      }

      // Vertical bounds
      if (direction.includes('n') || direction.includes('s')) {
        const maxY = window.innerHeight - 50;
        if (newTop + newHeight > maxY) {
          if (direction.includes('n')) {
            newTop = Math.max(0, maxY - newHeight);
          } else {
            newHeight = Math.min(newHeight, maxY - newTop);
          }
        }
      }

      setFrames(prev => {
        const frameIndex = prev.findIndex(frame => frame.id === frameId);
        if (frameIndex < 0) return prev;
        
        const updatedFrames = [...prev];
        updatedFrames[frameIndex] = {
          ...updatedFrames[frameIndex],
          window: {
            ...updatedFrames[frameIndex].window,
            size: { width: newWidth, height: newHeight },
            position: { x: newLeft, y: newTop }
          }
        };
        return updatedFrames;
      });
    };

    const handleResizeEnd = () => {
      setIsResizing(prev => ({ ...prev, [frameId]: false }));
      setResizeDirection(prev => ({ ...prev, [frameId]: "" }));
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
    };

    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);
  };

  const contextValue: GlobalIFrameContextType = {
    frames,
    activeFrameId,
    openIframe,
    closeIframe,
    maximizeIframe,
    minimizeIframe,
    focusIframe,
    isInIframe,
  };

  // Don't render the floating windows if we're inside an iframe ourselves
  const shouldRenderIframes = !isInIframe() && frames.length > 0;

  return (
    <GlobalIFrameContext.Provider value={contextValue}>
      {children}

      <AnimatePresence>
        {shouldRenderIframes && frames.map(frame => {
          if (!frame.window.isVisible) return null;
          
          const isActiveFrame = activeFrameId === frame.id;
          const frameIsDragging = isDragging[frame.id] || false;
          const frameIsResizing = isResizing[frame.id] || false;
          const frameResizeDirection = resizeDirection[frame.id] || "";
          const frameIsHovering = isHovering[frame.id] || false;
          
          return (
            <React.Fragment key={frame.id}>
              {/* Main iframe container */}
              <div 
                className="fixed z-50 pointer-events-auto" 
                style={{ 
                  top: frame.window.position.y, 
                  left: frame.window.position.x,
                  width: frame.window.isMaximized ? '100%' : `${frame.window.size.width}px`,
                  height: frame.window.isMaximized ? '100%' : `${frame.window.isMinimized ? 48 : frame.window.size.height}px`,
                  zIndex: frame.window.zIndex,
                }}
              >
                {/* If window is maximized, we show a backdrop you can click to close */}
                {frame.window.isMaximized && (
                  <div 
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto" 
                    onClick={() => closeIframe(frame.id)}
                  />
                )}

                <motion.div
                  ref={(el) => { frameRefs.current[frame.id] = el; }}
                  className={`
                    bg-white rounded-xl flex flex-col overflow-hidden shadow-2xl pointer-events-auto
                    ${frame.window.isMaximized ? 'rounded-none' : ''} 
                    ${frameIsDragging ? 'cursor-grabbing' : ''} 
                    ${frameIsResizing ? `cursor-${frameResizeDirection || 'nwse'}-resize` : ''}
                    transition-all duration-150
                    ${isActiveFrame ? 'ring-2 ring-[#4facfe]' : ''}
                  `}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    width: frame.window.isMaximized
                      ? window?.innerWidth || 1000
                      : frame.window.isMinimized 
                        ? (frameIsHovering ? 340 : 320)
                        : frame.window.size.width,
                    height: frame.window.isMaximized
                      ? window?.innerHeight || 600
                      : frame.window.isMinimized 
                        ? 48 
                        : frame.window.size.height,
                    x: frame.window.isMinimized && !frameIsHovering ? 10 : 0,
                    y: 0,
                    borderRadius: frame.window.isMinimized ? 24 : frame.window.isMaximized ? 0 : 12,
                    transition: {
                      type: "tween",
                      duration: frameIsDragging || frameIsResizing ? 0 : 0.15,
                      ease: "easeOut",
                    },
                  }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  style={{
                    boxShadow: frame.window.isMinimized
                      ? '0 4px 20px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)'
                      : '0 0 0 1px rgba(0,0,0,0.05), 0 10px 25px -5px rgba(0, 0, 0, 0.25), 0 10px 15px -5px rgba(0, 0, 0, 0.15), 0 0 50px 5px rgba(0, 0, 0, 0.1)',
                    width: '100%',
                    height: '100%'
                  }}
                  onMouseEnter={() => setIsHovering(prev => ({ ...prev, [frame.id]: true }))}
                  onMouseLeave={() => setIsHovering(prev => ({ ...prev, [frame.id]: false }))}
                  onClick={() => !frame.window.isMaximized && focusIframe(frame.id)}
                >
                  {/* TITLE BAR */}
                  {frame.window.isMinimized ? (
                    /* MINIMIZED TITLE BAR - Facebook Messenger style */
                    <div
                      className={`
                        flex items-center justify-between p-3 h-full
                        bg-gradient-to-r from-[#213f5b] to-[#1d6fa5] text-white 
                        relative select-none cursor-pointer
                        transition-all duration-150
                      `}
                      onMouseDown={e => handleDragStart(e, frame.id)}
                      onClick={() => minimizeIframe(frame.id)}
                      style={{ touchAction: 'none' }}
                    >
                      <div className="absolute inset-0 bg-white/5"></div>
                      <div className="flex items-center justify-between w-full relative z-20">
                        <div className="flex items-center">
                          <div className="h-6 w-6 bg-gradient-to-br from-[#4facfe] to-[#1d6fa5] rounded-md flex items-center justify-center mr-2 shadow-md">
                            <BuildingOfficeIcon className="h-4 w-4 text-white" />
                          </div>
                          <h3 className="text-sm font-semibold truncate">
                            Projet {frame.projectNumber ? `#${frame.projectNumber}` : ''}
                          </h3>
                        </div>
                        
                        <div className="flex space-x-2">
                          {frameIsHovering && (
                            <>
                              <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.1 }}
                                className="h-6 w-6 bg-white/10 rounded-full hover:bg-white/20 flex items-center justify-center relative z-50"
                                onClick={(e) => { 
                                  e.stopPropagation(); 
                                  e.preventDefault();
                                  closeIframe(frame.id); 
                                }}
                              >
                                <XMarkIcon className="h-3 w-3 text-white" />
                              </motion.div>
                              <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="h-6 w-6 bg-white/10 rounded-full hover:bg-white/20 flex items-center justify-center"
                                onClick={(e) => { e.stopPropagation(); maximizeIframe(frame.id); }}
                              >
                                <MaximizeIcon className="h-3 w-3 text-white" />
                              </motion.div>
                            </>
                          )}
                          <motion.div
                            initial={{ rotate: 0 }}
                            animate={{ rotate: frameIsHovering ? 180 : 0 }}
                            transition={{ duration: 0.15 }}
                            className="h-6 w-6 bg-white/10 rounded-full hover:bg-white/20 flex items-center justify-center"
                          >
                            <ChevronUp className="h-3 w-3 text-white" />
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* NORMAL TITLE BAR */
                    <div
                      className={`
                        flex items-center justify-between p-3 
                        bg-gradient-to-r from-[#213f5b] to-[#1d6fa5] text-white 
                        relative select-none 
                        ${frame.window.isMaximized ? '' : 'rounded-t-xl'} 
                        cursor-move
                      `}
                      onMouseDown={(e) => {
                        // Check if the click target is a button or inside a button
                        const isButton = (e.target as HTMLElement).closest('button') || 
                                        (e.target as HTMLElement).closest('.rounded-full') ||
                                        (e.target as HTMLElement).closest('.h-4.w-4') ||
                                        (e.target as HTMLElement).closest('.h-6.w-6');
                        if (isButton) return; // Don't start drag if clicking on a button
                        handleDragStart(e, frame.id);
                      }}
                      style={{ touchAction: 'none' }}
                    >
                      <div className="absolute inset-0 bg-white/5"></div>
                      <div className="absolute left-0 bottom-0 w-full h-px bg-white/10"></div>

                      <div className="flex items-center relative z-30">
                        <div className="flex space-x-3 ml-6 relative z-40">
                          <div
                            className="h-4 w-4 bg-red-500 rounded-full cursor-pointer hover:bg-red-400 flex items-center justify-center group relative z-50"
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              e.preventDefault();
                              closeIframe(frame.id);
                            }}
                          >
                            <XMarkIcon className="h-3 w-3 text-red-800 opacity-0 group-hover:opacity-100" />
                          </div>
                          <div
                            className="h-4 w-4 bg-yellow-500 rounded-full cursor-pointer hover:bg-yellow-400 flex items-center justify-center group"
                            onClick={() => minimizeIframe(frame.id)}
                          >
                            <MinimizeIcon className="h-3 w-3 text-yellow-800 opacity-0 group-hover:opacity-100" />
                          </div>
                          <div
                            className="h-4 w-4 bg-green-500 rounded-full cursor-pointer hover:bg-green-400 flex items-center justify-center group"
                            onClick={() => maximizeIframe(frame.id)}
                          >
                            <MaximizeIcon className="h-3 w-3 text-green-800 opacity-0 group-hover:opacity-100" />
                          </div>
                        </div>

                        <div className="flex items-center ml-4">
                          <div className="h-5 w-5 bg-gradient-to-br from-[#4facfe] to-[#1d6fa5] rounded-md flex items-center justify-center shadow-inner">
                            <BuildingOfficeIcon className="h-3 w-3 text-white" />
                          </div>
                          <h3 className="ml-2 text-sm font-semibold truncate">
                            Détails du projet {frame.projectNumber ? `#${frame.projectNumber}` : ''}
                          </h3>
                        </div>
                      </div>

                      {/* Right side controls */}
                      <div className="flex items-center space-x-1 pr-2">
                        <div className="text-xs font-medium text-white/70 bg-white/10 px-2 py-0.5 rounded-md">
                          {frame.projectNumber ? `#${frame.projectNumber}` : 'Projet'}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CONTENT / IFRAME */}
                  {!frame.window.isMinimized && (
                    <div className="relative flex-1 w-full h-full bg-gray-50">
                      {frameIsDragging && (
                        <div className="absolute inset-0 z-20 bg-transparent cursor-grabbing" />
                      )}
                      
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#f9fbff] to-white z-10 iframe-loader">
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 border-3 border-[#4facfe] border-t-transparent rounded-full animate-spin" />
                          <p className="mt-4 text-sm text-[#213f5b] font-medium">Chargement...</p>
                        </div>
                      </div>

                      <iframe
                        src={`/dashboard/sales/leads/${frame.projectId}`}
                        className="w-full h-full border-none"
                        title={`Détails du projet ${frame.projectNumber || ''}`}
                        onLoad={(e) => {
                          const target = e.target as HTMLIFrameElement;
                          const loaderEl = target.parentElement?.querySelector('.iframe-loader');
                          if (loaderEl) {
                            loaderEl.classList.add('opacity-0');
                            setTimeout(() => {
                              loaderEl.classList.add('hidden');
                            }, 200);
                          }
                        }}
                      />
                    </div>
                  )}

                  {/* RESIZE HANDLES */}
                  {!frame.window.isMaximized && !frame.window.isMinimized && (
                    <>
                      {/* Corner hints - REDUCED SIZE */}
                      <div 
                        className="absolute top-0 left-0 w-10 h-10 cursor-nwse-resize z-30 hover:bg-[#4facfe]/10" 
                        onMouseDown={(e) => handleResizeStart(e, frame.id, "nw")}
                      />
                      <div 
                        className="absolute top-0 right-0 w-10 h-10 cursor-nesw-resize z-30 hover:bg-[#4facfe]/10" 
                        onMouseDown={(e) => handleResizeStart(e, frame.id, "ne")}
                      />
                      <div 
                        className="absolute bottom-0 left-0 w-10 h-10 cursor-nesw-resize z-30 hover:bg-[#4facfe]/10" 
                        onMouseDown={(e) => handleResizeStart(e, frame.id, "sw")}
                      />
                      <div 
                        className="absolute bottom-0 right-0 w-10 h-10 cursor-nwse-resize z-30 group hover:bg-[#4facfe]/10" 
                        onMouseDown={(e) => handleResizeStart(e, frame.id, "se")}
                      >
                        {/* Resize indicator */}
                        <div className="absolute bottom-2 right-2 w-5 h-5 flex items-end justify-end opacity-70 group-hover:opacity-100">
                          <div className="w-1 h-1 rounded-full bg-gray-500 group-hover:bg-[#4facfe] m-0.5"></div>
                          <div className="w-1 h-1 rounded-full bg-gray-500 group-hover:bg-[#4facfe] m-0.5"></div>
                          <div className="w-1 h-1 rounded-full bg-gray-500 group-hover:bg-[#4facfe] m-0.5"></div>
                        </div>
                      </div>

                      {/* Edges - REDUCED SIZE */}
                      <div 
                        className="absolute top-0 left-10 right-10 h-4 cursor-ns-resize z-30 hover:bg-[#4facfe]/10"
                        onMouseDown={(e) => handleResizeStart(e, frame.id, "n")}
                      />
                      <div 
                        className="absolute bottom-0 left-10 right-10 h-4 cursor-ns-resize z-30 hover:bg-[#4facfe]/10"
                        onMouseDown={(e) => handleResizeStart(e, frame.id, "s")}
                      />
                      <div 
                        className="absolute left-0 top-10 bottom-10 w-4 cursor-ew-resize z-30 hover:bg-[#4facfe]/10"
                        onMouseDown={(e) => handleResizeStart(e, frame.id, "w")}
                      />
                      <div 
                        className="absolute right-0 top-10 bottom-10 w-4 cursor-ew-resize z-30 hover:bg-[#4facfe]/10"
                        onMouseDown={(e) => handleResizeStart(e, frame.id, "e")}
                      />
                    </>
                  )}
                </motion.div>
              </div>
            </React.Fragment>
          );
        })}
      </AnimatePresence>

      {/* Extra styling */}
      <style jsx global>{`
        .shimmer {
          animation: shimmer 2s infinite linear;
          background-size: 1000px 100%;
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .iframe-loader {
          transition: opacity 0.2s ease-out;
        }
        .cursor-grabbing iframe,
        .cursor-nwse-resize iframe,
        .cursor-nesw-resize iframe,
        .cursor-ns-resize iframe,
        .cursor-ew-resize iframe {
          pointer-events: none !important;
        }
      `}</style>
    </GlobalIFrameContext.Provider>
  );
};