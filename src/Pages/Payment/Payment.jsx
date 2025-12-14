import React from 'react';
import { useParams } from 'react-router';
import UseAxiosSecure from '../../Hooks/UseAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../../Hooks/useAuth';

const Payment = () => {
    const { user } = useAuth();
    const { id } = useParams(); // contest id
    const axiosSecure = UseAxiosSecure();

    const { isLoading, data: contest } = useQuery({
        queryKey: ['contest', id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/contest/${id}`);
            return res.data;
        }
    });

    const handlePayment = async () => {
        const paymentInfo = {
            cost: contest.price,
            contestId: contest._id,
            contestName: contest.name,
            userEmail: user.email,
            userId: user._id,
            userName: user.name
        };

        const res = await axiosSecure.post('/create-checkout-session', paymentInfo);
        window.location.href = res.data.url;
    };

    if (isLoading) return <p>Loading...</p>;

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 border rounded">
            <h2 className="text-2xl mb-4">
                Pay ${contest.price} for {contest.name}
            </h2>
            <button onClick={handlePayment} className="btn btn-primary w-full">
                Pay Now
            </button>
        </div>
    );
};

export default Payment;
