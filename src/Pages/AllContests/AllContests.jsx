import React, { useEffect, useState } from 'react';
import UseAxiosSecure from '../../Hooks/UseAxiosSecure';
import { Link } from 'react-router';

const AllContests = () => {
    const axiosSecure = UseAxiosSecure();
    const [contests, setContests] = useState([]);
    const [loading, setLoading] = useState(true);

    // ================= Fetch All Contests =================
    useEffect(() => {
        axiosSecure.get('/contest')
            .then(res => {
                setContests(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [axiosSecure]);

    if (loading) {
        return (
            <div className="flex justify-center mt-20">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-center mb-8">
                All Contests
            </h2>

            {contests.length === 0 ? (
                <p className="text-center text-gray-500">
                    No contests available
                </p>
            ) : (
                <div className="grid gap-6 
                grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

                    {contests.map(contest => (
                        <div
                            key={contest._id}
                            className="card bg-base-100 shadow-lg rounded-2xl hover:shadow-2xl transition"
                        >
                            <figure>
                                <img
                                    src={contest.image}
                                    alt={contest.name}
                                    className="h-40 w-full object-cover"
                                />
                            </figure>

                            <div className="card-body p-5">
                                <h3 className="card-title text-lg">
                                    {contest.name}
                                </h3>

                                <p className="text-sm text-gray-500 line-clamp-3">
                                    {contest.description}
                                </p>

                                <div className="mt-3 space-y-1 text-sm">
                                    <p>
                                        <span className="font-medium">
                                            Entry Fee:
                                        </span>{' '}
                                        ৳{contest.price}
                                    </p>
                                    <p>
                                        <span className="font-medium">
                                            Prize:
                                        </span>{' '}
                                        ৳{contest.prizeMoney}
                                    </p>
                                    <p>
                                        <span className="font-medium">
                                            Deadline:
                                        </span>{' '}
                                        {new Date(contest.deadline).toLocaleDateString()}
                                    </p>
                                </div>

                                <div className="card-actions justify-between mt-4">
                                    <span
                                        className={`badge ${
                                            contest.status === 'approved'
                                                ? 'badge-success'
                                                : 'badge-warning'
                                        }`}
                                    >
                                        {contest.status}
                                    </span>

                                    <Link
                                        to={`/details/${contest._id}`}
                                        className="btn btn-sm btn-primary"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}

                </div>
            )}
        </div>
    );
};

export default AllContests;
