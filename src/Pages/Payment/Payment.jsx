import React from 'react';
import { useParams, useNavigate } from 'react-router';
import UseAxiosSecure from '../../Hooks/UseAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../../Hooks/useAuth';
import Swal from 'sweetalert2';

const Payment = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = UseAxiosSecure();

  const { isLoading, data: contest } = useQuery({
    queryKey: ['contest', id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/contest/${id}`);
      return res.data;
    }
  });

  const handlePayment = async () => {
    if (!user || !contest) return;

    try {
      const paymentInfo = {
        cost: contest.price,
        contestId: contest._id,
        contestName: contest.name,
        userId: user._id,
        userName: user.displayName || user.name,
        userEmail: user.email
      };

      const res = await axiosSecure.post(
        "/create-checkout-session",
        paymentInfo
      );

      if (res.data?.url) {
        window.location.href = res.data.url;
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Payment Failed',
        text: 'There was an error processing your payment. Please try again.',
        confirmButtonColor: '#3B82F6',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!contest) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">!</span>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Contest Not Found</h2>
          <p className="text-gray-600 mb-6">The contest you're trying to access doesn't exist.</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Complete Your Registration</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Secure your spot in the contest by completing the payment process
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          <div className="lg:w-2/3">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
                <h2 className="text-2xl font-bold mb-2">{contest.name}</h2>
                <p className="text-blue-100">Registration Payment</p>
              </div>

              
              <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-24 h-24 flex-shrink-0">
                    <img 
                      src={contest.image} 
                      alt={contest.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{contest.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <span className="font-bold"></span>
                        <span>Prize: ${contest.prizeMoney}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="font-bold"></span>
                        <span>{contest.participantsCount || 0} Participants</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-2">Contest Description</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {contest.description}
                  </p>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h4 className="font-semibold text-gray-800 mb-4">What's Included:</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="text-green-500 font-bold mt-0.5">✓</span>
                      <span className="text-gray-700">Full contest participation rights</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-500 font-bold mt-0.5">✓</span>
                      <span className="text-gray-700">Submission eligibility for prize money</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-500 font-bold mt-0.5">✓</span>
                      <span className="text-gray-700">Access to all contest resources</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-500 font-bold mt-0.5">✓</span>
                      <span className="text-gray-700">Community support and networking</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/3">
            <div className="sticky top-6">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Payment Summary</h3>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Contest Fee</span>
                      <span className="font-semibold">${contest.price}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Service Fee</span>
                      <span className="text-gray-600">$0.00</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Tax</span>
                      <span className="text-gray-600">$0.00</span>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-900">Total</span>
                        <span className="text-2xl font-bold text-blue-600">${contest.price}</span>
                      </div>
                    </div>
                  </div>

                 
                  <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <h4 className="font-semibold text-gray-800 mb-2">Paying as:</h4>
                    <div className="flex items-center gap-3">
                      
                      <div>
                        <p className="font-medium text-gray-900">
                          {user?.displayName || user?.name || 'User'}
                        </p>
                        <p className="text-sm text-gray-600">{user?.email}</p>
                      </div>
                    </div>
                  </div>

                
                  <button 
                    onClick={handlePayment}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-4 px-6 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-xl"></span>
                      <span>Pay ${contest.price} Now</span>
                    </div>
                    <p className="text-sm font-normal mt-1 text-green-100">
                      Secure payment processed via Stripe
                    </p>
                  </button>

               
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-center gap-2 text-gray-600">
                      <span className="text-lg"></span>
                      <span className="text-sm">Secure SSL Encryption</span>
                    </div>
                    <p className="text-xs text-center text-gray-500 mt-2">
                      Your payment information is secure and encrypted
                    </p>
                  </div>
                </div>
              </div>

            
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-5">
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <span className="text-blue-600"></span>
                  Need Help?
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Have questions about payment or the contest?
                </p>
                <div className="space-y-2">
                  <a 
                    href="mailto:support@contestplatform.com" 
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-2"
                  >
                    <span></span>
                    <span>mdjashimuddinjnn22990@gmail.com</span>
                  </a>
                  <div className="text-sm text-gray-600 flex items-center gap-2">
                    <span></span>
                    <span>1-800-CONTEST</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

 
        <div className="mt-10 text-center">
          <p className="text-sm text-gray-500">
            By proceeding with payment, you agree to our{' '}
            <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>
          </p>
          <button 
            onClick={() => navigate(-1)}
            className="mt-4 text-gray-600 hover:text-gray-800 flex items-center justify-center gap-2 mx-auto"
          >
            <span>←</span>
            <span>Back to Contest Details</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;