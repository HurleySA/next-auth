import { NextPage } from "next";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useCan } from "../hooks/useCan";
import { setupAPIClient } from "../services/api";
import { withSSRAuth } from "../utils/withSSRAuth";

const Dashboard: NextPage = () =>{
    const { user } = useContext(AuthContext);

    const userCanSeeMetrics = useCan({
      roles: ['administrator']
    })

    return(
      <>
        <div>E-mail: {user?.email} </div>

        {userCanSeeMetrics && <div>Métricas</div>}
      </>
    )
}
export default Dashboard;

export const getServerSideProps = withSSRAuth(async (ctx) => {
    const apiClient = setupAPIClient(ctx);
    const response = await apiClient.get('/me');
    return {
      props:{}
    }
  });