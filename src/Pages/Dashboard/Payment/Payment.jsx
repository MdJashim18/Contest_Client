import React from 'react';
import { useParams } from 'react-router';
import UseAxiosSecure from '../../../Hooks/UseAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../../../Hooks/useAuth';

const Payment = () => {
    const { user } = useAuth()
    const { parcelId } = useParams()
    const axiosSecure = UseAxiosSecure()
    const { isLoading, data: parcel } = useQuery({
        queryKey: ['Parcels', parcelId],
        queryFn: async () => {
            const res = await axiosSecure.get(`/parcels/${parcelId}`)
            return res.data
        }
    })

    const handlePayment = async()=>{
        const paymentInfo = {
            cost : parcel.cost,
            parcelId : parcel._id,
            senderEmail : parcel.senderEmail,
            parcelName : parcel.parcelName
        }

        const res = await axiosSecure.post('/create-checkout-session',paymentInfo)
        console.log(res.data)
        window.location.href = res.data.url;
    }

    if (isLoading) {
        return <span className="loading loading-dots loading-xl"></span>
    }

    return (
        <div>
            <h2>Please Pay ${parcel.cost} for {parcel.parcelName} </h2>
            <button onClick={handlePayment} className='btn btn-primary text-black'>Pay</button>
        </div>
    );
};

export default Payment;