'use client'

import { useState } from 'react'
import Link from 'next/link'

const Header = ({ menuItems }) => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleToggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <header className="fixed top-0 z-50 left-0 right-0 bg-gradient-to-r from-fuchsia-600 to-indigo-900 shadow-lg backdrop-filter backdrop-blur-lg bg-opacity-40">
      <div className="max-w-5xl mx-auto px-6 py-2 flex justify-between items-center">
        <Link href={'/'} className="text-2xl font-bold text-white">
          Social Automation
        </Link>
        <div className="hidden md:flex space-x-4">
          {menuItems.map((item, index) => (
            <Link
              href={item.link}
              key={index}
              className="bg-white text-indigo-800 rounded-md px-4 py-2 hover:bg-indigo-200 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="md:hidden">
          <button
            className="text-white rounded-full p-2 hover:bg-indigo-700 transition-colors"
            onClick={handleToggleMobileMenu}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="M3 12h18M3 6h18M3 18h18"></path>
            </svg>
          </button>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="bg-white py-2 absolute top-full left-0 right-0 z-50">
          {menuItems.map((item, index) => (
            <Link href={item.link} key={index}>
              <div
                onClick={handleToggleMobileMenu}
                className="w-full text-center text-indigo-800 py-2 hover:bg-indigo-200 transition-colors"
              >
                {item.label}
              </div>
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}

export default Header
