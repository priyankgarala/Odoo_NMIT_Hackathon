import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CartIcon from './CartIcon'

const Header = () => {
  const navigate = useNavigate()

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl">🛍️</div>
            <span className="text-xl font-bold text-gray-900">Odoo Marketplace</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Products
            </Link>
            <Link 
              to="/profile" 
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              My Profile
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            <CartIcon />
            <button
              onClick={() => navigate('/profile')}
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Profile
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
