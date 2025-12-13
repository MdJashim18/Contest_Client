import React, { useEffect, useState } from "react";
import UseAxiosSecure from "../../Hooks/UseAxiosSecure";
import { FaUserShield } from "react-icons/fa";
import { FiShieldOff } from "react-icons/fi";

const ShowUsers = () => {
  const [users, setUsers] = useState([]);
  const axiosSecure = UseAxiosSecure();

  // Fetch all users from backend
  const fetchUsers = () => {
    axiosSecure.get("/users")
      .then(res => setUsers(res.data))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle role change
  const handleRoleChange = (userId, newRole) => {
    axiosSecure.patch(`/users/${userId}`, { role: newRole })
      .then(() => {
        // Update local state
        setUsers(prev =>
          prev.map(u => u._id === userId ? { ...u, role: newRole } : u)
        );
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">All Users</h1>

      <table className="table-auto border border-gray-300 w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">#</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Action</th>
            <th className="border px-4 py-2">Role</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user, index) => (
            <tr key={user._id}>
              <td className="border px-4 py-2">{index + 1}</td>
              <td className="border px-4 py-2">{user.displayName}</td>
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2 text-center">
                {user.role === "admin" ? (
                  <button
                    className="btn btn-sm btn-warning flex items-center justify-center"
                    onClick={() => handleRoleChange(user._id, "user")}
                  >
                    <FiShieldOff className="mr-1" /> Demote
                  </button>
                ) : (
                  <button
                    className="btn btn-sm btn-primary flex items-center justify-center"
                    onClick={() => handleRoleChange(user._id, "admin")}
                  >
                    <FaUserShield className="mr-1" /> Promote
                  </button>
                )}
              </td>
              <td className="border px-4 py-2">{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShowUsers;
