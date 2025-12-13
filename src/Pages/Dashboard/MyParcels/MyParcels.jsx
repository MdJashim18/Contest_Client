import { useQuery } from '@tanstack/react-query';
import React from 'react';
import useAuth from '../../../Hooks/useAuth';
import UseAxiosSecure from '../../../Hooks/UseAxiosSecure';
import { FaRegEdit, FaTrashAlt } from 'react-icons/fa';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import Swal from 'sweetalert2';
import { Link } from 'react-router';

const MyParcels = () => {
    const { user } = useAuth();
    const axiosSecure = UseAxiosSecure();

    // ✅ Get parcels safely
    const { data: parcels = [], refetch } = useQuery({
        queryKey: ['myParcels', user?.email],
        enabled: !!user?.email,   // ✅ prevent crash
        queryFn: async () => {
            const res = await axiosSecure.get(`/parcels?email=${user.email}`);
            return res.data;
        }
    });

    // ✅ Delete parcel
    const handleParcelDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                axiosSecure.delete(`/parcels/${id}`)
                    .then(res => {
                        if (res.data.deletedCount) {
                            refetch();
                            Swal.fire(
                                "Deleted!",
                                "Your parcel has been deleted.",
                                "success"
                            );
                        }
                    });
            }
        });
    };

    // ✅ Payment handler
    const handlePayment = async (parcel) => {
        const paymentInfo = {
            cost: parcel.cost,
            parcelId: parcel._id,
            senderEmail: parcel.senderEmail,
            parcelName: parcel.parcelName
        };

        const res = await axiosSecure.post('/create-checkout-session', paymentInfo);
        window.location.href = res.data.url;
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">
                All of my parcels : {parcels.length}
            </h2>

            <div className="overflow-x-auto">
                <table className="table table-zebra">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Cost</th>
                            <th>Payment Status</th>
                            <th>Delivery Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            parcels.map((parcel, index) => (
                                <tr key={parcel._id}>
                                    <th>{index + 1}</th>
                                    <td>{parcel.parcelName}</td>
                                    <td>{parcel.cost} ৳</td>

                                    <td>
                                        {
                                            parcel.paymentStatus === 'paid' ? (
                                                <span className="text-green-500 font-semibold">
                                                    Paid
                                                </span>
                                            ) : (
                                                <button
                                                    onClick={() => handlePayment(parcel)}
                                                    className="btn btn-sm btn-primary text-black"
                                                >
                                                    Pay
                                                </button>
                                            )
                                        }
                                    </td>

                                    <td>{parcel.deliveryStatus}</td>

                                    <td className="flex gap-2">
                                        {/* View */}
                                        <Link to={`/parcel/${parcel._id}`}>
                                            <button className="btn btn-square hover:bg-primary">
                                                <FaMagnifyingGlass />
                                            </button>
                                        </Link>

                                        {/* Edit */}
                                        <Link to={`/update-parcel/${parcel._id}`}>
                                            <button className="btn btn-square hover:bg-primary">
                                                <FaRegEdit />
                                            </button>
                                        </Link>

                                        {/* Delete */}
                                        <button
                                            onClick={() => handleParcelDelete(parcel._id)}
                                            className="btn btn-square hover:bg-primary"
                                        >
                                            <FaTrashAlt />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyParcels;
