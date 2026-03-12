import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function PolishingPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await api.get('/products?processType=polishing');
      setProducts(res.data);
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden py-24 px-4 bg-gradient-to-r from-purple-600 to-pink-700 mb-12">
        <div className="container mx-auto relative z-10">
          <div className="flex items-center justify-between mb-12">
            <Link to="/products/rice" className="flex items-center gap-2 bg-white/20 px-6 py-3 rounded-xl text-white hover:bg-white/30 transition-all font-semibold">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              View Rice Milling
            </Link>
            <Link to="/products" className="flex items-center gap-2 bg-white/20 px-6 py-3 rounded-xl text-white hover:bg-white/30 transition-all font-semibold">
              Back to Products
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <div>
              <h1 className="text-5xl font-extrabold text-white drop-shadow-lg">Polishing Equipment</h1>
              <p className="text-xl text-purple-100 mt-2">Advanced polishing technology for premium rice quality</p>
            </div>
          </div>
        </div>
      </div>

      {/* Description Card */}
      <div className="container mx-auto px-4 -mt-8 relative z-10 mb-12">
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-purple-100">
          <p className="text-gray-700 leading-relaxed text-lg">
            We provide premium dyeing services with a wide color palette. Our dyeing solutions (B-Max, Dye-Max, F-Max, Mini-Max)
            ensure vibrant colors, excellent fastness, and minimal environmental impact. Suitable for bulk orders and custom color matching.
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <div key={p._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-1 border border-purple-100">
              {p.imageUrl && (
                <div className="relative h-48 overflow-hidden">
                  <img src={p.imageUrl} alt={p.name} className={`w-full h-full object-cover transform duration-500 ${p.stockStatus === 'Out of Stock' ? 'grayscale opacity-60' : 'hover:scale-110'}`} />
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg">
                    Dyeing
                  </div>
                  {p.stockStatus === 'Out of Stock' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                      <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest shadow-sm">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>
              )}
              <div className="p-6">
                <h3 className="font-bold text-xl mb-2 text-gray-800">{p.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{p.description}</p>
                <div className="flex items-end justify-between mb-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Price per kg</div>
                    <div className="text-2xl font-bold text-green-600">₹{p.ratePerKg}</div>
                  </div>
                </div>
                {p.stockStatus === 'Out of Stock' ? (
                  <button disabled className="w-full block text-center px-6 py-3 bg-gray-300 text-gray-500 rounded-xl font-bold cursor-not-allowed">
                    Out of Stock
                  </button>
                ) : (
                  <Link to="/booking" className="block text-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-xl transition-all">
                    Book Service
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
