import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Icons as SVG components
const ArrowRightOnRectangleIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const SparklesIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l7 7-7 7M12 3l7 7-7 7" />
  </svg>
);

const ChartBarIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const DocumentCheckIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CogIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const LandingPage = () => {
  const [userEmail, setUserEmail] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    fetch("/.auth/me")
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          setUserEmail(data[0].user_id);
        }
      })
      .catch(err => console.error("Failed to fetch user:", err));
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    window.location.href = '/.auth/logout?post_logout_redirect_uri=' + 
      encodeURIComponent(window.location.origin);
  };

  const AnimatedBackground = () => (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-pink-900/20" />
      <div 
        className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-cyan-400/10 to-blue-600/10 blur-3xl"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
          transition: 'all 0.3s ease'
        }}
      />
      <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-gradient-to-r from-purple-400/10 to-pink-600/10 blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-20 w-80 h-80 rounded-full bg-gradient-to-r from-emerald-400/10 to-teal-600/10 blur-3xl animate-pulse delay-1000" />
      
      {/* Floating particles */}
      {typeof window !== 'undefined' && [...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/20 rounded-full"
          initial={{ 
            x: Math.random() * (window.innerWidth || 1000), 
            y: Math.random() * (window.innerHeight || 1000)
          }}
          animate={{
            y: [null, -20, 20, -20],
            opacity: [0.2, 0.8, 0.2, 0.8]
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2
          }}
        />
      ))}
    </div>
  );

  const GlowingButton = ({ children, className, ...props }) => (
    <motion.button
      className={`relative overflow-hidden group ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-600/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300" />
      <div className="relative z-10">{children}</div>
    </motion.button>
  );

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <AnimatedBackground />
      
      {/* Glassmorphism Header */}
      <motion.header 
        className="relative z-50 backdrop-blur-xl bg-white/5 border-b border-white/10"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex items-center justify-between px-4 sm:px-8 py-4">
          {userEmail && (
            <motion.div 
              className="flex items-center space-x-3 bg-white/10 backdrop-blur-lg rounded-2xl px-4 py-2 border border-white/20"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="relative">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {userEmail.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full animate-pulse" />
              </div>
              <span className="text-sm font-medium text-white/90 truncate max-w-[120px] sm:max-w-full">
                {userEmail}
              </span>
            </motion.div>
          )}
          
          {/* Mobile menu button */}
          <motion.button 
            className="md:hidden relative z-50 w-10 h-10 flex items-center justify-center bg-white/10 backdrop-blur-lg rounded-xl border border-white/20"
            onClick={toggleMobileMenu}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              animate={{ rotate: mobileMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {mobileMenuOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </motion.div>
          </motion.button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex items-center space-x-6">
              {[
                { to: "/", label: "Home" },
                { to: "/view-data", label: "View Data" },
                { to: "/Analytics", label: "Dashboard" },
                { to: "/admin", label: "Admin" }
              ].map((item, index) => (
                <motion.div
                  key={item.to}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <a 
                    href={item.to} 
                    className="relative px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-all duration-300 group"
                  >
                    <span className="relative z-10">{item.label}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 to-blue-600/0 group-hover:from-cyan-400/20 group-hover:to-blue-600/20 rounded-lg transition-all duration-300" />
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-600 group-hover:w-full transition-all duration-300" />
                  </a>
                </motion.div>
              ))}
            </nav>
            
            {userEmail && (
              <GlowingButton
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-sm font-medium text-white hover:bg-white/20 transition-all duration-300"
              >
                <ArrowRightOnRectangleIcon className="h-3 w-3 mr-2" />
                Logout
              </GlowingButton>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden backdrop-blur-xl bg-black/40 border-t border-white/10"
            >
              <nav className="px-4 py-4 space-y-2">
                {[
                  { to: "/", label: "Home" },
                  { to: "/view-data", label: "View Data" },
                  { to: "/Analytics", label: "Dashboard" },
                  { to: "/admin", label: "Admin" }
                ].map((item, index) => (
                  <motion.div
                    key={item.to}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <a 
                      href={item.to} 
                      className="block px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                      onClick={toggleMobileMenu}
                    >
                      {item.label}
                    </a>
                  </motion.div>
                ))}
                
                {userEmail && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="pt-4 border-t border-white/10"
                  >
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-all duration-300"
                    >
                      {/* <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" /> */}
                      Logout
                    </button>
                  </motion.div>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Hero Section */}
      <section className="relative z-10 text-center py-32 px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-5xl mx-auto"
        >
          <motion.div
            className="inline-flex items-center px-4 py-2 mb-8 bg-white/10 backdrop-blur-lg rounded-full border border-white/20"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <SparklesIcon className="w-4 h-4 mr-2 text-cyan-400" />
            <span className="text-sm font-medium text-white/90">Bodyline-Digital Excellence</span>
          </motion.div>
          
          <motion.h1
            className="text-6xl sm:text-8xl font-black mb-8 bg-gradient-to-r from-white via-cyan-200 to-blue-400 bg-clip-text text-transparent leading-tight"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            FCA
            <motion.span 
              className="block text-4xl sm:text-4xl font-medium text-white/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              Factory Certified Audit Platform
            </motion.span>
          </motion.h1>
          
          <motion.p
            className="text-xl text-white/70 mb-12 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
Welcome to the FCA platform. Click on get started for the guide.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
          >
            <a href="/get-started">
              <GlowingButton className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl font-bold text-lg shadow-2xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300">
                Get Started
                <motion.div
                  className="inline-block ml-2"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.div>
              </GlowingButton>
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <motion.section
        className="relative z-10 px-4 sm:px-8 max-w-7xl mx-auto pb-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* FCA Inline */}
          <motion.div
            className="group relative"
            whileHover={{ y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <a href="/fca-inline" className="block">
              <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-cyan-400/50 transition-all duration-500 overflow-hidden">
                {/* Default gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-blue-600/10 opacity-100 group-hover:opacity-0 transition-opacity duration-500" />
                
                {/* Hover image background */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-all duration-500 bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage: "url('/in2.svg')"
                  }}
                />
                
                <div className="relative z-10">
                  <div className="h-48 mb-6 flex items-center justify-center">
                    <motion.div
                      className="relative"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="w-32 h-32 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-cyan-500/20 overflow-hidden group-hover:bg-white/20 transition-all duration-500">
                        {/* Image inside box (default state) */}
                        <img 
                          src="/in.svg" 
                          alt="FCA Inline"
                          className="w-20 h-20 object-cover rounded-2xl opacity-100  transition-opacity duration-300"
                        />
                        {/* Icon appears on hover */}
                      {/*  <ChartBarIcon className="w-16 h-16 text-white absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300" /> */}
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-400 rounded-full animate-pulse" />
                    </motion.div>
                  </div>
                  
                  <h2 className="text-2xl font-bold mb-3 text-white group-hover:text-cyan-400 transition-colors duration-300">
                    FCA Inline
                  </h2>
                  <p className="text-white/60 group-hover:text-white/80 transition-colors duration-300">
                    Real-time inline audit processing 
                  </p>
                  
                  <div className="mt-6 flex items-center text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300">
                    <span className="text-sm font-medium">Start Audit</span>
                    <motion.div
                      className="ml-2"
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.div>
                  </div>
                </div>
              </div>
            </a>
          </motion.div>

          {/* FCA Endline */}
          <motion.div
            className="group relative"
            whileHover={{ y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <a href="/fca-endline" className="block">
              <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-[#34a0a4]/50 transition-all duration-500 overflow-hidden">
                {/* Default gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#34a0a4]/10 to-[#34a0a4]/10 opacity-100 group-hover:opacity-0 transition-opacity duration-500" />
                
                {/* Hover image background */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-all duration-500 bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage: "url('/end.svg')"
                  }}
                />
                
                <div className="relative z-10">
                  <div className="h-48 mb-6 flex items-center justify-center">
                    <motion.div
                      className="relative"
                      whileHover={{ scale: 1.1, rotate: -5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="w-32 h-32 bg-gradient-to-br from-[#457b9d] to-[#34a0a4] rounded-3xl flex items-center justify-center shadow-2xl shadow-[#34a0a4]/20 overflow-hidden group-hover:bg-white/20 transition-all duration-500">
                        {/* Image inside box (default state) */}
                        <img 
                          src="/end2.svg" 
                          alt="FCA Endline"
                          className="w-20 h-20 object-cover rounded-2xl opacity-100  transition-opacity duration-300"
                        />
                        {/* Icon appears on hover */}
                      {/*   <DocumentCheckIcon className="w-16 h-16 text-white absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300" /> */}
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-pulse" />
                    </motion.div>
                  </div>
                  
                  <h2 className="text-2xl font-bold mb-3 text-white group-hover:text-[#34a0a4] transition-colors duration-300">
                    FCA Endline
                  </h2>
                  <p className="text-white/60 group-hover:text-white/80 transition-colors duration-300">
                    Comprehensive endline audit 
                  </p>
                  
                  <div className="mt-6 flex items-center text-[#34a0a4] group-hover:text-[#34a0a4] transition-colors duration-300">
                    <span className="text-sm font-medium">Begin Endline</span>
                    <motion.div
                      className="ml-2"
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.div>
                  </div>
                </div>
              </div>
            </a>
          </motion.div>

          {/* Final Audit - Coming Soon */}
          <motion.div
            className="group relative"
            whileHover={{ y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-teal-600/5" />
              
              <div className="relative z-10">
                <div className="h-48 mb-6 flex items-center justify-center">
                  <motion.div
                    className="relative"
                    animate={{ 
                      scale: [1, 1.05, 1],
                      rotate: [0, 2, -2, 0]
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  >
                    <div className="w-32 h-32 bg-gradient-to-br from-emerald-400/30 to-teal-600/30 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/10 border border-emerald-400/20">
                      <CogIcon className="w-16 h-16 text-emerald-400/70" />
                    </div>
                    <div className="absolute top-2 right-2">
                      <motion.div
                        className="px-2 py-1 text-xs font-bold text-emerald-300 bg-emerald-400/20 rounded-full border border-emerald-400/30"
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        Coming Soon
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
                
                <h2 className="text-2xl font-bold mb-3 text-white/70">
                  Final Audit
                </h2>
                <p className="text-white/50 mb-4">
                   Final Audit module is under development. Stay tuned!
                </p>
                
                <div className="flex items-center text-emerald-400/70">
                  <span className="text-sm font-medium">In Development</span>
                  <motion.div
                    className="ml-2"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    ⚡
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer 
        className="relative z-10 mt-20 py-8 backdrop-blur-xl bg-white/5 border-t border-white/10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <div className="max-w-6xl mx-auto px-8 flex items-left justify-between">
          <motion.div 
            className="flex items-left "
            whileHover={{ scale: 1.05 }}
          >
            
             <img 
              src="/JV White@4x.png" 
              alt="Bodyline Logo" 
              className="h-9 w-40 mr-3"
            />
           
           
          </motion.div>
          
          <div className="text-right">
            <p className="text-white/80 text-sm font-medium">
              © {new Date().getFullYear()} FCA App
            </p>
            <p className="text-white/50 text-xs">
              Bodyline Digital Excellence
            </p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default LandingPage;