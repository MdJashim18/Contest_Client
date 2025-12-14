import React, { useEffect, useState } from 'react';
import UseAxiosSecure from '../../Hooks/UseAxiosSecure';
import Swal from 'sweetalert2';
import { Link } from 'react-router';

const AllContestAdmin = () => {
    const axiosSecure = UseAxiosSecure();
    const [contests, setContests] = useState([]);

    // ================= Fetch Contests =================
    useEffect(() => {
        axiosSecure.get('/contest')
            .then(res => {
                setContests(res.data);
            })
            .catch(err => {
                console.error(err);
            });
    }, [axiosSecure]);

    // ================= Approve Contest =================
    const handleConfirm = (id) => {
        axiosSecure.patch(`/contest/approve/${id}`)
            .then(res => {
                if (res.data.modifiedCount > 0) {
                    Swal.fire('Approved!', 'Contest has been approved.', 'success');
                    setContests(prev =>
                        prev.map(c =>
                            c._id === id ? { ...c, status: 'approved' } : c
                        )
                    );
                }
            });
    };

    // ================= Reject Contest =================
    const handleReject = (id) => {
        axiosSecure.patch(`/contest/reject/${id}`)
            .then(res => {
                if (res.data.modifiedCount > 0) {
                    Swal.fire('Rejected!', 'Contest has been rejected.', 'info');
                    setContests(prev =>
                        prev.map(c =>
                            c._id === id ? { ...c, status: 'rejected' } : c
                        )
                    );
                }
            });
    };

    // ================= Delete Contest =================
    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This contest will be permanently deleted!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it'
        }).then((result) => {
            if (result.isConfirmed) {
                axiosSecure.delete(`/contest/${id}`)
                    .then(res => {
                        if (res.data.deletedCount > 0) {
                            Swal.fire('Deleted!', 'Contest has been deleted.', 'success');
                            setContests(prev => prev.filter(c => c._id !== id));
                        }
                    });
            }
        });
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">See All Contests</h1>

            <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Price</th>
                            <th>Prize</th>
                            <th>Status</th>
                            <th>Actions</th>
                            <th>Details</th>
                        </tr>
                    </thead>

                    <tbody>
                        {contests.map((contest, index) => (
                            <tr key={contest._id}>
                                <td>{index + 1}</td>
                                <td>{contest.name}</td>
                                <td>{contest.contestType}</td>
                                <td>${contest.price}</td>
                                <td>${contest.prizeMoney}</td>
                                <td>
                                    <span
                                        className={`badge ${contest.status === 'approved'
                                                ? 'badge-success'
                                                : contest.status === 'rejected'
                                                    ? 'badge-error'
                                                    : 'badge-warning'
                                            }`}
                                    >
                                        {contest.status || 'pending'}
                                    </span>
                                </td>
                                <td className="space-x-2">
                                    <button
                                        onClick={() => handleConfirm(contest._id)}
                                        className="btn btn-xs btn-success"
                                        disabled={contest.status === 'approved'}
                                    >
                                        Confirm
                                    </button>

                                    <button
                                        onClick={() => handleReject(contest._id)}
                                        className="btn btn-xs btn-warning"
                                        disabled={contest.status === 'rejected'}
                                    >
                                        Reject
                                    </button>

                                    <button
                                        onClick={() => handleDelete(contest._id)}
                                        className="btn btn-xs btn-error"
                                    >
                                        Delete
                                    </button>
                                </td>
                                <td>
                                    <Link
                                        to = {`/dashboard/contest/${contest._id}`}
                                        className="btn btn-xs btn-info"
                                    >
                                        Details
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {contests.length === 0 && (
                    <p className="text-center mt-4 text-gray-500">
                        No contests found.
                    </p>
                )}
            </div>
        </div>
    );
};

export default AllContestAdmin;
