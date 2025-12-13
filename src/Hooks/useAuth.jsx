import { useContext } from "react";
import { AuthContext } from "../Contexts/AuthContext/AuthContext";

const useAuth = () => {
    return useContext(AuthContext);
};

export default useAuth;
