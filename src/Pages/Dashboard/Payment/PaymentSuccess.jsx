import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router';
import UseAxiosSecure from '../../../Hooks/UseAxiosSecure';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id')
    console.log(sessionId)
    const axiosSecure = UseAxiosSecure()

    useEffect(() => {
        if (sessionId) {
            axiosSecure.patch(`/payment-success`)
        }
    }, [sessionId])
    return (
        <div>
            <h2 className="text-4xl">Payment Successful</h2>
        </div>
    );
};

export default PaymentSuccess;