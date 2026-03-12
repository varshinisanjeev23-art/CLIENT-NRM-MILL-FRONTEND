import { useContext, useEffect, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import StarRating from '../components/StarRating';
import api from '../services/api';

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, updateWeight, cartTotal, clearCart } = useContext(CartContext);
    const navigate = useNavigate();
    const [stockMap, setStockMap] = useState({});
    const [loadingStock, setLoadingStock] = useState(true);
    const [orderCount, setOrderCount] = useState(0);

    useEffect(() => {
        api.get('/bookings/order-count')
            .then(res => setOrderCount(res.data.totalOrders || 0))
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        api.get('/products')
            .then(res => {
                const map = {};
                res.data.forEach(p => { map[p._id] = p.stockStatus; });
                setStockMap(map);
            })
            .catch(err => console.error(err))
            .finally(() => setLoadingStock(false));
    }, []);

    const hasOutOfStockItems = cart.some(item => stockMap[item._id] === 'Out of Stock');

    if (cart.length === 0) {
        return (
            <div className="min-h-screen relative flex flex-col items-center justify-center p-4 overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="fixed inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1542332606-b3d2706db66d?auto=format&fit=crop&q=80&w=2000"
                        alt="Grain Field"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-green-900/60 backdrop-blur-sm"></div>
                </div>

                <div className="relative z-10 text-center flex flex-col items-center bg-white p-12 rounded-[40px] shadow-2xl border border-green-100">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 border border-green-200">
                        <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                    <h2 className="text-4xl font-black text-gray-900 mb-2 uppercase tracking-tighter">Your cart is empty</h2>
                    <p className="text-gray-500 mb-8 font-medium">Looks like you haven't added anything yet.</p>
                    <Link to="/products" className="bg-green-600 text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-green-700 transition-all shadow-xl">
                        Start Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen">
            {/* 1. Header Banner */}
            <div className="relative h-[300px] w-full flex items-center justify-center overflow-hidden">
                <img 
                    src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=2000" 
                    alt="Rice field banner" 
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40"></div>
                <h1 className="relative z-10 text-white text-5xl md:text-6xl font-black tracking-widest uppercase">
                    SHOPPING CART
                </h1>
            </div>

            <div className="container mx-auto px-4 py-16 max-w-7xl">
                {/* 2. Cart Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-200 text-[11px] font-black uppercase tracking-[0.2em] text-gray-500">
                                <th className="pb-6 w-[45%]">PRODUCT</th>
                                <th className="pb-6">PRICE</th>
                                <th className="pb-6 text-center">QUANTITY</th>
                                <th className="pb-6 text-right">TOTAL</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {cart.map((item) => (
                                <tr key={`${item._id}-${item.weight}`} className="group">
                                    <td className="py-10">
                                        <div className="flex gap-8">
                                            <div className="w-40 h-40 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 shrink-0">
                                                <img 
                                                    src={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${item.images && item.images.length > 0 ? item.images[0] : item.imageUrl}`} 
                                                    className="w-full h-full object-contain" 
                                                    alt={item.name} 
                                                />
                                            </div>
                                            <div className="flex flex-col justify-center">
                                                <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
                                                    {item.name}
                                                </h3>
                                                <div className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">
                                                    Quantity: <span className="text-gray-900">{item.weight}kg</span>
                                                </div>
                                                <div className="flex gap-4">
                                                    <button className="text-gray-400 hover:text-gray-900 transition-colors">
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button 
                                                        onClick={() => removeFromCart(item._id, item.weight)}
                                                        className="text-gray-400 hover:text-red-500 transition-colors"
                                                    >
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-10 align-middle">
                                        <div className="flex flex-col gap-1">
                                            {item.originalPrice && (
                                                <span className="text-sm text-gray-400 line-through">Rs. {(item.originalPrice * item.weight).toFixed(2)}</span>
                                            )}
                                            <span className="text-xl font-black text-[#3ba829]">Rs. {(item.ratePerKg * item.weight).toFixed(2)}</span>
                                        </div>
                                    </td>
                                    <td className="py-10 align-middle">
                                        <div className="flex items-center justify-center mx-auto border-2 border-gray-200 rounded-lg overflow-hidden h-14 w-44">
                                            <button 
                                                onClick={() => updateQuantity(item._id, item.weight, Math.max(1, item.quantity - 1))}
                                                className="w-14 h-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors font-bold text-xl"
                                            >
                                                −
                                            </button>
                                            <div className="flex-1 text-center font-black text-gray-900 border-x border-gray-200 text-lg">
                                                {item.quantity}
                                            </div>
                                            <button 
                                                onClick={() => {
                                                    if (item.weight === 1) return;
                                                    updateQuantity(item._id, item.weight, item.quantity + 1);
                                                }}
                                                disabled={item.weight === 1}
                                                className={`w-14 h-full flex items-center justify-center font-bold text-xl transition-colors ${
                                                    item.weight === 1 
                                                    ? 'bg-gray-100 text-gray-300 cursor-not-allowed' 
                                                    : 'text-gray-500 hover:bg-gray-100 text-black'
                                                }`}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </td>
                                    <td className="py-10 align-middle text-right">
                                        <span className="text-xl font-black text-gray-900 uppercase">
                                            Rs. {(item.ratePerKg * item.weight * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* 3. Footer Section */}
                <div className="grid lg:grid-cols-2 gap-20 mt-16 pt-16 border-t border-gray-100">
                    {/* Left: Note & Coupon */}
                    <div className="space-y-12">
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-4 uppercase tracking-widest italic">Add Order Note</label>
                            <textarea 
                                className="w-full h-32 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3ba829] focus:border-transparent transition-all outline-none resize-none font-medium text-gray-600"
                                placeholder="How can we help you?"
                            ></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-4 uppercase tracking-widest italic text-left">Coupon:</label>
                            <div className="flex gap-4 max-w-md">
                                <input 
                                    type="text" 
                                    placeholder="Enter Code" 
                                    className="flex-1 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3ba829] focus:border-transparent transition-all outline-none font-bold uppercase tracking-widest text-xs"
                                />
                                <button className="bg-gray-900 text-white px-8 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all">Apply</button>
                            </div>
                        </div>
                    </div>

                    {/* Right: Summary */}
                    <div className="flex flex-col items-end">
                        {cartTotal >= 699 && (
                            <div className="mb-8 text-right space-y-2 w-full max-w-md">
                                <div className="text-green-600 font-bold text-sm flex items-center justify-end gap-2 group">
                                    <span className="italic font-black">Congratulations!</span> You've got free shipping!
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-1 flex-1 border-b-8 border-dotted border-green-600/30"></div>
                                    <span className="text-2xl animate-bounce-horizontal">🚚</span>
                                </div>
                            </div>
                        )}

                        <div className="flex items-end gap-4 mb-2">
                            <span className="text-2xl font-black text-gray-900 uppercase italic">SUBTOTAL:</span>
                            <span className="text-3xl font-black text-gray-900 border-b-4 border-gray-100 pb-1">
                                Rs. {cartTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} INR
                            </span>
                        </div>
                        <p className="text-sm text-gray-400 font-medium italic mb-10 text-right">
                            Tax included and shipping calculated at checkout
                        </p>

                        <button 
                            onClick={() => navigate('/booking')}
                            className="bg-[#3ba829] text-white px-20 py-5 rounded-lg font-black uppercase tracking-[0.2em] hover:bg-[#318b22] transition-all text-xs shadow-2xl shadow-green-200/50"
                        >
                            Check Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
