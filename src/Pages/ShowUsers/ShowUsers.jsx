import React, { useEffect, useState } from "react";
import UseAxiosSecure from "../../Hooks/UseAxiosSecure";
import { FaUser, FaUserTie, FaUserShield } from "react-icons/fa";

const ShowUsers = () => {
  const [users, setUsers] = useState([]);
  const axiosSecure = UseAxiosSecure();

  const getAllUsers = async () => {
    try {
      const res = await axiosSecure.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const getNextRole = (currentRole) => {
    if (currentRole === "user") return "creator";
    if (currentRole === "creator") return "admin";
    return "user"; 
  };

  const handleRoleChange = async (user) => {
    const updatedRole = getNextRole(user.role);

    try {
      await axiosSecure.patch(`/users/${user._id}`, {
        role: updatedRole,
      });

      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u._id === user._id ? { ...u, role: updatedRole } : u
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  const roleBadge = (role) => {
    if (role === "admin") return "badge-success";
    if (role === "creator") return "badge-warning";
    return "badge-secondary";
  };

  const roleIcon = (role) => {
    if (role === "admin") return <FaUserShield />;
    if (role === "creator") return <FaUserTie />;
    return <FaUser />;
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>

      <div className="overflow-x-auto">
        <table className="table w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user, index) => (
              <tr key={user._id}>
                <td>{index + 1}</td>
                <td>{user.displayName || "N/A"}</td>
                <td>{user.email}</td>

                <td>
                  <span className={`badge ${roleBadge(user.role)}`}>
                    {user.role}
                  </span>
                </td>

                <td className="text-center">
                  <button
                    onClick={() => handleRoleChange(user)}
                    className="btn btn-sm btn-outline flex items-center gap-2 mx-auto"
                  >
                    {roleIcon(user.role)}
                    Change Role
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <p className="text-center mt-6 text-gray-500">
            No users found
          </p>
        )}
      </div>
    </div>
  );
};

export default ShowUsers;
