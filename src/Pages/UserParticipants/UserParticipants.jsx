import React, { useEffect, useState } from 'react';
import UseAxiosSecure from '../../Hooks/UseAxiosSecure';
import useAuth from '../../Hooks/useAuth';
import { Link } from 'react-router';

const UserParticipants = () => {
    const axiosSecure = UseAxiosSecure();
    const { user } = useAuth();

    const [contests, setContests] = useState([]);
    const [sortAsc, setSortAsc] = useState(true);

    useEffect(() => {
        const fetchContests = async () => {
            try {
                const res = await axiosSecure.get('/public-contest');
                let userContests = res.data.filter(contest =>
                    contest.participants.some(p => p.userEmail === user.email)
                );

                
                userContests.sort((a, b) => {
                    const dateA = new Date(a.deadline);
                    const dateB = new Date(b.deadline);
                    return sortAsc ? dateA - dateB : dateB - dateA;
                });

                setContests(userContests);
            } catch (err) {
                console.error(err);
            }
        };

        if (user?.email) fetchContests();
    }, [user, axiosSecure, sortAsc]);

    const toggleSort = () => setSortAsc(prev => !prev);

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">My Participated Contests</h1>

            <button
                onClick={toggleSort}
                className="btn btn-sm btn-outline mb-4"
            >
                Sort by Deadline {sortAsc ? '↑' : '↓'}
            </button>
                <div className="overflow-x-auto">
                    <table className="table w-full border">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Deadline</th>
                                <th>Participants</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contests.map(contest => {
                                const isPaid = contest.participants.some(
                                    p => p.userEmail === user.email
                                );
                                return (
                                    <tr key={contest._id}>
                                        <td>{contest.name}</td>
                                        <td>{new Date(contest.deadline).toLocaleDateString()}</td>
                                        <td>{contest.participantsCount}</td>
                                        <td>
                                            <span className={`badge ${isPaid ? 'badge-success' : 'badge-warning'}`}>
                                                {isPaid ? 'Paid' : 'Not Paid'}
                                            </span>
                                        </td>
                                        <td>
                                            <Link to={`/details/${contest._id}`} className="btn btn-sm btn-info">
                                                Details
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
        </div>
    );
};

export default UserParticipants;
