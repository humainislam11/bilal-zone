import { createContext, useState } from 'react';

 const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    const addToCart = (product, quantity) => {
        const newItem = { ...product, cartQuantity: quantity };
        setCart([...cart, newItem]);
        alert(`${product.name} added to cart!`);
    };

    return (
        <CartContext.Provider value={{ cart, addToCart }}>
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;