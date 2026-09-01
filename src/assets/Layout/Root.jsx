import { Outlet } from 'react-router-dom';
import Navbar from '../Components/ui/Navbar'; // আপনার নেভবারের পাথ
import BottomNav from '../Components/ui/BottomNav';
import FloatingCart from '../Components/ui/FloatingCart';

const Root = () => {
  return (
    <div className='bg-gray-100'>
      
        <Navbar cartCount={0} /> {/* নেভবার এখানে থাকবে */}
      <main>
        <Outlet /> {/* এই আউটলেটের জায়গায় Home, Login, Register পেজগুলো রেন্ডার হবে */}
      </main>

      <FloatingCart></FloatingCart>
     
     <BottomNav></BottomNav>
    </div>
  );
};

export default Root;