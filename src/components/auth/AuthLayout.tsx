import React, { memo } from 'react';
import { motion } from 'framer-motion';
import backgroundImage1 from '@/assets/backgroundImage1.jpeg';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  showBranding?: boolean;
  brandingContent?: {
    title: string;
    description: string;
    pulseColors: string[];
  };
}

// Logo component for consistent branding
const AuthLogo: React.FC = memo(() => (
  <motion.div 
    className="flex items-center justify-center mb-2"
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ type: "spring", stiffness: 400, damping: 30 }}
  >
    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
      <span className="text-white font-bold text-xl">SQ</span>
    </div>
  </motion.div>
));

AuthLogo.displayName = 'AuthLogo';

/**
 * PulseCircle component for visual enhancement
 */
const PulseCircle: React.FC<{ 
  color: string; 
  delay: number; 
  position: string; 
}> = memo(({ color, delay, position }) => (
  <motion.div
    className={`absolute ${position} w-4 h-4 ${color} rounded-full opacity-60`}
    animate={{
      scale: [1, 1.2, 1],
      opacity: [0.6, 0.8, 0.6],
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      delay: delay,
      ease: "easeInOut"
    }}
  />
));

PulseCircle.displayName = 'PulseCircle';

/**
 * AuthLayout component - Shared layout for all authentication pages
 * Optimized for performance with memoization and hardware acceleration
 */
const AuthLayout: React.FC<AuthLayoutProps> = memo(({ 
  children, 
  title, 
  subtitle, 
  showBranding = true,
  brandingContent
}) => {
  const defaultBrandingContent = {
    title: 'Welcome to StarQuest',
    description: 'Embark on your learning journey through the cosmos. Track your progress, complete quests, and unlock achievements as you grow.',
    pulseColors: ['bg-blue-400', 'bg-purple-400', 'bg-yellow-400']
  };

  const branding = brandingContent || defaultBrandingContent;

  return (
    <div className="min-h-screen w-full max-w-full flex relative overflow-hidden overflow-x-hidden">
      {/* Background Image with Overlay - Optimized for performance */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat w-full max-w-full"
        style={{
          backgroundImage: `url(${backgroundImage1})`,
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden'
        }}
      >
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-[1px]" />
      </div>

      {/* Content Container - Responsive design */}
      <div className="relative z-10 w-full max-w-full flex flex-col xl:flex-row overflow-x-hidden">
        {/* Form Section - Always visible */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 w-full max-w-full">
          <div className="w-full max-w-md mx-auto">
            {/* Form Panel with Glass Effect */}
            <motion.div 
              className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl w-full max-w-full"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30,
                opacity: { duration: 0.3 }
              }}
              style={{
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden'
              }}
            >
              {/* Logo */}
              <div className="mb-6">
                <AuthLogo />
              </div>

              {/* Form Header */}
              <div className="mb-6">
                <motion.h1 
                  className="text-2xl sm:text-3xl font-bold text-white mb-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {title}
                </motion.h1>
                {subtitle && (
                  <motion.p 
                    className="text-slate-400 text-sm sm:text-base leading-relaxed"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {subtitle}
                  </motion.p>
                )}
              </div>

              {/* Form Content */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="w-full max-w-full"
              >
                {children}
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Branding Section - Hidden on mobile/tablet, visible on desktop */}
        {showBranding && (
          <div className="hidden xl:flex flex-1 items-center justify-center p-8 w-full max-w-full">
            <div className="text-center max-w-lg w-full">
              <motion.div 
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl w-full max-w-full"
                initial={{ opacity: 0, x: 20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 30,
                  delay: 0.4
                }}
                style={{
                  transform: 'translateZ(0)',
                  backfaceVisibility: 'hidden'
                }}
              >
                <motion.h2 
                  className="text-3xl xl:text-4xl font-bold text-white mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  {branding.title}
                </motion.h2>
                <motion.p 
                  className="text-slate-300 text-lg xl:text-xl leading-relaxed mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  {branding.description}
                </motion.p>
                
                {/* Animated Pulse Dots */}
                <motion.div 
                  className="relative flex items-center justify-center space-x-4 h-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  {branding.pulseColors.map((color, index) => (
                    <PulseCircle 
                      key={index}
                      color={color}
                      delay={index * 0.5}
                      position="relative"
                    />
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

AuthLayout.displayName = 'AuthLayout';

export default AuthLayout; 