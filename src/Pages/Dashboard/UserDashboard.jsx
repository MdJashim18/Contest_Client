import useAuth from "../../Hooks/useAuth";

const UserDashboard = () => {
  const {user} = useAuth()
  console.log(user)
  return (
    <div>
      <h1>User Dashboard</h1>
      <p>Joined & Won contests</p>
    </div>
  );
};
export default UserDashboard;
