import React, { useState, useMemo } from "react";
import UseAxiosSecure from "../../Hooks/UseAxiosSecure";
import Swal from "sweetalert2";
import { Link } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  FaEye, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaTrash, 
  FaFilter, 
  FaSearch, 
  FaChartBar,
  FaDollarSign,
  FaCalendar,
  FaUsers,
  FaTrophy,
  FaExclamationTriangle,
  FaCheck,
  FaBan,
  FaEdit,
  FaSort,
  FaSortUp,
  FaSortDown
} from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";

const AllContestAdmin = () => {
    const axiosSecure = UseAxiosSecure();
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [typeFilter, setTypeFilter] = useState("all");
    const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });

    const {
        data: contests = [],
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["contests"],
        queryFn: async () => {
            const res = await axiosSecure.get("/contest");
            return res.data;
        },
    });

    const stats = useMemo(() => {
        const total = contests.length;
        const approved = contests.filter(c => c.status === "approved").length;
        const pending = contests.filter(c => c.status === "pending").length;
        const rejected = contests.filter(c => c.status === "rejected").length;
        const totalPrizeMoney = contests.reduce((sum, contest) => sum + (contest.prizeMoney || 0), 0);
        const totalParticipants = contests.reduce((sum, contest) => sum + (contest.participantsCount || 0), 0);
        const totalRevenue = contests.reduce((sum, contest) => sum + ((contest.participantsCount || 0) * (contest.price || 0)), 0);

        return {
            total,
            approved,
            pending,
            rejected,
            totalPrizeMoney,
            totalParticipants,
            totalRevenue,
            approvalRate: total > 0 ? Math.round((approved / total) * 100) : 0
        };
    }, [contests]);

    const chartData = useMemo(() => [
        { name: 'Approved', value: stats.approved, color: '#10B981' },
        { name: 'Pending', value: stats.pending, color: '#F59E0B' },
        { name: 'Rejected', value: stats.rejected, color: '#EF4444' }
    ], [stats]);

    const filteredAndSortedContests = useMemo(() => {
        let filtered = contests.filter(contest => {
            const matchesSearch = 
                contest.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                contest.contestType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                contest.description?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = 
                statusFilter === "all" || 
                contest.status === statusFilter;

            const matchesType = 
                typeFilter === "all" || 
                contest.contestType === typeFilter;

            return matchesSearch && matchesStatus && matchesType;
        });

        filtered.sort((a, b) => {
            if (sortConfig.key === 'price' || sortConfig.key === 'prizeMoney' || sortConfig.key === 'participantsCount') {
                const aVal = a[sortConfig.key] || 0;
                const bVal = b[sortConfig.key] || 0;
                return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
            }
            if (sortConfig.key === 'createdAt') {
                const aDate = new Date(a[sortConfig.key]);
                const bDate = new Date(b[sortConfig.key]);
                return sortConfig.direction === 'asc' ? aDate - bDate : bDate - aDate;
            }
            if (sortConfig.key === 'name') {
                return sortConfig.direction === 'asc' 
                    ? (a.name || '').localeCompare(b.name || '')
                    : (b.name || '').localeCompare(a.name || '');
            }
            return 0;
        });

        return filtered;
    }, [contests, searchTerm, statusFilter, typeFilter, sortConfig]);

    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
        }));
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return <FaSort className="text-gray-400" />;
        return sortConfig.direction === 'asc' 
            ? <FaSortUp className="text-blue-500" /> 
            : <FaSortDown className="text-blue-500" />;
    };

    const handleConfirm = async (id, contestName) => {
        const result = await Swal.fire({
            title: 'Approve Contest',
            html: `
                <div class="text-left">
                    <p class="mb-3">Are you sure you want to approve this contest?</p>
                    <div class="bg-green-50 p-3 rounded-lg border border-green-200">
                        <p class="font-semibold text-green-800">"${contestName}"</p>
                        <p class="text-sm text-green-600 mt-1">This will make the contest visible to all users.</p>
                    </div>
                </div>
            `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#10B981',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Yes, Approve',
            cancelButtonText: 'Cancel',
            reverseButtons: true,
            customClass: {
                popup: 'rounded-xl'
            }
        });

        if (!result.isConfirmed) return;

        try {
            const res = await axiosSecure.patch(`/contest/approve/${id}`);
            if (res.data.modifiedCount > 0) {
                Swal.fire({
                    icon: 'success',
                    title: 'Approved!',
                    text: 'Contest has been approved successfully',
                    timer: 2000,
                    showConfirmButton: false,
                    toast: true,
                    position: 'top-end'
                });
                queryClient.invalidateQueries(["contests"]);
            }
        } catch (error) {
            Swal.fire('Error', 'Failed to approve contest', 'error');
        }
    };

    const handleReject = async (id, contestName) => {
        const { value: reason } = await Swal.fire({
            title: 'Reject Contest',
            html: `
                <div class="text-left">
                    <p class="mb-3">Please provide a reason for rejecting this contest:</p>
                    <div class="bg-amber-50 p-3 rounded-lg border border-amber-200 mb-4">
                        <p class="font-semibold text-amber-800">"${contestName}"</p>
                    </div>
                </div>
            `,
            input: 'textarea',
            inputPlaceholder: 'Enter rejection reason...',
            inputAttributes: {
                'aria-label': 'Enter rejection reason'
            },
            showCancelButton: true,
            confirmButtonColor: '#F59E0B',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Reject Contest',
            cancelButtonText: 'Cancel',
            reverseButtons: true,
            customClass: {
                popup: 'rounded-xl'
            }
        });

        if (!reason) return;

        try {
            const res = await axiosSecure.patch(`/contest/reject/${id}`, { reason });
            if (res.data.modifiedCount > 0) {
                Swal.fire({
                    icon: 'info',
                    title: 'Rejected!',
                    html: `
                        <div class="text-left">
                            <p>Contest has been rejected.</p>
                            <div class="mt-3 p-3 bg-gray-50 rounded-lg">
                                <p class="font-medium text-gray-700">Reason:</p>
                                <p class="text-gray-600 mt-1">${reason}</p>
                            </div>
                        </div>
                    `,
                    timer: 3000
                });
                queryClient.invalidateQueries(["contests"]);
            }
        } catch (error) {
            Swal.fire('Error', 'Failed to reject contest', 'error');
        }
    };

    const handleDelete = async (id, contestName) => {
        const result = await Swal.fire({
            title: 'Delete Contest',
            html: `
                <div class="text-left">
                    <p class="mb-3 text-red-600 font-semibold">This action cannot be undone!</p>
                    <div class="bg-red-50 p-3 rounded-lg border border-red-200">
                        <p class="font-semibold text-red-800">"${contestName}"</p>
                        <p class="text-sm text-red-600 mt-1">All contest data including participants and submissions will be permanently deleted.</p>
                    </div>
                </div>
            `,
            icon: 'error',
            showCancelButton: true,
            confirmButtonColor: '#EF4444',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Delete Permanently',
            cancelButtonText: 'Cancel',
            reverseButtons: true,
            customClass: {
                popup: 'rounded-xl'
            }
        });

        if (!result.isConfirmed) return;

        try {
            const res = await axiosSecure.delete(`/contest/${id}`);
            if (res.data.deletedCount > 0) {
                Swal.fire({
                    icon: 'success',
                    title: 'Deleted!',
                    text: 'Contest has been permanently deleted',
                    timer: 2000,
                    showConfirmButton: false,
                    toast: true,
                    position: 'top-end'
                });
                queryClient.invalidateQueries(["contests"]);
            }
        } catch (error) {
            Swal.fire('Error', 'Failed to delete contest', 'error');
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            approved: { 
                label: 'Approved', 
                icon: <FaCheckCircle className="text-xs" />, 
                className: 'bg-green-100 text-green-800 border-green-200',
                iconColor: 'text-green-500'
            },
            pending: { 
                label: 'Pending Review', 
                icon: <FaExclamationTriangle className="text-xs" />, 
                className: 'bg-amber-100 text-amber-800 border-amber-200',
                iconColor: 'text-amber-500'
            },
            rejected: { 
                label: 'Rejected', 
                icon: <FaBan className="text-xs" />, 
                className: 'bg-red-100 text-red-800 border-red-200',
                iconColor: 'text-red-500'
            }
        };
        return statusConfig[status] || statusConfig.pending;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading contests...</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-4xl mb-4">⚠️</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Failed to Load Contests</h3>
                    <p className="text-gray-600 mb-4">{error.message}</p>
                    <button 
                        onClick={() => queryClient.invalidateQueries(["contests"])}
                        className="btn btn-primary"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
          
            <div className="mb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-blue-700 bg-clip-text text-transparent">
                            Contest Management
                        </h1>
                        <p className="text-gray-600 mt-2">Approve, reject, or delete contests on the platform</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            to="/dashboard/CreateContest"
                            className="btn btn-primary"
                        >
                            Create New Contest
                        </Link>
                        <button 
                            onClick={() => queryClient.invalidateQueries(["contests"])}
                            className="btn btn-outline"
                        >
                            Refresh
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Total Contests</p>
                                <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                                <p className="text-xs text-green-600 mt-2">
                                    {stats.approvalRate}% approval rate
                                </p>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-lg">
                                <FaTrophy className="text-2xl text-blue-500" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Total Participants</p>
                                <p className="text-2xl font-bold text-gray-800">{stats.totalParticipants}</p>
                                <p className="text-xs text-gray-500 mt-2">Across all contests</p>
                            </div>
                            <div className="p-3 bg-green-50 rounded-lg">
                                <FaUsers className="text-2xl text-green-500" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Total Prize Money</p>
                                <p className="text-2xl font-bold text-gray-800">${stats.totalPrizeMoney.toLocaleString()}</p>
                                <p className="text-xs text-gray-500 mt-2">To be distributed</p>
                            </div>
                            <div className="p-3 bg-purple-50 rounded-lg">
                                <FaDollarSign className="text-2xl text-purple-500" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Revenue Generated</p>
                                <p className="text-2xl font-bold text-gray-800">${stats.totalRevenue.toLocaleString()}</p>
                                <p className="text-xs text-gray-500 mt-2">From contest fees</p>
                            </div>
                            <div className="p-3 bg-amber-50 rounded-lg">
                                <FaChartBar className="text-2xl text-amber-500" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-6">Contest Status Distribution</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip 
                                    formatter={(value) => [`${value} contests`, 'Count']}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Bar 
                                    dataKey="value" 
                                    radius={[4, 4, 0, 0]}
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search contests by name, type, or description..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="input input-bordered pl-10 w-full"
                            />
                        </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                        <select 
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="select select-bordered w-full sm:w-40"
                        >
                            <option value="all">All Status</option>
                            <option value="approved">Approved</option>
                            <option value="pending">Pending</option>
                            <option value="rejected">Rejected</option>
                        </select>

                        <select 
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="select select-bordered w-full sm:w-40"
                        >
                            <option value="all">All Types</option>
                            <option value="UI/UX Design">UI/UX Design</option>
                            <option value="Web Development">Web Development</option>
                            <option value="Mobile Development">Mobile Development</option>
                            <option value="Graphic Design">Graphic Design</option>
                            <option value="Content Writing">Content Writing</option>
                           
                        </select>
                    </div>
                </div>

              
                <div className="flex flex-wrap gap-3 mt-4">
                    <span className="badge badge-lg bg-green-100 text-green-800 border-green-200">
                        <FaCheckCircle className="mr-1" />
                        {stats.approved} Approved
                    </span>
                    <span className="badge badge-lg bg-amber-100 text-amber-800 border-amber-200">
                        <FaExclamationTriangle className="mr-1" />
                        {stats.pending} Pending
                    </span>
                    <span className="badge badge-lg bg-red-100 text-red-800 border-red-200">
                        <FaBan className="mr-1" />
                        {stats.rejected} Rejected
                    </span>
                </div>
            </div>

           
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="font-semibold text-gray-700">
                                    <button 
                                        onClick={() => handleSort('name')}
                                        className="flex items-center gap-1"
                                    >
                                        Contest Name
                                        {getSortIcon('name')}
                                    </button>
                                </th>
                                <th className="font-semibold text-gray-700">
                                    <button 
                                        onClick={() => handleSort('contestType')}
                                        className="flex items-center gap-1"
                                    >
                                        Type
                                        {getSortIcon('contestType')}
                                    </button>
                                </th>
                                <th className="font-semibold text-gray-700">
                                    <button 
                                        onClick={() => handleSort('price')}
                                        className="flex items-center gap-1"
                                    >
                                        Entry Fee
                                        {getSortIcon('price')}
                                    </button>
                                </th>
                                <th className="font-semibold text-gray-700">
                                    <button 
                                        onClick={() => handleSort('prizeMoney')}
                                        className="flex items-center gap-1"
                                    >
                                        Prize
                                        {getSortIcon('prizeMoney')}
                                    </button>
                                </th>
                                <th className="font-semibold text-gray-700">
                                    <button 
                                        onClick={() => handleSort('participantsCount')}
                                        className="flex items-center gap-1"
                                    >
                                        Participants
                                        {getSortIcon('participantsCount')}
                                    </button>
                                </th>
                                <th className="font-semibold text-gray-700">Status</th>
                                <th className="font-semibold text-gray-700 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAndSortedContests.length > 0 ? (
                                filteredAndSortedContests.map((contest, index) => {
                                    const statusBadge = getStatusBadge(contest.status);
                                    return (
                                        <tr 
                                            key={contest._id} 
                                            className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                                        >
                                            <td>
                                                <div>
                                                    <div className="font-medium text-gray-900">
                                                        {contest.name}
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        {contest.description?.substring(0, 60)}...
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="">
                                                    {contest.contestType}
                                                </span>
                                            </td>
                                            <td className="font-medium">
                                                ${contest.price}
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-2">
                                                    <FaTrophy className="text-amber-500" />
                                                    <span className="font-bold text-gray-800">
                                                        ${contest.prizeMoney?.toLocaleString()}
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-2">
                                                    <FaUsers className="text-blue-500" />
                                                    <span className="font-medium">
                                                        {contest.participantsCount || 0}
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border ${statusBadge.className}`}>
                                                    <span className={statusBadge.iconColor}>{statusBadge.icon}</span>
                                                    {statusBadge.label}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-2 justify-center">
                                                    <button
                                                        onClick={() => handleConfirm(contest._id, contest.name)}
                                                        disabled={contest.status === "approved"}
                                                        className={`btn btn-sm ${contest.status === "approved" ? 'btn-success' : 'btn-outline btn-success'}`}
                                                        title="Approve Contest"
                                                    >
                                                        <FaCheck />
                                                        {contest.status === "approved" ? 'Approved' : 'Approve'}
                                                    </button>

                                                    <button
                                                        onClick={() => handleReject(contest._id, contest.name)}
                                                        disabled={contest.status === "rejected"}
                                                        className={`btn btn-sm ${contest.status === "rejected" ? 'btn-error' : 'btn-outline btn-warning'}`}
                                                        title="Reject Contest"
                                                    >
                                                        <FaTimesCircle />
                                                        {contest.status === "rejected" ? 'Rejected' : 'Reject'}
                                                    </button>

                                                    <button
                                                        onClick={() => handleDelete(contest._id, contest.name)}
                                                        className="btn btn-sm btn-outline btn-error"
                                                        title="Delete Contest"
                                                    >
                                                        <FaTrash />
                                                    </button>

                                                    <Link
                                                        to={`/details/${contest._id}`}
                                                        className="btn btn-sm btn-outline btn-info"
                                                        title="View Details"
                                                    >
                                                        <FaEye />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center py-8">
                                        <div className="flex flex-col items-center justify-center">
                                            <FaFilter className="text-4xl text-gray-300 mb-3" />
                                            <p className="text-gray-600 font-medium">No contests found</p>
                                            <p className="text-gray-500 text-sm mt-1">
                                                Try adjusting your search or filters
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="text-sm text-gray-600">
                        Showing <span className="font-semibold">{filteredAndSortedContests.length}</span> of <span className="font-semibold">{contests.length}</span> contests
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-sm text-gray-600">
                            Updated: {new Date().toLocaleTimeString()}
                        </div>
                        <div className="text-xs text-gray-500">
                            Sort by: {sortConfig.key} ({sortConfig.direction})
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllContestAdmin;