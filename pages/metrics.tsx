import { NextPage } from "next";
import { setupAPIClient } from "../services/api";
import { withSSRAuth } from "../utils/withSSRAuth";

const Metrics: NextPage = () =>{
    return(
      <>
          <div>Métricas</div>
      </>
    )
}
export default Metrics;

export const getServerSideProps = withSSRAuth(async (ctx) => {
    const apiClient = setupAPIClient(ctx);
    const response = await apiClient.get('/me');

    return {
      props:{}
    }
  },{
      permissions: ['metrics.list'],
      roles:['administrator']
  });