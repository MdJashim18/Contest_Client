import React, { useEffect, useState } from "react";
import UseAxiosSecure from "../../Hooks/UseAxiosSecure";
import Swal from "sweetalert2";
import { 
  FaEye, 
  FaTrophy, 
  FaMedal, 
  FaUsers, 
  FaFileAlt, 
  FaLink, 
  FaCalendarAlt,
  FaFilter,
  FaSearch,
  FaSortAmountDown,
  FaExternalLinkAlt,
  FaUserCheck,
  FaAward,
  FaChartBar,
  FaTimes,
  FaCheckCircle,
  FaExclamationTriangle
} from "react-icons/fa";
import { MdPendingActions, MdOutlineEmojiEvents } from "react-icons/md";

const Submission = () => {
    const axiosSecure = UseAxiosSecure();
    const [submissions, setSubmissions] = useState([]);
    const [filteredSubmissions, setFilteredSubmissions] = useState([]);
    const [selectedWinner, setSelectedWinner] = useState(null);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [position, setPosition] = useState("");
    const [reward, setReward] = useState("");
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [contestFilter, setContestFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [uniqueContests, setUniqueContests] = useState([]);

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                setLoading(true);
                const res = await axiosSecure.get("/contest");
                const contests = res.data;
                const allSubmissions = [];
                const contestsSet = new Set();

                contests.forEach(contest => {
                    contestsSet.add(contest.name);
                    if (contest.tasks) {
                        Object.entries(contest.tasks).forEach(([taskName, arr]) => {
                            arr.forEach(sub => {
                                allSubmissions.push({
                                    contestId: contest._id,
                                    contestName: contest.name,
                                    contestType: contest.contestType,
                                    userEmail: sub.userEmail,
                                    taskName,
                                    taskSubmission: sub.taskSubmission,
                                    winner: contest.winner || null,
                                    submittedAt: sub.submittedAt || new Date(),
                                    status: contest.winner?.userEmail === sub.userEmail ? 'winner' : 'pending'
                                });
                            });
                        });
                    }
                });

                setSubmissions(allSubmissions);
                setFilteredSubmissions(allSubmissions);
                setUniqueContests(Array.from(contestsSet));

            } catch (err) {
                console.error(err);
                Swal.fire("Error", "Failed to load submissions", "error");
            } finally {
                setLoading(false);
            }
        };

        fetchSubmissions();
    }, [axiosSecure]);

    // Apply filters
    useEffect(() => {
        let filtered = submissions;

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(sub => 
                sub.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                sub.contestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                sub.taskName.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Contest filter
        if (contestFilter !== "all") {
            filtered = filtered.filter(sub => sub.contestName === contestFilter);
        }

        // Status filter
        if (statusFilter !== "all") {
            filtered = filtered.filter(sub => 
                statusFilter === 'winner' ? sub.status === 'winner' : sub.status !== 'winner'
            );
        }

        setFilteredSubmissions(filtered);
    }, [searchTerm, contestFilter, statusFilter, submissions]);

    const stats = {
        total: submissions.length,
        winners: submissions.filter(s => s.status === 'winner').length,
        pending: submissions.filter(s => s.status !== 'winner').length,
        uniqueContests: uniqueContests.length,
        uniqueUsers: new Set(submissions.map(s => s.userEmail)).size
    };

    const openViewModal = (submission) => {
        setSelectedSubmission(submission);
        document.getElementById("view_modal").showModal();
    };

    const openWinnerModal = (submission) => {
        setSelectedWinner(submission);
        setPosition("");
        setReward("");
        document.getElementById("winner_modal").showModal();
    };

    const handleSetWinner = async () => {
        if (!position || !reward) {
            Swal.fire({
                icon: 'warning',
                title: 'All Fields Required',
                text: 'Please select position and enter reward',
                timer: 2000
            });
            return;
        }

        try {
            await axiosSecure.patch(`/contest/winner/${selectedWinner.contestId}`, {
                userEmail: selectedWinner.userEmail,
                position,
                reward,
                selectedAt: new Date()
            });

            Swal.fire({
                icon: 'success',
                title: 'Winner Announced! 🎉',
                html: `
                    <div class="text-left">
                        <p class="mb-3">Successfully set <strong>${selectedWinner.userEmail}</strong> as ${position} place winner!</p>
                        <div class="bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-lg border border-amber-200">
                            <p class="font-bold text-amber-800">Reward: ${reward}</p>
                            <p class="text-sm text-amber-600 mt-1">Contest: ${selectedWinner.contestName}</p>
                        </div>
                    </div>
                `,
                timer: 3000,
                showConfirmButton: false,
                toast: true,
                position: 'top-end'
            });

            document.getElementById("winner_modal").close();

            // Update local state
            setSubmissions(prev =>
                prev.map(s =>
                    s.contestId === selectedWinner.contestId &&
                    s.userEmail === selectedWinner.userEmail
                        ? {
                            ...s,
                            winner: {
                                userEmail: selectedWinner.userEmail,
                                position,
                                reward,
                            },
                            status: 'winner'
                        }
                        : s
                )
            );

            setSelectedWinner(null);
            setPosition("");
            setReward("");

        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: 'error',
                title: 'Failed to Set Winner',
                text: 'Please try again',
                timer: 2000
            });
        }
    };

    const getPositionBadge = (position) => {
        const positions = {
            '1st': { label: '🥇 1st Place', color: 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border-amber-200' },
            '2nd': { label: '🥈 2nd Place', color: 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-200' },
            '3rd': { label: '🥉 3rd Place', color: 'bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 border-orange-200' }
        };
        return positions[position] || { label: position, color: 'bg-blue-100 text-blue-800 border-blue-200' };
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const truncateText = (text, length = 30) => {
        if (!text) return '';
        return text.length > length ? text.substring(0, length) + '...' : text;
    };

    // if (loading) {
    //     return (
    //         <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
    //             <div className="text-center">
    //                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
    //                 <p className="mt-4 text-gray-600">Loading submissions...</p>
    //             </div>
    //         </div>
    //     );
    // }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
            {/* Header */}
            <div className="mb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-blue-700 bg-clip-text text-transparent">
                            Submissions Management
                        </h1>
                        <p className="text-gray-600 mt-2">Review submissions and declare contest winners</p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Total Submissions</p>
                                <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-lg">
                                <FaFileAlt className="text-2xl text-blue-500" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Declared Winners</p>
                                <p className="text-2xl font-bold text-green-600">{stats.winners}</p>
                            </div>
                            <div className="p-3 bg-green-50 rounded-lg">
                                <FaTrophy className="text-2xl text-green-500" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Pending Review</p>
                                <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
                            </div>
                            <div className="p-3 bg-amber-50 rounded-lg">
                                <MdPendingActions className="text-2xl text-amber-500" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Unique Participants</p>
                                <p className="text-2xl font-bold text-purple-600">{stats.uniqueUsers}</p>
                            </div>
                            <div className="p-3 bg-purple-50 rounded-lg">
                                <FaUsers className="text-2xl text-purple-500" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by email, contest, or task..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="input input-bordered pl-10 w-full"
                            />
                        </div>

                        <select 
                            value={contestFilter}
                            onChange={(e) => setContestFilter(e.target.value)}
                            className="select select-bordered w-full"
                        >
                            <option value="all">All Contests</option>
                            {uniqueContests.map((contest, idx) => (
                                <option key={idx} value={contest}>{contest}</option>
                            ))}
                        </select>

                        <select 
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="select select-bordered w-full"
                        >
                            <option value="all">All Status</option>
                            <option value="winner">Winners Only</option>
                            <option value="pending">Pending Review</option>
                        </select>
                    </div>

                    {/* Quick Stats */}
                    <div className="flex flex-wrap gap-3 mt-4">
                        <span className="badge badge-lg bg-blue-100 text-blue-800 border-blue-200">
                            <FaFileAlt className="mr-2" />
                            {filteredSubmissions.length} shown
                        </span>
                        {searchTerm && (
                            <button 
                                onClick={() => setSearchTerm('')}
                                className="badge badge-lg bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200 transition-colors"
                            >
                                Clear Search
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Submissions Table */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="font-semibold text-gray-700">Participant</th>
                                <th className="font-semibold text-gray-700">Contest</th>
                                <th className="font-semibold text-gray-700">Task</th>
                                <th className="font-semibold text-gray-700">Submission</th>
                                <th className="font-semibold text-gray-700">Status</th>
                                <th className="font-semibold text-gray-700 text-center">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredSubmissions.length > 0 ? (
                                filteredSubmissions.map((sub, idx) => {
                                    const isWinner = sub.status === 'winner';
                                    const positionBadge = isWinner ? getPositionBadge(sub.winner?.position) : null;
                                    
                                    return (
                                        <tr 
                                            key={idx} 
                                            className={`hover:bg-gray-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                                        >
                                            <td>
                                                <div className="font-medium text-gray-900">
                                                    {truncateText(sub.userEmail, 25)}
                                                </div>
                                            </td>
                                            <td>
                                                <div>
                                                    <div className="font-medium text-gray-900">
                                                        {truncateText(sub.contestName, 20)}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {sub.contestType}
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="">
                                                    {sub.taskName}
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    onClick={() => openViewModal(sub)}
                                                    className="btn btn-sm btn-outline btn-info flex items-center gap-2"
                                                >
                                                    <FaEye />
                                                    View Submission
                                                </button>
                                            </td>
                                            <td>
                                                {isWinner ? (
                                                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${positionBadge.color}`}>
                                                        <FaMedal />
                                                        {positionBadge.label}
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border bg-amber-100 text-amber-800 border-amber-200">
                                                        <FaExclamationTriangle />
                                                        Pending Review
                                                    </span>
                                                )}
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-2 justify-center">
                                                    {!isWinner ? (
                                                        <button
                                                            onClick={() => openWinnerModal(sub)}
                                                            className="btn btn-sm btn-outline btn-success flex items-center gap-2"
                                                            title="Declare Winner"
                                                        >
                                                            <FaAward />
                                                            Declare Winner
                                                        </button>
                                                    ) : (
                                                        <span className="text-green-600 font-medium flex items-center gap-2">
                                                            <FaCheckCircle />
                                                            Winner Declared
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-8">
                                        <div className="flex flex-col items-center justify-center">
                                            <FaFileAlt className="text-4xl text-gray-300 mb-3" />
                                            <p className="text-gray-600 font-medium">No submissions found</p>
                                            <p className="text-gray-500 text-sm mt-1">
                                                {searchTerm || contestFilter !== 'all' || statusFilter !== 'all'
                                                    ? 'Try adjusting your filters'
                                                    : 'No submissions have been made yet'
                                                }
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Table Footer */}
                <div className="p-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="text-sm text-gray-600">
                        Showing <span className="font-semibold">{filteredSubmissions.length}</span> of <span className="font-semibold">{submissions.length}</span> submissions
                    </div>
                    <div className="text-sm text-gray-500">
                        Updated: {new Date().toLocaleTimeString()}
                    </div>
                </div>
            </div>

            {/* View Submission Modal */}
            <dialog id="view_modal" className="modal">
                <div className="modal-box max-w-4xl">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="font-bold text-2xl text-gray-800">Submission Details</h3>
                            <p className="text-gray-600">Review participant's submission</p>
                        </div>
                        <button
                            onClick={() => document.getElementById("view_modal").close()}
                            className="btn btn-sm btn-circle btn-ghost"
                        >
                            ×
                        </button>
                    </div>

                    {selectedSubmission && (
                        <div className="space-y-6">
                            {/* Header Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                    <p className="text-sm text-gray-500 mb-1">Participant</p>
                                    <p className="font-medium text-gray-900">{selectedSubmission.userEmail}</p>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                                    <p className="text-sm text-gray-500 mb-1">Contest</p>
                                    <p className="font-medium text-gray-900">{selectedSubmission.contestName}</p>
                                </div>
                            </div>

                            {/* Task Info */}
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="font-medium text-gray-900">Task: {selectedSubmission.taskName}</p>
                                    <span className="badge badge-outline">{selectedSubmission.contestType}</span>
                                </div>
                                <p className="text-sm text-gray-600">Submitted on: {formatDate(selectedSubmission.submittedAt)}</p>
                            </div>

                            {/* Submission Content */}
                            <div>
                                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <FaFileAlt />
                                    Submitted Content
                                </h4>
                                
                                {selectedSubmission.taskSubmission.startsWith("http") ? (
                                    <div className="space-y-4">
                                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="font-medium text-gray-700">External Link Submission</p>
                                                <span className="badge badge-info">URL</span>
                                            </div>
                                            <a
                                                href={selectedSubmission.taskSubmission}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-blue-600 hover:text-blue-800 break-all flex items-center gap-2"
                                            >
                                                {selectedSubmission.taskSubmission}
                                                <FaExternalLinkAlt className="text-sm" />
                                            </a>
                                            <div className="mt-4">
                                                <a
                                                    href={selectedSubmission.taskSubmission}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="btn btn-primary flex items-center gap-2"
                                                >
                                                    <FaExternalLinkAlt />
                                                    Open Submission
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 max-h-96 overflow-y-auto">
                                        <div className="flex items-center justify-between mb-3">
                                            <p className="font-medium text-gray-700">Text Submission</p>
                                            <span className="badge badge-outline">Text</span>
                                        </div>
                                        <div className="whitespace-pre-wrap font-mono text-sm bg-white p-4 rounded border">
                                            {selectedSubmission.taskSubmission}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-3 pt-6 border-t">
                                {selectedSubmission.status !== 'winner' && (
                                    <button
                                        onClick={() => {
                                            document.getElementById("view_modal").close();
                                            setTimeout(() => openWinnerModal(selectedSubmission), 300);
                                        }}
                                        className="btn btn-success flex items-center gap-2"
                                    >
                                        <FaAward />
                                        Declare as Winner
                                    </button>
                                )}
                                <button
                                    onClick={() => document.getElementById("view_modal").close()}
                                    className="btn btn-outline"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>

            {/* Winner Declaration Modal */}
            <dialog id="winner_modal" className="modal">
                <div className="modal-box max-w-md">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="font-bold text-xl text-gray-800 flex items-center gap-2">
                                <FaTrophy className="text-amber-500" />
                                Declare Winner
                            </h3>
                            <p className="text-gray-600 text-sm">Award position to participant</p>
                        </div>
                        <button
                            onClick={() => document.getElementById("winner_modal").close()}
                            className="btn btn-sm btn-circle btn-ghost"
                        >
                            ×
                        </button>
                    </div>

                    {selectedWinner && (
                        <div className="space-y-6">
                            {/* Contestant Info */}
                            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-xl border border-amber-200">
                                <div className="flex items-center gap-3">
                                    <div className="bg-amber-100 p-3 rounded-full">
                                        <FaUserCheck className="text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">{selectedWinner.userEmail}</p>
                                        <p className="text-sm text-gray-600">{selectedWinner.contestName}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Winner Details Form */}
                            <div className="space-y-4">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-medium flex items-center gap-2">
                                            <MdOutlineEmojiEvents />
                                            Winner Position
                                        </span>
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {['1st', '2nd', '3rd'].map((pos) => (
                                            <label 
                                                key={pos}
                                                className={`flex flex-col items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                                                    position === pos 
                                                        ? 'border-amber-500 bg-amber-50' 
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    value={pos}
                                                    checked={position === pos}
                                                    onChange={(e) => setPosition(e.target.value)}
                                                    className="hidden"
                                                />
                                                <span className={`text-2xl ${position === pos ? 'text-amber-600' : 'text-gray-400'}`}>
                                                    {pos === '1st' ? '🥇' : pos === '2nd' ? '🥈' : '🥉'}
                                                </span>
                                                <span className={`text-sm font-medium ${position === pos ? 'text-amber-700' : 'text-gray-600'}`}>
                                                    {pos} Place
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-medium flex items-center gap-2">
                                            <FaAward />
                                            Reward / Prize
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g., $500 cash prize, Certificate, Job Opportunity"
                                        className="input input-bordered w-full"
                                        value={reward}
                                        onChange={(e) => setReward(e.target.value)}
                                    />
                                    <label className="label">
                                        <span className="label-text-alt text-gray-500">
                                            Be specific about the reward
                                        </span>
                                    </label>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="modal-action">
                                <button 
                                    onClick={handleSetWinner}
                                    className="btn btn-success flex items-center gap-2"
                                    disabled={!position || !reward}
                                >
                                    <FaCheckCircle />
                                    Declare Winner
                                </button>
                                <button
                                    onClick={() => document.getElementById("winner_modal").close()}
                                    className="btn btn-outline"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </div>
    );
};

export default Submission;