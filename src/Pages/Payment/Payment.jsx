import React from 'react';
import { useParams, useNavigate } from 'react-router';
import UseAxiosSecure from '../../Hooks/UseAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../../Hooks/useAuth';

const Payment = () => {
    const { user } = useAuth();
    const { id } = useParams(); // contest id
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
        if (!contest) return;
        const paymentInfo = {
            cost: contest.price,  // use contest price
            contestId: contest._id,
            userEmail: user.email,
            contestName: contest.name
        };

        const res = await axiosSecure.post('/create-checkout-session', paymentInfo);
        if (res.data.url) {
            window.location.href = res.data.url; // redirect to Stripe/checkout
        }
    };

    if (isLoading) return <span className="loading loading-dots loading-xl"></span>;
    if (!contest) return <p className="text-center mt-10">Contest not found</p>;

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 border rounded-lg">
            <h2 className="text-2xl mb-4">
                Please pay ${contest.price} for "{contest.name}"
            </h2>
            <button onClick={handlePayment} className='btn btn-primary w-full'>
                Pay Now
            </button>
        </div>
    );
};

export default Payment;
