import React, { useEffect, useState } from 'react';
import UseAxiosSecure from '../../Hooks/UseAxiosSecure';
import useAuth from '../../Hooks/useAuth';
import Swal from 'sweetalert2';
import { Link } from 'react-router';
import { 
  FaEye, 
  FaEdit, 
  FaTrash, 
  FaTrophy, 
  FaUsers, 
  FaDollarSign, 
  FaCalendarAlt,
  FaChartBar,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaFilter,
  FaSearch,
  FaSortAmountDown,
  FaPlusCircle,
  FaFileAlt
} from 'react-icons/fa';
import { MdPendingActions, MdOutlineUpdate } from 'react-icons/md';

const ShowContestTable = () => {
    const axiosSecure = UseAxiosSecure();
    const { user } = useAuth();
    const [contests, setContests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });

    useEffect(() => {
        if (user?.email) {
            axiosSecure
                .get(`/contest?email=${user.email}`)
                .then(res => {
                    const myContests = res.data.filter(
                        contest => contest.creatorEmail === user.email
                    );
                    setContests(myContests);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching contests:', error);
                    setLoading(false);
                });
        }
    }, [axiosSecure, user]);

    const stats = {
        total: contests.length,
        approved: contests.filter(c => c.status === 'approved').length,
        pending: contests.filter(c => c.status === 'pending').length,
        rejected: contests.filter(c => c.status === 'rejected').length,
        totalPrize: contests.reduce((sum, contest) => sum + (contest.prizeMoney || 0), 0),
        totalParticipants: contests.reduce((sum, contest) => sum + (contest.participantsCount || 0), 0),
        totalRevenue: contests.reduce((sum, contest) => sum + ((contest.participantsCount || 0) * (contest.price || 0)), 0)
    };

    const filteredAndSortedContests = contests
        .filter(contest => {
            const matchesSearch = 
                contest.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                contest.contestType?.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesStatus = 
                statusFilter === 'all' || 
                contest.status === statusFilter;
            
            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            if (sortConfig.key === 'prizeMoney' || sortConfig.key === 'participantsCount' || sortConfig.key === 'price') {
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

    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
        }));
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return null;
        return sortConfig.direction === 'asc' ? '↑' : '↓';
    };

    const handleDelete = (id, contestName) => {
        Swal.fire({
            title: 'Delete Contest',
            html: `
                <div class="text-left">
                    <p class="mb-3 text-red-600 font-semibold">This action cannot be undone!</p>
                    <div class="bg-red-50 p-4 rounded-lg border border-red-200">
                        <p class="font-bold text-red-800">"${contestName}"</p>
                        <p class="text-sm text-red-600 mt-2">
                            All contest data including participants and submissions will be permanently deleted.
                        </p>
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
        }).then((result) => {
            if (result.isConfirmed) {
                axiosSecure.delete(`/contest/${id}`)
                    .then(() => {
                        setContests(prev =>
                            prev.filter(contest => contest._id !== id)
                        );

                        Swal.fire({
                            icon: 'success',
                            title: 'Deleted!',
                            text: 'Contest has been permanently deleted',
                            timer: 2000,
                            showConfirmButton: false,
                            toast: true,
                            position: 'top-end'
                        });
                    })
                    .catch(error => {
                        Swal.fire('Error', 'Failed to delete contest', 'error');
                    });
            }
        });
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
                icon: <MdPendingActions className="text-xs" />, 
                className: 'bg-amber-100 text-amber-800 border-amber-200',
                iconColor: 'text-amber-500'
            },
            rejected: { 
                label: 'Rejected', 
                icon: <FaTimesCircle className="text-xs" />, 
                className: 'bg-red-100 text-red-800 border-red-200',
                iconColor: 'text-red-500'
            }
        };
        return statusConfig[status] || statusConfig.pending;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading your contests...</p>
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
                            My Contests
                        </h1>
                        <p className="text-gray-600 mt-2">Manage all contests created by you</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            to="/dashboard/CreateContest"
                            className="btn btn-primary flex items-center gap-2"
                        >
                            <FaPlusCircle />
                            Create New Contest
                        </Link>
                    </div>
                </div>

                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Total Contests</p>
                                <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                                <p className="text-xs text-gray-500 mt-2">Created by you</p>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-lg">
                                <FaFileAlt className="text-2xl text-blue-500" />
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
                                <p className="text-2xl font-bold text-gray-800">${stats.totalPrize.toLocaleString()}</p>
                                <p className="text-xs text-gray-500 mt-2">To be distributed</p>
                            </div>
                            <div className="p-3 bg-purple-50 rounded-lg">
                                <FaTrophy className="text-2xl text-purple-500" />
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
                                <FaDollarSign className="text-2xl text-amber-500" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8 border border-blue-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Contest Status Overview</h3>
                    <div className="flex flex-wrap gap-3">
                        <span className="badge badge-lg bg-green-100 text-green-800 border-green-200">
                            <FaCheckCircle className="mr-2" />
                            {stats.approved} Approved
                        </span>
                        <span className="badge badge-lg bg-amber-100 text-amber-800 border-amber-200">
                            <FaExclamationTriangle className="mr-2" />
                            {stats.pending} Pending
                        </span>
                        <span className="badge badge-lg bg-red-100 text-red-800 border-red-200">
                            <FaTimesCircle className="mr-2" />
                            {stats.rejected} Rejected
                        </span>
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
                                placeholder="Search contests by name or type..."
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

                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-outline flex items-center gap-2">
                                <FaSortAmountDown />
                                Sort
                            </div>
                            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-10">
                                <li><button onClick={() => handleSort('name')}>Name {getSortIcon('name')}</button></li>
                                <li><button onClick={() => handleSort('prizeMoney')}>Prize Money {getSortIcon('prizeMoney')}</button></li>
                                <li><button onClick={() => handleSort('participantsCount')}>Participants {getSortIcon('participantsCount')}</button></li>
                                <li><button onClick={() => handleSort('createdAt')}>Date Created {getSortIcon('createdAt')}</button></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {filteredAndSortedContests.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                        <FaFileAlt className="text-6xl text-gray-300 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Contests Found</h3>
                        <p className="text-gray-500 mb-6">
                            {searchTerm || statusFilter !== 'all' 
                                ? 'Try adjusting your search or filters'
                                : 'You haven\'t created any contests yet'
                            }
                        </p>
                        <Link
                            to="/dashboard/CreateContest"
                            className="btn btn-primary flex items-center gap-2"
                        >
                            <FaPlusCircle />
                            Create Your First Contest
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="font-semibold text-gray-700">
                                        <button 
                                            onClick={() => handleSort('name')}
                                            className="flex items-center gap-1 hover:text-blue-600"
                                        >
                                            Contest Name
                                            {getSortIcon('name') && <span className="ml-1">{getSortIcon('name')}</span>}
                                        </button>
                                    </th>
                                    <th className="font-semibold text-gray-700">Type</th>
                                    <th className="font-semibold text-gray-700">
                                        <button 
                                            onClick={() => handleSort('prizeMoney')}
                                            className="flex items-center gap-1 hover:text-blue-600"
                                        >
                                            Prize
                                            {getSortIcon('prizeMoney') && <span className="ml-1">{getSortIcon('prizeMoney')}</span>}
                                        </button>
                                    </th>
                                    <th className="font-semibold text-gray-700">
                                        <button 
                                            onClick={() => handleSort('participantsCount')}
                                            className="flex items-center gap-1 hover:text-blue-600"
                                        >
                                            Participants
                                            {getSortIcon('participantsCount') && <span className="ml-1">{getSortIcon('participantsCount')}</span>}
                                        </button>
                                    </th>
                                    <th className="font-semibold text-gray-700">Status</th>
                                    <th className="font-semibold text-gray-700">Created</th>
                                    <th className="font-semibold text-gray-700 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAndSortedContests.map((contest, index) => {
                                    const statusBadge = getStatusBadge(contest.status);
                                    return (
                                        <tr 
                                            key={contest._id} 
                                            className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                                        >
                                            <td>
                                                <div>
                                                    <div className="font-medium text-gray-900 flex items-center gap-2">
                                                        {contest.name}
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        {contest.description?.substring(0, 50)}...
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="">
                                                    {contest.contestType}
                                                </span>
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
                                                    {contest.participantsCount > 0 && (
                                                        <span className="text-xs text-green-600">
                                                            (+${(contest.participantsCount * (contest.price || 0)).toLocaleString()})
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border ${statusBadge.className}`}>
                                                    <span className={statusBadge.iconColor}>{statusBadge.icon}</span>
                                                    {statusBadge.label}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="text-sm text-gray-600 flex items-center gap-1">
                                                    <FaCalendarAlt className="text-gray-400" />
                                                    {formatDate(contest.createdAt)}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-2 justify-center">
                                                    {contest.status === 'pending' && (
                                                        <Link
                                                            to={`/dashboard/UpdateContest/${contest._id}`}
                                                            className="btn btn-sm btn-outline btn-info flex items-center gap-1"
                                                            title="Edit Contest"
                                                        >
                                                            <FaEdit />
                                                            Edit
                                                        </Link>
                                                    )}

                                                    {contest.status === 'pending' && (
                                                        <button
                                                            onClick={() => handleDelete(contest._id, contest.name)}
                                                            className="btn btn-sm btn-outline btn-error flex items-center gap-1"
                                                            title="Delete Contest"
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    )}

                                                    <Link
                                                        to={`/dashboard/Submission/${contest._id}`}
                                                        className="btn btn-sm btn-outline btn-primary flex items-center gap-1"
                                                        title="View Submissions"
                                                    >
                                                        <FaEye />
                                                        Submissions
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="text-sm text-gray-600">
                            Showing <span className="font-semibold">{filteredAndSortedContests.length}</span> of <span className="font-semibold">{contests.length}</span> contests
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-sm text-gray-600">
                                Sorted by: <span className="font-medium">{sortConfig.key}</span> ({sortConfig.direction})
                            </div>
                            {searchTerm && (
                                <button 
                                    onClick={() => setSearchTerm('')}
                                    className="text-sm text-blue-600 hover:text-blue-800"
                                >
                                    Clear Search
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <FaCheckCircle className="text-green-500" />
                        Quick Tips
                    </h3>
                    <ul className="space-y-2">
                        <li className="text-sm text-gray-700">Pending contests can be edited or deleted</li>
                        <li className="text-sm text-gray-700">Approved contests are visible to all users</li>
                        <li className="text-sm text-gray-700">View submissions to see participant entries</li>
                        <li className="text-sm text-gray-700">Rejected contests need revision before resubmission</li>
                    </ul>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <FaChartBar className="text-blue-500" />
                        Performance Insights
                    </h3>
                    <div className="space-y-2">
                        <div className="text-sm text-gray-700">
                            <span className="font-medium">Approval Rate:</span> {stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0}%
                        </div>
                        <div className="text-sm text-gray-700">
                            <span className="font-medium">Average Participants:</span> {stats.total > 0 ? Math.round(stats.totalParticipants / stats.total) : 0} per contest
                        </div>
                        <div className="text-sm text-gray-700">
                            <span className="font-medium">Total Value:</span> ${(stats.totalPrize + stats.totalRevenue).toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShowContestTable;