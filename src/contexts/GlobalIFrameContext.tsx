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
  // X as CloseIcon 
} from "lucide-react";

type IFrameWindowParams = {
  isMaximized: boolean;
  isMinimized: boolean;
  isVisible: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
};

type GlobalIFrameContextType = {
  iframeProjectId: string | null;
  iframeWindow: IFrameWindowParams;
  openIframe: (projectId: string, projectNumber?: string) => void;
  closeIframe: () => void;
  maximizeIframe: () => void;
  minimizeIframe: () => void;
  isInIframe: () => boolean;
};

const defaultIFrameWindow: IFrameWindowParams = {
  isMaximized: false,
  isMinimized: false,
  isVisible: false,
  position: { x: 50, y: 50 },
  size: { width: 1000, height: 600 }
};

const GlobalIFrameContext = createContext<GlobalIFrameContextType>({
  iframeProjectId: null,
  iframeWindow: defaultIFrameWindow,
  openIframe: () => {},
  closeIframe: () => {},
  maximizeIframe: () => {},
  minimizeIframe: () => {},
  isInIframe: () => false,
});

export const useGlobalIFrame = () => useContext(GlobalIFrameContext);

export const GlobalIFrameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [iframeProjectId, setIframeProjectId] = useState<string | null>(null);
  const [iframeProjectNumber, setIframeProjectNumber] = useState<string | null>(null);
  const [iframeWindow, setIframeWindow] = useState<IFrameWindowParams>(defaultIFrameWindow);

  // Refs for dragging & resizing
  const iframeRef = useRef<HTMLDivElement>(null);
  const previousSizeRef = useRef({ width: 1000, height: 600 });

  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState("");

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

  useEffect(() => {
    // Save to localStorage only if visible (and not inside an iframe).
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

  const openIframe = (projectId: string, projectNumber?: string) => {
    if (isInIframe()) {
      try {
        if (window.top) {
          window.top.location.href = `/dashboard/admin/projects/${projectId}`;
        } else {
          window.location.href = `/dashboard/admin/projects/${projectId}`;
        }
      } catch {
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
    setIframeWindow({
      ...iframeWindow,
      isVisible: false
    });
  };

  const maximizeIframe = () => {
    if (iframeWindow.isMaximized) {
      setIframeWindow({
        ...iframeWindow,
        isMaximized: false,
        isMinimized: false,
        size: previousSizeRef.current
      });
    } else {
      previousSizeRef.current = iframeWindow.size;
      setIframeWindow({
        ...iframeWindow,
        isMaximized: true,
        isMinimized: false,
        position: { x: 0, y: 0 },
        size: { 
          width: typeof window !== 'undefined' ? window.innerWidth : 1000,
          height: typeof window !== 'undefined' ? window.innerHeight : 600
        }
      });
    }
  };

  const minimizeIframe = () => {
    setIframeWindow({
      ...iframeWindow,
      isMinimized: !iframeWindow.isMinimized
    });
  };

  // Handle DRAG
  const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    if (iframeWindow.isMaximized) return;
    // If you notice issues, remove or comment out preventDefault:
    e.preventDefault();

    setIsDragging(true);
    if (!iframeRef.current) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const dragOffsetX = e.clientX - rect.left;
    const dragOffsetY = e.clientY - rect.top;

    const handleDragMove = (moveEvent: MouseEvent) => {
      moveEvent.preventDefault();
      const newX = moveEvent.clientX - dragOffsetX;
      const newY = moveEvent.clientY - dragOffsetY;

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

    const handleDragEnd = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
    };

    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
  };

  // Handle RESIZE
  const handleResizeStart = (e: React.MouseEvent<HTMLDivElement>, direction: string) => {
    if (iframeWindow.isMaximized) return;
    e.preventDefault();
    e.stopPropagation();

    setIsResizing(true);
    setResizeDirection(direction);

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = iframeWindow.size.width;
    const startHeight = iframeWindow.size.height;
    const startLeft = iframeWindow.position.x;
    const startTop = iframeWindow.position.y;

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
      document.removeEventListener('mouseup', handleResizeEnd);
    };

    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);
  };

  const contextValue: GlobalIFrameContextType = {
    iframeProjectId,
    iframeWindow,
    openIframe,
    closeIframe,
    maximizeIframe,
    minimizeIframe,
    isInIframe,
  };

  // Don't render the floating window if we're inside an iframe ourselves
  const shouldRenderIframe = !isInIframe() && iframeWindow.isVisible && iframeProjectId;

  return (
    <GlobalIFrameContext.Provider value={contextValue}>
      {children}

      <AnimatePresence>
        {shouldRenderIframe && (
          <>
            {/* Removed the invisible full-screen container that was closing the iframe */}
            
            {/* Main iframe container - sizing determines interactive area */}
          <div className="fixed z-50 pointer-events-auto" style={{ 
            top: iframeWindow.position.y, 
            left: iframeWindow.position.x,
            width: iframeWindow.isMaximized ? '100%' : `${iframeWindow.size.width}px`,
            height: iframeWindow.isMaximized ? '100%' : `${iframeWindow.isMinimized ? 48 : iframeWindow.size.height}px`,
          }}>
            {/* If window is maximized, we show a backdrop you can click to close */}
            {iframeWindow.isMaximized && (
              <div 
                className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto" 
                onClick={closeIframe}
              />
            )}

            <motion.div
              ref={iframeRef}
              className={`
                bg-white rounded-xl flex flex-col overflow-hidden shadow-2xl pointer-events-auto
                ${iframeWindow.isMaximized ? 'rounded-none' : ''} 
                ${iframeWindow.isMinimized ? 'h-12 overflow-hidden' : ''} 
                ${isDragging ? 'cursor-grabbing' : ''} 
                ${isResizing ? `cursor-${resizeDirection || 'nwse'}-resize` : ''}
              `}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{
                opacity: 1,
                scale: 1,
                width: iframeWindow.isMaximized
                  ? window?.innerWidth || 1000
                  : iframeWindow.isMinimized 
                    ? 300 
                    : iframeWindow.size.width,
                height: iframeWindow.isMaximized
                  ? window?.innerHeight || 600
                  : iframeWindow.isMinimized 
                    ? 48 
                    : iframeWindow.size.height,
                transition: {
                  type: isDragging || isResizing ? "tween" : "spring",
                  duration: isDragging || isResizing ? 0 : 0.3,
                  damping: 25,
                  stiffness: 300,
                },
              }}
              style={{
                boxShadow:
                  '0 0 0 1px rgba(0,0,0,0.05), 0 10px 25px -5px rgba(0, 0, 0, 0.25), 0 10px 15px -5px rgba(0, 0, 0, 0.15), 0 0 50px 5px rgba(0, 0, 0, 0.1)',
                width: '100%',
                height: '100%'
              }}
            >
              {/* TITLE BAR */}
                              <div
                className={`
                  flex items-center justify-between p-3 
                  bg-gradient-to-r from-[#213f5b] to-[#1d6fa5] text-white 
                  relative select-none 
                  ${iframeWindow.isMaximized ? '' : 'rounded-t-xl'} 
                  cursor-move
                `}
                onMouseDown={(e) => {
                  // Check if the click target is a button or inside a button
                  const isButton = (e.target as HTMLElement).closest('button') || 
                                   (e.target as HTMLElement).closest('.rounded-full');
                  if (isButton) return; // Don't start drag if clicking on a button
                  handleDragStart(e);
                }}
                style={{ touchAction: 'none' }}
              >
                <div className="absolute inset-0 bg-white/5"></div>
                <div className="absolute left-0 bottom-0 w-full h-px bg-white/10"></div>

                <div className="flex items-center relative z-20">
                  <div className="flex space-x-3 ml-6">
                    <div
                      className="h-4 w-4 bg-red-500 rounded-full cursor-pointer hover:bg-red-400 flex items-center justify-center group"
                      onClick={closeIframe}
                    >
                      <XMarkIcon className="h-3 w-3 text-red-800 opacity-0 group-hover:opacity-100" />
                    </div>
                    <div
                      className="h-4 w-4 bg-yellow-500 rounded-full cursor-pointer hover:bg-yellow-400 flex items-center justify-center group"
                      onClick={minimizeIframe}
                    >
                      <MinimizeIcon className="h-3 w-3 text-yellow-800 opacity-0 group-hover:opacity-100" />
                    </div>
                    <div
                      className="h-4 w-4 bg-green-500 rounded-full cursor-pointer hover:bg-green-400 flex items-center justify-center group"
                      onClick={maximizeIframe}
                    >
                      <MaximizeIcon className="h-3 w-3 text-green-800 opacity-0 group-hover:opacity-100" />
                    </div>
                  </div>

                  <div className="flex items-center ml-4">
                    <div className="h-5 w-5 bg-gradient-to-br from-[#4facfe] to-[#1d6fa5] rounded-md flex items-center justify-center">
                      <BuildingOfficeIcon className="h-3 w-3 text-white" />
                    </div>
                    <h3 className="ml-2 text-sm font-semibold truncate">
                      Détails du projet {iframeProjectNumber ? `#${iframeProjectNumber}` : ''}
                    </h3>
                  </div>
                </div>

                {/* Removing the duplicate control buttons in the top right */}
                <div></div>
              </div>

              {/* CONTENT / IFRAME */}
              {!iframeWindow.isMinimized && (
                <div className="relative flex-1 w-full h-full bg-gray-50">
                  {isDragging && (
                    <div className="absolute inset-0 z-20 bg-transparent cursor-grabbing" />
                  )}
                  
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#f9fbff] to-white z-10 iframe-loader">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 border-3 border-[#4facfe] border-t-transparent rounded-full animate-spin" />
                      <p className="mt-4 text-sm text-[#213f5b] font-medium">Chargement...</p>
                    </div>
                  </div>

                  <iframe
                    src={`/dashboard/admin/projects/${iframeProjectId}`}
                    className="w-full h-full border-none"
                    title={`Détails du projet ${iframeProjectNumber || ''}`}
                    onLoad={(e) => {
                      const target = e.target as HTMLIFrameElement;
                      const loaderEl = target.parentElement?.querySelector('.iframe-loader');
                      if (loaderEl) {
                        loaderEl.classList.add('opacity-0');
                        setTimeout(() => {
                          loaderEl.classList.add('hidden');
                        }, 500);
                      }
                    }}
                  />
                </div>
              )}

              {/* RESIZE HANDLES */}
              {!iframeWindow.isMaximized && !iframeWindow.isMinimized && (
                <>
                  {/* Corner hints - REDUCED SIZE */}
                  <div 
                    className="absolute top-0 left-0 w-10 h-10 cursor-nwse-resize z-30 hover:bg-[#4facfe]/10" 
                    onMouseDown={(e) => handleResizeStart(e, "nw")}
                  />
                  <div 
                    className="absolute top-0 right-0 w-10 h-10 cursor-nesw-resize z-30 hover:bg-[#4facfe]/10" 
                    onMouseDown={(e) => handleResizeStart(e, "ne")}
                  />
                  <div 
                    className="absolute bottom-0 left-0 w-10 h-10 cursor-nesw-resize z-30 hover:bg-[#4facfe]/10" 
                    onMouseDown={(e) => handleResizeStart(e, "sw")}
                  />
                  <div 
                    className="absolute bottom-0 right-0 w-10 h-10 cursor-nwse-resize z-30 group hover:bg-[#4facfe]/10" 
                    onMouseDown={(e) => handleResizeStart(e, "se")}
                  >
                    {/* Smaller resize indicator */}
                    <div className="absolute bottom-2 right-2 w-5 h-5 flex items-end justify-end">
                      <div className="w-1 h-1 rounded-full bg-gray-500 group-hover:bg-[#4facfe] m-0.5"></div>
                      <div className="w-1 h-1 rounded-full bg-gray-500 group-hover:bg-[#4facfe] m-0.5"></div>
                      <div className="w-1 h-1 rounded-full bg-gray-500 group-hover:bg-[#4facfe] m-0.5"></div>
                    </div>
                  </div>

                  {/* Edges - REDUCED SIZE */}
                  <div 
                    className="absolute top-0 left-10 right-10 h-4 cursor-ns-resize z-30 hover:bg-[#4facfe]/10"
                    onMouseDown={(e) => handleResizeStart(e, "n")}
                  />
                  <div 
                    className="absolute bottom-0 left-10 right-10 h-4 cursor-ns-resize z-30 hover:bg-[#4facfe]/10"
                    onMouseDown={(e) => handleResizeStart(e, "s")}
                  />
                  <div 
                    className="absolute left-0 top-10 bottom-10 w-4 cursor-ew-resize z-30 hover:bg-[#4facfe]/10"
                    onMouseDown={(e) => handleResizeStart(e, "w")}
                  />
                  <div 
                    className="absolute right-0 top-10 bottom-10 w-4 cursor-ew-resize z-30 hover:bg-[#4facfe]/10"
                    onMouseDown={(e) => handleResizeStart(e, "e")}
                  />
                </>
              )}
            </motion.div>
          </div>
          </>
        )}
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
          transition: opacity 0.5s ease-out;
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