import React, { useState, useEffect, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { FaUsers, FaCrown, FaPaintBrush, FaUserShield, FaChartLine, FaFilter, FaSearch, FaSync, FaCalendarAlt, FaEnvelope, FaHome, FaTachometerAlt, FaUser, FaCog, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";
import { MdAdminPanelSettings, MdPersonAddAlt, MdOutlineSpaceDashboard, MdOutlineAnalytics, MdOutlineManageAccounts, MdOutlinePerson } from "react-icons/md";
import { HiOutlineUserGroup, HiOutlineDocumentReport } from "react-icons/hi";
import { AiOutlineDashboard } from "react-icons/ai";
import UseAxiosSecure from "../../Hooks/UseAxiosSecure";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';

    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    };

    try {
        return new Date(dateString).toLocaleDateString('en-US', options);
    } catch (error) {
        return 'Invalid Date';
    }
};


const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
};

const AdminDashboard = () => {
    const axiosSecure = UseAxiosSecure();
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [contests, setContests] = useState([]);
    const [updatingId, setUpdatingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [activeMenu, setActiveMenu] = useState("overview");

    const [stats, setStats] = useState({
        totalUsers: 0,
        totalAdmins: 0,
        totalCreators: 0,
        totalRegularUsers: 0,
        recentUsers: 0,
        totalContests: 0,
        activeContests: 0,
        totalRevenue: 0,
        pendingApprovals: 0
    });

    const [recentActivity, setRecentActivity] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    const adminMenus = [
        { id: "overview", label: "Overview", icon: <AiOutlineDashboard /> },
        { id: "users", label: "User Management", icon: <FaUsers /> },
        { id: "contests", label: "Contest Management", icon: <FaCrown /> },
        { id: "analytics", label: "Analytics", icon: <MdOutlineAnalytics /> },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {

                const usersRes = await axiosSecure.get("/users");
                const usersData = usersRes.data;
                setUsers(usersData);

                const contestsRes = await axiosSecure.get("/contest");
                const contestsData = contestsRes.data;
                setContests(contestsData);

                const totalUsers = usersData.length;
                const totalAdmins = usersData.filter(u => u.role === "admin").length;
                const totalCreators = usersData.filter(u => u.role === "creator").length;
                const totalRegularUsers = usersData.filter(u => u.role === "user").length;

                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                const recentUsers = usersData.filter(u =>
                    new Date(u.createdAt) > weekAgo
                ).length;

                const totalContests = contestsData.length;
                const activeContests = contestsData.filter(c => c.status === "approved").length;
                const pendingApprovals = contestsData.filter(c => c.status === "pending").length;

                const totalRevenue = contestsData.reduce((sum, contest) => {
                    return sum + (contest.participantsCount || 0) * (contest.price || 0);
                }, 0);

                setStats({
                    totalUsers,
                    totalAdmins,
                    totalCreators,
                    totalRegularUsers,
                    recentUsers,
                    totalContests,
                    activeContests,
                    totalRevenue,
                    pendingApprovals
                });

                const sortedByRecent = [...usersData]
                    .sort((a, b) => new Date(b.createdAt || b.updatedAt) - new Date(a.createdAt || a.updatedAt))
                    .slice(0, 10);
                setRecentActivity(sortedByRecent);

            } catch (err) {
                console.error("Error fetching data:", err);
                Swal.fire("Error", "Failed to load dashboard data", "error");
            }
        };

        fetchData();
    }, [axiosSecure]);

    const roleChartData = useMemo(() => [
        { name: "Admins", value: stats.totalAdmins, color: "#EF4444" },
        { name: "Creators", value: stats.totalCreators, color: "#F59E0B" },
        { name: "Users", value: stats.totalRegularUsers, color: "#3B82F6" }
    ], [stats]);

    const contestChartData = useMemo(() => [
        { name: "Approved", value: contests.filter(c => c.status === "approved").length, color: "#10B981" },
        { name: "Pending", value: contests.filter(c => c.status === "pending").length, color: "#F59E0B" },
        { name: "Rejected", value: contests.filter(c => c.status === "rejected").length, color: "#EF4444" }
    ], [contests]);

    const growthChartData = useMemo(() => [
        { month: "Jan", users: Math.floor(stats.totalUsers * 0.1) },
        { month: "Feb", users: Math.floor(stats.totalUsers * 0.15) },
        { month: "Mar", users: Math.floor(stats.totalUsers * 0.2) },
        { month: "Apr", users: Math.floor(stats.totalUsers * 0.3) },
        { month: "May", users: Math.floor(stats.totalUsers * 0.5) },
        { month: "Jun", users: Math.floor(stats.totalUsers * 0.7) },
        { month: "Jul", users: stats.totalUsers },
    ], [stats.totalUsers]);

    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch =
                user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.displayName?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesRole =
                roleFilter === "all" ||
                user.role === roleFilter;

            return matchesSearch && matchesRole;
        });
    }, [users, searchTerm, roleFilter]);

    const handleSearch = debounce((value) => {
        setSearchTerm(value);
    }, 300);

    const handleRoleChange = async (userId, newRole) => {
        try {
            const result = await Swal.fire({
                title: "Change User Role",
                html: `
                    <div class="text-left">
                        <p class="mb-2">Are you sure you want to change this user's role to <strong>${newRole}</strong>?</p>
                        <p class="text-sm text-gray-600">This action will grant different permissions and access levels.</p>
                    </div>
                `,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3B82F6",
                cancelButtonColor: "#6B7280",
                confirmButtonText: "Yes, Change Role",
                cancelButtonText: "Cancel",
                reverseButtons: true,
                customClass: {
                    popup: 'rounded-xl',
                    confirmButton: 'px-4 py-2',
                    cancelButton: 'px-4 py-2'
                }
            });

            if (!result.isConfirmed) return;

            setUpdatingId(userId);

            await axiosSecure.patch(`/users/${userId}`, {
                role: newRole,
            });

            const user = users.find(u => u._id === userId);

            setUsers(prev => prev.map(u =>
                u._id === userId ? { ...u, role: newRole } : u
            ));

            setStats(prev => {
                const updatedStats = { ...prev };

                if (user.role === "admin") updatedStats.totalAdmins -= 1;
                else if (user.role === "creator") updatedStats.totalCreators -= 1;
                else if (user.role === "user") updatedStats.totalRegularUsers -= 1;

                if (newRole === "admin") updatedStats.totalAdmins += 1;
                else if (newRole === "creator") updatedStats.totalCreators += 1;
                else if (newRole === "user") updatedStats.totalRegularUsers += 1;

                return updatedStats;
            });

            Swal.fire({
                icon: "success",
                title: "Role Updated!",
                text: `User role has been changed to ${newRole}`,
                timer: 2000,
                showConfirmButton: false,
                toast: true,
                position: "top-end"
            });

        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: "error",
                title: "Update Failed",
                text: "Failed to update user role. Please try again.",
                timer: 3000
            });
        } finally {
            setUpdatingId(null);
        }
    };

    const viewUserDetails = (user) => {
        setSelectedUser(user);
        document.getElementById('user_details_modal').showModal();
    };

    const sendEmail = (email) => {
        window.location.href = `mailto:${email}`;
    };

    const getRoleBadge = (role) => {
        const roles = {
            admin: {
                label: "Admin",
                icon: <MdAdminPanelSettings />,
                color: "bg-red-100 text-red-800 border-red-200",
                iconColor: "text-red-500"
            },
            creator: {
                label: "Creator",
                icon: <FaPaintBrush />,
                color: "bg-amber-100 text-amber-800 border-amber-200",
                iconColor: "text-amber-500"
            },
            user: {
                label: "User",
                icon: <HiOutlineUserGroup />,
                color: "bg-blue-100 text-blue-800 border-blue-200",
                iconColor: "text-blue-500"
            }
        };
        return roles[role] || roles.user;
    };

    const renderContent = () => {
        switch (activeMenu) {
            case "overview":
                return renderOverview();
            case "users":
                return renderUserManagement();
            case "contests":
                return renderContestManagement();
            case "analytics":
                return renderAnalytics();
            default:
                return renderOverview();
        }
    };

    const renderOverview = () => (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-5 text-white transform transition-transform hover:scale-105">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm opacity-90">Total Users</p>
                            <p className="text-2xl font-bold">{stats.totalUsers}</p>
                            <p className="text-xs mt-2 opacity-80">+{stats.recentUsers} new this week</p>
                        </div>
                        <div className="p-3 bg-white/20 rounded-lg">
                            <FaUsers className="text-2xl" />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-5 text-white transform transition-transform hover:scale-105">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm opacity-90">Active Contests</p>
                            <p className="text-2xl font-bold">{stats.activeContests}</p>
                            <p className="text-xs mt-2 opacity-80">Total: {stats.totalContests}</p>
                        </div>
                        <div className="p-3 bg-white/20 rounded-lg">
                            <FaCrown className="text-2xl" />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg p-5 text-white transform transition-transform hover:scale-105">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm opacity-90">Total Revenue</p>
                            <p className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
                            <p className="text-xs mt-2 opacity-80">From contests</p>
                        </div>
                        <div className="p-3 bg-white/20 rounded-lg">
                            <FaChartLine className="text-2xl" />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl shadow-lg p-5 text-white transform transition-transform hover:scale-105">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm opacity-90">Pending Approvals</p>
                            <p className="text-2xl font-bold">{stats.pendingApprovals}</p>
                            <p className="text-xs mt-2 opacity-80">Awaiting review</p>
                        </div>
                        <div className="p-3 bg-white/20 rounded-lg">
                            <MdOutlineAnalytics className="text-2xl" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-6">User Role Distribution</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={roleChartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                >
                                    {roleChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => [`${value} users`, 'Count']} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-6">Monthly Growth</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={growthChartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip formatter={(value) => [`${value} users`, 'Total']} />
                                <Legend />
                                <Bar dataKey="users" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent User Activity</h3>
                <div className="space-y-3">
                    {recentActivity.slice(0, 5).map((activity, index) => {
                        const roleBadge = getRoleBadge(activity.role);
                        return (
                            <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={activity.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(activity.name || activity.email)}&background=random`}
                                        alt="Avatar"
                                        className="w-10 h-10 rounded-full"
                                    />
                                    <div>
                                        <p className="font-medium text-gray-800">{activity.name || activity.email}</p>
                                        <p className="text-sm text-gray-500">Joined {formatDate(activity.createdAt)}</p>
                                    </div>
                                </div>
                                <span className={`badge ${roleBadge.color} gap-1`}>
                                    {roleBadge.icon}
                                    {activity.role}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );

    const renderUserManagement = () => (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">User Management</h2>
                        <p className="text-gray-600">Manage user roles and permissions</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search users..."
                                onChange={(e) => handleSearch(e.target.value)}
                                className="input input-bordered pl-10 w-full"
                            />
                        </div>

                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="select select-bordered w-full md:w-40"
                        >
                            <option value="all">All Roles</option>
                            <option value="admin">Admin</option>
                            <option value="creator">Creator</option>
                            <option value="user">User</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="table">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="font-semibold text-gray-700">User</th>
                            <th className="font-semibold text-gray-700">Email</th>
                            <th className="font-semibold text-gray-700">Role</th>
                            <th className="font-semibold text-gray-700">Joined</th>
                            <th className="font-semibold text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user, index) => {
                            const roleBadge = getRoleBadge(user.role);
                            return (
                                <tr key={user._id} className="hover:bg-gray-50">
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email)}&background=random`}
                                                alt={user.name}
                                                className="w-10 h-10 rounded-full"
                                            />
                                            <div>
                                                <div className="font-medium text-gray-900">
                                                    {user.name || user.displayName || "No Name"}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {user.address || "No address"}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="text-gray-700">{user.email}</td>
                                    <td>
                                        <span className={`badge ${roleBadge.color} gap-1`}>
                                            {roleBadge.icon}
                                            {roleBadge.label}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="text-sm text-gray-600">
                                            {formatDate(user.createdAt)}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <select
                                                value={user.role}
                                                disabled={updatingId === user._id}
                                                onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                                className="select select-bordered select-sm w-32"
                                            >
                                                <option value="user">User</option>
                                                <option value="creator">Creator</option>
                                                <option value="admin">Admin</option>
                                            </select>

                                            <button
                                                onClick={() => viewUserDetails(user)}
                                                className="btn btn-ghost btn-sm"
                                            >
                                                <MdOutlineSpaceDashboard />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderContestManagement = () => (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Contest Management</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-700 mb-4">Contest Distribution</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={contestChartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                >
                                    {contestChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => [`${value} contests`, 'Count']} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-semibold text-gray-700">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => navigate("/dashboard/CreateContest")}
                            className="btn btn-primary"
                        >
                            Create New Contest
                        </button>
                        <button
                            onClick={() => navigate("/dashboard/admin/All-Contest")}
                            className="btn btn-outline"
                        >
                            View All Contests
                        </button>
                    </div>

                    <div className="mt-6">
                        <h4 className="font-medium text-gray-700 mb-3">Recent Contests</h4>
                        <div className="space-y-3">
                            {contests.slice(0, 5).map(contest => (
                                <div key={contest._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="font-medium">{contest.name}</p>
                                        <p className="text-sm text-gray-600">{contest.contestType}</p>
                                    </div>
                                    <span className={`badge ${contest.status === 'approved' ? 'badge-success' :
                                        contest.status === 'pending' ? 'badge-warning' : 'badge-error'
                                        }`}>
                                        {contest.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderAnalytics = () => (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Analytics Dashboard</h2>
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="stat">
                        <div className="stat-title">Avg. Contest Price</div>
                        <div className="stat-value">${contests.length > 0 ? Math.round(contests.reduce((a, b) => a + (b.price || 0), 0) / contests.length) : 0}</div>
                    </div>
                    <div className="stat">
                        <div className="stat-title">Total Participants</div>
                        <div className="stat-value">{contests.reduce((a, b) => a + (b.participantsCount || 0), 0)}</div>
                    </div>
                    <div className="stat">
                        <div className="stat-title">Success Rate</div>
                        <div className="stat-value">87%</div>
                    </div>
                </div>

                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={growthChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="users" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );



    return (
        <div className="min-h-screen">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
                <p className="text-gray-600 mt-2">Manage platform activities, users, and contests</p>
            </div>

            <div className="mb-8">
                <div className="tabs tabs-boxed bg-base-200 p-2 rounded-lg">
                    {adminMenus.map((menu) => (
                        <button
                            key={menu.id}
                            className={`tab tab-lg ${activeMenu === menu.id ? 'tab-active bg-primary text-white' : ''}`}
                            onClick={() => setActiveMenu(menu.id)}
                        >
                            <span className="flex items-center gap-2">
                                {menu.icon}
                                {menu.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="mb-8">
                {renderContent()}
            </div>

            <dialog id="user_details_modal" className="modal">
                <div className="modal-box max-w-2xl">
                    {selectedUser && (
                        <>
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="font-bold text-xl">User Details</h3>
                                    <p className="text-gray-600">Complete user information</p>
                                </div>
                                <button
                                    onClick={() => document.getElementById('user_details_modal').close()}
                                    className="btn btn-md btn-ghost"
                                >
                                    close
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                                    <img
                                        src={selectedUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser.name || selectedUser.email)}&background=random`}
                                        alt="Avatar"
                                        className="w-20 h-20 rounded-full border-4 border-white shadow"
                                    />
                                    <div>
                                        <h4 className="text-xl font-bold text-gray-800">
                                            {selectedUser.name || selectedUser.displayName || "No Name"}
                                        </h4>
                                        <p className="text-gray-600">{selectedUser.email}</p>
                                        <div className="mt-2">
                                            <span className={`badge ${getRoleBadge(selectedUser.role).color} gap-2`}>
                                                {getRoleBadge(selectedUser.role).icon}
                                                {selectedUser.role.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Address</label>
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                            {selectedUser.address || "Not provided"}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Account Created</label>
                                        <div className="p-3 bg-gray-50 rounded-lg flex items-center gap-2">
                                            <FaCalendarAlt className="text-gray-400" />
                                            {selectedUser.createdAt ? formatDate(selectedUser.createdAt) : 'N/A'}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Last Updated</label>
                                        <div className="p-3 bg-gray-50 rounded-lg flex items-center gap-2">
                                            <FaCalendarAlt className="text-gray-400" />
                                            {selectedUser.updatedAt ? formatDate(selectedUser.updatedAt) : 'Never'}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Role Management</label>
                                        <select
                                            value={selectedUser.role}
                                            onChange={(e) => handleRoleChange(selectedUser._id, e.target.value)}
                                            className="select select-bordered w-full"
                                        >
                                            <option value="user">User</option>
                                            <option value="creator">Creator</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t">
                                    <button
                                        onClick={() => sendEmail(selectedUser.email)}
                                        className="btn btn-outline"
                                    >
                                        <FaEnvelope />
                                        Send Email
                                    </button>
                                    <button
                                        onClick={() => document.getElementById('user_details_modal').close()}
                                        className="btn"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </div>
    );
};

export default AdminDashboard;