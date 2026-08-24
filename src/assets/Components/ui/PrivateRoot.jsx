import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import PropTypes from 'prop-types';
import { AuthContext } from "../../../context/AuthContext";

const PrivateRoot = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    // লোডিং চেক
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    // ইউজার লগইন করা থাকলে চিলড্রেন দেখাবে
    if (user) {
        return children;
    }

    // লগইন করা না থাকলে লোকেশনসহ রিডাইরেক্ট করবে
    return <Navigate state={{ from: location }} to='/register' replace />;
};

PrivateRoot.propTypes = {
    children: PropTypes.node // PropTypes.func থেকে PropTypes.node তে পরিবর্তন করা হলো
};

export default PrivateRoot;