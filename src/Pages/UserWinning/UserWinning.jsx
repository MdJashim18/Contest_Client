import React, { useEffect, useState } from 'react';
import UseAxiosSecure from '../../Hooks/UseAxiosSecure';
import useAuth from '../../Hooks/useAuth';

const UserWinning = () => {
    const axiosSecure = UseAxiosSecure();
    const { user } = useAuth();

    const [winningContests, setWinningContests] = useState([]);

    useEffect(() => {
        const fetchWinningContests = async () => {
            try {
                const res = await axiosSecure.get('/public-contest');
                const won = res.data.filter(
                    contest => contest.winner?.userEmail === user.email
                );
                setWinningContests(won);
            } catch (err) {
                console.error(err);
            }
        };

        if (user?.email) fetchWinningContests();
    }, [user, axiosSecure]);
    console.log(winningContests)

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">My Winning Contests</h1>
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
                                    {contest.winner.reward}
                                </td>
                                <td>
                                    {contest.prizeDescription || 'Prize details not available'}
                                </td>
                                <td>{contest.winner.selectedAt}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default UserWinning;
