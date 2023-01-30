import Objective from 'components/PlannerDashboard/Objective';
import { useState, useEffect } from 'react';
import { getAxiosInstance } from 'utils/axiosClient';
import useAuth from '../../hooks/useAuth';

const Dashboard = () => {
  const [businessPlan, setBusinessPlan] = useState();
  const { userToken, waitingUser } = useAuth();

  const getObjectives = async () => {
    try {
      let path = `/api/business-plan/1`;
      let response = await getAxiosInstance().get(path);
      setBusinessPlan(response.data);
    } catch {
      console.error('ERROR');
    }
  };

  useEffect(() => {
    if (!userToken) return;
    getObjectives();
  }, [userToken, waitingUser]);

  return (
    !!businessPlan &&
    businessPlan.objectives.map((objective, index) => {
      return <Objective key={index} objectives={objective} />;
    })
  );
};

export default Dashboard;
