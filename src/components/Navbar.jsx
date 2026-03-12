import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import services from '../data/services';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { cartCount, openCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [openServices, setOpenServices] = useState(false);
  const [openWhy, setOpenWhy] = useState(false);

  const whyItems = [
    { label: 'Savings', to: '/why-nrm/savings', summary: 'Cost efficiency & bulk advantages' },
    { label: 'Sustainability', to: '/why-nrm/sustainability', summary: 'Waste management, eco-friendly processes' }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-gray-900/95 text-white shadow-md backdrop-blur-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="text-2xl font-extrabold nav-brand tracking-wide">
          NRM
        </Link>
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
        <div className="flex items-center space-x-6">
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

          {user ? (
            <div className="flex items-center space-x-4">
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
              <Link to="/login" className="bg-blue-600/20 text-blue-400 border border-blue-500/30 px-3 py-1.5 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-all">Sign In</Link>
              <Link to="/register" className="bg-green-600 px-3 py-1.5 rounded-lg font-semibold hover:bg-green-700 transition-all">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
