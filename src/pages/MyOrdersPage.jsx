import { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import ReviewModal from '../components/ReviewModal';
import InvoiceModal from '../components/InvoiceModal';
import ViewReviewModal from '../components/ViewReviewModal';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

function StatusBadge({ status }) {
  const config = {
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
    processing: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
    shipped: { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-200' },
    out_for_delivery: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' },
    delivered: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
    cancelled: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' }
  };
  const { bg, text, border } = config[status] || { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${bg} ${text} ${border}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
}

function OrderTimeline({ order }) {
  const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleString('en-GB', { 
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
    });
  };

  const steps = [
    { label: 'Order Placed', time: order.placedAt || order.createdAt, done: true },
    { label: 'Processed', time: order.processedAt, done: !!order.processedAt },
    { label: 'Shipped', time: order.shippedAt, done: !!order.shippedAt },
    { label: 'Out for Delivery', time: order.outForDeliveryAt, done: !!order.outForDeliveryAt },
    { label: 'Delivered', time: order.deliveredAt, done: !!order.deliveredAt }
  ];

  return (
    <div className="mt-8 pt-6 border-t border-gray-100">
      <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6 px-1">Order Journey</h4>
      <div className="relative flex flex-col gap-6 ml-4">
        {/* Continuous Line */}
        <div className="absolute left-[7px] top-1 bottom-1 w-0.5 bg-gray-100"></div>
        
        {steps.map((step, idx) => (
          <div key={idx} className={`relative flex items-center gap-4 ${!step.done ? 'opacity-30' : ''}`}>
             <div className={`w-4 h-4 rounded-full border-4 z-10 ${step.done ? 'bg-green-500 border-green-100' : 'bg-gray-200 border-gray-100'}`}></div>
             <div className="flex-1 flex justify-between items-center bg-gray-50/50 p-2 rounded-xl border border-transparent hover:border-gray-100 transition-all">
               <span className="text-sm font-bold text-gray-700">{step.label}</span>
               {step.time && <span className="text-[10px] font-medium text-gray-500">{formatDate(step.time)}</span>}
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MyOrdersPage() {
  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshTick, setRefreshTick] = useState(0);
  const [activeTab, setActiveTab] = useState('orders');
  const [searchTerm, setSearchTerm] = useState('');
  const [reviewOrder, setReviewOrder] = useState(null);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);
  const [viewReviewOrder, setViewReviewOrder] = useState(null);
  const [products, setProducts] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      try {
        setError('');
        const [ordersRes, productsRes] = await Promise.all([
          api.get('/bookings/my'),
          api.get('/products')
        ]);
        if (active) {
          setOrders(ordersRes.data || []);
          setProducts(productsRes.data || []);
        }
      } catch (e) {
        if (active) setError(e.response?.data?.message || 'Failed to load data');
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchData();
    return () => { active = false; };
  }, [refreshTick]);

  const refresh = () => setRefreshTick((x) => x + 1);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      await api.patch(`/bookings/${orderId}`, { status: 'cancelled' });
      refresh();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel order');
    }
  };
  
  const handleBuyItAgain = (order) => {
    // Attempt to find the full product object from our active products list
    const product = products.find(p => p._id === (order.product?._id || order.product));
    
    if (product) {
      // Add to cart using the saved weight (quantityKg) from the previous order
      addToCart(product, order.quantityKg, 1);
      navigate('/booking');
    } else {
      // Fallback: If product can't be found (e.g., deleted), alert the user
      alert('This product is no longer available in the store.');
    }
  };

  const handleCompletePayment = async (order) => {
    try {
      if (!window.Razorpay) {
        alert('Razorpay SDK failed to load. Please check your internet connection and refresh the page.');
        return;
      }

      const orderRes = await api.post('/payments/order', {
        amount: order.totalAmount,
        bookingId: order._id
      });

      const { orderId, key, amount, currency, paymentId } = orderRes.data;

      const options = {
        key,
        amount,
        currency,
        name: 'NRM Rice Mill',
        description: `Payment for ${order.riceType}`,
        order_id: orderId,
        handler: async (response) => {
          try {
            await api.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              paymentId,
              bookingId: order._id
            });
            alert('Payment successful!');
            refresh();
          } catch (err) {
            console.error('Final Verification Error:', err);
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: ''
        },
        theme: { color: '#3ba829' },
        modal: {
          ondismiss: function () {
            console.log('Checkout modal closed');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Payment Error:', err);
      alert(err.response?.data?.message || 'Failed to initialize payment');
    }
  };

  const getFilteredOrders = () => {
    let filtered = orders;
    if (activeTab === 'cancelled') filtered = orders.filter(o => o.status === 'cancelled');
    else if (activeTab === 'open') filtered = orders.filter(o => ['pending', 'processing', 'shipped', 'out_for_delivery'].includes(o.status));

    // Simple search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(o =>
        o._id.toLowerCase().includes(term) ||
        o.riceType?.toLowerCase().includes(term)
      );
    }
    return filtered;
  };

  const displayedOrders = getFilteredOrders();

  return (
    <div className="relative min-h-screen font-sans text-gray-900 bg-gray-50">

      <div className="relative z-10 print:hidden">
        {/* Header / Breadcrumb Area with Glassmorphism */}
        <div className="bg-white/40 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4">
          <div className="text-sm text-gray-500 mb-6">
            <Link to="/" className="hover:underline hover:text-orange-600">Your Account</Link> › <span className="text-orange-700 font-bold">Your Orders</span>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-2">
            <div>
              <h1 className="text-3xl font-normal mb-2 text-gray-900">Your Orders</h1>
              {user && <p className="text-gray-600">Hi, <span className="font-bold">{user.name}</span></p>}
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search all orders"
                  className="pl-10 pr-4 py-2 border border-gray-200/50 rounded-xl w-full focus:ring-2 focus:ring-[#3ba829] focus:border-[#3ba829] outline-none shadow-sm bg-white/50 backdrop-blur-sm transition-all text-sm font-medium"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200/30 mb-8 overflow-x-auto">
          <nav className="flex space-x-8 min-w-max" aria-label="Tabs">
            {[
              { id: 'orders', label: 'Orders' },
              { id: 'open', label: 'Not Yet Dispatched' },
              { id: 'cancelled', label: 'Cancelled Orders' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-black text-xs uppercase tracking-widest transition-all
                  ${activeTab === tab.id
                    ? 'border-[#3ba829] text-[#3ba829]'
                    : 'border-transparent text-gray-400 hover:text-gray-700 hover:border-gray-300'}
                `}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Stats Summary - "Amazon-like" subtle summary */}
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-600">
          <span className="font-bold text-black">{orders.length} orders</span> placed in
          <select className="ml-2 bg-gray-100 border-gray-300 rounded-md text-xs py-1 px-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm cursor-pointer">
            <option>past 3 months</option>
            <option>past 6 months</option>
            <option>2026</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        ) : displayedOrders.length === 0 ? (
          <div className="border border-gray-200 rounded-lg p-12 text-center bg-gray-50">
            <h3 className="text-xl font-medium text-gray-600 mb-2">No orders found</h3>
            <p className="text-gray-500 mb-6">Looks like you haven't placed any orders in this category yet.</p>
            <Link to="/products" className="bg-yellow-400 text-gray-900 border border-yellow-500 px-6 py-2 rounded-md font-medium hover:bg-yellow-500 shadow-sm transition-colors">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {displayedOrders.map((order) => (
              <div key={order._id} className="border border-gray-100/50 rounded-2xl overflow-hidden bg-white/60 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_15px_45px_rgb(0,0,0,0.08)] transition-all duration-500 group/card relative">
                {/* Subtle Shimmer for High Fidelity */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/card:translate-x-[100%] transition-transform duration-1000 pointer-events-none"></div>

                {/* Order Header */}
                <div className="bg-[#fcfdfa]/80 px-6 py-4 border-b border-gray-100/50 flex flex-col md:flex-row justify-between text-sm text-gray-600 gap-4">
                  <div className="flex gap-8">
                    <div>
                      <div className="uppercase text-xs font-bold mb-1">Order Placed</div>
                      <div className="text-gray-900">{new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                    </div>
                    <div>
                      <div className="uppercase text-xs font-bold mb-1">Total</div>
                      <div className="text-gray-900 font-medium">₹{order.totalAmount}</div>
                    </div>
                    <div className="hidden md:block">
                      <div className="uppercase text-xs font-bold mb-1">Ship To</div>
                      <div className="text-blue-600 hover:underline cursor-pointer flex items-center group relative">
                        {user?.name || 'Customer'} <span className="ml-1 text-gray-400">▼</span>
                      </div>
                    </div>
                  </div>

                  <div className="md:text-right">
                    <div className="uppercase text-xs font-bold mb-1">Order # <span className="text-gray-500 font-normal normal-case">{order._id}</span></div>
                    <div className="flex xl:justify-end gap-3 text-blue-600">
                      <span 
                        onClick={() => setExpandedOrderId(expandedOrderId === order._id ? null : order._id)}
                        className="hover:underline cursor-pointer active:text-blue-800"
                      >
                        {expandedOrderId === order._id ? 'Hide order details' : 'View order details'}
                      </span>
                      <span className="text-gray-300">|</span>
                      <span 
                        onClick={() => setSelectedInvoiceOrder(order)}
                        className="hover:underline cursor-pointer active:text-blue-800"
                      >
                        Invoice
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Body */}
                <div className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">

                    {/* Main Info */}
                    <div className="flex-1">
                      <div className="mb-4">
                        <h3 className="text-lg font-bold text-gray-900 mb-1 capitalize">
                          {order.status === 'delivered' ? 'Delivered' : order.status.replace(/_/g, ' ')}
                          {order.status === 'pending' && <span className="text-sm font-normal text-gray-500 ml-2">Arriving soon</span>}
                        </h3>
                        {order.status === 'delivered' ? (
                          <p className="text-green-700 text-sm">Package was handed to resident.</p>
                        ) : order.status === 'shipped' ? (
                          <p className="text-indigo-700 text-sm">Your order is on the way.</p>
                        ) : order.status === 'out_for_delivery' ? (
                          <p className="text-purple-700 text-sm">Our delivery partner is nearby.</p>
                        ) : order.status === 'cancelled' ? (
                          <p className="text-red-700 text-sm">This order has been cancelled.</p>
                        ) : order.status === 'pending' ? (
                          <p className="text-amber-700 text-sm font-bold">Payment Pending. Please complete to proceed.</p>
                        ) : (
                          <p className="text-orange-700 text-sm">Preparing for dispatch.</p>
                        )}
                      </div>

                      <div className="flex gap-4">
                        {/* Product Image */}
                        <div className="w-24 h-24 bg-gray-100 rounded-md border border-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden relative">
                          {(() => {
                            // 1. Try saved snapshot
                            let img = order.productImage;

                            // 2. Try populated product reference
                            if (!img && order.product?.imageUrl) {
                              img = order.product.imageUrl;
                            }

                            // 3. Fallback: Try matching known products by name (for legacy orders)
                            if (!img && products.length > 0) {
                              const match = products.find(p =>
                                p.name === order.riceType ||
                                (order.riceType && p.name && order.riceType.toLowerCase().includes(p.name.toLowerCase()))
                              );
                              if (match) img = match.imageUrl;
                            }

                            if (img) {
                              // Avoid double-URL issue
                              const src = img.startsWith('http')
                                ? img
                                : `${import.meta.env.VITE_API_BASE_URL || 'https://rice-mill-backend.onrender.com'}${img}`;

                              return (
                                <img
                                  src={src}
                                  alt={order.riceType || 'Product'}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.style.display = 'none'; // Hide broken image to show fallback
                                    e.target.parentElement.classList.add('fallback-active');
                                  }}
                                />
                              );
                            }

                            return <span className="text-3xl">🍚</span>;
                          })()}
                        </div>

                        <div>
                          <Link to="/products" className="text-gray-900 font-black hover:text-[#3ba829] text-lg transition-colors leading-tight block mb-1">
                            {order.riceType} ({order.processType || 'Rice Milling'})
                          </Link>
                          <div className="text-sm text-gray-500 mt-1">Quantity: {order.quantityKg} kg</div>
                          <div className="mt-2">
                            <StatusBadge status={order.status} />
                          </div>

                          <div className="mt-4 flex flex-wrap gap-2">
                            <button 
                               onClick={() => handleBuyItAgain(order)}
                               className="bg-yellow-400 border border-yellow-500 hover:bg-yellow-500 text-gray-900 text-sm font-medium px-4 py-1.5 rounded-lg shadow-sm transition-colors flex items-center gap-1"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                              Buy it again
                            </button>
                            <button onClick={() => window.location.href = `/products`} className="bg-white/80 border border-gray-200 hover:bg-white text-gray-700 text-xs font-black uppercase tracking-widest px-5 py-2 rounded-lg shadow-sm transition-all">
                              View Item
                            </button>

                          </div>
                        </div>
                      </div>

                      {/* Timeline Feature */}
                      {expandedOrderId === order._id && <OrderTimeline order={order} />}
                    </div>

                    {/* Action Buttons Sidebar */}
                    <div className="md:w-64 flex flex-col gap-3">
                      {order.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleCompletePayment(order)}
                            className="w-full bg-[#3ba829] border border-[#2d811f] text-white py-1.5 rounded-lg text-sm font-bold shadow-md hover:bg-[#318b22] transition-colors"
                          >
                            Complete Payment
                          </button>
                          <button
                            onClick={() => handleCancelOrder(order._id)}
                            className="w-full bg-white border border-gray-300 text-gray-800 py-1.5 rounded-lg text-sm font-medium shadow-sm hover:bg-gray-50 transition-colors"
                          >
                            Cancel Order
                          </button>
                        </>
                      )}

                      {!order.isReviewed && (
                        <div className="flex flex-col gap-2 mb-1 p-2 bg-green-50/50 rounded-xl border border-green-100">
                          <p className="text-[10px] font-black uppercase tracking-widest text-[#3ba829] text-center">Rate this Product</p>
                          <div className="flex justify-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() => navigate(`/products/p/${order.product?._id || order.product}?tab=Reviews&writeReview=true&rating=${star}`)}
                                className="transform hover:scale-125 transition-transform"
                              >
                                <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.921-.755 1.688-1.54 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.784.57-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {!order.isReviewed && (
                        <button
                          onClick={() => navigate(`/products/p/${order.product?._id || order.product}?tab=Reviews&writeReview=true`)}
                          className="w-full bg-[#3ba829] border border-[#2d811f] text-white py-1.5 rounded-lg text-sm font-bold shadow-md hover:bg-[#318b22] transition-colors"
                        >
                          Write a review about the purchase
                        </button>
                      )}
                      {order.isReviewed && (
                        <button
                          onClick={() => navigate(`/products/p/${order.product?._id || order.product}?tab=Reviews`)}
                          className="w-full bg-white border border-gray-100 text-[#3ba829] py-2 rounded-lg text-xs font-black uppercase tracking-widest shadow-sm hover:bg-green-50 transition-all border-b-2 border-green-200"
                        >
                          See your review
                        </button>
                      )}
                      <button 
                        onClick={() => navigate('/contact')}
                        className="w-full bg-white border border-gray-300 text-gray-800 py-1.5 rounded-lg text-sm font-medium shadow-sm hover:bg-gray-50 transition-colors"
                      >
                        Leave delivery feedback
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      </div> {/* Close relative z-10 */}

      {reviewOrder && (
        <ReviewModal
          order={reviewOrder}
          isOpen={!!reviewOrder}
          onClose={() => setReviewOrder(null)}
          onReviewSuccess={refresh}
        />
      )}

      {selectedInvoiceOrder && (
        <InvoiceModal
          order={selectedInvoiceOrder}
          isOpen={!!selectedInvoiceOrder}
          onClose={() => setSelectedInvoiceOrder(null)}
        />
      )}

      {viewReviewOrder && (
        <ViewReviewModal
          order={viewReviewOrder}
          isOpen={!!viewReviewOrder}
          onClose={() => setViewReviewOrder(null)}
        />
      )}
    </div>
  );
}
