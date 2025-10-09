import React from 'react'
import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="bg-gray-900/90 backdrop-blur-2xl border-b border-gray-800 sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="text-2xl font-bold">
          <Link to="/" className="text-white hover:text-blue-400 transition-all duration-300 flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Premium Store
            </span>
          </Link>
        </div>

        <div className="flex space-x-8">
          <Link 
            to="/" 
            className="text-gray-300 hover:text-white transition-all duration-300 px-4 py-2 rounded-lg hover:bg-gray-800/50 font-medium group relative overflow-hidden"
          >
            <span className="relative z-10">Home</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          </Link>
          <Link 
            to="/about" 
            className="text-gray-300 hover:text-white transition-all duration-300 px-4 py-2 rounded-lg hover:bg-gray-800/50 font-medium group relative overflow-hidden"
          >
            <span className="relative z-10">About</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          </Link>
          <Link 
            to="/card" 
            className="text-gray-300 hover:text-white transition-all duration-300 px-4 py-2 rounded-lg hover:bg-gray-800/50 font-medium group relative overflow-hidden"
          >
            <span className="relative z-10">Products</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar