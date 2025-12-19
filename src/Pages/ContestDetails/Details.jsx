import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../Hooks/useAuth";
import UseAxiosSecure from "../../Hooks/UseAxiosSecure";
import Swal from "sweetalert2";

const Details = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const axiosSecure = UseAxiosSecure();

  const [isRegistered, setIsRegistered] = useState(false);
  const [taskText, setTaskText] = useState("");
  const [taskName, setTaskName] = useState("");
  const [timeLeft, setTimeLeft] = useState("");
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  const {
    data: contest,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["contest-details", id],
    enabled: !!id && !!user,
    queryFn: async () => {
      const res = await axiosSecure.get(`/contest/${id}`);
      return res.data;
    },
  });

  useEffect(() => {
    if (!contest || !user) return;

    const participant = contest.participants?.find(
      (p) => p.userEmail === user.email
    );

    if (participant?.taskSubmission) {
      setIsSubmitDisabled(true);
    }

    const registeredData = JSON.parse(
      localStorage.getItem("registeredContest")
    );

    setIsRegistered(
      registeredData &&
        registeredData.contestId.toString() === id &&
        registeredData.userEmail === user.email
    );
  }, [contest, user, id]);

  useEffect(() => {
    if (!contest) return;

    const interval = setInterval(() => {
      const now = new Date();
      const deadline = new Date(contest.deadline);
      const diff = deadline - now;

      if (diff <= 0) {
        setTimeLeft("Contest Ended");
        clearInterval(interval);

        const registeredData = JSON.parse(
          localStorage.getItem("registeredContest")
        );

        if (
          registeredData?.contestId.toString() === id &&
          registeredData.userEmail === user?.email
        ) {
          localStorage.removeItem("registeredContest");
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
    if (!user) {
      Swal.fire("Login Required", "Please login to register", "warning");
      return navigate("/login");
    }
    navigate(`/payment/${id}`);
  };

  const handleSubmitTask = async () => {
    if (!taskName || !taskText) {
      return Swal.fire(
        "Missing Info",
        "Please provide task name and links",
        "warning"
      );
    }

    try {
      const res = await axiosSecure.patch(
        `/contest/submit-task/${id}`,
        {
          taskName,
          userEmail: user.email,
          taskSubmission: taskText,
        }
      );

      if (res.status === 200) {
        Swal.fire("Success", "Task submitted successfully!", "success");

        setTaskText("");
        setTaskName("");
        setIsSubmitDisabled(true);
        document.getElementById("submit_task_modal").close();

        refetch();
      }
    } catch {
      Swal.fire("Error", "Failed to submit task. Try again.", "error");
    }
  };

  if (isLoading) {
    return <p className="text-center mt-10">Loading contest...</p>;
  }

  if (isError) {
    return (
      <p className="text-center mt-10 text-red-500">
        {error.message}
      </p>
    );
  }

  if (!contest) return null;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <img
        src={contest.image}
        alt={contest.name}
        className="w-full h-80 object-cover rounded-lg mb-6"
      />

      <h1 className="text-3xl font-bold mb-2">{contest.name}</h1>
      <p className="text-red-500 font-semibold mb-4">
        {timeLeft}
      </p>

      <p className="font-medium mb-2">
        Participants: {contest.participantsCount || 0}
      </p>
      <p className="font-bold text-lg mb-4">
        Prize Money: ${contest.prizeMoney}
      </p>

      <div className="mb-4">
        <h3 className="font-semibold text-lg">
          Contest Description
        </h3>
        <p className="text-gray-700">
          {contest.description}
        </p>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold text-lg">
          Task Instructions
        </h3>
        <p className="text-gray-700">
          {contest.taskInstruction}
        </p>
      </div>

      {!isRegistered && timeLeft !== "Contest Ended" && (
        <button
          onClick={handleRegister}
          className="btn btn-success w-full mb-3"
        >
          Register / Pay
        </button>
      )}

      {isRegistered && timeLeft !== "Contest Ended" && (
        <button
          onClick={() =>
            document
              .getElementById("submit_task_modal")
              .showModal()
          }
          className="btn btn-primary w-full mb-3"
          disabled={isSubmitDisabled}
        >
          {isSubmitDisabled
            ? "Task Submitted"
            : "Submit Task"}
        </button>
      )}

      {timeLeft === "Contest Ended" && (
        <p className="text-center text-gray-500 mt-4">
          Contest has ended.
        </p>
      )}

      <dialog id="submit_task_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-2">
            Submit Your Task
          </h3>

          <input
            type="text"
            placeholder="Task Name"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            className="input input-bordered w-full mb-2"
          />

          <textarea
            className="textarea textarea-bordered w-full mb-2"
            placeholder="Provide task links"
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
          />

          <div className="modal-action">
            <button
              className="btn btn-success"
              onClick={handleSubmitTask}
            >
              Submit
            </button>
            <button
              className="btn"
              onClick={() =>
                document
                  .getElementById("submit_task_modal")
                  .close()
              }
            >
              Cancel
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default Details;
