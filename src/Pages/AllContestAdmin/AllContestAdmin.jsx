import React from "react";
import UseAxiosSecure from "../../Hooks/UseAxiosSecure";
import Swal from "sweetalert2";
import { Link } from "react-router";
import {
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

const AllContestAdmin = () => {
    const axiosSecure = UseAxiosSecure();
    const queryClient = useQueryClient();

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

    const handleConfirm = async (id) => {
        const confirm = await Swal.fire({
            title: "Approve contest?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Approve",
        });

        if (!confirm.isConfirmed) return;

        const res = await axiosSecure.patch(`/contest/approve/${id}`);
        if (res.data.modifiedCount > 0) {
            Swal.fire("Approved!", "Contest approved successfully", "success");
            queryClient.invalidateQueries(["contests"]);
        }
    };

    const handleReject = async (id) => {
        const confirm = await Swal.fire({
            title: "Reject contest?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Reject",
        });

        if (!confirm.isConfirmed) return;

        const res = await axiosSecure.patch(`/contest/reject/${id}`);
        if (res.data.modifiedCount > 0) {
            Swal.fire("Rejected!", "Contest rejected", "info");
            queryClient.invalidateQueries(["contests"]);
        }
    };

    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: "Delete contest?",
            text: "This action cannot be undone",
            icon: "error",
            showCancelButton: true,
            confirmButtonText: "Delete",
        });

        if (!confirm.isConfirmed) return;

        const res = await axiosSecure.delete(`/contest/${id}`);
        if (res.data.deletedCount > 0) {
            Swal.fire("Deleted!", "Contest deleted successfully", "success");
            queryClient.invalidateQueries(["contests"]);
        }
    };

    if (isLoading) {
        return (
            <p className="text-center mt-10 text-lg">
                Loading contests...
            </p>
        );
    }

    if (isError) {
        return (
            <p className="text-center mt-10 text-red-500">
                {error.message}
            </p>
        );
    }

    return (
        <div className="p-4 md:p-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">
                    All Contests (Admin)
                </h1>
                <p className="text-gray-600">
                    Approve, reject or delete contests
                </p>
            </div>

            <div className="overflow-x-auto bg-base-100 shadow rounded-lg">
                <table className="table table-zebra w-full">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Price</th>
                            <th>Prize</th>
                            <th>Status</th>
                            <th className="text-center">Actions</th>
                            <th>Details</th>
                        </tr>
                    </thead>

                    <tbody>
                        {contests.length ? (
                            contests.map((contest, index) => (
                                <tr key={contest._id}>
                                    <td>{index + 1}</td>
                                    <td className="font-medium">{contest.name}</td>
                                    <td>{contest.contestType}</td>
                                    <td>${contest.price}</td>
                                    <td>${contest.prizeMoney}</td>

                                    <td>
                                        <span
                                            className={`badge ${contest.status === "approved"
                                                    ? "badge-success"
                                                    : contest.status === "rejected"
                                                        ? "badge-error"
                                                        : "badge-warning"
                                                }`}
                                        >
                                            {contest.status || "pending"}
                                        </span>
                                    </td>

                                    <td>
                                        <div className="flex flex-wrap gap-2 justify-center">
                                            <button
                                                onClick={() => handleConfirm(contest._id)}
                                                className="btn btn-xs btn-success"
                                                disabled={contest.status === "approved"}
                                            >
                                                Approve
                                            </button>

                                            <button
                                                onClick={() => handleReject(contest._id)}
                                                className="btn btn-xs btn-warning"
                                                disabled={contest.status === "rejected"}
                                            >
                                                Reject
                                            </button>

                                            <button
                                                onClick={() => handleDelete(contest._id)}
                                                className="btn btn-xs btn-error"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>

                                    <td>
                                        <Link
                                            to={`/dashboard/contest/${contest._id}`}
                                            className="btn btn-xs btn-info"
                                        >
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="text-center py-6">
                                    No contests found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AllContestAdmin;
