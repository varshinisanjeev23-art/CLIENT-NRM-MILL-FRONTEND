import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import services from '../data/services';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { cartCount, openCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [openWhy, setOpenWhy] = useState(false);
  const [openServices, setOpenServices] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const whyItems = [
    { label: 'Savings', to: '/why-nrm/savings', summary: 'Cost efficiency & bulk advantages' },
    { label: 'Sustainability', to: '/why-nrm/sustainability', summary: 'Waste management, eco-friendly processes' }
  ];

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="bg-gray-900/95 text-white shadow-md backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="text-2xl font-extrabold nav-brand tracking-wide" onClick={() => setMobileMenuOpen(false)}>
          NRM
        </Link>

        {/* Desktop Links */}
        <ul className="hidden md:flex space-x-6 items-center">
          <li><Link to="/" className="nav-link hover:text-blue-300">Home</Link></li>
          <li><Link to="/products" className="nav-link hover:text-blue-300">Products</Link></li>
          <li><Link to="/careers" className="nav-link hover:text-blue-300">Careers</Link></li>
          <li className="relative group" onMouseEnter={() => setOpenWhy(true)} onMouseLeave={() => setOpenWhy(false)}>
            <button className="nav-link hover:text-blue-300 flex items-center gap-1">
              Why NRM
              <span className="text-xs">▾</span>
            </button>
            <div className={`${openWhy ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-1 pointer-events-none'} dropdown-panel absolute left-0 top-full pt-3 w-64 bg-white text-gray-800 rounded-xl shadow-2xl z-20 transform-gpu`}>
              <div className="p-3 border-b text-xs uppercase text-gray-500">Explore strengths</div>
              <ul>
                {whyItems.map((item) => (
                  <li key={item.to}>
                    <Link to={item.to} className="block px-4 py-3 hover:bg-gray-100" onClick={() => setOpenWhy(false)}>
                      <div className="text-sm font-semibold">{item.label}</div>
                      <div className="text-xs text-gray-600">{item.summary}</div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </li>
          <li className="relative group" onMouseEnter={() => setOpenServices(true)} onMouseLeave={() => setOpenServices(false)}>
            <button className="nav-link hover:text-blue-300 flex items-center gap-1">
              Services
              <span className="text-xs">▾</span>
            </button>
            <div className={`${openServices ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-1 pointer-events-none'} dropdown-panel absolute left-0 top-full pt-3 w-72 bg-white text-gray-800 rounded-xl shadow-2xl z-20 transform-gpu`}>
              <div className="p-3 border-b text-xs uppercase text-gray-500">Choose a service</div>
              <ul className="max-h-80 overflow-y-auto">
                {services.map((svc) => (
                  <li key={svc.slug}>
                    <Link
                      to={`/services/${svc.slug}`}
                      className="block px-4 py-3 hover:bg-gray-100"
                      onClick={() => setOpenServices(false)}
                    >
                      <div className="text-sm font-semibold">{svc.title}</div>
                      <div className="text-xs text-gray-600 line-clamp-2">{svc.summary}</div>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="border-t p-3 text-center text-sm">
                <Link to="/services" className="text-blue-600 hover:underline" onClick={() => setOpenServices(false)}>View all services</Link>
              </div>
            </div>
          </li>
          {user && <li><Link to="/my-orders" className="nav-link hover:text-blue-300">My Orders</Link></li>}
          <li><Link to="/contact" className="nav-link hover:text-blue-300">Contact Us</Link></li>
        </ul>

        <div className="flex items-center space-x-4">
          <Link 
            to="/cart" 
            onClick={(e) => { e.preventDefault(); openCart(); }}
            className="relative p-2 hover:text-green-400 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-gray-900">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User Section (Hidden on small mobile if needed, but keeping for now) */}
          <div className="hidden sm:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {user.profilePicture ? (
                    <img src={user.profilePicture} alt={user.name} className="w-8 h-8 rounded-full border-2 border-blue-500 shadow-sm" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm">
                      {user.name?.charAt(0)}
                    </div>
                  )}
                  <span className="text-sm font-semibold hidden lg:inline">Hi, {user.name}</span>
                </div>
                <button onClick={handleLogout} className="bg-gradient-to-r from-red-600 to-orange-600 px-3 py-1.5 rounded-lg font-semibold hover:shadow-lg transition-transform hover:-translate-y-0.5 text-sm">Logout</button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="bg-blue-600/20 text-blue-400 border border-blue-500/30 px-3 py-1.5 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-all text-sm">Sign In</Link>
                <Link to="/register" className="bg-green-600 px-3 py-1.5 rounded-lg font-semibold hover:bg-green-700 transition-all text-sm">Sign Up</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-gray-300 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div className={`md:hidden absolute top-16 inset-x-0 bg-gray-900 border-t border-gray-800 transition-all duration-300 origin-top transform ${mobileMenuOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 pointer-events-none'}`}>
        <div className="container mx-auto px-4 py-6 space-y-4">
          <Link to="/" className="block text-lg font-semibold py-2 border-b border-gray-800" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <Link to="/products" className="block text-lg font-semibold py-2 border-b border-gray-800" onClick={() => setMobileMenuOpen(false)}>Products</Link>
          <Link to="/careers" className="block text-lg font-semibold py-2 border-b border-gray-800" onClick={() => setMobileMenuOpen(false)}>Careers</Link>
          
          <div className="py-2 border-b border-gray-800">
            <div className="text-sm uppercase text-gray-500 mb-2">Services</div>
            <div className="grid grid-cols-1 gap-2">
              {services.slice(0, 4).map(svc => (
                <Link key={svc.slug} to={`/services/${svc.slug}`} className="text-sm text-gray-300 hover:text-white" onClick={() => setMobileMenuOpen(false)}>• {svc.title}</Link>
              ))}
              <Link to="/services" className="text-sm text-blue-400 font-bold" onClick={() => setMobileMenuOpen(false)}>View all services →</Link>
            </div>
          </div>

          <div className="py-2 border-b border-gray-800">
            <div className="text-sm uppercase text-gray-500 mb-2">Why NRM</div>
            <div className="grid grid-cols-1 gap-2">
              {whyItems.map(item => (
                <Link key={item.to} to={item.to} className="text-sm text-gray-300 hover:text-white" onClick={() => setMobileMenuOpen(false)}>• {item.label}</Link>
              ))}
            </div>
          </div>

          {user && <Link to="/my-orders" className="block text-lg font-semibold py-2 border-b border-gray-800" onClick={() => setMobileMenuOpen(false)}>My Orders</Link>}
          <Link to="/contact" className="block text-lg font-semibold py-2 border-b border-gray-800" onClick={() => setMobileMenuOpen(false)}>Contact Us</Link>

          {!user && (
            <div className="grid grid-cols-2 gap-4 pt-4">
              <Link to="/login" className="flex items-center justify-center bg-blue-600/20 text-blue-400 border border-blue-500/30 py-3 rounded-xl font-bold" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
              <Link to="/register" className="flex items-center justify-center bg-green-600 py-3 rounded-xl font-bold" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
            </div>
          )}
          {user && (
             <div className="pt-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {user.profilePicture ? (
                    <img src={user.profilePicture} alt={user.name} className="w-10 h-10 rounded-full" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold">{user.name?.charAt(0)}</div>
                  )}
                  <div className="text-gray-300 text-sm">{user.name}</div>
                </div>
                <button onClick={handleLogout} className="text-red-400 font-bold">Logout</button>
             </div>
          )}
        </div>
      </div>
    </nav>
  );
}
