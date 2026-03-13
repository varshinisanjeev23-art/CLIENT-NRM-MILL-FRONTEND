import { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import api from '../services/api';

const COLORS = ['#ff4757', '#ffa502', '#2ed573', '#1e90ff', '#ff6b81', '#fbbf24'];
function randomBetween(min, max) { return Math.random() * (max - min) + min; }

export default function CartSidebar() {
    const {
        cart,
        isCartOpen,
        closeCart,
        removeFromCart,
        updateQuantity,
        updateWeight,
        addToCart,
        cartTotal
    } = useContext(CartContext);
    const navigate = useNavigate();
    const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://rice-mill-backend.onrender.com';
    const [confetti, setConfetti] = useState([]);

    const [recommendations, setRecommendations] = useState([]);
    const [orderCount, setOrderCount] = useState(0);

    useEffect(() => {
        if (isCartOpen) {
            // Check if user is first-time buyer
            api.get('/bookings/order-count')
                .then(res => setOrderCount(res.data.totalOrders || 0))
                .catch(err => console.error(err));
        }
    }, [isCartOpen]);

    useEffect(() => {
        if (isCartOpen) {
            api.get('/products')
                .then(res => {
                    // Get 2-3 products that are NOT already in the cart
                    const inCartIds = cart.map(item => item._id);
                    const filtered = res.data
                        .filter(p => !inCartIds.includes(p._id))
                        .slice(0, 2);
                    setRecommendations(filtered);
                })
                .catch(err => console.error('Error fetching recommendations:', err));
        }
    }, [isCartOpen, cart]);

    useEffect(() => {
        if (isCartOpen && cartTotal >= 699) {
            const pieces = Array.from({ length: 50 }, (_, i) => ({
                id: i,
                left: `${randomBetween(0, 100)}%`,
                size: `${randomBetween(6, 12)}px`,
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                delay: `${randomBetween(0, 3)}s`,
                duration: `${randomBetween(2, 4)}s`
            }));
            setConfetti(pieces);
        } else {
            setConfetti([]);
        }
    }, [isCartOpen, cartTotal]);

    if (!isCartOpen) return null;

    const handleCheckout = () => {
        closeCart();
        if (cart.length === 0) {
            navigate('/products');
        } else {
            navigate('/booking');
        }
    };

    const handleViewCart = () => {
        closeCart();
        navigate('/cart');
    };

    const handleAddRecommendation = (product) => {
        // Find best default weight (skip 1kg if not first order)
        let weight = product.quantityOptions?.[0] || 1;
        if (weight === 1 && orderCount > 0) {
            weight = product.quantityOptions?.find(opt => opt > 1) || 10;
        }
        addToCart(product, weight, 1);
    };

    return (
        <div className="fixed inset-0 z-[100] overflow-hidden">
            <style>{`
                @keyframes fall {
                    0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
                }
                .confetti-p {
                    position: absolute;
                    top: -10vh;
                    animation: fall linear infinite;
                    pointer-events: none;
                    z-index: 101;
                }
            `}</style>

            {/* Confetti Overlay */}
            {confetti.map(p => (
                <div key={p.id} className="confetti-p" style={{
                    left: p.left,
                    width: p.size,
                    height: p.size,
                    backgroundColor: p.color,
                    animationDelay: p.delay,
                    animationDuration: p.duration,
                    borderRadius: Math.random() > 0.5 ? '50%' : '2px'
                }} />
            ))}
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in"
                onClick={closeCart}
            />

            {/* Sidebar */}
            <div className="absolute right-0 top-0 h-full w-full sm:max-w-md bg-white shadow-2xl transition-transform transform translate-x-0 animate-in slide-in-from-right duration-300 pointer-events-auto">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                    <h2 className="text-xl font-black text-gray-900 tracking-tight">SHOPPING CART</h2>
                    <button
                        onClick={closeCart}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="overflow-y-auto h-[calc(100%-280px)] p-6 space-y-6">
                    {/* Free Shipping Progress Indicator */}
                    <div className="space-y-3">
                        {cartTotal >= 699 ? (
                            <div className="flex items-center gap-3 text-green-600 font-bold text-sm">
                                <span>🚚</span>
                                <span>Congratulations! You've got free shipping!</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 text-gray-500 font-bold text-sm">
                                <span>🚚</span>
                                <span>Add <span className="text-blue-600">₹{(699 - cartTotal).toFixed(0)}</span> more for FREE shipping</span>
                            </div>
                        )}
                        <div className="relative h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-green-500 transition-all duration-500"
                                style={{ width: `${Math.min((cartTotal / 699) * 100, 100)}%` }}
                            />
                        </div>
                        {/* Dotted stylized line as seen in screenshot */}
                        <div className="border-b-4 border-dotted border-green-200/50 w-full pt-1"></div>
                    </div>

                    {cart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                            <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            <p className="font-bold text-sm tracking-widest uppercase">Your cart is empty</p>
                            <button
                                onClick={closeCart}
                                className="mt-6 text-green-600 font-black italic hover:underline"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {cart.map((item) => (
                                <div key={`${item._id}-${item.weight}`} className="flex flex-col sm:flex-row gap-4">
                                    {/* Item Image */}
                                    <div className="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 shrink-0">
                                        <img
                                            src={`${API_BASE}${item.images && item.images.length > 0 ? item.images[0] : item.imageUrl}`}
                                            alt={item.name}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>

                                    {/* Item Details */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-bold text-gray-900 mb-1 leading-tight line-clamp-2">
                                            {item.name}
                                        </h3>

                                        {/* Dynamic Weight/Pack Selection for Available Quantities */}
                                        <div className="flex flex-wrap gap-1.5 mb-3">
                                            {(item.quantityOptions && item.quantityOptions.length > 0 ? item.quantityOptions : [1, 5, 10, 25])
                                                .filter(opt => {
                                                    if (opt === 1 && orderCount > 0) return false;
                                                    return true;
                                                })
                                                .map(opt => (
                                                    <button
                                                        key={opt}
                                                        onClick={() => updateWeight(item._id, item.weight, opt)}
                                                        className={`px-2 py-1 rounded-md border font-bold text-[9px] uppercase tracking-tighter transition-all ${item.weight === opt
                                                                ? 'border-[#3ba829] bg-green-50 text-[#3ba829]'
                                                                : 'border-gray-200 text-gray-400 hover:border-gray-300'
                                                            }`}
                                                    >
                                                        {opt}kg
                                                    </button>
                                                ))}
                                        </div>
                                        <div className="text-sm font-black text-[#3ba829] mb-4">
                                            Rs. {(item.ratePerKg * item.weight).toFixed(2)}
                                        </div>

                                        <div className="flex items-center gap-4">
                                            {/* Quantity Selector */}
                                            <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden h-9">
                                                <button
                                                    onClick={() => updateQuantity(item._id, item.weight, Math.max(1, item.quantity - 1))}
                                                    className="w-8 h-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors font-bold"
                                                >
                                                    −
                                                </button>
                                                <div className="w-8 text-center text-xs font-black text-gray-900 border-x border-gray-200">
                                                    {item.quantity}
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        if (item.weight === 1) return;
                                                        updateQuantity(item._id, item.weight, item.quantity + 1);
                                                    }}
                                                    disabled={item.weight === 1}
                                                    className={`w-8 h-full flex items-center justify-center font-bold transition-colors ${item.weight === 1
                                                            ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                                                            : 'text-gray-500 hover:bg-gray-100'
                                                        }`}
                                                >
                                                    +
                                                </button>
                                            </div>

                                            {/* Circular Buttons - Screenshot specific */}
                                            <button
                                                onClick={() => removeFromCart(item._id, item.weight)}
                                                className="w-9 h-9 rounded-full bg-red-50 border border-red-50 flex items-center justify-center text-red-500 hover:bg-red-100 transition-all shadow-sm ml-2"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* You May Also Like Section - Real Products */}
                            {recommendations.length > 0 && (
                                <div className="pt-8 border-t border-gray-100">
                                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] text-center mb-8">You may also like</h4>
                                    <div className="space-y-4">
                                        {recommendations.map(p => (
                                            <div key={p._id} className="bg-gray-50 p-4 rounded-2xl flex items-center gap-4 hover:bg-green-50 transition-colors group">
                                                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center border border-gray-100 group-hover:border-green-200 overflow-hidden shrink-0">
                                                    <img
                                                        src={`${API_BASE}${p.images?.[0] || p.imageUrl}`}
                                                        className="w-full h-full object-contain p-1"
                                                        alt={p.name}
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-xs font-bold text-gray-900 mb-1 leading-tight line-clamp-1">{p.name}</div>
                                                    <div className="text-[10px] font-black text-[#3ba829]">Rs. {p.ratePerKg.toFixed(2)} / kg</div>
                                                </div>
                                                <button
                                                    onClick={() => handleAddRecommendation(p)}
                                                    className="w-9 h-9 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-[#3ba829] group-hover:text-white group-hover:border-[#3ba829] transition-all shadow-sm"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer sticky bottom */}
                <div className="absolute bottom-0 left-0 w-full p-6 bg-white border-t border-gray-100 shadow-[0_-10px_30px_rgba(0,0,0,0.03)] z-10">
                    <div className="flex justify-between items-baseline mb-1">
                        <span className="text-base font-black text-gray-900">Subtotal:</span>
                        <span className="text-lg font-black text-gray-900 border-b-2 border-gray-100">
                            Rs. {cartTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} INR
                        </span>
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold mb-6 italic">
                        Tax included and shipping calculated at checkout
                    </p>

                    <div className="space-y-3 font-black text-xs uppercase tracking-widest">
                        <button
                            onClick={handleViewCart}
                            className="w-full bg-[#1c1c1c] text-white py-4 rounded-lg hover:bg-black transition-all flex items-center justify-center gap-2 group border border-black"
                        >
                            VIEW CART
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </button>
                        <button
                            onClick={handleCheckout}
                            className="w-full bg-[#3ba829] text-white py-4 rounded-lg hover:bg-[#318b22] transition-all flex items-center justify-center gap-2 border border-[#3ba829]"
                        >
                            CHECK OUT
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
