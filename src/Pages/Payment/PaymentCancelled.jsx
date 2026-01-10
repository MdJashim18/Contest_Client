import React from 'react';
import { Link, useNavigate } from 'react-router';

const PaymentCancelled = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex flex-col items-center justify-center p-6">
            <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
            
                <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-8 text-center text-white relative overflow-hidden">
                  
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 left-1/4 w-32 h-32 bg-white rounded-full"></div>
                        <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-white rounded-full"></div>
                    </div>
                    
                    <div className="relative">
                        <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white/30">
                            <span className="text-5xl"></span>
                        </div>
                        <h1 className="text-4xl font-bold mb-3">Payment Cancelled</h1>
                        <p className="text-amber-100 text-lg">
                            Your payment was not completed
                        </p>
                    </div>
                </div>

              
                <div className="p-8">
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 mb-8 border border-gray-200">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                                    <span className="text-amber-600 text-2xl"></span>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">What happened?</h3>
                                <p className="text-gray-600">
                                    You chose to cancel the payment process. No charges have been made to your account. 
                                    Your registration is not complete until payment is successfully processed.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-amber-50 rounded-2xl p-6 mb-8 border border-amber-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <span className="text-amber-600"></span>
                            Possible Reasons
                        </h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-amber-600 text-xs font-bold">1</span>
                                </div>
                                <span className="text-gray-700">You decided not to proceed with the payment</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-amber-600 text-xs font-bold">2</span>
                                </div>
                                <span className="text-gray-700">Payment was interrupted or timed out</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-amber-600 text-xs font-bold">3</span>
                                </div>
                                <span className="text-gray-700">Technical issues with the payment processor</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentCancelled;