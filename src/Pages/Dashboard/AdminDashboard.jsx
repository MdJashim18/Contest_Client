import React, { useEffect, useState } from "react";
import axios from "axios";
import UseAxiosSecure from "../../Hooks/UseAxiosSecure";

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const axiosSecure = UseAxiosSecure

    
    const fetchUsers = async () => {
        try {
            const res = await axiosSecure.get("/users");
            setUsers(res.data);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRoleChange = async (userId, newRole) => {
        try {
            setUpdatingId(userId);
            await axios.patch(`/users/${userId}/role`, {
                role: newRole,
            });
            
            setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
            setUpdatingId(null);
        } catch (error) {
            console.log(error);
            setUpdatingId(null);
        }
    };

    if (loading) return <p>Loading users...</p>;

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
            <p className="mb-6">Approve contests | Change roles</p>

            <table className="table-auto border-collapse border border-gray-300 w-full">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border px-4 py-2">#</th>
                        <th className="border px-4 py-2">Name</th>
                        <th className="border px-4 py-2">Email</th>
                        <th className="border px-4 py-2">Role</th>
                        <th className="border px-4 py-2">Change Role</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={user._id}>
                            <td className="border px-4 py-2">{index + 1}</td>
                            <td className="border px-4 py-2">{user.name}</td>
                            <td className="border px-4 py-2">{user.email}</td>
                            <td className="border px-4 py-2">{user.role}</td>
                            <td className="border px-4 py-2">
                                <select
                                    value={user.role}
                                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                    disabled={updatingId === user._id}
                                    className="border px-2 py-1 rounded"
                                >
                                    <option value="user">User</option>
                                    <option value="creator">Creator</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;
