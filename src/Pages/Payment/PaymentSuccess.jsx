import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import UseAxiosSecure from '../../Hooks/UseAxiosSecure';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const axiosSecure = UseAxiosSecure();
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionId) {
      axiosSecure.patch('/payment-success', { sessionId })
        .then(() => {
          setTimeout(() => {
            navigate('/'); // or contest details page
          }, 2000);
        });
    }
  }, [sessionId]);

  return (
    <div className="flex justify-center items-center h-screen">
      <h2 className="text-4xl text-green-600 font-bold">
        ✅ Payment Successful!
      </h2>
    </div>
  );
};

export default PaymentSuccess;
