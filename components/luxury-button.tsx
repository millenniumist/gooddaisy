'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface LuxuryButtonProps {
  children: React.ReactNode
  onClick?: () => void
}

export function LuxuryButtonComponent({ children, onClick }: LuxuryButtonProps = { children: 'Click Me' }) {
  return (
    <motion.button
      className="relative px-8 py-4 rounded-full font-bold text-white text-lg overflow-hidden transition-all duration-300 ease-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-white"
      style={{
        background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4, #45B7D1)',
        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2), 0 6px 6px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.1)',
        textShadow: '0 1px 1px rgba(0, 0, 0, 0.2)'
      }}
      whileHover={{
        boxShadow: '0 15px 25px rgba(0, 0, 0, 0.3), 0 10px 10px rgba(0, 0, 0, 0.2), inset 0 0 0 1px rgba(255, 255, 255, 0.2)'
      }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      <span className="relative z-10">{children}</span>
      <motion.div
        className="absolute inset-0 bg-white opacity-20"
        style={{ filter: 'blur(15px)' }}
        animate={{
          background: [
            'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)',
            'radial-gradient(circle, rgba(255,255,255,0.8) 100%, rgba(255,255,255,0) 100%)',
            'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)',
          ],
        }}
        transition={{
          repeat: Infinity,
          repeatType: 'reverse',
          duration: 3,
        }}
      />
    </motion.button>
  )
}