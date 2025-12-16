import React, { useEffect, useState } from 'react';
import UseAxiosSecure from '../../Hooks/UseAxiosSecure';
import useAuth from '../../Hooks/useAuth';

const UserWinning = () => {
    const axiosSecure = UseAxiosSecure();
    const { user } = useAuth();

    const [winningContests, setWinningContests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWinningContests = async () => {
            try {
                setLoading(true);
                const res = await axiosSecure.get('/contest');
                const won = res.data.filter(
                    contest => contest.winner?.userEmail === user.email
                );
                setWinningContests(won);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };

        if (user?.email) fetchWinningContests();
    }, [user, axiosSecure]);

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">My Winning Contests</h1>

            {loading ? (
                <p>Loading...</p>
            ) : winningContests.length === 0 ? (
                <p>You haven't won any contests yet.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table w-full border">
                        <thead>
                            <tr>
                                <th>Contest Name</th>
                                <th>Prize Amount</th>
                                <th>Prize Details</th>
                                <th>Winning Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {winningContests.map(contest => (
                                <tr key={contest._id}>
                                    <td>{contest.name}</td>
                                    <td>
                                        {contest.prize?.[user.email] 
                                            ? `$${contest.prize[user.email]}` 
                                            : 'N/A'}
                                    </td>
                                    <td>
                                        {contest.prizeDescription || 'Prize details not available'}
                                    </td>
                                    <td>{contest.winner?.wonAt ? new Date(contest.winner.wonAt).toLocaleDateString() : 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default UserWinning;
