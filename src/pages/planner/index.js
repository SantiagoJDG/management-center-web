import Objective from 'components/PlannerDashboard/Objective';
import { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';

const Dashboard = () => {
  const [setObjective] = useState();
  const { userToken, waitingUser } = useAuth();

  const objectivesMock = {
    id: 1,
    startDate: '2022-12-12',
    endDate: '2023-12-12',
    commentData: {
      id: 1,
      author: 1,
      description: 'Comentario inicial y principal de plan de negocio',
      created_at: '2022-01-26',
      updated_at: null
    },
    goals: [
      {
        id: 1,
        description: 'Mejorar la rentabilidad de los proyectos en Europa en 5%.',
        categoryData: {
          id: 1,
          name: 'Financieras'
        },
        authorData: {
          id: 1,
          name: 'Edgar Alexander Guevara Naranjo'
        },
        business_plan_goal: {
          id: 1,
          business_plan_id: 1,
          business_goal_id: 1
        }
      }
    ],
    strategies: [
      {
        id: 1,
        description: 'Estrategia para Mejorar la rentabilidad de los proyectos en Europa en 5%.',
        strategyCategoryData: {
          id: 1,
          name: 'Indicadores'
        },
        businessGoalData: null,
        authorData: {
          id: 1,
          name: 'Edgar Alexander Guevara Naranjo'
        },
        business_plan_strategy: {
          id: 1,
          business_plan_id: 1,
          business_strategy_id: 1
        }
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
