import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import { FiCreditCard, FiCheckCircle, FiClock } from 'react-icons/fi';

const PaymentHistory = () => {
  const { user } = useContext(AuthContext);
  const axiosPublic = useAxiosPublic();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      axiosPublic.get(`/orders?email=${user.email}`)
        .then(res => {
          const userPayments = res.data.filter(order => order.email === user.email);
          setPayments(userPayments);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching payment history:", err);
          setLoading(false);
        });
    }
  }, [axiosPublic, user?.email]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-black text-gray-800">Payment History</h1>
        <p className="text-sm text-gray-500">View all your transaction history and payment statuses.</p>
      </div>

      {payments.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-gray-100 shadow-sm text-center">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
            <FiCreditCard />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">No payment history found</h3>
          <p className="text-sm text-gray-500">You haven't made any transactions yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase text-xs tracking-wider">
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Payment Method</th>
                  <th className="p-4">Transaction ID (TrxID)</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {payments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-mono text-xs text-gray-500">
                      {payment._id}
                    </td>

                    <td className="p-4 font-bold text-gray-800 uppercase">
                      <span className={`inline-block px-2.5 py-1 rounded-lg text-xs ${
                        payment.paymentMethod === 'bkash' ? 'bg-pink-50 text-pink-600' :
                        payment.paymentMethod === 'nagad' ? 'bg-orange-50 text-orange-600' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {payment.paymentMethod || 'Cash on Delivery'}
                      </span>
                    </td>

                    <td className="p-4 font-mono text-xs text-gray-600 font-bold">
                      {payment.transactionId || 'N/A'}
                    </td>

                    <td className="p-4 font-black text-blue-600">
                      ৳{payment.totalPrice}
                    </td>

                    {/* ডেট দেখানোর ফিক্সড অংশ */}
                    <td className="p-4 text-xs text-gray-500">
                      {payment.createdAt 
                        ? new Date(payment.createdAt).toLocaleDateString() 
                        : payment._id 
                          ? new Date(parseInt(payment._id.substring(0, 8), 16) * 1000).toLocaleDateString() 
                          : 'N/A'}
                    </td>

                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold capitalize ${
                        payment.status === 'approved' || payment.status === 'Delivered' ? 'bg-green-50 text-green-600 border border-green-200' :
                        payment.status === 'Processing' ? 'bg-blue-50 text-blue-600 border border-blue-200' :
                        'bg-yellow-50 text-yellow-600 border border-yellow-200'
                      }`}>
                        {payment.status === 'approved' || payment.status === 'Delivered' ? <FiCheckCircle /> : <FiClock />}
                        {payment.status || 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;