import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import useAuth from "../../Hooks/useAuth";
import UseAxiosSecure from "../../Hooks/UseAxiosSecure";

const Details = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const axiosSecure = UseAxiosSecure();

    const [contest, setContest] = useState(null);
    const [isRegistered, setIsRegistered] = useState(false);
    const [taskText, setTaskText] = useState("");
    const [timeLeft, setTimeLeft] = useState("");
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

    // Redirect if not logged in
    useEffect(() => {
        if (!user) navigate("/login");
    }, [user, navigate]);

    // Fetch contest data & check localStorage
    useEffect(() => {
        if (!id) return;

        axiosSecure.get(`/contest/${id}`)
            .then(res => setContest(res.data))
            .catch(err => console.error(err));

        const registeredData = JSON.parse(localStorage.getItem('registeredContest'));
        if (registeredData?.contestId === id && registeredData.userEmail === user?.email) {
            setIsRegistered(true);
        }
    }, [axiosSecure, id, user]);

    // Countdown timer
    useEffect(() => {
        if (!contest) return;

        const interval = setInterval(() => {
            const now = new Date();
            const deadline = new Date(contest.deadline);
            const diff = deadline - now;

            if (diff <= 0) {
                setTimeLeft("Contest Ended");
                clearInterval(interval);

                // ✅ Remove registration info when contest ends
                const registeredData = JSON.parse(localStorage.getItem('registeredContest'));
                if (registeredData?.contestId === id && registeredData.userEmail === user?.email) {
                    localStorage.removeItem('registeredContest');
                    setIsRegistered(false);
                    setIsSubmitDisabled(false);
                }
            } else {
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((diff / (1000 * 60)) % 60);
                const seconds = Math.floor((diff / 1000) % 60);
                setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s left`);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [contest, id, user]);

    const handleRegister = () => {
        if (!user) return navigate("/login");
        navigate(`/payment/${id}`);
    };

    const handleSubmitTask = async () => {
        if (!taskText) return alert("Please provide task links");

        try {
            const res = await axiosSecure.patch(`/contest/submit-task/${id}`, {
                userId: user._id,
                taskSubmission: taskText
            });

            if (res.status === 200) {
                alert("Task submitted successfully");
                setTaskText("");
                setIsSubmitDisabled(true); // ✅ disable button after submit
                document.getElementById("submit_task_modal").close();

                setContest(prev => ({
                    ...prev,
                    participants: prev.participants.map(p =>
                        p.userId === user._id ? { ...p, taskSubmission: taskText } : p
                    )
                }));
            }
        } catch (err) {
            console.error(err);
            alert("Failed to submit task. Please try again.");
        }
    };

    if (!contest) return <p className="text-center mt-10">Loading...</p>;

    return (
        <div className="max-w-5xl mx-auto p-6">
            <img src={contest.image} alt={contest.name} className="w-full h-80 object-cover rounded-lg mb-6" />
            <h1 className="text-3xl font-bold mb-2">{contest.name}</h1>
            <p className="text-red-500 font-semibold mb-4">{timeLeft}</p>
            <p className="font-medium mb-2">Participants: {contest.participantsCount || 0}</p>
            <p className="font-bold text-lg mb-4">Prize Money: ${contest.prizeMoney}</p>

            <div className="mb-4">
                <h3 className="font-semibold text-lg">Contest Description</h3>
                <p className="text-gray-700">{contest.description}</p>
            </div>

            <div className="mb-4">
                <h3 className="font-semibold text-lg">Task Instructions</h3>
                <p className="text-gray-700">{contest.taskInstruction}</p>
            </div>

            {contest.winner && (
                <div className="border p-4 rounded-lg mb-4">
                    <h3 className="font-semibold text-lg mb-2">Winner</h3>
                    <div className="flex items-center gap-3">
                        <img src={contest.winner.photo} alt="Winner" className="w-12 h-12 rounded-full" />
                        <p>{contest.winner.name}</p>
                    </div>
                </div>
            )}

            {/* Buttons */}
            {!isRegistered && timeLeft !== "Contest Ended" && (
                <button onClick={handleRegister} className="btn btn-success w-full mb-3">
                    Register / Pay
                </button>
            )}

            {isRegistered && timeLeft !== "Contest Ended" && (
                <button
                    onClick={() => document.getElementById("submit_task_modal").showModal()}
                    className="btn btn-primary w-full mb-3"
                    disabled={isSubmitDisabled} // ✅ disabled after submit
                >
                    {isSubmitDisabled ? "Task Submitted" : "Submit Task"}
                </button>
            )}

            {timeLeft === "Contest Ended" && (
                <p className="text-center text-gray-500 mt-4">Contest has ended.</p>
            )}

            {/* Submit Task Modal */}
            <dialog id="submit_task_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg mb-2">Submit Your Task</h3>
                    <textarea
                        className="textarea textarea-bordered w-full"
                        placeholder="Provide task links (GitHub / Drive / Live URL)"
                        value={taskText}
                        onChange={(e) => setTaskText(e.target.value)}
                    />
                    <div className="modal-action">
                        <button className="btn btn-success" onClick={handleSubmitTask}>Submit</button>
                        <button className="btn" onClick={() => document.getElementById("submit_task_modal").close()}>Cancel</button>
                    </div>
                </div>
            </dialog>
        </div>
    );
};

export default Details;
