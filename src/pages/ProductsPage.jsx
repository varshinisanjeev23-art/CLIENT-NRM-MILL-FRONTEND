import { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { CartContext } from '../context/CartContext';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');
  const [sortBy, setSortBy] = useState('Best selling');
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/products');
        setProducts(res.data);
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const handleAddToCart = (p) => {
    if (p.stockStatus === 'Out of Stock') return;
    // Default to the first quantity option if available, otherwise 10kg
    const defaultWeight = (p.quantityOptions && p.quantityOptions.length > 0) ? p.quantityOptions[0] : 10;
    addToCart(p, Number(defaultWeight), 1);
  };

  const handleQuickShop = (p) => {
    if (p.stockStatus === 'Out of Stock') return;
    setQuickViewProduct(p);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < Math.floor(rating) ? "text-amber-400" : "text-gray-300"}>
        ★
      </span>
    ));
  };

  const sortedProducts = [...products]
    .filter(p => p.status !== 'inactive')
    .filter(p => !categoryFilter || p.category === categoryFilter)
    .sort((a, b) => {
      if (sortBy === 'Price: Low to High') return a.ratePerKg - b.ratePerKg;
      if (sortBy === 'Price: High to Low') return b.ratePerKg - a.ratePerKg;
      if (sortBy === 'Newest Arrivals') return new Date(b.createdAt) - new Date(a.createdAt);
      return 0;
    });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8faf8]">
        <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8faf8] via-[#f1f5f1] to-[#e8f0e8]">

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="text-center mb-16 px-4">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight uppercase">
            {categoryFilter || 'Rice'} Collection
          </h1>
          <div className="w-20 h-1.5 bg-green-600 mx-auto rounded-full"></div>
        </div>

        {/* Filters & Grid Options */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 py-8 border-y border-gray-100 gap-8">
          <div className="flex items-center gap-6">
            <div className="text-gray-400 font-black uppercase text-[11px] tracking-[0.2em] flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              {sortedProducts.length} Varieties Available
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Sort by</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-gray-200 px-6 py-3 rounded-2xl text-xs font-bold text-gray-700 focus:ring-2 focus:ring-green-500 outline-none cursor-pointer hover:border-gray-400 transition-all"
            >
              <option>Best selling</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest Arrivals</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {sortedProducts.map((p) => (
              <div key={p._id} className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="relative aspect-square overflow-hidden bg-[#fafafa]">
                  {p.imageUrl ? (
                    <Link to={`/products/p/${p._id}`}>
                      <img
                        src={`${import.meta.env.VITE_API_BASE_URL || 'https://rice-mill-backend.onrender.com'}${p.imageUrl}`}
                        alt={p.name}
                        className={`w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ${p.stockStatus === 'Out of Stock' ? 'grayscale opacity-60' : ''}`}
                      />
                    </Link>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50">
                      <svg className="w-16 h-16 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                  )}

                  <div className="absolute inset-x-0 bottom-0 p-6 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 pointer-events-none">
                    {p.stockStatus !== 'Out of Stock' && (
                      <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleQuickShop(p); }}
                        className="pointer-events-auto w-full bg-gray-900 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl hover:bg-green-600 transition-colors"
                      >
                        Quick Shop
                      </button>
                    )}
                  </div>

                  {p.stockStatus === 'Out of Stock' && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-red-500 text-white px-4 py-1.5 rounded-full font-black uppercase text-[9px] tracking-widest shadow-lg">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-1 mb-4">
                    <div className="flex text-xs">{renderStars(p.rating)}</div>
                    <span className="text-[10px] text-gray-400 font-bold ml-1 uppercase letter-spacing-1">({p.reviewsCount} Reviews)</span>
                  </div>

                  <Link to={`/products/p/${p._id}`}>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight group-hover:text-green-700 transition-colors uppercase tracking-tight">{p.name}</h3>
                  </Link>

                  <div className="mt-auto flex items-end justify-between">
                    <div>
                      <span className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1 opacity-60">Starting from</span>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-black text-green-700">₹{p.ratePerKg.toFixed(0)}</span>
                        {p.originalPrice && (
                          <span className="text-sm text-gray-300 line-through font-bold">₹{p.originalPrice.toFixed(0)}</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddToCart(p)}
                      disabled={p.stockStatus === 'Out of Stock'}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${p.stockStatus === 'Out of Stock'
                        ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-gray-900 hover:scale-110 shadow-md shadow-green-200'
                        }`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-32 text-center border-2 border-dashed border-gray-100 rounded-[40px]">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 text-gray-200">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">No products found</h3>
            <p className="text-gray-400 font-medium mb-10">We couldn't find any products in the "{categoryFilter || 'Rice'}" category.</p>
            <Link to="/products" className="inline-block px-10 py-4 bg-gray-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-green-600 transition-all shadow-xl">Show All Collections</Link>
          </div>
        )}
      </div>

      {/* Sustainable Section */}
      <section className="bg-green-900 py-20 mt-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src="https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover" alt="Rice field" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Sustainable & Organic</h2>
            <p className="text-green-100 text-xl font-medium mb-10 leading-relaxed">
              Every grain tells a story of tradition, purity, and excellence. We work directly with farmers to bring you the highest quality organic rice.
            </p>
            <div className="flex flex-wrap gap-8">
              {['Chemical Free', 'Direct from Farms', 'Traditional Seeds'].map(item => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center text-green-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span className="text-white font-bold text-sm tracking-wide">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          addToCart={addToCart}
          navigate={navigate}
        />
      )}
    </div>
  );
}

function QuickViewModal({ product, onClose, addToCart, navigate }) {
  const [weight, setWeight] = useState(10); // 10kg default
  const [quantity, setQuantity] = useState(1);

  const calculatedPrice = (product.ratePerKg * weight).toFixed(2);
  const originalCalcPrice = product.originalPrice ? (product.originalPrice * weight).toFixed(2) : null;

  const handleAddToCart = () => {
    addToCart(product, Number(weight), Number(quantity));
    onClose();
  };

  const handleBuyNow = () => {
    addToCart(product, Number(weight), Number(quantity));
    onClose();
    navigate('/booking');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal Container */}
      <div className="relative bg-white rounded-xl w-full max-w-[400px] shadow-2xl z-10 animate-[fadeIn_0.2s_ease-out] border border-gray-100 p-6 flex flex-col pt-10">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-900 z-10 w-8 h-8 flex items-center justify-center transition-colors hover:bg-gray-100 rounded-full"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header: Image & Basics */}
        <div className="flex gap-4 items-center mb-6">
          <div className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 bg-gray-50 overflow-hidden rounded border border-gray-100 relative">
            <img
              src={`${import.meta.env.VITE_API_BASE_URL || 'https://rice-mill-backend.onrender.com'}${product.imageUrl}`}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.stockStatus === 'Out of Stock' && (
              <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                <span className="text-[10px] font-black text-red-600 bg-red-100 px-2 py-0.5 rounded uppercase">Out of Stock</span>
              </div>
            )}
          </div>
          <div className="flex-[1] min-w-0">
            <h2 className="text-lg font-bold text-gray-900 leading-tight mb-2 truncate whitespace-normal break-words line-clamp-2">
              {product.name}
            </h2>
            <div className="flex items-center gap-2 flex-wrap">
              {originalCalcPrice && <span className="text-sm line-through text-gray-400">Rs. {originalCalcPrice}</span>}
              <span className="text-lg font-black text-red-600">Rs. {calculatedPrice}</span>
            </div>
          </div>
        </div>

        <div className="w-full h-px bg-gray-100 mb-6"></div>

        {/* Form area */}
        <div className="flex flex-col w-full text-center items-center">

          <div className="mb-6 w-full">
            <div className="text-[11px] font-black tracking-[0.15em] mb-4 text-gray-800 uppercase">
              QUANTITY: <span className="text-green-700">{weight === 10 ? '10KG' : weight === 25 ? '25KG' : '100KG'}</span>
            </div>
            <div className="flex justify-center gap-3">
              {[
                { val: 10, label: '10kg' },
                { val: 25, label: '25kg' },
                { val: 100, label: '100kg' }
              ].map(opt => (
                <button
                  key={opt.val}
                  onClick={() => setWeight(opt.val)}
                  className={`w-12 h-12 rounded-full border-[1.5px] font-bold text-xs flex items-center justify-center transition-all ${weight === opt.val
                    ? 'border-green-600 bg-green-50 text-green-700 shadow-md scale-105'
                    : 'border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-900'
                    }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Stepper Input */}
          <div className="flex items-center justify-between border border-gray-300 rounded-md w-32 h-10 mb-6 mx-auto overflow-hidden">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-full flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-black font-semibold transition-colors"
            >
              −
            </button>
            <div className="flex-[1] text-center font-bold text-gray-900 outline-none">{quantity}</div>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-full flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-black font-semibold transition-colors"
            >
              +
            </button>
          </div>

          {/* Actions */}
          <div className="w-full flex flex-col gap-3 mt-2">
            <button
              onClick={handleAddToCart}
              disabled={product.stockStatus === 'Out of Stock'}
              className="w-full bg-[#3ba829] hover:bg-[#318b22] disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 rounded-[3px] font-black uppercase tracking-wider text-[13px] shadow-sm transition-all text-center"
            >
              ADD TO CART
            </button>
            <button
              onClick={handleBuyNow}
              disabled={product.stockStatus === 'Out of Stock'}
              className="w-full bg-[#1e2022] hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 rounded-[3px] font-black uppercase tracking-wider text-[13px] shadow-sm transition-all text-center"
            >
              BUY IT NOW
            </button>
          </div>

          {/* Details Link */}
          <button
            onClick={() => { onClose(); navigate(`/products/p/${product._id}`); }}
            className="mt-6 text-[13px] font-bold text-gray-500 hover:text-gray-900 flex items-center gap-1 group transition-colors"
          >
            View full details
            <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
            </svg>
          </button>

        </div>

      </div>
    </div>
  );
}
