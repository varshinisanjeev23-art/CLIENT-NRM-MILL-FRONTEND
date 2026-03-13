import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import { CartContext } from '../context/CartContext';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart, openCart } = useContext(CartContext);
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [weight, setWeight] = useState(10); // Will be updated when product loads
  const [activeImage, setActiveImage] = useState(0); // Which image index is shown
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('Description');
  const [isZoomed, setIsZoomed] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [orderCount, setOrderCount] = useState(0);
  
  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    title: '',
    content: '',
    name: '',
    email: '',
  });
  const [reviewSort, setReviewSort] = useState('Most Recent');
  const [submittedReviews, setSubmittedReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
        // Set default weight from first quantity option
        const opts = res.data.quantityOptions;
        if (opts && opts.length > 0) setWeight(opts[0]);
      } catch (err) {
        console.error('Failed to load product details', err);
      } finally {
        setLoading(false);
      }
    };
    const fetchStatus = async () => {
        try {
            const res = await api.get('/bookings/order-count');
            setOrderCount(res.data.totalOrders || 0);
        } catch (err) {
            console.error(err);
        }
    };
    fetchProduct();
    fetchStatus();
  }, [id]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab) {
      setActiveTab(tab);
      // If it's the reviews tab, scroll down after a small delay
      if (tab === 'Reviews') {
        setTimeout(() => {
          const el = document.getElementById('tabs-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
          if (params.get('writeReview') === 'true') {
            setShowReviewForm(true);
            const initialRating = params.get('rating');
            if (initialRating) {
              setReviewForm(prev => ({ ...prev, rating: Number(initialRating) }));
            }
          }
        }, 300);
      }
    }
  }, [location]);

  useEffect(() => {
    if (!id) return;
    const fetchReviews = async () => {
      setReviewsLoading(true);
      try {
        const res = await api.get(`/reviews/product/${id}`);
        const mapped = res.data.map(r => ({
          id: r._id,
          rating: r.rating,
          name: r.displayName || (r.user && r.user.name) || 'Anonymous',
          date: new Date(r.createdAt).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
          title: r.title || '',
          content: r.comment || '',
          createdAt: r.createdAt,
        }));
        setSubmittedReviews(mapped);
      } catch (err) {
        console.error('Failed to load reviews', err);
      } finally {
        setReviewsLoading(false);
      }
    };
    fetchReviews();
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowStickyBar(true);
      } else {
        setShowStickyBar(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8faf8]">
        <div className="w-12 h-12 border-4 border-[#3ba829] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8faf8]">
        <h2 className="text-3xl font-black text-gray-900 mb-4">Product Not Found</h2>
        <Link to="/products" className="px-8 py-3 bg-[#3ba829] text-white rounded font-bold hover:bg-[#318b22]">Return to Products</Link>
      </div>
    );
  }

  const calculatedPrice = (product.ratePerKg * weight).toFixed(2);
  const originalCalcPrice = product.originalPrice ? (product.originalPrice * weight).toFixed(2) : null;
  const inStock = product.stockStatus !== 'Out of Stock';

  const handleAddToCart = () => {
    if (inStock) {
      addToCart(product, Number(weight), Number(quantity));
      openCart();
    }
  };

  const handleBuyNow = () => {
    if (inStock) {
      addToCart(product, Number(weight), Number(quantity));
      navigate('/booking');
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-amber-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
      </svg>
    ));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (reviewForm.rating === 0) {
      alert('Please select a rating before submitting.');
      return;
    }
    try {
      const res = await api.post('/reviews/product-page', {
        productId: product._id,
        productName: product.name,
        rating: reviewForm.rating,
        title: reviewForm.title,
        comment: reviewForm.content,
        displayName: reviewForm.name,
        email: reviewForm.email,
      });
      const saved = res.data;
      const newReview = {
        id: saved._id,
        rating: saved.rating,
        name: saved.displayName || 'Anonymous',
        date: new Date(saved.createdAt).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
        title: saved.title || '',
        content: saved.comment || '',
        createdAt: saved.createdAt,
      };
      setSubmittedReviews(prev => [newReview, ...prev]);
      alert('Review submitted successfully!');
      setShowReviewForm(false);
      setReviewForm({ rating: 0, title: '', content: '', name: '', email: '' });
    } catch (error) {
      console.error('Failed to submit review', error);
      alert('Failed to submit review. Please try again.');
    }
  };

  return (
    <div className="bg-white min-h-screen pb-32">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 pt-2 pb-4 border-b border-gray-100">
        <div className="flex items-center text-sm text-gray-500 font-medium">
          <Link to="/" className="hover:text-gray-900 transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/products" className="hover:text-gray-900 transition-colors">Products</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-semibold">{product.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-4 pb-8 lg:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
           {/* 1. Product Image Section */}
           <div className="flex flex-col md:flex-row gap-6">
             {/* Thumbnails - Left Side on Desktop */}
             <div className="flex md:flex-col gap-4 order-2 md:order-1 overflow-x-auto md:overflow-visible pb-4 md:pb-0 px-2 md:px-0 scrollbar-hide">
               {(() => {
                 const imgList =
                   product.images && product.images.length > 0
                     ? product.images
                     : product.imageUrl
                     ? [product.imageUrl]
                     : [];
                 return imgList.map((imgUrl, idx) => (
                   <button
                     key={idx}
                     onClick={() => setActiveImage(idx)}
                     className={`w-20 h-20 md:w-28 md:h-28 flex-shrink-0 bg-white border-2 rounded-xl overflow-hidden transition-all duration-300 ${
                       activeImage === idx ? 'border-[#3ba829] shadow-lg scale-105' : 'border-gray-100 hover:border-gray-200'
                     }`}
                   >
                     <img
                       src={`${import.meta.env.VITE_API_BASE_URL || 'https://rice-mill-backend.onrender.com'}${imgUrl}`}
                       alt={`Thumbnail ${idx + 1}`}
                       className="w-full h-full object-contain p-1"
                     />
                   </button>
                 ));
               })()}
             </div>

             {/* Main Image */}
             <div className={`relative flex-1 order-1 md:order-2 bg-white rounded-[2rem] overflow-hidden ${inStock ? 'cursor-zoom-in' : ''} group`} onClick={() => inStock && setIsZoomed(true)}>
                <img
                  src={`${import.meta.env.VITE_API_BASE_URL || 'https://rice-mill-backend.onrender.com'}${
                    product.images && product.images.length > 0
                      ? product.images[activeImage] || product.images[0]
                      : product.imageUrl
                  }`}
                  alt={product.name}
                  className={`w-full h-auto object-contain transition-all duration-700 min-h-[300px] max-h-[600px] group-hover:scale-105 ${!inStock && 'grayscale opacity-80'}`}
                />

                {/* Navigation Arrows - Specific Screenshot Style */}
                <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 flex justify-between items-center pointer-events-none">
                    <button 
                        onClick={(e) => { e.stopPropagation(); setActiveImage(prev => (prev === 0 ? (product.images?.length || 1) - 1 : prev - 1)); }}
                        className="w-12 h-12 rounded-full bg-[#3ba829] shadow-xl flex items-center justify-center text-white pointer-events-auto hover:bg-[#318b22] transition-all hover:scale-110"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                    <button 
                        onClick={(e) => { e.stopPropagation(); setActiveImage(prev => (prev === ((product.images?.length || 1) - 1) ? 0 : prev + 1)); }}
                        className="w-12 h-12 rounded-full bg-white border border-gray-200 shadow-xl flex items-center justify-center text-gray-900 pointer-events-auto hover:bg-gray-50 transition-all hover:scale-110"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                </div>

                {!inStock && (
                   <div className="absolute inset-0 bg-black/5 flex items-center justify-center pointer-events-none">
                     <span className="bg-red-600 outline outline-4 outline-white text-white px-8 py-3 rounded-full font-black tracking-widest uppercase shadow-2xl z-10">Out of Stock</span>
                   </div>
                )}
             </div>
           </div>

          {/* 2. Product Information Section */}
          <div className="flex flex-col pt-4">
            
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 leading-tight">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
              <div className="flex items-center gap-1">
                {renderStars(product.rating)}
                <span className="text-sm font-semibold text-gray-500 ml-2">({product.reviewsCount} reviews)</span>
              </div>
              <div className="w-px h-4 bg-gray-300"></div>
              <span className={`text-sm font-bold uppercase tracking-wider ${inStock ? 'text-green-600' : 'text-red-500'}`}>
                {inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            <div className="flex items-center gap-4 mb-8">
              {originalCalcPrice && (
                 <>
                   <span className="text-2xl font-semibold text-gray-400 line-through decoration-1">Rs. {originalCalcPrice}</span>
                   <span className="bg-red-600 text-white text-[11px] font-black px-2 py-1 uppercase rounded shadow-sm">SAVE {Math.round((1 - (calculatedPrice/originalCalcPrice)) * 100)}%</span>
                 </>
              )}
              <span className="text-4xl lg:text-5xl font-black text-[#3ba829]">Rs. {calculatedPrice}</span>
            </div>

            <p className="text-gray-600 leading-relaxed mb-10 text-lg">
              Unlock free delivery for orders above ₹699. This premium quality {product.category.toLowerCase()} is organically grown and sorted to ensure the best nutrition and taste for your family.
            </p>

            {/* 3. Quantity Selection */}
            <div className="mb-10 w-full text-left">
              <div className="text-[13px] font-black tracking-[0.1em] mb-4 text-gray-800 uppercase">
                QUANTITY: <span className="text-green-700">{weight}KG</span>
              </div>
              <div className="flex gap-4 flex-wrap">
                {(product.quantityOptions && product.quantityOptions.length > 0
                  ? product.quantityOptions
                  : [10, 25, 100]
                ).filter(opt => {
                    if (opt === 1 && orderCount > 0) return false;
                    return true;
                }).map(opt => (
                  <button
                    key={opt}
                    onClick={() => {
                        setWeight(opt);
                        if (opt === 1) setQuantity(1); // Force 1 if sample picked
                    }}
                    className={`w-16 h-16 rounded-full border-2 font-black text-sm flex items-center justify-center transition-all ${
                      weight === opt
                        ? 'border-[#3ba829] bg-green-50 text-[#3ba829] shadow-md scale-105'
                        : 'border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {opt}kg
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Cart Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
               {/* Stepper Input */}
              <div className="flex items-center justify-between border-2 border-gray-300 rounded overflow-hidden w-full sm:w-36 h-14 bg-white">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                  className="w-12 h-full flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-black font-semibold transition-colors"
                >
                  −
                </button>
                <div className="flex-[1] text-center font-bold text-gray-900 text-lg">{quantity}</div>
                <button 
                  onClick={() => {
                    if (weight === 1) return;
                    setQuantity(quantity + 1);
                  }} 
                  disabled={weight === 1}
                  className={`w-12 h-full flex items-center justify-center font-semibold transition-colors ${
                    weight === 1
                    ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-black'
                  }`}
                >
                  +
                </button>
              </div>

               <button 
                  onClick={handleAddToCart} 
                  disabled={!inStock}
                  className="flex-[2] bg-[#3ba829] hover:bg-[#318b22] disabled:opacity-50 disabled:cursor-not-allowed text-white h-14 rounded font-black uppercase tracking-wider text-sm shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                  ADD TO CART
                </button>
            </div>
            <button 
                onClick={handleBuyNow} 
                disabled={!inStock}
                className="w-full bg-[#1e2022] hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed text-white h-14 rounded font-black uppercase tracking-wider text-sm shadow-sm transition-all mb-8"
              >
                BUY IT NOW
            </button>

            {/* 5. Delivery & Trust Icons */}
            <div className="grid grid-cols-3 gap-4 border-t border-gray-100 pt-8 mt-4">
               <div className="flex flex-col items-center text-center gap-3 group translate-y-0 hover:-translate-y-1 transition-transform">
                 <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-50 text-blue-600">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                 </div>
                 <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">Free Delivery</span>
               </div>
               <div className="flex flex-col items-center text-center gap-3 group translate-y-0 hover:-translate-y-1 transition-transform">
                 <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-50 text-green-600">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                 </div>
                 <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">Secure Gateway</span>
               </div>
               <div className="flex flex-col items-center text-center gap-3 group translate-y-0 hover:-translate-y-1 transition-transform">
                 <div className="w-12 h-12 flex items-center justify-center rounded-full bg-amber-50 text-amber-600">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                 </div>
                 <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">Organic Certified</span>
               </div>
            </div>

          </div>
        </div>

        {/* 6. Product Tabs Section */}
        <div id="tabs-section" className="mt-24 max-w-5xl mx-auto">
          <div className="flex flex-wrap border-b border-gray-200 justify-center sm:justify-start gap-2 sm:gap-8">
            {['Description', 'Additional Information', 'Reviews'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-[13px] sm:text-sm font-bold tracking-wider uppercase transition-all duration-300 relative ${
                  activeTab === tab ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#3ba829]"></span>
                )}
              </button>
            ))}
          </div>
          
          <div className="py-12 animate-fade-in">
            {activeTab === 'Description' && (
               <div className="prose prose-lg max-w-none text-gray-600">
                 <p className="font-semibold text-gray-800 text-xl mb-6">{product.name} ({product.category})</p>
                 <p>{product.description}</p>
                 <p className="mt-4">
                  These grains are specifically chosen from nutrient rich farmlands to make sure they reach your dining table perfectly polished and full of natural aroma.
                 </p>
                 
                 <h3 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Health Benefits of {product.name}</h3>
                 <ul className="space-y-3 font-medium text-gray-700 list-disc pl-5 marker:text-[#3ba829]">
                   <li>Promotes Iron Strength & Bone Health</li>
                   <li>Regulates Blood Pressure and heart efficiency</li>
                   <li>Maintains Weight through natural long-lasting fulfillment</li>
                   <li>Boosts Energy naturally without synthetic additives</li>
                   <li>Manages Diabetes with a low glycemic index</li>
                 </ul>
               </div>
            )}
            {activeTab === 'Additional Information' && (
               <div className="bg-gray-50 rounded-xl p-8 border border-gray-100">
                 <table className="w-full text-left text-gray-700">
                   <tbody>
                     <tr className="border-b border-gray-200">
                       <th className="py-4 font-bold w-1/3">Weight Variants</th>
                       <td className="py-4">10kg, 25kg, 100kg</td>
                     </tr>
                     <tr className="border-b border-gray-200">
                       <th className="py-4 font-bold">Category</th>
                       <td className="py-4">{product.category}</td>
                     </tr>
                     <tr className="border-b border-gray-200">
                       <th className="py-4 font-bold">Packaging</th>
                       <td className="py-4">Eco-friendly Jute/Cotton double-layered protective standard</td>
                     </tr>
                     <tr>
                       <th className="py-4 font-bold">Shelf Life</th>
                       <td className="py-4">12 Months from Date of Packaging (Store in cool, dry place)</td>
                     </tr>
                   </tbody>
                 </table>
               </div>
            )}
            {activeTab === 'Reviews' && (
               <div className="py-16">
                 {/* Top summary section */}
                 <div className="text-center mb-12">
                   <h3 className="text-2xl font-black text-gray-900 mb-8">Customer Reviews</h3>
                   <div className="flex flex-col md:flex-row items-center justify-center gap-12">
                     <div className="flex flex-col items-center">
                       <div className="flex justify-center mb-2">
                         {renderStars(product.rating)}
                         <span className="font-semibold text-gray-700 ml-2">{product.rating.toFixed(2)} out of 5</span>
                       </div>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          Based on {submittedReviews.length} review{submittedReviews.length !== 1 ? 's' : ''}
                          <svg className="w-4 h-4 text-teal-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                        </p>
                     </div>

                     <div className="w-full max-w-sm">
                       {[5, 4, 3, 2, 1].map((star) => (
                         <div key={star} className="flex items-center gap-2 mb-2">
                           <div className="flex gap-1">
                             {Array.from({length: 5}).map((_, i) => (
                               <svg key={i} className={`w-3 h-3 ${i < star ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                                 <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                               </svg>
                             ))}
                           </div>
                           <div className="flex-1 h-3 bg-gray-100 relative">
                             <div className="absolute top-0 left-0 h-full bg-[#fbbf24]" style={{ width: `${(submittedReviews.filter(r => r.rating === star).length / (submittedReviews.length || 1) * 100)}%` }}></div>
                           </div>
                           <div className="text-xs text-gray-500 w-4 text-right">{submittedReviews.filter(r => r.rating === star).length}</div>
                         </div>
                       ))}
                     </div>

                     {!showReviewForm && (
                       <button
                         onClick={() => setShowReviewForm(true)}
                         className="bg-[#fbbf24] hover:bg-[#eab308] px-8 py-3 rounded text-white font-bold text-sm shadow transition-colors"
                       >
                         Write a review
                       </button>
                     )}
                   </div>
                 </div>

                 {/* Write a review form */}
                 {showReviewForm && (
                   <div className="max-w-2xl mx-auto border-t border-gray-100 pt-10 mt-10 animate-fade-in">
                     <h3 className="text-2xl font-black text-center text-gray-900 mb-8">Write a review</h3>
                     <form onSubmit={handleReviewSubmit} className="space-y-6">
                       <div className="text-center">
                         <label className="block text-sm font-semibold text-gray-700 mb-2">Rating</label>
                         <div className="flex justify-center gap-1">
                           {[1, 2, 3, 4, 5].map((star) => (
                             <button key={star} type="button" onClick={() => setReviewForm({...reviewForm, rating: star})} className="focus:outline-none">
                               <svg className={`w-8 h-8 hover:scale-110 transition-transform ${star <= reviewForm.rating ? 'text-[#fbbf24]' : 'text-gray-200'}`} fill={star <= reviewForm.rating ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 20 20">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={star <= reviewForm.rating ? "0" : "1.5"} d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                               </svg>
                             </button>
                           ))}
                         </div>
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-gray-500 mb-1 text-center">Review Title (100)</label>
                         <input type="text" placeholder="Give your review a title" maxLength={100} value={reviewForm.title} onChange={(e) => setReviewForm({...reviewForm, title: e.target.value})} className="w-full border border-gray-300 px-4 py-3 rounded focus:outline-none focus:border-[#fbbf24] transition-colors" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-gray-500 mb-1 text-center">Review content</label>
                         <textarea placeholder="Start writing here..." rows={5} value={reviewForm.content} onChange={(e) => setReviewForm({...reviewForm, content: e.target.value})} className="w-full border border-gray-300 px-4 py-3 rounded focus:outline-none focus:border-[#fbbf24] transition-colors resize-y" required></textarea>
                       </div>
                       <div className="border border-dashed border-gray-300 rounded p-8 bg-gray-50 text-center flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
                         <label className="block text-sm font-medium text-gray-700 mb-4 cursor-pointer">Picture/Video (optional)</label>
                         <div className="w-16 h-16 bg-white shadow flex items-center justify-center rounded mb-2">
                           <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                         </div>
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-gray-500 mb-1 text-center">Display name (displayed publicly like <span className="text-[#fbbf24]">John Smith</span>)</label>
                         <input type="text" placeholder="Display name" value={reviewForm.name} onChange={(e) => setReviewForm({...reviewForm, name: e.target.value})} className="w-full border border-gray-300 px-4 py-3 rounded focus:outline-none focus:border-[#fbbf24] transition-colors" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-gray-500 mb-1 text-center">Email address</label>
                         <input type="email" placeholder="Your email address" value={reviewForm.email} onChange={(e) => setReviewForm({...reviewForm, email: e.target.value})} className="w-full border border-gray-300 px-4 py-3 rounded focus:outline-none focus:border-[#fbbf24] transition-colors" required />
                       </div>
                       <p className="text-xs text-gray-500 text-center leading-relaxed">How we use your data: We'll only contact you about the review you left, and only if necessary. By submitting your review, you agree to Judge.me's terms, privacy and content policies.</p>
                       <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                         <button type="button" onClick={() => setShowReviewForm(false)} className="px-8 py-3 border-2 border-[#fbbf24] text-[#fbbf24] font-bold rounded uppercase text-sm hover:bg-[#fbbf24] hover:text-white transition-colors">Cancel review</button>
                         <button type="submit" className="px-8 py-3 bg-[#fbbf24] text-white font-bold rounded uppercase text-sm hover:bg-[#eab308] transition-colors">Submit Review</button>
                       </div>
                     </form>
                   </div>
                 )}

                 {/* Review Cards List */}
                 <div className="mt-12 border-t border-gray-100 pt-8">
                   <div className="flex items-center gap-2 mb-8">
                     <select
                       value={reviewSort}
                       onChange={(e) => setReviewSort(e.target.value)}
                       className="text-[#fbbf24] font-bold text-sm bg-transparent border-none cursor-pointer focus:outline-none appearance-none pr-4"
                       style={{ backgroundImage: 'none' }}
                     >
                       <option>Most Recent</option>
                       <option>Highest Rated</option>
                       <option>Lowest Rated</option>
                     </select>
                     <svg className="w-3 h-3 text-[#fbbf24] -ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                   </div>

                   <div className="space-y-0">
                      {reviewsLoading ? (
                        <div className="flex justify-center py-12">
                          <div className="w-8 h-8 border-4 border-[#fbbf24] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      ) : submittedReviews.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                          <svg className="w-12 h-12 mx-auto mb-3 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3v-3z" /></svg>
                          <p className="font-medium">No reviews yet. Be the first to write one!</p>
                        </div>
                      ) : (
                        [...submittedReviews]
                          .sort((a, b) => {
                            if (reviewSort === 'Highest Rated') return b.rating - a.rating;
                            if (reviewSort === 'Lowest Rated') return a.rating - b.rating;
                            return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
                          })
                          .map((review) => (
                          <div key={review.id} className="py-8 border-b border-gray-100 last:border-b-0">
                            {/* Stars row + Date */}
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex gap-0.5">
                                {Array.from({length: 5}).map((_, i) => (
                                  <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'text-[#fbbf24]' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                  </svg>
                                ))}
                              </div>
                              <span className="text-sm text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                            </div>
                            {/* Avatar + Name */}
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                              </div>
                              <span className="text-sm font-semibold text-[#fbbf24]">{review.name}</span>
                            </div>
                            {/* Title */}
                            {review.title && <h4 className="font-bold text-gray-900 mb-1">{review.title}</h4>}
                            {/* Content */}
                            {review.content && <p className="text-gray-600 text-sm leading-relaxed">{review.content}</p>}
                          </div>
                        ))
                      )}
                    </div>
                 </div>
               </div>
            )}
          </div>
        </div>


      </div>

      {/* Lightbox / Zoom functionality overlay */}
      {isZoomed && (
        <div 
          className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in"
          onClick={() => setIsZoomed(false)}
        >
          <img 
            src={`${import.meta.env.VITE_API_BASE_URL || 'https://rice-mill-backend.onrender.com'}${
              product.images && product.images.length > 0
                ? product.images[activeImage] || product.images[0]
                : product.imageUrl
            }`}
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            alt="Zoomed"
          />
          <div className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </div>
        </div>
      )}

      {/* 7. Sticky Cart Bar */}
      <div className={`fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] transform transition-transform duration-500 z-[90] ${showStickyBar ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="container mx-auto px-4 h-20 sm:h-24 flex items-center justify-between gap-4">
          <div className="hidden md:flex items-center gap-4 flex-[1]">
            <img src={`${import.meta.env.VITE_API_BASE_URL || 'https://rice-mill-backend.onrender.com'}${product.imageUrl}`} className="w-12 h-12 object-cover rounded shadow shadow-gray-200" alt="Thumb" />
            <div>
              <div className="font-bold text-sm text-gray-900 truncate max-w-[200px] lg:max-w-xs">{product.name}</div>
              <div className="text-[#3ba829] font-black text-sm">Rs. {calculatedPrice} <span className="text-gray-400 font-medium line-through ml-1">{(product.originalPrice * weight).toFixed(2)}</span></div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-6 justify-end w-full md:w-auto">
            {/* Dropdown for sticky bar weight */}
            <select 
              value={weight} 
              onChange={(e) => setWeight(Number(e.target.value))}
              className="border border-gray-300 rounded text-sm px-3 py-2 font-bold bg-white text-gray-700 outline-none w-24 sm:w-32 focus:border-[#3ba829]"
            >
              {(product.quantityOptions && product.quantityOptions.length > 0
                ? product.quantityOptions
                : [10, 25, 100]
              ).map(q => (
                <option key={q} value={q}>{q}kg</option>
              ))}
            </select>
            
            {/* Tiny Stepper */}
            <div className="hidden sm:flex items-center justify-between border border-gray-300 rounded overflow-hidden w-24 h-[38px] bg-white">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-full flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-black transition-colors">−</button>
              <div className="flex-[1] text-center font-bold text-gray-900 text-sm">{quantity}</div>
              <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-full flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-black transition-colors">+</button>
            </div>

            <button 
              onClick={handleAddToCart}
              disabled={!inStock}
              className="bg-[#3ba829] hover:bg-[#318b22] disabled:opacity-50 text-white px-6 sm:px-10 h-10 rounded text-xs sm:text-sm font-black uppercase tracking-wider shadow whitespace-nowrap"
            >
              ADD TO CART
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
