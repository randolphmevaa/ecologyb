'use client';

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { AnimatePresence, motion } from "framer-motion";
import {
  XMarkIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";
import { 
  MinimizeIcon, 
  MaximizeIcon,
  X as CloseIcon 
} from "lucide-react";

// Define IFrame window parameters type
type IFrameWindowParams = {
  isMaximized: boolean;
  isMinimized: boolean;
  isVisible: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
};

// Define the shape of the context
type GlobalIFrameContextType = {
  iframeProjectId: string | null;
  iframeWindow: IFrameWindowParams;
  openIframe: (projectId: string, projectNumber?: string) => void;
  closeIframe: () => void;
  maximizeIframe: () => void;
  minimizeIframe: () => void;
  isInIframe: () => boolean;
};

// Default values
const defaultIFrameWindow: IFrameWindowParams = {
  isMaximized: false,
  isMinimized: false,
  isVisible: false,
  position: { x: 50, y: 50 },
  size: { width: 1000, height: 600 }
};

// Create context with default values
const GlobalIFrameContext = createContext<GlobalIFrameContextType>({
  iframeProjectId: null,
  iframeWindow: defaultIFrameWindow,
  openIframe: () => {},
  closeIframe: () => {},
  maximizeIframe: () => {},
  minimizeIframe: () => {},
  isInIframe: () => false,
});

// Hook to use the context
export const useGlobalIFrame = () => useContext(GlobalIFrameContext);

export const GlobalIFrameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [iframeProjectId, setIframeProjectId] = useState<string | null>(null);
  const [iframeProjectNumber, setIframeProjectNumber] = useState<string | null>(null);
  const [iframeWindow, setIframeWindow] = useState<IFrameWindowParams>(defaultIFrameWindow);
  
  // Refs for dragging and resizing
  const iframeRef = useRef<HTMLDivElement>(null);
  const previousSizeRef = useRef({ width: 1000, height: 600 });
  
  // Enhanced state for drag and resize
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState("");
  
  // Ref for storing drag/resize starting positions
  const startPosRef = useRef({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    left: 0,
    top: 0,
  });

  // Detect if we're inside an iframe to prevent nested iframes
  const isInIframe = () => {
    try {
      return window.self !== window.top;
    } catch {
      return true;
    }
  };

  // Check if we're in a touch device
//   const isTouchDevice = () => {
//     if (typeof window === 'undefined') return false;
//     return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
//   };

  // Load saved state on initial render
  useEffect(() => {
    // Don't load iframe state if we're already inside an iframe
    if (isInIframe()) return;
    
    const savedIframeState = localStorage.getItem('iframeState');
    if (savedIframeState) {
      try {
        const { projectId, projectNumber, window } = JSON.parse(savedIframeState);
        setIframeProjectId(projectId);
        setIframeProjectNumber(projectNumber);
        setIframeWindow(window);
      } catch (e) {
        console.error('Error restoring iframe state:', e);
        localStorage.removeItem('iframeState');
      }
    }
  }, []);

  // Save state to localStorage when it changes
  useEffect(() => {
    if (iframeWindow.isVisible && !isInIframe()) {
      localStorage.setItem('iframeState', JSON.stringify({
        projectId: iframeProjectId,
        projectNumber: iframeProjectNumber,
        window: iframeWindow
      }));
    } else if (localStorage.getItem('iframeState')) {
      localStorage.removeItem('iframeState');
    }
  }, [iframeWindow, iframeProjectId, iframeProjectNumber]);

  // Add window resize handler to adjust iframe when window size changes
  useEffect(() => {
    const handleWindowResize = () => {
      if (iframeWindow.isMaximized) {
        setIframeWindow(prev => ({
          ...prev,
          size: {
            width: window.innerWidth,
            height: window.innerHeight
          }
        }));
      }
    };

    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, [iframeWindow.isMaximized]);

  // Handle iframe window controls
  const openIframe = (projectId: string, projectNumber?: string) => {
    // Prevent opening iframe within iframe
    if (isInIframe()) {
      // If in iframe, navigate to the project directly in parent window
      try {
        if (window.top) {
          window.top.location.href = `/dashboard/admin/projects/${projectId}`;
        } else {
          window.location.href = `/dashboard/admin/projects/${projectId}`;
        }
      } catch {
        // If navigation fails due to security, at least open in this window
        window.location.href = `/dashboard/admin/projects/${projectId}`;
      }
      return;
    }
    
    setIframeProjectId(projectId);
    if (projectNumber) setIframeProjectNumber(projectNumber);
    setIframeWindow({
      ...iframeWindow,
      isVisible: true,
      isMinimized: false
    });
  };

  const closeIframe = () => {
    setIframeWindow(prev => ({
      ...prev,
      isVisible: false
    }));
  };

  const maximizeIframe = () => {
    if (iframeWindow.isMaximized) {
      // Restore to previous size
      setIframeWindow(prev => ({
        ...prev,
        isMaximized: false,
        isMinimized: false,
        size: previousSizeRef.current
      }));
    } else {
      // Save current size before maximizing
      previousSizeRef.current = iframeWindow.size;
      // Maximize
      setIframeWindow(prev => ({
        ...prev,
        isMaximized: true,
        isMinimized: false,
        position: { x: 0, y: 0 },
        size: { 
          width: typeof window !== 'undefined' ? window.innerWidth : 1000, 
          height: typeof window !== 'undefined' ? window.innerHeight : 600 
        }
      }));
    }
  };

  const minimizeIframe = () => {
    setIframeWindow(prev => ({
      ...prev,
      isMinimized: !prev.isMinimized
    }));
  };

  // Enhanced drag functionality with touch support
  const handleDragStart = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (iframeWindow.isMaximized) return;
    
    e.preventDefault();
    setIsDragging(true);
    
    // Get the current iframe container
    const container = iframeRef.current;
    if (!container) return;
    
    // Record starting positions
    const rect = container.getBoundingClientRect();
    
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    // Calculate offset from the top-left corner of the title bar
    const dragOffsetX = clientX - rect.left;
    const dragOffsetY = clientY - rect.top;
    
    const handleMove = (moveEvent: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      
      let moveClientX, moveClientY;
      if ('touches' in moveEvent) {
        moveClientX = moveEvent.touches[0].clientX;
        moveClientY = moveEvent.touches[0].clientY;
      } else {
        moveClientX = (moveEvent as MouseEvent).clientX;
        moveClientY = (moveEvent as MouseEvent).clientY;
      }
      
      // Calculate new position
      const newX = moveClientX - dragOffsetX;
      const newY = moveClientY - dragOffsetY;
      
      // Apply constraints
      const maxX = window.innerWidth - 100;
      const maxY = window.innerHeight - 50;
      
      setIframeWindow(prev => ({
        ...prev,
        position: {
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY))
        }
      }));
    };
    
    const handleEnd = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchend', handleEnd);
    };
    
    // Add event listeners for both mouse and touch
    document.addEventListener('mousemove', handleMove, { passive: false });
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchend', handleEnd);
  };

  // Enhanced resize functionality with touch support
  const handleResizeStart = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>, 
    direction: string
  ) => {
    if (iframeWindow.isMaximized) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    setIsResizing(true);
    setResizeDirection(direction);
    
    // Get current iframe dimensions and position
    const rect = iframeRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    // Store starting values
    startPosRef.current = {
      x: clientX,
      y: clientY,
      width: iframeWindow.size.width,
      height: iframeWindow.size.height,
      left: iframeWindow.position.x,
      top: iframeWindow.position.y
    };
    
    const handleResizeMove = (moveEvent: MouseEvent | TouchEvent) => {
      if (!isResizing) return;
      
      let moveClientX, moveClientY;
      if ('touches' in moveEvent) {
        moveClientX = moveEvent.touches[0].clientX;
        moveClientY = moveEvent.touches[0].clientY;
        // Prevent scrolling during resize on touch devices
        moveEvent.preventDefault();
      } else {
        moveClientX = (moveEvent as MouseEvent).clientX;
        moveClientY = (moveEvent as MouseEvent).clientY;
      }
      
      // Calculate position changes
      const dx = moveClientX - startPosRef.current.x;
      const dy = moveClientY - startPosRef.current.y;
      
      // Apply resize based on direction
      const { width: startWidth, height: startHeight, left: startLeft, top: startTop } = startPosRef.current;
      let newWidth = startWidth;
      let newHeight = startHeight;
      let newLeft = startLeft;
      let newTop = startTop;
      
      // Handle resizing based on direction
      if (direction.includes('e')) newWidth = Math.max(300, startWidth + dx);
      if (direction.includes('w')) {
        newWidth = Math.max(300, startWidth - dx);
        newLeft = startLeft + dx;
      }
      if (direction.includes('s')) newHeight = Math.max(200, startHeight + dy);
      if (direction.includes('n')) {
        newHeight = Math.max(200, startHeight - dy);
        newTop = startTop + dy;
      }
      
      // Ensure window stays within viewport
      const maxX = window.innerWidth - 50;
      const maxY = window.innerHeight - 50;
      
      // Adjust if exceeding right or bottom edge
      if (newLeft + newWidth > maxX) {
        if (direction.includes('w')) newLeft = Math.max(0, maxX - newWidth);
        else newWidth = Math.min(newWidth, maxX - newLeft);
      }
      
      if (newTop + newHeight > maxY) {
        if (direction.includes('n')) newTop = Math.max(0, maxY - newHeight);
        else newHeight = Math.min(newHeight, maxY - newTop);
      }
      
      // Ensure we don't go off the left or top edge
      newLeft = Math.max(0, newLeft);
      newTop = Math.max(0, newTop);
      
      // Update iframe window state
      setIframeWindow(prev => ({
        ...prev,
        size: { width: newWidth, height: newHeight },
        position: { x: newLeft, y: newTop }
      }));
    };
    
    const handleResizeEnd = () => {
      setIsResizing(false);
      setResizeDirection("");
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('touchmove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
      document.removeEventListener('touchend', handleResizeEnd);
    };
    
    // Add event listeners for both mouse and touch
    document.addEventListener('mousemove', handleResizeMove, { passive: false });
    document.addEventListener('touchmove', handleResizeMove, { passive: false });
    document.addEventListener('mouseup', handleResizeEnd);
    document.addEventListener('touchend', handleResizeEnd);
  };

  // Generate cursor class based on resize direction
  const getCursorClass = () => {
    if (isDragging) return 'cursor-grabbing';
    if (isResizing) {
      switch (resizeDirection) {
        case 'n': case 's': return 'cursor-ns-resize';
        case 'e': case 'w': return 'cursor-ew-resize';
        case 'ne': case 'sw': return 'cursor-nesw-resize';
        case 'nw': case 'se': return 'cursor-nwse-resize';
        default: return '';
      }
    }
    return '';
  };

  // Expose context values
  const contextValue = {
    iframeProjectId,
    iframeWindow,
    openIframe,
    closeIframe,
    maximizeIframe,
    minimizeIframe,
    isInIframe,
  };

  // Don't render the iframe if we're already inside an iframe
  const shouldRenderIframe = !isInIframe() && iframeWindow.isVisible && iframeProjectId;

  return (
    <GlobalIFrameContext.Provider value={contextValue}>
      {children}

      {/* Persistent IFrame Window that follows you everywhere */}
      <AnimatePresence>
        {shouldRenderIframe && (
          <div className="fixed inset-0 z-50 pointer-events-none">
            {/* Semi-transparent backdrop only when maximized */}
            {iframeWindow.isMaximized && (
              <div 
                className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto" 
                onClick={closeIframe}
              ></div>
            )}
            
            {/* IFrame Container */}
            <motion.div 
              ref={iframeRef}
              className={`absolute bg-white rounded-xl flex flex-col overflow-hidden pointer-events-auto shadow-2xl ${
                iframeWindow.isMaximized ? 'inset-0 rounded-none' : ''
              } ${
                iframeWindow.isMinimized ? 'h-12 overflow-hidden' : ''
              } ${
                getCursorClass()
              } ${
                isDragging || isResizing ? 'will-change-transform' : ''
              }`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                width: iframeWindow.isMaximized 
                  ? (typeof window !== 'undefined' ? window.innerWidth : 1000)
                  : iframeWindow.isMinimized
                    ? 300
                    : iframeWindow.size.width,
                height: iframeWindow.isMaximized 
                  ? (typeof window !== 'undefined' ? window.innerHeight : 600)
                  : iframeWindow.isMinimized
                    ? 48
                    : iframeWindow.size.height,
                top: iframeWindow.isMaximized 
                  ? 0 
                  : iframeWindow.position.y,
                left: iframeWindow.isMaximized 
                  ? 0 
                  : iframeWindow.position.x,
                transition: { 
                  type: isDragging || isResizing ? "tween" : "spring", 
                  duration: isDragging || isResizing ? 0 : 0.3,
                  damping: 25, 
                  stiffness: 300,
                }
              }}
              style={{
                boxShadow: '0 0 0 1px rgba(0,0,0,0.05), 0 10px 25px -5px rgba(0, 0, 0, 0.25), 0 10px 15px -5px rgba(0, 0, 0, 0.15), 0 0 50px 5px rgba(0, 0, 0, 0.1)',
                ...(iframeWindow.isMaximized ? {} : {
                  top: iframeWindow.position.y,
                  left: iframeWindow.position.x,
                  width: iframeWindow.isMinimized ? 300 : iframeWindow.size.width,
                  height: iframeWindow.isMinimized ? 48 : iframeWindow.size.height,
                })
              }}
            >
              {/* Window Title Bar with controls */}
              <div 
                className={`flex items-center justify-between p-3 bg-gradient-to-r from-[#213f5b] to-[#1d6fa5] text-white cursor-move relative ${iframeWindow.isMaximized ? '' : 'rounded-t-xl'} select-none`}
                onMouseDown={handleDragStart}
                onTouchStart={handleDragStart}
                style={{ touchAction: 'none' }}
              >
                {/* Decorative elements for title bar */}
                <div className="absolute inset-0 bg-white/5 bg-opacity-10"></div>
                <div className="absolute left-0 bottom-0 w-full h-px bg-white/10"></div>
                
                <div className="flex items-center relative z-10">
                  <div className="flex space-x-2 ml-1">
                    <div className="h-3.5 w-3.5 bg-red-500 rounded-full cursor-pointer hover:bg-red-400 transition-colors flex items-center justify-center group" onClick={closeIframe}>
                      <XMarkIcon className="h-2 w-2 text-red-800 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="h-3.5 w-3.5 bg-yellow-500 rounded-full cursor-pointer hover:bg-yellow-400 transition-colors flex items-center justify-center group" onClick={minimizeIframe}>
                      <MinimizeIcon className="h-2 w-2 text-yellow-800 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="h-3.5 w-3.5 bg-green-500 rounded-full cursor-pointer hover:bg-green-400 transition-colors flex items-center justify-center group" onClick={maximizeIframe}>
                      <MaximizeIcon className="h-2 w-2 text-green-800 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  
                  <div className="flex items-center ml-4">
                    <div className="h-5 w-5 bg-gradient-to-br from-[#4facfe] to-[#1d6fa5] rounded-md shadow-sm flex items-center justify-center">
                      <BuildingOfficeIcon className="h-3 w-3 text-white" />
                    </div>
                    <h3 className="ml-2 text-sm font-semibold truncate">
                      Détails du projet {iframeProjectNumber ? `#${iframeProjectNumber}` : ''}
                    </h3>
                  </div>
                </div>
                
                <div className="flex space-x-1 relative z-10">
                  <button 
                    onClick={minimizeIframe}
                    className="p-1.5 hover:bg-white/10 rounded-md transition-colors"
                    title="Baisser"
                  >
                    <MinimizeIcon className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={maximizeIframe}
                    className="p-1.5 hover:bg-white/10 rounded-md transition-colors"
                    title="Agrandir"
                  >
                    <MaximizeIcon className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={closeIframe}
                    className="p-1.5 hover:bg-white/10 hover:text-red-300 rounded-md transition-colors"
                    title="Fermer"
                  >
                    <CloseIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {/* IFrame Content with loading indicator */}
              {!iframeWindow.isMinimized && (
                <div className="relative flex-1 w-full h-full bg-gray-50">
                  {/* Show blocking overlay during drag/resize operations */}
                  {(isDragging || isResizing) && (
                    <div 
                      className={`absolute inset-0 z-20 bg-transparent ${getCursorClass()}`} 
                      onMouseUp={() => {
                        setIsDragging(false);
                        setIsResizing(false);
                      }}
                      onTouchEnd={() => {
                        setIsDragging(false);
                        setIsResizing(false);
                      }}
                    />
                  )}
                  
                  {/* Loading overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#f9fbff] to-white z-10 iframe-loader">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 border-3 border-[#4facfe] border-t-transparent rounded-full animate-spin"></div>
                      <p className="mt-4 text-sm text-[#213f5b] font-medium">Chargement...</p>
                    </div>
                  </div>
                  
                  {/* The iframe itself */}
                  <iframe 
                    src={`/dashboard/admin/projects/${iframeProjectId}`}
                    className="w-full h-full border-none"
                    title={`Détails du projet ${iframeProjectNumber || ''}`}
                    sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-downloads"
                    loading="lazy"
                    onLoad={(e) => {
                      // Hide the loader when iframe is loaded
                      const target = e.target as HTMLIFrameElement;
                      const loaderEl = target.parentElement?.querySelector('.iframe-loader');
                      if (loaderEl) {
                        loaderEl.classList.add('opacity-0');
                        setTimeout(() => {
                          loaderEl.classList.add('hidden');
                        }, 500);
                      }
                    }}
                  ></iframe>
                </div>
              )}
              
              {/* Resize handles - only show when not maximized or minimized */}
              {!iframeWindow.isMaximized && !iframeWindow.isMinimized && (
                <>
                  {/* Corner handles */}
                  <div 
                    className="absolute top-0 left-0 w-16 h-16 cursor-nwse-resize z-30"
                    onMouseDown={(e) => handleResizeStart(e, "nw")}
                    onTouchStart={(e) => handleResizeStart(e, "nw")}
                  />
                  <div 
                    className="absolute top-0 right-0 w-16 h-16 cursor-nesw-resize z-30"
                    onMouseDown={(e) => handleResizeStart(e, "ne")}
                    onTouchStart={(e) => handleResizeStart(e, "ne")}
                  />
                  <div 
                    className="absolute bottom-0 left-0 w-16 h-16 cursor-nesw-resize z-30"
                    onMouseDown={(e) => handleResizeStart(e, "sw")}
                    onTouchStart={(e) => handleResizeStart(e, "sw")}
                  />
                  <div 
                    className="absolute bottom-0 right-0 w-20 h-20 cursor-nwse-resize z-30 group"
                    onMouseDown={(e) => handleResizeStart(e, "se")}
                    onTouchStart={(e) => handleResizeStart(e, "se")}
                  >
                    {/* Visual indicator for resize handle */}
                    <div className="absolute bottom-2 right-2 w-8 h-8 flex items-end justify-end">
                      <div className="w-1 h-1 rounded-full bg-gray-400 m-0.5"></div>
                      <div className="w-1 h-1 rounded-full bg-gray-400 m-0.5"></div>
                      <div className="w-1 h-1 rounded-full bg-gray-400 m-0.5"></div>
                    </div>
                    <div className="absolute bottom-2 right-2 w-8 h-8 flex items-end justify-end">
                      <div className="w-1 h-1 rounded-full bg-gray-400 m-0.5"></div>
                      <div className="w-1 h-1 rounded-full bg-gray-400 m-0.5"></div>
                    </div>
                    <div className="absolute bottom-2 right-2 w-8 h-8 flex items-end justify-end">
                      <div className="w-1 h-1 rounded-full bg-gray-400 m-0.5"></div>
                    </div>
                  </div>
                  
                  {/* Edge handles */}
                  <div 
                    className="absolute top-0 left-16 right-16 h-8 cursor-ns-resize z-30"
                    onMouseDown={(e) => handleResizeStart(e, "n")}
                    onTouchStart={(e) => handleResizeStart(e, "n")}
                  />
                  <div 
                    className="absolute bottom-0 left-16 right-16 h-8 cursor-ns-resize z-30"
                    onMouseDown={(e) => handleResizeStart(e, "s")}
                    onTouchStart={(e) => handleResizeStart(e, "s")}
                  />
                  <div 
                    className="absolute left-0 top-16 bottom-16 w-8 cursor-ew-resize z-30"
                    onMouseDown={(e) => handleResizeStart(e, "w")}
                    onTouchStart={(e) => handleResizeStart(e, "w")}
                  />
                  <div 
                    className="absolute right-0 top-16 bottom-16 w-8 cursor-ew-resize z-30"
                    onMouseDown={(e) => handleResizeStart(e, "e")}
                    onTouchStart={(e) => handleResizeStart(e, "e")}
                  />
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CSS for animations and improved UI */}
      <style jsx global>{`
        .iframe-loader {
          transition: opacity 0.5s ease-out;
        }
        
        /* Fix iframe interaction during drag */
        .cursor-grabbing iframe,
        .cursor-nwse-resize iframe,
        .cursor-nesw-resize iframe,
        .cursor-ns-resize iframe,
        .cursor-ew-resize iframe {
          pointer-events: none !important;
        }
        
        /* Hardware acceleration for smoother dragging */
        .will-change-transform {
          will-change: transform;
        }
      `}</style>
    </GlobalIFrameContext.Provider>
  );
};