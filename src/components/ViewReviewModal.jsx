import { useState, useEffect } from 'react';
import api from '../services/api';
import StarRating from './StarRating';

export default function ViewReviewModal({ order, isOpen, onClose }) {
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && order) {
      const fetchReview = async () => {
        try {
          const res = await api.get('/reviews/user');
          const found = res.data.find(r => r.booking === order._id || (r.booking?._id === order._id));
          setReview(found);
        } catch (err) {
          console.error('Failed to fetch review', err);
        } finally {
          setLoading(false);
        }
      };
      fetchReview();
    }
  }, [isOpen, order]);

  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden transition-all animate-in fade-in zoom-in duration-300">
        
        {/* Modal Header */}
        <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Review Details</h2>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Order # {order._id.slice(-6)}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900 transition-colors p-2 hover:bg-gray-100 rounded-full">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
               <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
               <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading Review...</p>
            </div>
          ) : review ? (
            <div className="space-y-8">
              {/* Product Card */}
              <div className="flex items-center gap-5 p-5 border border-gray-100 rounded-2xl bg-gray-50 items-start">
                  <div className="w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                      <img 
                        src={order.productImage ? `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${order.productImage}` : 'https://placehold.co/100x100?text=Rice'} 
                        className="w-full h-full object-contain" 
                        alt={order.riceType} 
                      />
                  </div>
                  <div>
                      <h4 className="font-black text-gray-900 text-sm mb-1">{order.riceType}</h4>
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Delivered on {new Date(order.updatedAt).toLocaleDateString()}</p>
                  </div>
              </div>

              {/* Rating Section */}
              <div className="text-center">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Your Rating</h3>
                  <div className="flex justify-center scale-125">
                      <StarRating rating={review.rating} />
                  </div>
              </div>

              {/* Review Content */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                  <div>
                      <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Headline</h3>
                      <p className="text-lg font-black text-gray-900 leading-tight">"{review.title || 'No Title'}"</p>
                  </div>
                  <div>
                      <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Comment</h3>
                      <p className="text-gray-600 leading-relaxed font-medium italic">
                        {review.comment || 'No comment provided.'}
                      </p>
                  </div>
              </div>

              {/* Review Images if any */}
              {review.images && review.images.length > 0 && (
                 <div className="pt-4">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 text-left">Shared Photos</h3>
                    <div className="flex gap-3 overflow-x-auto pb-2">
                        {review.images.map((img, i) => (
                           <img key={i} src={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${img}`} className="w-20 h-20 rounded-xl object-cover border border-gray-100 shadow-sm" alt="Review" />
                        ))}
                    </div>
                 </div>
              )}
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="text-4xl mb-4">📝</div>
              <p className="text-gray-500 font-bold tracking-tight">We couldn't locate the details for this review.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-6 bg-gray-50 border-t border-gray-50 flex justify-end">
            <button 
                onClick={onClose}
                className="bg-gray-900 text-white px-10 py-3 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all shadow-xl shadow-gray-200"
            >
                Back to Orders
            </button>
        </div>
      </div>
    </div>
  );
}
