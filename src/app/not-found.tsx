'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, Leaf, AlertCircle, ChevronRight, Home, Mail } from 'lucide-react';

export default function NotFoundFrench() {
  // Fixed type declaration to allow string values
  const [isHovering, setIsHovering] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [rotationDegree, setRotationDegree] = useState(0);
  const [animateRefresh, setAnimateRefresh] = useState(false);
  const [leafPosition, setLeafPosition] = useState({ x: 0, y: 0 });
  const [showParticles, setShowParticles] = useState(false);
  
  // Ecology'B corporate colors
  const colors = {
    white: '#ffffff',
    lightBlue: '#bfddf9',
    lightGreen: '#d2fcb2',
    darkBlue: '#213f5b'
  };

  useEffect(() => {
    // Stagger animations for a more polished experience
    setTimeout(() => setIsLoaded(true), 100);
    setTimeout(() => setShowParticles(true), 1200);
    
    // Enhanced 404 animation sequence
    const animateNumber = () => {
      setRotationDegree(2.5);
      setTimeout(() => setRotationDegree(-1.8), 400);
      setTimeout(() => setRotationDegree(1.2), 800);
      setTimeout(() => setRotationDegree(0), 1200);
    };
    
    setTimeout(animateNumber, 800);
    
    // Floating leaf animation with improved natural movement
    const leafInterval = setInterval(() => {
      setLeafPosition({
        x: Math.sin(Date.now() / 1000) * 20,
        y: Math.cos(Date.now() / 1500) * 10 + (Math.sin(Date.now() / 800) * 5)
      });
    }, 50);
    
    return () => clearInterval(leafInterval);
  }, []);

  const handleRefresh = () => {
    setAnimateRefresh(true);
    setTimeout(() => setAnimateRefresh(false), 800);
    window.location.reload();
  };

  // Generate random particles for background effect
  const renderParticles = () => {
    const particles = [];
    for (let i = 0; i < 20; i++) {
      const size = Math.random() * 6 + 2;
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const animDuration = Math.random() * 20 + 10;
      const delay = Math.random() * 5;
      const color = i % 2 === 0 ? colors.lightGreen : colors.lightBlue;
      
      particles.push(
        <div 
          key={i}
          className={`absolute rounded-full transition-opacity duration-1000 ${showParticles ? 'opacity-40' : 'opacity-0'}`}
          style={{
            width: `${size}px`,
            height: `${size}px`,
            left: `${left}%`,
            top: `${top}%`,
            backgroundColor: color,
            filter: 'blur(1px)',
            animation: `float ${animDuration}s ease-in-out ${delay}s infinite alternate`
          }}
        />
      );
    }
    return particles;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white overflow-hidden relative">
      {/* Animated floating particles */}
      {renderParticles()}
      
      {/* Enhanced background gradient */}
      <div className="absolute inset-0 bg-opacity-30" 
           style={{
             background: `
               radial-gradient(circle at 70% 20%, ${colors.lightBlue}40, transparent 35%), 
               radial-gradient(circle at 30% 70%, ${colors.lightGreen}30, transparent 35%),
               radial-gradient(circle at 90% 90%, ${colors.darkBlue}10, transparent 20%)
             `
           }}>
      </div>
      
      {/* Enhanced glass effect container */}
      <div className="relative z-10 w-full max-w-3xl mx-auto px-8 pt-12 pb-16 rounded-2xl shadow-xl backdrop-blur-sm"
           style={{
             backgroundColor: 'rgba(255, 255, 255, 0.85)', 
             border: `1px solid ${colors.lightBlue}50`,
             boxShadow: `0 10px 30px -10px ${colors.darkBlue}20, 0 0 10px ${colors.lightBlue}30`,
           }}>
        
        {/* Ecology'B enhanced logo/branding */}
        <div className="absolute top-6 left-6 flex items-center">
          <div className={`relative transition-all duration-700 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
            <Leaf 
              size={26} 
              style={{
                color: colors.darkBlue, 
                filter: `drop-shadow(0 0 6px ${colors.lightGreen})`
              }} 
              className="mr-2"
              strokeWidth={2.5}
            />
            <div className="absolute w-6 h-6 rounded-full -top-1 -left-1" 
                 style={{
                   backgroundColor: colors.lightGreen,
                   opacity: 0.3,
                   filter: 'blur(8px)',
                   animation: 'pulse 3s infinite'
                 }} 
            />
          </div>
          <div>
            <h3 className={`text-lg font-bold tracking-tight transition-all duration-700 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                style={{color: colors.darkBlue}}>
              Ecology&apos;B
            </h3>
            <div className={`h-0.5 w-0 transition-all duration-700 delay-300 ${isLoaded ? 'w-full opacity-100' : 'opacity-0'}`}
                 style={{backgroundColor: colors.lightGreen}} />
          </div>
        </div>
        
        {/* Multiple floating decorative leaves */}
        <div className="absolute" 
             style={{
               top: `calc(20% + ${leafPosition.y}px)`,
               right: `calc(15% + ${leafPosition.x}px)`,
               transform: 'rotate(25deg)',
               opacity: 0.7,
               filter: `drop-shadow(0 0 8px ${colors.lightGreen})`
             }}>
          <Leaf size={40} style={{color: colors.lightGreen}} strokeWidth={1} />
        </div>
        
        <div className="absolute" 
             style={{
               bottom: `calc(20% + ${leafPosition.y * -0.7}px)`,
               left: `calc(10% + ${leafPosition.x * -0.5}px)`,
               transform: 'rotate(-15deg)',
               opacity: 0.4,
               filter: `drop-shadow(0 0 8px ${colors.lightGreen})`
             }}>
          <Leaf size={28} style={{color: colors.lightGreen}} strokeWidth={1} />
        </div>
        
        {/* Main content */}
        <div className="mt-16">
          {/* Enhanced 404 with animated elements */}
          <div className="relative flex justify-center mb-14">
            <div className="absolute -top-20 -left-20 w-40 h-40 rounded-full opacity-60"
                 style={{
                   background: `radial-gradient(circle, ${colors.lightGreen}80, transparent 70%)`,
                   filter: 'blur(25px)',
                   animation: 'pulse 8s infinite alternate'
                 }}></div>
            
            <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full opacity-50"
                 style={{
                   background: `radial-gradient(circle, ${colors.lightBlue}90, transparent 70%)`,
                   filter: 'blur(20px)',
                   animation: 'pulse 6s infinite alternate-reverse'
                 }}></div>
                
            <h1 
              className="text-9xl md:text-9xl font-black transition-all duration-300 ease-in-out relative z-10"
              style={{ 
                transform: `rotate(${rotationDegree}deg)`,
                color: colors.darkBlue,
                textShadow: `3px 3px 0 ${colors.lightBlue}, 6px 6px 0 ${colors.lightGreen}30`,
                letterSpacing: '0.05em'
              }}
            >
              404
              
              {/* Character by character animation for 404 */}
              <span className="absolute inset-0 flex justify-center overflow-hidden">
                {['4', '0', '4'].map((char, index) => (
                  <span 
                    key={index}
                    className="inline-block opacity-0"
                    style={{
                      color: 'transparent',
                      textShadow: `0 0 5px ${colors.lightGreen}`,
                      animation: `fadeInOut 3s ${index * 0.2}s infinite alternate`,
                      WebkitBackgroundClip: 'text'
                    }}
                  >
                    {char}
                  </span>
                ))}
              </span>
              
              {/* First-time page load decorative effect */}
              <div className={`absolute -inset-4 rounded-full transition-all duration-700 ${isLoaded ? 'scale-0 opacity-0' : 'scale-100 opacity-40'}`}
                   style={{
                     background: `radial-gradient(circle, ${colors.lightBlue}, transparent 70%)`,
                     filter: 'blur(30px)'
                   }}></div>
            </h1>
            
            <div className={`absolute -top-2 -right-2 transition-all duration-300 ease-in-out ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}>
              <AlertCircle 
                size={28} 
                style={{color: colors.darkBlue}}
                className="animate-pulse"
              />
            </div>
          </div>

          {/* Error message with enhanced typography and transitions */}
          <div className={`text-center transition-all duration-1000 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight" 
                style={{
                  color: colors.darkBlue,
                  textShadow: `0 1px 1px ${colors.lightBlue}80`
                }}>
              Oups ! Page introuvable.
            </h2>
            
            <p className="text-gray-600 max-w-lg mx-auto mb-8 text-lg leading-relaxed">
              La page que vous recherchez semble avoir disparu dans notre écosystème numérique.
              <span className="block mt-2">Nos experts en biodiversité digitale sont déjà à sa recherche.</span>
            </p>

            {/* Enhanced stylized divider */}
            <div className="flex items-center justify-center mb-10">
              <div className="h-px w-24 bg-gradient-to-r from-transparent to-gray-300"></div>
              <div className="relative mx-4">
                <Leaf size={22} style={{color: colors.darkBlue}} className="rotate-12" />
                <div className="absolute inset-0 scale-75 rotate-45 opacity-30"
                     style={{color: colors.lightGreen}}>
                  <Leaf size={22} />
                </div>
              </div>
              <div className="h-px w-24 bg-gradient-to-l from-transparent to-gray-300"></div>
            </div>

            {/* Enhanced action buttons with ripple effect */}
            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-12">
              <Link 
                href="/" 
                className={`group relative flex items-center justify-center gap-2 py-4 px-8 rounded-lg font-medium transition-all duration-300 overflow-hidden ${isHovering === 'login' ? 'shadow-lg scale-[1.03]' : 'shadow-md'}`}
                style={{
                  backgroundColor: colors.darkBlue,
                  color: colors.white,
                }}
                onMouseEnter={() => setIsHovering('login')}
                onMouseLeave={() => setIsHovering(null)}
              >
                {/* Ripple effect background */}
                <div className="absolute inset-0 w-full h-full transition-all duration-300 scale-x-0 origin-left group-hover:scale-x-100"
                     style={{
                       background: `linear-gradient(to right, transparent, ${colors.darkBlue}AA, ${colors.darkBlue})`
                     }}></div>
                     
                {/* Button content on top */}
                <div className="relative flex items-center justify-center gap-2">
                  <ArrowLeft size={18} className={`transition-transform duration-300 ${isHovering === 'login' ? 'transform -translate-x-1' : ''}`} />
                  <span>Retour à la page de connexion</span>
                </div>
                
                {/* Bottom accent bar */}
                {isHovering === 'login' && 
                  <div className="absolute bottom-0 left-0 w-full h-1 rounded-b-lg transition-all duration-300" 
                       style={{backgroundColor: colors.lightGreen}}></div>
                }
              </Link>
              
              <button 
                onClick={handleRefresh}
                className={`group relative flex items-center justify-center gap-2 py-4 px-8 rounded-lg font-medium transition-all duration-300 overflow-hidden ${isHovering === 'refresh' ? 'shadow-md scale-[1.03]' : ''}`}
                style={{
                  backgroundColor: colors.white,
                  color: colors.darkBlue,
                  border: `2px solid ${isHovering === 'refresh' ? colors.lightGreen : colors.lightBlue}`
                }}
                onMouseEnter={() => setIsHovering('refresh')}
                onMouseLeave={() => setIsHovering(null)}
              >
                {/* Subtle background highlight */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                     style={{backgroundColor: colors.lightGreen}}></div>
                     
                <div className="relative flex items-center gap-2">
                  <RefreshCw 
                    size={18} 
                    className={`transition-all duration-300 ${animateRefresh ? 'animate-spin' : isHovering === 'refresh' ? 'rotate-45' : ''}`} 
                  />
                  <span>Rafraîchir la page</span>
                </div>
              </button>
            </div>
            
            {/* Enhanced help options with better animations */}
            <div className={`transition-all duration-1000 delay-400 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <p className="text-gray-500 text-sm mb-4 font-medium">Vous pouvez également :</p>
              
              <div className="flex flex-wrap justify-center gap-3">
                {[
                  {label: 'Nos solutions écologiques', href: 'https://www.ecologyb.fr/', icon: <Leaf size={14} />},
                  {label: 'À propos d\'Ecology\'B', href: 'https://www.ecologyb.fr/contact', icon: <Home size={14} />},
                  {label: 'Contacter le support', href: 'https://www.ecologyb.fr/contact', icon: <Mail size={14} />}
                ].map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
                    className={`group flex items-center px-5 py-2.5 rounded-full text-sm transition-all duration-300 ${isHovering === `link-${index}` ? 'shadow-md' : ''}`}
                    style={{
                      backgroundColor: isHovering === `link-${index}` ? (index % 2 === 0 ? colors.lightGreen : colors.lightBlue) : 'transparent',
                      color: colors.darkBlue,
                      border: `1px solid ${index % 2 === 0 ? colors.lightGreen : colors.lightBlue}`
                    }}
                    onMouseEnter={() => setIsHovering(`link-${index}`)}
                    onMouseLeave={() => setIsHovering(null)}
                  >
                    <span className={`mr-1.5 transition-all duration-300 ${isHovering === `link-${index}` ? 'opacity-100 scale-100' : 'opacity-70 scale-90'}`}>
                      {item.icon}
                    </span>
                    {item.label}
                    <ChevronRight 
                      size={14} 
                      className={`ml-1.5 transition-transform duration-300 ${isHovering === `link-${index}` ? 'transform translate-x-1 opacity-100' : 'opacity-50'}`} 
                    />
                    
                    {/* Hover gradient overlay */}
                    <div className="absolute bottom-0 left-0 w-0 h-full group-hover:w-full rounded-full transition-all duration-700 -z-10 opacity-10"
                      style={{
                        background: `linear-gradient(to right, ${index % 2 === 0 ? colors.lightGreen : colors.lightBlue}, transparent)`
                      }}></div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Enhanced footer */}
        <div className={`absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-center px-8 py-3 rounded-full shadow-lg transition-all duration-1000 delay-600 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
             style={{
               backgroundColor: 'rgba(255, 255, 255, 0.9)',
               backdropFilter: 'blur(5px)',
               border: `1px solid ${colors.lightBlue}40`
             }}>
          <p className="text-sm font-medium" style={{color: colors.darkBlue}}>
            © 2025 Ecology&apos;B — Ensemble pour un avenir durable
          </p>
        </div>
      </div>
      
      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px) translateX(0px); }
          100% { transform: translateY(-15px) translateX(5px); }
        }
        
        @keyframes pulse {
          0% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.05); }
          100% { opacity: 0.3; transform: scale(1); }
        }
        
        @keyframes fadeInOut {
          0% { opacity: 0; }
          50% { opacity: 0.7; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
