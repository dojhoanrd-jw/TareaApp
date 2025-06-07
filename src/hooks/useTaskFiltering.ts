import { useMemo } from 'react';
import { TaskData } from '../context/TaskContext';

export type FilterType = 'all' | 'completed' | 'in-progress';
export type DayFilter = 'all' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

interface UseTaskFilteringProps {
  tasks: TaskData[];
  activeFilter: FilterType;
  selectedDay: DayFilter;
}

export const useTaskFiltering = ({ tasks, activeFilter, selectedDay }: UseTaskFilteringProps) => {
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const statusMatch = 
        activeFilter === 'all' || 
        (activeFilter === 'completed' && task.status === 'completed') ||
        (activeFilter === 'in-progress' && task.status === 'in-progress');

      const dayMatch = 
        selectedDay === 'all' || 
        task.days.includes(selectedDay);

      return statusMatch && dayMatch;
    });
  }, [tasks, activeFilter, selectedDay]);

  const taskCounts = useMemo(() => ({
    all: tasks.length,
    completed: tasks.filter(task => task.status === 'completed').length,
    inProgress: tasks.filter(task => task.status === 'in-progress').length,
  }), [tasks]);

  return {
    filteredTasks,
    taskCounts,
  };
};
