import React, { useEffect, useState } from 'react';
import UseAxiosSecure from '../../Hooks/UseAxiosSecure';
import useAuth from '../../Hooks/useAuth';
import Swal from 'sweetalert2';
import { Link } from 'react-router';

const ShowContestTable = () => {
    const axiosSecure = UseAxiosSecure();
    const { user } = useAuth();
    const [contests, setContests] = useState([]);
    const [loading, setLoading] = useState(true);

    // ================= Fetch My Contests =================
    useEffect(() => {
        if (user?.email) {
            console.log(user.email)
            axiosSecure
                .get(`/contest`)
                .then(res => {
                    // Filter contests created by this user
                    const myContests = res.data.filter(
                        contest => contest.creatorEmail === user.email
                    );
                    console.log(myContests)
                    setContests(myContests);
                    setLoading(false);
                });
        }
    }, [axiosSecure, user]);

    // ================= Delete Contest =================
    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This contest will be permanently deleted!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                axiosSecure.delete(`/contest/${id}`)
                    .then(() => {
                        setContests(prev =>
                            prev.filter(contest => contest._id !== id)
                        );

                        Swal.fire(
                            'Deleted!',
                            'Contest has been deleted.',
                            'success'
                        );
                    });
            }
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center mt-20">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-center mb-6">
                My Created Contests
            </h2>

            {contests.length === 0 ? (
                <p className="text-center text-gray-500">
                    You have not created any contest yet
                </p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Contest Name</th>
                                <th>Prize</th>
                                <th>Status</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {contests.map((contest, index) => (
                                <tr key={contest._id}>
                                    <td>{index + 1}</td>

                                    <td className="font-medium">
                                        {contest.name}
                                    </td>

                                    <td>৳{contest.prizeMoney}</td>

                                    <td>
                                        <span
                                            className={`badge ${contest.status === 'approved'
                                                ? 'badge-success'
                                                : contest.status === 'rejected'
                                                    ? 'badge-error'
                                                    : 'badge-warning'
                                                }`}
                                        >
                                            {contest.status}
                                        </span>
                                    </td>

                                    <td>
                                        <div className="flex flex-wrap gap-2 justify-center">

                                            {/* Edit (only pending) */}
                                            {contest.status === 'pending' && (
                                                <Link
                                                    to={`/dashboard/edit-contest/${contest._id}`}
                                                    className="btn btn-xs btn-info"
                                                >
                                                    Edit
                                                </Link>
                                            )}

                                            {/* Delete (only pending) */}
                                            {contest.status === 'pending' && (
                                                <button
                                                    onClick={() =>
                                                        handleDelete(contest._id)
                                                    }
                                                    className="btn btn-xs btn-error"
                                                >
                                                    Delete
                                                </button>
                                            )}

                                            {/* See Submissions */}
                                            <Link
                                                to={`/dashboard/contest-submissions/${contest._id}`}
                                                className="btn btn-xs btn-outline"
                                            >
                                                See Submissions
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ShowContestTable;
