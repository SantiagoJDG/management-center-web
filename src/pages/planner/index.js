import Objective from 'components/PlannerDashboard/Objective';
import { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';

const Dashboard = () => {
  const [setObjective] = useState();
  const { userToken, waitingUser } = useAuth();

  const objectivesMock = {
    id: 1,
    description: 'The Objective in the world',
    goal: [
      {
        id: 1,
        id_objective: 1,
        title: 'My Goal is better than yours',
        goals: [
          'Prepare goal to be better than yoyrs',
          'Make Sure that my goal is better than yours',
          'Look the free man and pass de ball'
        ]
      }
    ],
    strategy: [
      {
        id: 1,
        description: 'Look out for goals which are better than yours'
      },
      {
        id: 2,
        description: 'Look out for goals which are better than yours'
      }
    ]
  };

  const getObjectives = async () => {
    try {
      setObjective(objectivesMock);
      console.log(objectivesMock);
    } catch {
      console.error('ERROR');
    }
  };

  useEffect(() => {
    if (!userToken) return;

    getObjectives();
  }, [userToken, waitingUser]);
  return <Objective objectives={objectivesMock} />;
};

export default Dashboard;
