import { Link } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { CartContext } from '../context/CartContext';
import heroBg from '../assets/images/hero-bg.png';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const { addToCart } = useContext(CartContext);

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/products');
        setProducts(res.data);
      } catch (err) {
        console.error('Failed to load products', err);
      }
    })();

    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev === 0 ? 1 : 0));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#f8faf8]">
      {/* Hero Slider Section */}
      <section className="relative overflow-hidden min-h-[420px] flex items-center mb-12">
        
        {/* Slide 1: Premium Rice Banner (Millet Style) */}
        <div className={`absolute inset-0 transition-opacity duration-1000 flex items-center ${currentSlide === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
          <div className="absolute inset-0 bg-[#3a5a2e]">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0 100 C 20 0 50 0 100 100 V 100 H 0 Z" fill="white" />
              </svg>
            </div>
          </div>
          
          <div className="container mx-auto px-6 py-12 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="lg:w-1/2 text-center lg:text-left space-y-6">
              <div className="space-y-1">
                <h1 className="text-4xl md:text-6xl font-black text-[#fbc02d] leading-none tracking-tight">
                  Healthy Premium <br />
                  <span className="text-white">Rice Varieties</span>
                </h1>
                <div className="h-1 w-24 bg-white/20 rounded-full mx-auto lg:mx-0"></div>
              </div>
              <div className="bg-white text-[#3a5a2e] inline-block px-6 py-2 rounded-full font-black text-lg md:text-xl shadow-xl">
                Nutritious Varieties of Original Rice
              </div>
              <p className="text-white/90 text-lg font-bold tracking-wide">
                Tasty | Healthy | Easy to Cook
              </p>
              <div>
                <Link to="/products" className="inline-block bg-white text-black px-10 py-3 rounded-full font-black text-xl uppercase tracking-tighter hover:scale-105 transition-transform shadow-lg">
                  SHOP NOW
                </Link>
              </div>
            </div>

            <div className="lg:w-1/2 relative hidden lg:block">
               <div className="flex flex-wrap justify-center -space-x-10">
                  {products.filter(p => p.category === 'Rice').slice(0, 4).map((p, i) => (
                    <div key={p._id} className="w-40 h-52 bg-white rounded-xl shadow-2xl p-2 transform transition-all duration-300 relative group"
                      style={{ zIndex: 10 + i, marginTop: i % 2 === 0 ? '0' : '30px' }}
                    >
                      <img src={`${import.meta.env.VITE_API_BASE_URL || 'https://rice-mill-backend.onrender.com'}${p.imageUrl}`} className="w-full h-full object-cover rounded-lg" alt={p.name} />
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>

        {/* Slide 2: Old Image Banner (NRM Excellence) */}
        <div className={`absolute inset-0 transition-opacity duration-1000 flex items-center ${currentSlide === 1 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
          <div className="absolute inset-0">
            <img src={heroBg} alt="Rice Field" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
          </div>
          
          <div className="container mx-auto px-6 py-12 relative z-10 text-left">
            <div className="max-w-3xl space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/20 backdrop-blur-md rounded-full border border-green-400/30 text-green-300 text-[10px] font-black uppercase tracking-[0.2em]">
                Tradition Meets Technology
              </div>
              <h2 className="text-4xl md:text-7xl font-black text-white leading-[1.1] tracking-tighter">
                NRM <span className="text-green-500">Rice Mill</span><br />
                Excellence
              </h2>
              <p className="text-lg md:text-xl text-gray-200 max-w-xl font-medium leading-relaxed opacity-90">
                Premium rice processing with state-of-the-art milling technology. We deliver the purest grains from the heart of local farms to your table.
              </p>
              <div className="pt-4">
                <Link to="/products" className="inline-block bg-green-600 text-white px-10 py-3 rounded-full font-black text-xl uppercase tracking-tighter hover:bg-green-700 transition-colors shadow-lg">
                  DISCOVER MORE
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Slider Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {[0, 1].map(i => (
            <button 
              key={i} 
              onClick={() => setCurrentSlide(i)}
              className={`w-3 h-3 rounded-full transition-all ${currentSlide === i ? 'bg-white w-8' : 'bg-white/40'}`}
            />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 -mt-20 relative z-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center transform hover:scale-105 transition-transform duration-300 border border-amber-100">
              <div className="text-5xl font-extrabold text-amber-600 mb-2">500+</div>
              <div className="text-gray-600 font-medium">Happy Clients</div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center transform hover:scale-105 transition-transform duration-300 border border-green-100">
              <div className="text-5xl font-extrabold text-green-600 mb-2">99%</div>
              <div className="text-gray-600 font-medium">Success Rate</div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center transform hover:scale-105 transition-transform duration-300 border border-orange-100">
              <div className="text-5xl font-extrabold text-orange-600 mb-2">24/7</div>
              <div className="text-gray-600 font-medium">Support Available</div>
            </div>
          </div>
        </div>
      </section>



      {/* Why NRM Section */}
      <section className="py-20 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-orange-600">Why Choose NRM?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 group border-t-4 border-amber-500">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">Cost Savings</h3>
              <p className="text-gray-600 leading-relaxed">Save up to 30% with our optimized bulk processing and efficient workflows.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 group border-t-4 border-green-500">
              <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">Eco-Friendly</h3>
              <p className="text-gray-600 leading-relaxed">Sustainable chemicals, water recycling, and reduced carbon footprint.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 group border-t-4 border-orange-500">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">Fast Processing</h3>
              <p className="text-gray-600 leading-relaxed">24-72 hour turnaround with real-time tracking and updates.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 group border-t-4 border-yellow-500">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">Quality Assured</h3>
              <p className="text-gray-600 leading-relaxed">ISO certified processes with 99% customer satisfaction rate.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-orange-600">Professional Rice Milling Solutions</h2>
          <p className="text-gray-600 text-lg mb-10 max-w-3xl mx-auto">From paddy to polished rice, we handle all varieties with precision and care.</p>
          <Link to="/services" className="inline-flex items-center gap-2 text-amber-600 text-xl font-bold hover:gap-4 transition-all duration-300 group">
            Explore All Services
            <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9InNtYWxsR3JpZCIgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDgwIDAgTCAwIDAgMCA4MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNzbWFsbEdyaWQpIi8+PC9zdmc+')] opacity-30"></div>

        <div className="container mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-extrabold mb-6 text-white uppercase tracking-tighter">Ready to Process Your Grains?</h2>
          <p className="text-xl md:text-2xl mb-10 text-blue-100 max-w-3xl mx-auto">Join hundreds of satisfied rice farmers and traders. Book online, track in real-time, download invoices instantly.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="group px-12 py-5 bg-white text-indigo-600 rounded-xl text-xl font-bold shadow-2xl hover:shadow-white/30 hover:scale-105 transition-all duration-300">
              <span className="flex items-center justify-center gap-2">
                Create Free Account
                <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
            <Link to="/contact" className="px-12 py-5 border-2 border-white text-white rounded-xl text-xl font-bold hover:bg-white hover:text-indigo-600 transition-all duration-300">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
