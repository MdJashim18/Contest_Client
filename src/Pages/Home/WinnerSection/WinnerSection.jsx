import React, { useEffect, useState } from "react";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";

const WinnerSection = () => {
    const axiosSecure = UseAxiosSecure();

    const [winners, setWinners] = useState([]);
    const [users, setUsers] = useState([]);
    const [matchedWinners, setMatchedWinners] = useState([]);

   
    useEffect(() => {
        axiosSecure.get("/public-contest")
            .then(res => {
                const winnerList = res.data
                    .filter(c => c.winner && Object.keys(c.winner).length > 0)
                    .map(c => ({
                        ...c.winner,
                        contest: c.title
                    }));

                setWinners(winnerList);
            })
            .catch(err => console.error(err));
    }, [axiosSecure]);

   
    useEffect(() => {
        axiosSecure.get("/users")
            .then(res => setUsers(res.data))
            .catch(err => console.error(err));
    }, [axiosSecure]);

    
    useEffect(() => {
        if (winners.length && users.length) {
            const matched = winners.map(winner => {
                const user = users.find(
                    u => u.userEmail === winner.email
                );

                return user
                    ? { ...winner, user }
                    : null;
            }).filter(Boolean);

            setMatchedWinners(matched);
        }
    }, [winners, users]);

   
    const totalPrize = winners.reduce(
        (sum, w) => sum + Number(w.reward || 0),
        0
    );

    return (
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16 text-white my-10">
            <div className="max-w-7xl mx-auto px-6">

               
                <h2 className="text-4xl font-bold text-center mb-4">
                   Our Recent Winners
                </h2>
                <p className="text-center max-w-2xl mx-auto mb-12 text-gray-200">
                    Join thousands of creative minds. Compete, win prizes, and make your mark!
                </p>

                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 text-center">
                    <div className="bg-white/10 p-6 rounded-xl">
                        <h3 className="text-3xl font-bold">{matchedWinners.length}+</h3>
                        <p>Total Winners</p>
                    </div>
                    <div className="bg-white/10 p-6 rounded-xl">
                        <h3 className="text-3xl font-bold"> {totalPrize}</h3>
                        <p>Prize Money Won</p>
                    </div>
                    <div className="bg-white/10 p-6 rounded-xl">
                        <h3 className="text-3xl font-bold">100%</h3>
                        <p>Transparent Results</p>
                    </div>
                </div>

                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {matchedWinners.slice(0, 3).map(winner => (
                        <div
                            key={winner._id}
                            className="bg-white text-black rounded-xl shadow-lg overflow-hidden hover:scale-105 transition"
                        >
                            <img
                                src={winner.user.photoURL}
                                alt={winner.user.displayName}
                                className="h-48 w-full object-cover"
                            />

                            <div className="p-4 text-center">
                                <h3 className="text-xl font-bold">
                                    {winner.user.displayName}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {winner.contest}
                                </p>
                                <p className="text-lg font-semibold mt-2 text-indigo-600">
                                    Won {winner.reward}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

               
                <div className="text-center mt-12">
                    <h3 className="text-2xl font-semibold mb-4">
                         You Could Be the Next Winner!
                    </h3>
                    <p className="mb-6 text-gray-200">
                        Participate in contests, showcase your talent and win exciting prizes.
                    </p>
                    <a href="/contest" className="btn btn-warning px-10">
                        Explore Contests
                    </a>
                </div>

            </div>
        </div>
    );
};

export default WinnerSection;
