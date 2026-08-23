import { useEffect, useState } from "react";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider, 
  signInWithPopup,
  updateProfile // 👈 ফায়ারবেস থেকে এটি ইম্পোর্ট করা হয়েছে
} from "firebase/auth";
import PropTypes from 'prop-types';
import { AuthContext } from "./AuthContext"; 
import app from "../firebase/config";
import useAxiosPublic from "../assets/hooks/useAxiosPublic";
import Swal from "sweetalert2";

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
   
  const axiosPublic = useAxiosPublic();

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const googleLogin = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  // 🌟 ইউজার প্রোফাইল আপডেট করার ফাংশনটি এখানে যোগ করা হয়েছে
  const updateUserProfile = (name, photo) => {
    setLoading(true);
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo
    }).then(() => {
      // লোকাল স্টেট আপডেট করা যাতে UI এ সাথে সাথে পরিবর্তন দেখা যায়
      setUser({ ...auth.currentUser });
      setLoading(false);
    }).catch((error) => {
      setLoading(false);
      throw error;
    });
  };

  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log('user in the auth state changed', currentUser);
      
      if (currentUser?.email) {
        try {
          // ব্যাকএন্ডে চেক করা হচ্ছে ইউজার ডাটাবেজে আছে কি না
          const res = await axiosPublic.get(`/users/check/${currentUser.email}`);
          
          if (res.data.exists === false) {
            // যদি ডাটাবেজে না থাকে, তবে ফায়ারবেস থেকে লগআউট করে দেবো
            await signOut(auth);
            setUser(null);
            localStorage.removeItem('access-token');
            Swal.fire({
              icon: 'error',
              title: 'অ্যাক্সেস অস্বীকৃত!',
              text: 'আপনার অ্যাকাউন্টটি ডিলিট বা ব্লক করা হয়েছে।',
              confirmButtonText: 'ঠিক আছে'
            });
          } else {
            // ডাটাবেজে থাকলে ইউজার সেট করব এবং JWT টোকেন জেনারেট করব
            setUser(currentUser);
            const userInfo = { email: currentUser.email };
            const tokenRes = await axiosPublic.post('/jwt', userInfo);
            if (tokenRes.data.token) {
              localStorage.setItem('access-token', tokenRes.data.token);
            }
          }
        } catch (error) {
          console.error("Error checking user in database:", error);
          setUser(currentUser);
        }
      } else {
        setUser(null);
        localStorage.removeItem('access-token');
      }
      
      setLoading(false);
    });

    return () => unSubscribe();
  }, [axiosPublic]);

  const authData = {
    user,
    loading,
    createUser,
    signIn,
    logOut,
    googleLogin,
    updateUserProfile, // 👈 এটি এখানে যুক্ত করা হয়েছে যাতে অন্য কম্পোনেন্ট থেকে ব্যবহার করা যায়
  };

  return (
    <AuthContext.Provider value={authData}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default AuthProvider;