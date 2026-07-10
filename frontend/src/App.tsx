import React from 'react';
import { motion } from 'framer-motion';

function App() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" }
    },
  };

  return (
    <div className="min-h-screen bg-[#0d0d12] text-white font-sans overflow-hidden">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex justify-between items-center p-6 lg:px-24"
      >
        <img
          src="/assets/Logo_SOKENS_DIGITAL-removebg-preview.png"
          alt="Sokens Digital"
          className="h-10 object-contain"
        />
        <div className="hidden md:flex gap-8 text-gray-400">
          <a href="#" className="hover:text-white transition-colors">Services</a>
          <a href="#" className="hover:text-white transition-colors">Work</a>
          <a href="#" className="hover:text-white transition-colors">About</a>
        </div>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full transition-colors font-medium relative overflow-hidden group">
          <span className="relative z-10">Get in Touch</span>
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
        </button>
      </motion.nav>

      {/* Hero Section */}
      <main className="relative pt-32 pb-16 lg:pt-48 lg:pb-32 px-6 lg:px-24 text-center">
        {/* Glow Effects */}
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none"
        ></motion.div>
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-0 right-0 w-[500px] h-[500px] bg-pink-900/20 rounded-full blur-[100px] pointer-events-none"
        ></motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-4xl mx-auto"
        >
          <motion.h1 variants={itemVariants} className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
            Elevating Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400">
              Digital Presence
            </span>
          </motion.h1>
          <motion.p variants={itemVariants} className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            We craft stunning, high-performance web applications and digital solutions that drive growth and captivate your audience.
          </motion.p>
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-black px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              Start a Project
            </button>
            <button className="border border-gray-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:border-gray-400 transition-colors bg-white/5 backdrop-blur-sm">
              Our Services
            </button>
          </motion.div>
        </motion.div>

        {/* Mockup / Visual element */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
          className="mt-24 relative z-10 w-full max-w-5xl mx-auto"
        >
          <motion.div 
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="aspect-[16/9] rounded-2xl bg-gradient-to-br from-gray-800/80 to-black/80 border border-gray-700/50 shadow-2xl overflow-hidden relative backdrop-blur-xl"
          >
            <div className="absolute inset-0 bg-purple-500/10 mix-blend-overlay"></div>
            <div className="flex items-center justify-center h-full text-gray-500 text-xl font-medium tracking-widest">
              [ Interactive Dashboard / Showcase Graphic ]
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}

export default App;
