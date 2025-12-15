import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import UseAxiosSecure from '../../Hooks/UseAxiosSecure';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const axiosSecure = UseAxiosSecure();
    const navigate = useNavigate();
    const [sessionData, setSessionData] = useState(null);

    useEffect(() => {
        if (sessionId) {
            axiosSecure.get(`/payment-session/${sessionId}`)
                .then(res => setSessionData(res.data))
                .catch(err => console.log(err));
        }
    }, [sessionId]);

    const handleCompleteRegistration = async () => {
        try {
            if (!sessionData?.userEmail) return alert("User info missing");

            // Patch contest participants
            const res = await axiosSecure.patch(`/contest/register/${sessionData.contestId}`, {
                userEmail: sessionData.userEmail
            });

            if (res.status === 200) {
                // ✅ Save info in localStorage
                localStorage.setItem(
                    'registeredContest',
                    JSON.stringify({
                        contestId: sessionData.contestId,
                        userEmail: sessionData.userEmail
                    })
                );

                alert("Registration completed successfully!");
                navigate(`/details/${sessionData.contestId}`);
            }
        } catch (error) {
            console.log(error);
            alert(error.response?.data?.message || "Registration failed");
        }
    };

    if (!sessionData) return <p className="text-center mt-20">Processing...</p>;

    return (
        <div className="flex flex-col justify-center items-center h-screen gap-4">
            <h2 className="text-4xl text-green-600 font-bold">
                ✅ Payment Successful!
            </h2>
            <p className="text-lg">Click below to complete registration</p>
            <button className="btn btn-primary" onClick={handleCompleteRegistration}>
                Complete Registration
            </button>
        </div>
    );
};

export default PaymentSuccess;
