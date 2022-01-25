import { NextPage } from "next";
import { useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { api } from "../services/api";

const Dashboard: NextPage = () =>{
    const { user } = useContext(AuthContext);

    return(
        <div>E-mail: {user?.email} </div>
    )
}
export default Dashboard;