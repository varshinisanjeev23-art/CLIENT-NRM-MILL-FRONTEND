import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        const parsed = savedCart ? JSON.parse(savedCart) : [];
        return parsed.map(item => {
            if (!item.weight) {
                return { ...item, weight: item.quantity >= 10 ? item.quantity : 10, quantity: 1 };
            }
            return item;
        });
    });
    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product, weight = 10, quantity = 1) => {
        const w = Number(weight);
        const q = Number(quantity);
        setCart((prev) => {
            const existing = prev.find((item) => item._id === product._id && item.weight === w);
            if (existing) {
                return prev.map((item) =>
                    item._id === product._id && item.weight === w ? { ...item, quantity: item.quantity + q } : item
                );
            }
            return [...prev, { ...product, weight: w, quantity: q }];
        });
    };

    const removeFromCart = (productId, weight) => {
        setCart((prev) => prev.filter((item) => !(item._id === productId && item.weight === weight)));
    };

    const updateQuantity = (productId, weight, quantity) => {
        setCart((prev) =>
            prev.map((item) => (item._id === productId && item.weight === weight ? { ...item, quantity } : item))
        );
    };

    const updateWeight = (productId, oldWeight, newWeight) => {
        setCart((prev) => {
            // First check if an item with newWeight already exists
            const existingTarget = prev.find(item => item._id === productId && item.weight === newWeight);
            const currentItem = prev.find(item => item._id === productId && item.weight === oldWeight);
            
            if (!currentItem) return prev;

            if (existingTarget) {
                // Combine quantities if transitioning to an existing weight variant
                return prev.map(item => {
                    if (item._id === productId && item.weight === newWeight) {
                        return { ...item, quantity: item.quantity + currentItem.quantity };
                    }
                    return item;
                }).filter(item => !(item._id === productId && item.weight === oldWeight));
            } else {
                // Just update the weight of the current tracking item
                return prev.map(item => (item._id === productId && item.weight === oldWeight ? { ...item, weight: newWeight } : item));
            }
        });
    };

    const clearCart = () => setCart([]);
    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    const cartTotal = cart.reduce((acc, item) => acc + (item.ratePerKg * item.weight * item.quantity), 0);
    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                updateWeight,
                clearCart,
                cartTotal,
                cartCount,
                isCartOpen,
                openCart,
                closeCart
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
