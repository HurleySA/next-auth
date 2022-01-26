import { NextPage } from "next";
import { useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { setupAPIClient } from "../services/api";
import { api } from "../services/apiCliente";
import { withSSRAuth } from "../utils/withSSRAuth";

const Dashboard: NextPage = () =>{
    const { user } = useContext(AuthContext);

    return(
        <div>E-mail: {user?.email} </div>
    )
}
export default Dashboard;

export const getServerSideProps = withSSRAuth(async (ctx) => {
    const apiClient = setupAPIClient(ctx);
    const response = await apiClient.get('/me');
    console.log(response.data);
    return {
      props:{}
    }
  });