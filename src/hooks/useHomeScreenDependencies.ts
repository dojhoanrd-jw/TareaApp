import { useTask } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';

export interface IHomeScreenDependencies {
  taskService: ReturnType<typeof useTask>;
  authService: ReturnType<typeof useAuth>;
}

export const useHomeScreenDependencies = (): IHomeScreenDependencies => {
  const taskService = useTask();
  const authService = useAuth();

  return {
    taskService,
    authService,
  };
};
