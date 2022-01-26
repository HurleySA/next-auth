import { NextPage } from "next";
import { useContext } from "react";
import { Can } from "../components/Can";
import { AuthContext } from "../contexts/AuthContext";
import { useCan } from "../hooks/useCan";
import { setupAPIClient } from "../services/api";
import { withSSRAuth } from "../utils/withSSRAuth";

const Dashboard: NextPage = () =>{
    const { user } = useContext(AuthContext);

    return(
      <>
        <div>E-mail: {user?.email} </div>
        <Can permissions={['metrics.list']}>
          <div>Métricas</div>
        </Can>
        
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