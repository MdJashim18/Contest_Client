import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import UseAxiosSecure from '../../../Hooks/UseAxiosSecure';
import useAuth from '../../../Hooks/useAuth';

const PopularContests = () => {
    const axiosSecure = UseAxiosSecure();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [contests, setContests] = useState([]);
    

    useEffect(() => {
        axiosSecure.get('/contest')
            .then(res => {
                const sorted = res.data.sort(
                    (a, b) => (b.participantsCount || 0) - (a.participantsCount || 0)
                );
                setContests(sorted.slice(0, 6));
            })
            .catch(err => console.error(err));
    }, [axiosSecure]);

 
    const handleDetails = (id) => {
        if (!user) {
            navigate('/login');
        } else {
            navigate(`/Details/${id}`);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-10">
            <h1 className="text-3xl font-bold mb-6 text-center">
                 Popular Contests
            </h1>

          
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {contests.map(contest => (
                    <div
                        key={contest._id}
                        className="card bg-base-100 shadow-lg hover:shadow-xl transition"
                    >
                      
                        <figure>
                            <img
                                src={contest.image}
                                alt={contest.name}
                                className="h-48 w-full object-cover"
                                
                            />

                        </figure>

                       
                        <div className="card-body">
                            <h2 className="card-title">
                                {contest.name}
                            </h2>

                            <p className="text-sm text-gray-600">
                                👥 Participants: {contest.participantsCount || 0}
                            </p>

                            <p className="text-gray-700">
                                {contest.description?.slice(0, 80)}...
                            </p>

                            <div className="card-actions justify-between mt-4">
                                <button
                                    onClick={() => handleDetails(contest._id)}
                                    className="btn btn-sm btn-primary"
                                >
                                    Details
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            
            <div className="text-center mt-8">
                <Link
                    to='all-contests'
                    className="btn btn-outline btn-primary"
                >
                    Show All Contests
                </Link>
            </div>
        </div>
    );
};

export default PopularContests;
