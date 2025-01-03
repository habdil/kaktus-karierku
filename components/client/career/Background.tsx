// components/client/career/Background.tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import styles from "./Background.module.css";

type FloatingElementProps = {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
};

const FloatingElement = ({ children, delay = 0, duration = 3, className = "" }: FloatingElementProps) => (
  <motion.div
    initial={{ y: 0 }}
    animate={{ y: [-10, 10, -10] }}
    transition={{
      repeat: Infinity,
      duration,
      delay,
      ease: "easeInOut",
    }}
    className={className}
  >
    {children}
  </motion.div>
);

const BackgroundElement = ({ color }: { color: string }) => {
  const [position] = useState({
    left: `${Math.random() * 80 + 10}%`,
    top: `${Math.random() * 80 + 10}%`,
  });

  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ 
        scale: [0.5, 1, 0.5],
        opacity: [0.3, 0.6, 0.3],
      }}
      transition={{
        duration: Math.random() * 3 + 2,
        repeat: Infinity,
        ease: "easeInOut",
        delay: Math.random() * 2,
      }}
      className={`absolute rounded-full ${styles.backgroundElement} ${color} blur-2xl`}
      style={position}
    />
  );
};

const PatternOverlay = () => (
  <div className="absolute inset-0 overflow-hidden opacity-[0.15]">
    <div className={`absolute inset-0 ${styles.patternOverlay}`} />
  </div>
);

const floatingIcons = [
  { icon: "🎯", delay: 0, duration: 4, position: "left-[20%] top-[30%]" },
  { icon: "⭐", delay: 1, duration: 3.5, position: "left-[40%] top-[60%]" },
  { icon: "🚀", delay: 2, duration: 4.5, position: "left-[60%] top-[40%]" },
  { icon: "💡", delay: 0.5, duration: 3.8, position: "left-[80%] top-[70%]" },
  { icon: "🎨", delay: 1.5, duration: 4.2, position: "left-[30%] top-[80%]" },
];

export const Background = () => {
  const [bgLoaded, setBgLoaded] = useState(false);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white" />

      {/* Main background gradient */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-[url('/gamifikasi/background.jpg')] bg-cover bg-center opacity-75 mix-blend-overlay"
          onLoad={() => setBgLoaded(true)}
        />
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <BackgroundElement 
            key={`blue-${i}`} 
            color="bg-blue-200"
          />
        ))}
        {[...Array(2)].map((_, i) => (
          <BackgroundElement 
            key={`purple-${i}`} 
            color="bg-purple-200"
          />
        ))}
        {[...Array(2)].map((_, i) => (
          <BackgroundElement 
            key={`pink-${i}`} 
            color="bg-pink-200"
          />
        ))}
      </div>

      {/* Pattern overlay */}
      <PatternOverlay />

      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingIcons.map((item, index) => (
          <div
            key={index}
            className={`absolute ${item.position}`}
          >
            <FloatingElement
              delay={item.delay}
              duration={item.duration}
              className="text-2xl md:text-3xl"
            >
              {item.icon}
            </FloatingElement>
          </div>
        ))}
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-white/30 backdrop-blur-[1px]" />
      
      {/* Interactive hover effect area */}
      <div className="absolute inset-0 bg-transparent z-10 pointer-events-none" />
    </div>
  );
};

export default Background;