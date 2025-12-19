import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { FaPlusCircle, FaListAlt } from "react-icons/fa";
import UseAxiosSecure from "../../Hooks/UseAxiosSecure";
import useAuth from "../../Hooks/useAuth";

const CreatorDashboard = () => {
    const axiosSecure = UseAxiosSecure();
    const { user } = useAuth();

    const [contests, setContests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.email) return;

        const fetchContests = async () => {
            try {
                const res = await axiosSecure.get("/contest");

              
                const myContests = res.data.filter(
                    contest => contest.creatorEmail === user.email
                );

                setContests(myContests);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchContests();
    }, [axiosSecure, user]);

    const total = contests.length;
    const pending = contests.filter(c => c.status === "pending").length;
    const approved = contests.filter(c => c.status === "approved").length;

    if (loading) {
        return <p className="text-center mt-10">Loading dashboard...</p>;
    }

    return (
        <div className="p-4 md:p-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">
                    Contest Creator Dashboard
                </h1>
                <p className="text-gray-600 mt-1">
                    Manage your contests, submissions & winners
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                <div className="card bg-base-100 shadow-md">
                    <div className="card-body">
                        <h2 className="text-lg font-semibold">Total Contests</h2>
                        <p className="text-3xl font-bold text-primary">{total}</p>
                    </div>
                </div>

                <div className="card bg-base-100 shadow-md">
                    <div className="card-body">
                        <h2 className="text-lg font-semibold">Pending Contests</h2>
                        <p className="text-3xl font-bold text-warning">{pending}</p>
                    </div>
                </div>

                <div className="card bg-base-100 shadow-md">
                    <div className="card-body">
                        <h2 className="text-lg font-semibold">Approved Contests</h2>
                        <p className="text-3xl font-bold text-success">{approved}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               
                <div className="card bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg">
                    <div className="card-body">
                        <FaPlusCircle className="text-4xl mb-2" />
                        <h2 className="card-title text-2xl">Create New Contest</h2>
                        <p>Add a new contest with tasks, prize money and deadline.</p>
                        <div className="card-actions mt-4">
                            <Link to="/dashboard/CreateContest">
                                <button className="btn btn-sm bg-white text-indigo-600">
                                    Add Contest
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>

              
                <div className="card bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg">
                    <div className="card-body">
                        <FaListAlt className="text-4xl mb-2" />
                        <h2 className="card-title text-2xl">Manage Contests</h2>
                        <p>Edit, delete or track status of your created contests.</p>
                        <div className="card-actions mt-4">
                            <Link to="/dashboard/ShowContestTable">
                                <button className="btn btn-sm bg-white text-emerald-600">
                                    View Contests
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatorDashboard;
