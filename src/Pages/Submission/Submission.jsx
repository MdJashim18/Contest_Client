import React, { useEffect, useState } from "react";
import UseAxiosSecure from "../../Hooks/UseAxiosSecure";
import Swal from "sweetalert2";

const Submission = () => {
    const axiosSecure = UseAxiosSecure();
    const [submissions, setSubmissions] = useState([]);
    const [selectedWinner, setSelectedWinner] = useState(null);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [position, setPosition] = useState("");
    const [reward, setReward] = useState("");

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const res = await axiosSecure.get("/contest");
                const contests = res.data;
                const all = [];

                contests.forEach(contest => {
                    if (contest.tasks) {
                        Object.entries(contest.tasks).forEach(([taskName, arr]) => {
                            arr.forEach(sub => {
                                all.push({
                                    contestId: contest._id,
                                    contestName: contest.name,
                                    userEmail: sub.userEmail,
                                    taskName,
                                    taskSubmission: sub.taskSubmission,
                                    winner: contest.winner || null,
                                });
                            });
                        });
                    }
                });

                setSubmissions(all);
            } catch (err) {
                console.error(err);
            }
        };

        fetchSubmissions();
    }, [axiosSecure]);

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
            return Swal.fire("All fields required", "", "error");
        }

        try {
            await axiosSecure.patch(`/contest/winner/${selectedWinner.contestId}`, {
                userEmail: selectedWinner.userEmail,
                position,
                reward,
            });

            Swal.fire("Winner set successfully", "", "success");
            document.getElementById("winner_modal").close();

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
                        }
                        : s
                )
            );
        } catch (err) {
            console.error(err);
            Swal.fire("Failed to set winner", "", "error");
        }
    };

    return (
        <div className="p-4 overflow-x-auto">
            <h2 className="text-2xl font-bold mb-4">Contest Submissions</h2>

            <table className="table table-zebra w-full">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>User Email</th>
                        <th>Contest</th>
                        <th>Task</th>
                        <th>Submission</th>
                        <th>Winner</th>
                    </tr>
                </thead>

                <tbody>
                    {submissions.length ? (
                        submissions.map((sub, idx) => (
                            <tr key={idx}>
                                <td>{idx + 1}</td>
                                <td>{sub.userEmail}</td>
                                <td>{sub.contestName}</td>
                                <td>{sub.taskName}</td>
                                <td>
                                    <button
                                        onClick={() => openViewModal(sub)}
                                        className="btn btn-xs btn-info"
                                    >
                                        View
                                    </button>
                                </td>
                                <td>
                                    {sub.winner?.userEmail === sub.userEmail ? (
                                        <span className="text-green-600 font-bold">
                                            {sub.winner.position} Winner
                                        </span>
                                    ) : (
                                        <button
                                            onClick={() => openWinnerModal(sub)}
                                            className="btn btn-xs btn-success"
                                        >
                                            Set Winner
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center">
                                No submissions found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            <dialog id="view_modal" className="modal">
                <div className="modal-box max-w-2xl">
                    <h3 className="font-bold text-lg mb-2">Submission Details</h3>

                    {selectedSubmission && (
                        <div className="space-y-2">
                            <p><strong>User:</strong> {selectedSubmission.userEmail}</p>
                            <p><strong>Contest:</strong> {selectedSubmission.contestName}</p>
                            <p><strong>Task:</strong> {selectedSubmission.taskName}</p>

                            <div className="mt-3">
                                <p className="font-semibold mb-1">Submitted Content:</p>

                                
                                {selectedSubmission.taskSubmission.startsWith("http") ? (
                                    <a
                                        href={selectedSubmission.taskSubmission}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-blue-600 underline break-all"
                                    >
                                        {selectedSubmission.taskSubmission}
                                    </a>
                                ) : (
                                    <div className="p-3 border rounded bg-gray-100 whitespace-pre-wrap">
                                        {selectedSubmission.taskSubmission}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="modal-action">
                        <button
                            className="btn"
                            onClick={() => document.getElementById("view_modal").close()}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </dialog>

           
            <dialog id="winner_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg mb-3">Set Contest Winner</h3>

                    <label className="label">Winner Position</label>
                    <select
                        className="select select-bordered w-full mb-3"
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                    >
                        <option value="">Select Position</option>
                        <option value="1st">1st</option>
                        <option value="2nd">2nd</option>
                        <option value="3rd">3rd</option>
                    </select>

                    <label className="label">Winner Reward</label>
                    <input
                        type="text"
                        placeholder="Prize / Amount / Gift"
                        className="input input-bordered w-full"
                        value={reward}
                        onChange={(e) => setReward(e.target.value)}
                    />

                    <div className="modal-action">
                        <button onClick={handleSetWinner} className="btn btn-success">
                            Submit
                        </button>
                        <button
                            className="btn"
                            onClick={() => document.getElementById("winner_modal").close()}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </dialog>
        </div>
    );
};

export default Submission;
