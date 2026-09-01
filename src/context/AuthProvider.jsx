import { useEffect, useState } from "react";
import { 
  getAuth, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider, 
  signInWithPopup,
  updateProfile 
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

  const googleLogin = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const updateUserProfile = (name, photo) => {
    setLoading(true);
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo
    }).then(() => {
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
          const res = await axiosPublic.get(`/users/check/${currentUser.email}`);
          
          if (res.data.exists === false) {
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
            const userInfo = { email: currentUser.email };
            const tokenRes = await axiosPublic.post('/jwt', userInfo);
            if (tokenRes.data.token) {
              localStorage.setItem('access-token', tokenRes.data.token);
            }
            setUser(currentUser);
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
    logOut,
    googleLogin,
    updateUserProfile,
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