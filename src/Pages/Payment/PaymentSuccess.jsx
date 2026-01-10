import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import UseAxiosSecure from '../../Hooks/UseAxiosSecure';
import Swal from 'sweetalert2';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const axiosSecure = UseAxiosSecure();
    const navigate = useNavigate();
    const [sessionData, setSessionData] = useState(null);
    const [isProcessing, setIsProcessing] = useState(true);

    useEffect(() => {
        if (sessionId) {
            setIsProcessing(true);
            axiosSecure.get(`/payment-session/${sessionId}`)
                .then(res => {
                    setSessionData(res.data);
                    setIsProcessing(false);
                })
                .catch(err => {
                    console.log(err);
                    setIsProcessing(false);
                });
        }
    }, [sessionId, axiosSecure]);

    const handleCompleteRegistration = async () => {
        try {
            if (!sessionData?.userEmail){
                return Swal.fire({
                    icon: 'warning',
                    title: 'Missing Information',
                    text: 'User information not found. Please contact support.',
                    confirmButtonColor: '#3B82F6',
                });
            }

            const res = await axiosSecure.patch(`/contest/register/${sessionData.contestId}`, {
                userEmail: sessionData.userEmail
            });

            if (res.status === 200) {
                localStorage.setItem(
                    'registeredContest',
                    JSON.stringify({
                        contestId: sessionData.contestId,
                        userEmail: sessionData.userEmail
                    })
                );

                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Registration completed successfully!',
                    confirmButtonColor: '#10B981',
                });
                navigate(`/details/${sessionData.contestId}`);
            }
        } catch (error) {
            console.log(error);
            Swal.fire({
                icon: 'error',
                title: 'Registration Failed',
                text: error.response?.data?.message || "Unable to complete registration. Please try again.",
                confirmButtonColor: '#EF4444',
            });
        }
    };


    if (!sessionData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex flex-col items-center justify-center p-6">
                <div className="text-center max-w-md bg-white rounded-2xl shadow-xl p-8">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-red-600 text-3xl">⚠️</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">Payment Session Not Found</h2>
                    <p className="text-gray-600 mb-6">
                        We couldn't retrieve your payment session. Please check if the payment was successful or contact support.
                    </p>
                    <div className="space-y-3">
                        <button
                            onClick={() => navigate('/')}
                            className="w-full bg-gradient-to-r from-gray-700 to-gray-800 text-white font-semibold py-3 px-6 rounded-xl hover:from-gray-800 hover:to-gray-900 transition-all shadow-md"
                        >
                            Return to Home
                        </button>
                        <button
                            onClick={() => navigate('/contests')}
                            className="w-full border-2 border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-xl hover:bg-gray-50 transition-all"
                        >
                            Browse Contests
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex flex-col items-center justify-center p-6">
           
            <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
              
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center text-white">
                    <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-5xl">🎉</span>
                    </div>
                    <h1 className="text-4xl font-bold mb-3">Payment Successful!</h1>
                    <p className="text-green-100 text-lg">
                        Thank you for your payment. You're almost there!
                    </p>
                </div>

         
                <div className="p-8">
                    <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <span className="text-green-600">📋</span>
                            Payment Details
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                                <span className="text-gray-600">Contest Name</span>
                                <span className="font-semibold text-gray-900">{sessionData.contestName}</span>
                            </div>
                            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                                <span className="text-gray-600">Amount Paid</span>
                                <span className="text-2xl font-bold text-green-600">${sessionData.cost}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Payment Method</span>
                                <span className="font-medium text-gray-900 flex items-center gap-2">
                                    <span className="text-blue-600">💳</span>
                                    Stripe
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50 rounded-2xl p-6 mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <span className="text-blue-600">👤</span>
                            Registered To
                        </h3>
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                {sessionData.userName?.[0] || 'U'}
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900 text-lg">{sessionData.userName}</p>
                                <p className="text-gray-600">{sessionData.userEmail}</p>
                            </div>
                        </div>
                    </div>

                   
                    <div className="rounded-2xl border-2 border-dashed border-green-200 bg-green-50/50 p-6 mb-8">
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <span className="text-green-600">📝</span>
                            Next Steps
                        </h4>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <span className="text-green-500 font-bold mt-0.5">1</span>
                                <span className="text-gray-700">Complete registration below to secure your spot</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-green-500 font-bold mt-0.5">2</span>
                                <span className="text-gray-700">Check the contest details for task instructions</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-green-500 font-bold mt-0.5">3</span>
                                <span className="text-gray-700">Submit your entry before the deadline</span>
                            </li>
                        </ul>
                    </div>

                 
                    <div className="space-y-4">
                        <button 
                            onClick={handleCompleteRegistration}
                            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-4 px-6 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200 text-lg"
                        >
                            <div className="flex items-center justify-center gap-3">
                                <span className="text-xl">✅</span>
                                <span>Complete Registration</span>
                            </div>
                        </button>
                        
                        <button 
                            onClick={() => navigate(`/details/${sessionData.contestId}`)}
                            className="w-full border-2 border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-xl hover:bg-gray-50 transition-all"
                        >
                            View Contest Details
                        </button>
                    </div>
                </div>

                
                <div className="bg-gray-50 p-6 border-t border-gray-200">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                <span className="text-gray-600 text-xl">🔒</span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-800">Secure Transaction</p>
                                <p className="text-xs text-gray-500">Encrypted & Protected</p>
                            </div>
                        </div>
                        <div className="text-sm text-gray-600">
                            Need help? <a href="mailto:support@contestplatform.com" className="text-blue-600 hover:underline font-medium">Contact Support</a>
                        </div>
                    </div>
                </div>
            </div>

          
            <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute animate-float"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            fontSize: `${Math.random() * 20 + 10}px`,
                            animationDelay: `${Math.random() * 2}s`,
                            opacity: 0.7,
                        }}
                    >
                        {['🎉', '✨', '🎊', '🥳', '🌟', '💫'][Math.floor(Math.random() * 6)]}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PaymentSuccess;