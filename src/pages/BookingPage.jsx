import { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import FirstOrderCelebration from '../components/FirstOrderCelebration';

export default function BookingPage() {
  const { user } = useContext(AuthContext);
  const { cart, cartTotal, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [message, setMessage] = useState('');

  // Payment Options State
  const [address, setAddress] = useState({
    pincode: '638151',
    city: 'Erode',
    state: 'TAMIL NADU',
    flat: '',
    area: '',
    name: user?.name || 'Valued Customer',
    email: user?.email || '',
    type: 'home'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Redirect if cart is empty
    if (cart.length === 0) {
      navigate('/products');
      return;
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);



  const validateAddress = () => {
    const newErrors = {};
    if (!address.flat) newErrors.flat = "Please verify your address";
    if (!address.area) newErrors.area = "Enter full address including house, street, area & landmark";
    if (!address.name) newErrors.name = "Please fill out this field.";
    if (!address.email) newErrors.email = "Please fill out this field.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (validateAddress()) {
      setShowAddressModal(false);
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      alert('Please sign in to complete checkout.');
      return;
    }

    if (cartTotal <= 0) {
      alert('Cart is empty');
      return;
    }

    try {
      const riceTypeSummary = cart.map(item => `${item.name} (${item.weight}kg)`).join(', ');

      // Calculate total weight (SUM of each item's weight * quantity)
      const totalWeight = cart.reduce((acc, item) => {
        const unitWeight = Number(item.weight || 0);
        const quantity = Number(item.quantity || 1);
        return acc + (unitWeight * quantity);
      }, 0);

      const booking = await api.post('/bookings', {
        riceType: riceTypeSummary,
        costPerKg: cart.length > 0 ? cart[0].ratePerKg : 0,
        quantityKg: totalWeight,
        notes: `Delivery to ${address.flat}, ${address.area}, ${address.city}, ${address.pincode} (${address.type})`,
        totalAmount: cartTotal,
        productId: cart.length > 0 ? cart[0]._id : null,
        productImage: cart.length > 0 ? (cart[0].imageUrl || (cart[0].images && cart[0].images[0])) : null
      });

      const orderRes = await api.post('/payments/order', {
        amount: cartTotal,
        bookingId: booking.data._id
      });

      const { orderId, key, amount, currency, paymentId } = orderRes.data;

      if (!window.Razorpay) {
        alert('Razorpay SDK failed to load. Please check your internet connection and try again.');
        return;
      }

      const options = {
        key, amount, currency,
        name: 'NRM Rice Mill',
        description: 'Secure Checkout',
        order_id: orderId,
        handler: async function (response) {
          try {
            await api.post('/payments/verify', {
              ...response, paymentId, bookingId: booking.data._id
            });
            clearCart();
            navigate('/my-orders');
          } catch (verifyErr) {
            console.error('Payment verification failed:', verifyErr);
            alert('Payment verification failed. Please contact support if amount was deducted.');
          }
        },
        prefill: {
          name: address.name,
          email: address.email,
        },
        theme: { color: '#3ba829' },
        modal: {
          ondismiss: function () {
            console.log('Razorpay checkout was closed by the user');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error);
        alert(`Payment failed: ${response.error.description}`);
      });
      rzp.open();
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || 'Checkout failed. Please try again.';
      alert(errorMsg);
    }
  };

  const handleBackClick = () => {
    setShowCancelModal(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <p className="text-gray-500 font-medium mb-12">Securing your Checkout...</p>
        <div className="relative w-24 h-24 mt-4 animate-bounce">
          <div className="absolute inset-0 bg-[#fbc531] rounded-lg rotate-45 transform origin-center translate-x-[-15px]"></div>
          <div className="absolute inset-0 bg-[#00509d] rounded-lg rotate-45 transform origin-center translate-x-[15px] opacity-90 z-10"></div>
        </div>
        <p className="text-xs text-gray-400 mt-16 font-semibold flex items-center gap-2">
          Powered by <span className="text-[#3ba829] font-black tracking-wider text-sm flex items-center">NRM Secure</span>
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111111] flex justify-center sm:py-8 font-sans overflow-x-hidden">

      {/* Cancellation Modal Overlay */}
      {showCancelModal && (
        <div className="fixed inset-0 z-[120] bg-black/60 flex flex-col justify-end sm:justify-center items-center sm:p-4 transition-all duration-300">
          <div className="bg-white w-full max-w-md rounded-t-[28px] sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-300 relative">
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-gray-200 rounded-full sm:hidden"></div>
            <div className="px-6 pt-8 pb-4">
              <h2 className="text-[20px] font-black text-black mb-1 leading-tight tracking-tight">Wait, are you sure?</h2>
              <p className="text-[15px] font-semibold text-black mb-6 tracking-tight">Products in huge demand might run <span className="text-[#ea580c]">Out of Stock</span></p>

              <p className="text-sm font-medium text-black mb-4">Let us know what went wrong.</p>

              <div className="space-y-4 mb-2 max-h-[35vh] overflow-y-auto pr-2 custom-scrollbar">
                {[
                  "I found a better price or product elsewhere",
                  "I want to add or modify items in my cart",
                  "I find pricing too high or unclear",
                  "I am not sure about quality and return/exchange policy",
                  "I am facing issues in applying coupons",
                  "I am not sure about the delivery dates",
                  "Others"
                ].map((option, idx) => (
                  <label key={idx} className="flex items-start gap-3 cursor-pointer group">
                    <input type="checkbox" className="mt-[3px] w-4 h-4 rounded border-gray-300 text-black focus:ring-black accent-black" />
                    <span className="text-[14px] font-normal text-black">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="p-4 bg-white border-t border-gray-100/50 shadow-[0_-5px_20px_rgba(0,0,0,0.03)] rounded-t-[20px] relative z-20">
              <p className="text-[15px] font-medium text-black mb-3">Do you want to still cancel the payment?</p>
              <div className="flex gap-3 h-12">
                <button onClick={() => setShowCancelModal(false)} className="flex-1 bg-black text-white font-semibold text-[15px] rounded-xl hover:bg-gray-800 transition-colors tracking-wide">
                  Continue Shopping
                </button>
                <button onClick={() => navigate(-1)} className="flex-1 bg-white border border-black text-black font-semibold text-[15px] rounded-xl hover:bg-gray-50 transition-colors tracking-wide">
                  Skip and exit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Dropdown Modal */}
      {showCartDropdown && (
        <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex justify-center pt-0 sm:pt-16 pb-0 sm:pb-4 transition-all duration-300">
          <div className="bg-white w-full max-w-[480px] sm:rounded-3xl shadow-2xl flex flex-col h-full sm:h-auto sm:max-h-[85vh] animate-in slide-in-from-top-4 duration-300">

            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white sm:rounded-t-3xl">
              <button onClick={() => setShowCartDropdown(false)} className="p-2 -ml-2 text-gray-800 rounded-full hover:bg-gray-100">
                <svg className="w-5 h-5 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
              </button>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center p-1 bg-green-50">
                  <span className="text-[#6a5e42] font-black text-xs font-serif italic">NRM</span>
                </div>
              </div>

              <div className="text-right flex items-center gap-1 cursor-pointer" onClick={() => setShowCartDropdown(false)}>
                <div className="leading-tight">
                  <p className="text-[10px] text-gray-500 font-medium">{cart.length} items</p>
                  <p className="text-sm font-extrabold text-gray-900">₹{cartTotal.toLocaleString()}</p>
                </div>
                <svg className="w-4 h-4 text-gray-500 rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>



            <div className="flex-1 overflow-y-auto px-6 py-6 border-b border-gray-100">
              {cart.map((item, i) => (
                <div key={i} className="flex gap-4 mb-6">
                  <div className="w-20 h-20 rounded-xl bg-gray-50 border border-gray-200 overflow-hidden shrink-0">
                    <img src={`${import.meta.env.VITE_API_BASE_URL || 'https://rice-mill-backend.onrender.com'}${item.imageUrl || item.images?.[0]}`} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-semibold text-[15px] text-gray-900 leading-tight pr-4">{item.name}</h4>
                      <span className="font-bold text-[15px]">₹{(item.ratePerKg * item.weight * item.quantity)}</span>
                    </div>
                    <p className="text-gray-500 text-sm mt-1">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}

              <div className="bg-gray-50 rounded-2xl p-4 space-y-3 mt-4">
                <div className="flex justify-between items-center text-sm font-medium text-black">
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-medium text-black">
                  <span>Shipping</span>
                  <span className="text-[#3ba829] font-bold tracking-tight">Free</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white sm:rounded-b-3xl">
              <div className="flex justify-between items-center text-[18px] font-bold text-black tracking-tight">
                <span>To Pay</span>
                <span>₹{cartTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Address Modal Overlay */}
      {showAddressModal && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm sm:items-center items-end pb-0 sm:pb-4 transition-all">
          <div className="bg-white w-full max-w-md rounded-t-[28px] sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-300 max-h-[90vh] flex flex-col pt-3 relative">
            <div className="flex justify-center mb-2 sm:hidden absolute top-2 left-1/2 -translate-x-1/2 w-full">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
            </div>

            <div className="px-6 py-4 flex justify-between items-center relative mt-3">
              <div className="flex-1"></div>
              <button onClick={() => setShowAddressModal(false)} className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 absolute right-4 top-0">✕</button>
            </div>

            <div className="px-6 pb-6 overflow-y-auto custom-scrollbar">
              <form onSubmit={handleAddressSubmit} className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Add Delivery Address</h3>
                  <div className="space-y-4">
                    {/* Floating Labels */}
                    <div className="relative">
                      <input type="text" id="pincode" value={address.pincode} onChange={e => setAddress({ ...address, pincode: e.target.value })} className="block px-4 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:border-[#3ba829] peer" placeholder=" " />
                      <label htmlFor="pincode" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] bg-white px-2 peer-focus:text-[#3ba829] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 left-2">Pincode *</label>
                    </div>
                    <div className="flex gap-4">
                      <div className="relative flex-1">
                        <input type="text" id="city" value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} className="block px-4 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:border-[#3ba829] peer" placeholder=" " />
                        <label htmlFor="city" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] bg-white px-2 left-2 peer-focus:text-[#3ba829]">City *</label>
                      </div>
                      <div className="relative flex-1">
                        <input type="text" id="state" value={address.state} disabled className="block px-4 pb-2.5 pt-5 w-full text-sm text-gray-500 bg-gray-50 rounded-lg border border-gray-200 appearance-none" placeholder=" " />
                        <label className="absolute text-sm text-gray-400 transform -translate-y-4 scale-75 top-4 bg-gray-50 px-2 left-2">State *</label>
                      </div>
                    </div>
                    <div className="relative">
                      <input type="text" id="flat" value={address.flat} onChange={e => setAddress({ ...address, flat: e.target.value })} className={`block px-4 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-transparent rounded-lg border ${errors.flat ? 'border-red-500' : 'border-gray-300'} appearance-none focus:outline-none focus:border-[#3ba829] peer`} placeholder=" " />
                      <label className={`absolute text-sm ${errors.flat ? 'text-red-500' : 'text-gray-500'} duration-300 transform -translate-y-4 scale-75 top-4 bg-white px-2 left-2 peer-focus:text-[#3ba829] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2`}>Flat, House no. *</label>
                      {errors.flat && <p className="text-red-500 text-[11px] mt-1 absolute -bottom-4 left-1">{errors.flat}</p>}
                    </div>
                    <div className="relative mt-6">
                      <input type="text" id="area" value={address.area} onChange={e => setAddress({ ...address, area: e.target.value })} className={`block px-4 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-transparent rounded-lg border ${errors.area ? 'border-red-500' : 'border-gray-300'} appearance-none focus:outline-none focus:border-[#3ba829] peer`} placeholder=" " />
                      <label className={`absolute text-sm ${errors.area ? 'text-red-500' : 'text-gray-500'} duration-300 transform -translate-y-4 scale-75 top-4 bg-white px-2 left-2 peer-focus:text-[#3ba829] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2`}>Apartment, Area, Sector, Village *</label>
                      {errors.area && <p className="text-red-500 text-[11px] mt-1 absolute -bottom-4 left-1">{errors.area}</p>}
                    </div>
                  </div>
                </div>
                <div className="pt-4">
                  <h3 className="text-[15px] font-medium text-gray-900 mb-4">Customer Information</h3>
                  <div className="space-y-6">
                    <div className="relative">
                      <input type="text" id="name" value={address.name} onChange={e => setAddress({ ...address, name: e.target.value })} className={`block px-4 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-transparent rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300'} appearance-none focus:outline-none focus:border-[#3ba829] peer`} placeholder=" " />
                      <label className={`absolute text-sm ${errors.name ? 'text-red-500' : 'text-gray-500'} transform -translate-y-4 scale-75 top-4 bg-white px-2 left-2 peer-focus:text-[#3ba829] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2`}>Full Name *</label>
                    </div>
                    <div className="relative">
                      <input type="email" id="email" value={address.email} onChange={e => setAddress({ ...address, email: e.target.value })} className={`block px-4 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-transparent rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} appearance-none focus:outline-none focus:border-[#3ba829] peer`} placeholder=" " />
                      <label className={`absolute text-sm ${errors.email ? 'text-red-500' : 'text-gray-500'} transform -translate-y-4 scale-75 top-4 bg-white px-2 left-2 peer-focus:text-[#3ba829] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2`}>Email Address *</label>
                      {errors.email && (
                        <div className="absolute right-0 -top-6 bg-[#2d2d2d] text-white text-[11px] px-2 py-1.5 rounded shadow-lg before:content-[''] before:absolute before:-bottom-1 before:right-4 before:border-4 before:border-transparent before:border-t-[#2d2d2d]">
                          Please fill out this field.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-[15px] font-medium text-gray-900 mb-3">Save Address As</h3>
                  <div className="flex gap-3">
                    {['home', 'work'].map(t => (
                      <button key={t} type="button" onClick={() => setAddress({ ...address, type: t })} className={`capitalize px-6 py-2 rounded-full border text-sm font-medium flex items-center gap-2 ${address.type === t ? 'border-[#3ba829] text-[#3ba829]' : 'border-gray-300 text-gray-500'}`}>
                        {t}
                        <div className={`w-[14px] h-[14px] rounded-full border-[1.5px] flex items-center justify-center ${address.type === t ? 'border-[#3ba829]' : 'border-black'}`}>
                          {address.type === t && <div className="w-[6px] h-[6px] bg-[#3ba829] rounded-full"></div>}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="border border-green-200 rounded-xl p-4 mt-2 mb-2 bg-[#f8fdf6]">
                  <p className="text-sm font-medium mb-3">Shipping Method</p>
                  <div className="flex justify-between items-center bg-white border border-[#3ba829] rounded-lg p-3">
                    <div>
                      <p className="text-sm font-semibold">Shipping</p>
                      <span className="bg-[#0acc72] text-white text-[10px] uppercase font-bold px-2.5 py-0.5 rounded shadow-sm">Free</span>
                    </div>
                    <div className="w-[14px] h-[14px] rounded-full border-[1.5px] border-[#3ba829] flex items-center justify-center">
                      <div className="w-[6px] h-[6px] bg-[#3ba829] rounded-full"></div>
                    </div>
                  </div>
                </div>
                <button type="submit" className="w-full bg-[#3ba829] hover:bg-[#318b22] text-white py-3.5 rounded-xl font-bold text-[15px] transition-colors mt-4">Continue</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Main Checkout Container */}
      <div className="w-full max-w-[480px] bg-[#f8f9fa] sm:rounded-[1.5rem] sm:shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden flex flex-col relative sm:border border-gray-200">

        {/* Checkout Header */}
        <div className="bg-white flex items-center justify-between px-4 py-3 z-10 sticky top-0 shadow-sm shadow-gray-100/50">
          <button onClick={handleBackClick} className="p-2 -ml-2 text-gray-800 rounded-full hover:bg-gray-100 transition-colors">
            <svg className="w-5 h-5 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center p-1 bg-green-50 shadow-sm">
              <span className="text-[#6a5e42] font-black text-xs font-serif italic">NRM</span>
            </div>
          </div>

          <div className="text-right cursor-pointer group px-2 py-1 flex items-center gap-1 hover:bg-gray-50 rounded-lg transition-colors" onClick={() => setShowCartDropdown(true)}>
            <div className="leading-tight text-right">
              <p className="text-[10px] text-gray-500 font-medium">{cart.length} items</p>
              <p className="text-[15px] font-extrabold text-gray-900 tracking-tight">₹{cartTotal.toLocaleString()}</p>
            </div>
            <svg className="w-[18px] h-[18px] text-gray-600 group-hover:translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>



        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#f4f5f7] px-4 py-5 space-y-5">

          {/* Delivery Details */}
          <div className="bg-white rounded-[24px] p-[18px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100/80 relative">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 w-[34px] h-[34px] rounded-full bg-[#f8f9fa] flex items-center justify-center shrink-0 border border-gray-100">
                <svg className="w-[18px] h-[18px] text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>

              <div className="flex-1 min-w-0 pr-16 mt-1">
                <p className="font-extrabold text-[15px] truncate text-black mb-1">Deliver To {address.name}</p>
                <p className="text-[13px] text-gray-500 leading-snug truncate">
                  {address.flat ? `${address.flat}, ${address.area}, ${address.city}` : 'Add your delivery address'}
                </p>
                <p className="text-[13px] text-gray-500 leading-snug">
                  {address.state}, {address.pincode}
                </p>
                <p className="text-[12px] text-gray-400 mt-2 font-medium">
                  +91 9442352398 <span className="mx-1.5 opacity-50">|</span> <span className="truncate inline-block w-28 align-bottom">{address.email}</span>
                </p>
              </div>
            </div>

            <button onClick={() => setShowAddressModal(true)} className="absolute top-[18px] right-[18px] bg-white border border-black/80 text-black text-[12px] font-bold px-[14px] py-[6px] rounded-[6px] shadow-sm hover:bg-gray-50 transition-colors">Change</button>

            <div className="mt-5 bg-gray-50/70 rounded-[12px] p-[14px] flex flex-col justify-center border border-gray-100">
              <p className="text-[13px] text-gray-800 font-medium">Shipping</p>
              <span className="bg-[#3ba829] text-white text-[10px] uppercase font-black px-2 py-0.5 rounded shadow-sm w-max mt-1.5 tracking-wider">Free</span>
            </div>
          </div>

          {/* Payment Options Header Container */}
          <div className="bg-white rounded-[24px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100/80 overflow-hidden relative p-6 mt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Methods</h3>
            <p className="text-sm text-gray-500 mb-6">Choose your preferred payment method to complete the booking.</p>

            <div className="space-y-3">
              <button onClick={handleCheckout} className="w-full bg-[#f8f9fa] hover:bg-gray-100 text-gray-900 rounded-[14px] p-4 flex justify-between items-center transition-all border border-gray-200 group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                    <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2L8 22H16L18 2Z" /><path d="M6 2L2 14H10L6 2Z" /></svg>
                  </div>
                  <span className="font-semibold text-[15px]">UPI (Google Pay, PhonePe, etc.)</span>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
              </button>

              <button onClick={handleCheckout} className="w-full bg-[#f8f9fa] hover:bg-gray-100 text-gray-900 rounded-[14px] p-4 flex justify-between items-center transition-all border border-gray-200 group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                    <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                  </div>
                  <span className="font-semibold text-[15px]">Debit / Credit Cards</span>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
              </button>

              <button onClick={handleCheckout} className="w-full bg-[#f8f9fa] hover:bg-gray-100 text-gray-900 rounded-[14px] p-4 flex justify-between items-center transition-all border border-gray-200 group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                    <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg>
                  </div>
                  <span className="font-semibold text-[15px]">Net Banking</span>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>

          {/* Main Checkout Button */}
          <div className="px-1 pt-4 pb-8">
            <button
              onClick={handleCheckout}
              className="w-full bg-[#3ba829] hover:bg-[#318b22] text-white rounded-[16px] p-5 flex justify-between items-center transition-all shadow-[0_8px_20px_rgba(59,168,41,0.25)] border-b-4 border-[#2d811f]"
            >
              <div className="flex items-center gap-3">
                <svg className="w-[22px] h-[22px] opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                <span className="font-bold text-[18px] tracking-tight">Proceed to Pay</span>
              </div>
              <div className="flex items-center gap-1 font-black text-[20px]">
                ₹{cartTotal.toLocaleString()}
                <svg className="w-[20px] h-[20px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
              </div>
            </button>
          </div>

          <div className="flex flex-col items-center pt-2 pb-6">
            {/* Sticky log in plate - Like screenshot */}
            <div className="w-full bg-white rounded-[12px] border border-gray-200 p-4 flex justify-between items-center shadow-sm mt-8">
              <div className="flex items-center gap-[10px] text-gray-800">
                <svg className="w-6 h-6 text-gray-500 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span className="text-[15px] font-normal tracking-tight text-black">Logged in using <span className="font-bold ml-1">+91 63849 92398</span></span>
              </div>
              <button className="text-[15px] font-bold text-black hover:opacity-70 transition-opacity">Logout</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
