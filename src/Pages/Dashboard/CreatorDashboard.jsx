import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { 
    FaPlusCircle, 
    FaListAlt, 
    FaChartLine, 
    FaDollarSign, 
    FaTrophy, 
    FaUsers, 
    FaClock, 
    FaCheckCircle, 
    FaExclamationTriangle,
    FaArrowRight,
    FaCalendarAlt,
    FaFileAlt
} from "react-icons/fa";
import { MdOutlineDashboard, MdPendingActions } from "react-icons/md";
import { GiTrophyCup } from "react-icons/gi";
import UseAxiosSecure from "../../Hooks/UseAxiosSecure";
import useAuth from "../../Hooks/useAuth";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CreatorDashboard = () => {
    const axiosSecure = UseAxiosSecure();
    const { user } = useAuth();

    const [contests, setContests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalParticipants: 0,
        avgPrize: 0
    });

    useEffect(() => {
        if (!user?.email) return;

        const fetchContests = async () => {
            try {
                setLoading(true);
                const res = await axiosSecure.get("/contest");
                
                const myContests = res.data.filter(
                    contest => contest.creatorEmail === user.email
                );

                setContests(myContests);

              
                const totalRevenue = myContests.reduce((sum, contest) => 
                    sum + ((contest.participantsCount || 0) * (contest.price || 0)), 0
                );
                
                const totalParticipants = myContests.reduce((sum, contest) => 
                    sum + (contest.participantsCount || 0), 0
                );
                
                const avgPrize = myContests.length > 0 
                    ? myContests.reduce((sum, contest) => sum + (contest.prizeMoney || 0), 0) / myContests.length 
                    : 0;

                setStats({
                    totalRevenue,
                    totalParticipants,
                    avgPrize: Math.round(avgPrize)
                });

            } catch (err) {
                console.error("Error fetching contests:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchContests();
    }, [axiosSecure, user]);

   
    const contestStatusData = [
        { name: 'Approved', value: contests.filter(c => c.status === "approved").length, color: '#10B981' },
        { name: 'Pending', value: contests.filter(c => c.status === "pending").length, color: '#F59E0B' },
        { name: 'Rejected', value: contests.filter(c => c.status === "rejected").length, color: '#EF4444' }
    ];

    const recentContests = contests.slice(0, 4);

    const getStatusBadge = (status) => {
        const statusConfig = {
            'approved': { 
                color: 'bg-green-100 text-green-800 border-green-200',
                icon: <FaCheckCircle className="text-green-500" />
            },
            'pending': { 
                color: 'bg-amber-100 text-amber-800 border-amber-200',
                icon: <FaClock className="text-amber-500" />
            },
            'rejected': { 
                color: 'bg-red-100 text-red-800 border-red-200',
                icon: <FaExclamationTriangle className="text-red-500" />
            }
        };
        
        const config = statusConfig[status] || statusConfig.pending;
        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}>
                {config.icon}
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    

    return (
        <div className="p-4 md:p-6 space-y-6">
            

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
               
                <div className="bg-gradient-to-br from-white to-indigo-50 rounded-2xl shadow-lg border border-indigo-100 p-6 transform transition-transform hover:scale-[1.02]">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-indigo-100 rounded-xl">
                            <MdOutlineDashboard className="text-2xl text-indigo-600" />
                        </div>
                        <span className="text-sm font-medium text-indigo-600">Total</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-800 mb-2">{contests.length}</h3>
                    <p className="text-sm text-gray-600">Contests Created</p>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center text-xs text-gray-500">
                            <span className="flex-1">Active: {contests.filter(c => c.status === "approved").length}</span>
                            <span>Pending: {contests.filter(c => c.status === "pending").length}</span>
                        </div>
                    </div>
                </div>

              
                <div className="bg-gradient-to-br from-white to-emerald-50 rounded-2xl shadow-lg border border-emerald-100 p-6 transform transition-transform hover:scale-[1.02]">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-emerald-100 rounded-xl">
                            <FaDollarSign className="text-2xl text-emerald-600" />
                        </div>
                        <span className="text-sm font-medium text-emerald-600">Revenue</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-800 mb-2">${stats.totalRevenue.toLocaleString()}</h3>
                    <p className="text-sm text-gray-600">Total Revenue</p>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center text-xs text-emerald-600">
                            <FaChartLine className="mr-1" />
                            <span>From contest entries</span>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg border border-blue-100 p-6 transform transition-transform hover:scale-[1.02]">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-100 rounded-xl">
                            <FaUsers className="text-2xl text-blue-600" />
                        </div>
                        <span className="text-sm font-medium text-blue-600">Engagement</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-800 mb-2">{stats.totalParticipants}</h3>
                    <p className="text-sm text-gray-600">Total Participants</p>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center text-xs text-blue-600">
                            <span>Across all contests</span>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-white to-amber-50 rounded-2xl shadow-lg border border-amber-100 p-6 transform transition-transform hover:scale-[1.02]">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-amber-100 rounded-xl">
                            <GiTrophyCup className="text-2xl text-amber-600" />
                        </div>
                        <span className="text-sm font-medium text-amber-600">Prize</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-800 mb-2">${stats.avgPrize.toLocaleString()}</h3>
                    <p className="text-sm text-gray-600">Avg. Prize Money</p>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center text-xs text-amber-600">
                            <FaTrophy className="mr-1" />
                            <span>Per contest</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               
                <div className="relative overflow-hidden rounded-2xl group">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                    <div className="relative bg-gradient-to-r from-indigo-600/90 to-purple-600/90 p-8 rounded-2xl shadow-xl transform transition-transform group-hover:scale-[1.01]">
                        <div className="flex flex-col lg:flex-row items-center gap-6">
                            <div className="flex-shrink-0">
                                <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                                    <FaPlusCircle className="text-5xl text-white" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-white mb-3">Create New Contest</h2>
                                <p className="text-white/80 mb-6">
                                    Launch a new creative challenge. Set prize money, define tasks, and attract participants with your unique contest idea.
                                </p>
                                <Link to="/dashboard/CreateContest">
                                    <button className="btn btn-lg bg-white text-indigo-600 hover:bg-gray-100 hover:scale-105 transform transition-all shadow-lg flex items-center gap-2">
                                        <FaPlusCircle />
                                        Create Contest
                                        <FaArrowRight className="ml-2" />
                                    </button>
                                </Link>
                            </div>
                        </div>
                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
                    </div>
                </div>

                
                <div className="relative overflow-hidden rounded-2xl group">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"></div>
                    <div className="relative bg-gradient-to-r from-emerald-600/90 to-teal-600/90 p-8 rounded-2xl shadow-xl transform transition-transform group-hover:scale-[1.01]">
                        <div className="flex flex-col lg:flex-row items-center gap-6">
                            <div className="flex-shrink-0">
                                <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                                    <FaListAlt className="text-5xl text-white" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-white mb-3">Manage Contests</h2>
                                <p className="text-white/80 mb-6">
                                    View, edit, and track all your contests. Monitor submissions, update status, and manage participants from one dashboard.
                                </p>
                                <Link to="/dashboard/ShowContestTable">
                                    <button className="btn btn-lg bg-white text-emerald-600 hover:bg-gray-100 hover:scale-105 transform transition-all shadow-lg flex items-center gap-2">
                                        <FaListAlt />
                                        Manage Contests
                                        <FaArrowRight className="ml-2" />
                                    </button>
                                </Link>
                            </div>
                        </div>
                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-800">Recent Contests</h2>
                        <Link to="/dashboard/ShowContestTable" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-1">
                            View All <FaArrowRight />
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {recentContests.length > 0 ? (
                            recentContests.map((contest, index) => (
                                <div key={contest._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-white rounded-lg shadow-sm">
                                            <FaFileAlt className={`text-xl ${contest.status === 'approved' ? 'text-green-500' : contest.status === 'pending' ? 'text-amber-500' : 'text-red-500'}`} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-800">{contest.name}</h3>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-sm text-gray-600 flex items-center gap-1">
                                                    <FaDollarSign className="text-xs" />
                                                    ${contest.price}
                                                </span>
                                                <span className="text-sm text-gray-600 flex items-center gap-1">
                                                    <FaTrophy className="text-xs" />
                                                    ${contest.prizeMoney?.toLocaleString()}
                                                </span>
                                                <span className="text-sm text-gray-600 flex items-center gap-1">
                                                    <FaUsers className="text-xs" />
                                                    {contest.participantsCount || 0}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {getStatusBadge(contest.status)}
                                        <FaArrowRight className="text-gray-400" />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <div className="p-4 bg-gray-100 rounded-full inline-block mb-3">
                                    <FaListAlt className="text-3xl text-gray-400" />
                                </div>
                                <p className="text-gray-500">No contests created yet</p>
                                <Link to="/dashboard/CreateContest">
                                    <button className="btn btn-sm btn-primary mt-3">
                                        Create Your First Contest
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">Contest Status</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={contestStatusData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip 
                                    formatter={(value) => [`${value} contests`, 'Count']}
                                    contentStyle={{ 
                                        borderRadius: '8px',
                                        border: '1px solid #e5e7eb',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                    }}
                                />
                                <Bar 
                                    dataKey="value" 
                                    radius={[8, 8, 0, 0]}
                                    fill="#8884d8"
                                >
                                    {contestStatusData.map((entry, index) => (
                                        <rect key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-6 grid grid-cols-3 gap-3">
                        {contestStatusData.map((item) => (
                            <div key={item.name} className="text-center">
                                <div className="text-2xl font-bold" style={{ color: item.color }}>
                                    {item.value}
                                </div>
                                <div className="text-sm text-gray-600">{item.name}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                        <div className="text-sm text-gray-600 mb-1">Total Created</div>
                        <div className="text-2xl font-bold text-gray-800">{contests.length}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-sm text-gray-600 mb-1">Approval Rate</div>
                        <div className="text-2xl font-bold text-green-600">
                            {contests.length > 0 ? Math.round((contests.filter(c => c.status === "approved").length / contests.length) * 100) : 0}%
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-sm text-gray-600 mb-1">Avg Participants</div>
                        <div className="text-2xl font-bold text-blue-600">
                            {contests.length > 0 ? Math.round(stats.totalParticipants / contests.length) : 0}
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-sm text-gray-600 mb-1">Pending Action</div>
                        <div className="text-2xl font-bold text-amber-600">
                            {contests.filter(c => c.status === "pending").length}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatorDashboard;