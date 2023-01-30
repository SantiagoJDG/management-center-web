import Objective from 'components/PlannerDashboard/Objective';
import { useState, useEffect } from 'react';
import { getAxiosInstance } from 'utils/axiosClient';
import useAuth from '../../hooks/useAuth';

const Dashboard = () => {
  const [businessPlan, setBusinessPlan] = useState();
  const { userToken, waitingUser } = useAuth();

  const getBusinessPlan = async () => {
    try {
      let path = `/api/business-plan/1`;
      let response = await getAxiosInstance().get(path);
      setBusinessPlan(response.data);
    } catch {
      console.error('ERROR');
    }
  };

  useEffect(() => {
    if (waitingUser) return;
    if (!userToken) {
      router.replace('/login');
      return;
    }

    getBusinessPlan();
  }, [userToken, waitingUser]);

  return (
    !!businessPlan &&
    businessPlan.objectives.map((objective) => {
      return <Objective key={objective.id} objective={objective} />;
    })
  );
};

export default Dashboard;
