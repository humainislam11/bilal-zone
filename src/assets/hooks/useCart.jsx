import { useState, useEffect, useContext } from 'react';
import useAxiosPublic from './useAxiosPublic';
import { AuthContext } from '../../../context/AuthContext';

export const useCart = () => {
    const [cart, setCart] = useState([]);
    const axiosPublic = useAxiosPublic();
    const { user } = useContext(AuthContext);

    const refetch = async () => {
        if (user?.email) {
            try {
                const res = await axiosPublic.get(`/cart?email=${user.email}`);
                setCart(res.data);
            } catch (err) {
                console.error("Cart fetch error:", err);
            }
        }
    };
refetch();
    useEffect(() => {
        
    }, [user?.email]);

    return [cart, refetch];
};