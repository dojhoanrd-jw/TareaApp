import React from 'react';
import {
  FilterContainer,
  FilterButton,
  FilterText,
  FilterBadge,
  FilterBadgeText,
  FilterButtonContent,
} from './styles';

export type FilterType = 'all' | 'completed' | 'in-progress';

interface FilterTasksProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  allCount: number;
  completedCount: number;
  inProgressCount: number;
}

const FilterTasks: React.FC<FilterTasksProps> = ({
  activeFilter,
  onFilterChange,
  allCount,
  completedCount,
  inProgressCount,
}) => {
  return (
    <FilterContainer>
      <FilterButton
        isActive={activeFilter === 'all'}
        onPress={() => onFilterChange('all')}
      >
        <FilterButtonContent>
          <FilterText isActive={activeFilter === 'all'}>
            Todas
          </FilterText>
          {activeFilter === 'all' && (
            <FilterBadge>
              <FilterBadgeText>{allCount}</FilterBadgeText>
            </FilterBadge>
          )}
        </FilterButtonContent>
      </FilterButton>

      <FilterButton
        isActive={activeFilter === 'in-progress'}
        onPress={() => onFilterChange('in-progress')}
      >
        <FilterButtonContent>
          <FilterText isActive={activeFilter === 'in-progress'}>
            En progreso
          </FilterText>
          {activeFilter === 'in-progress' && (
            <FilterBadge>
              <FilterBadgeText>{inProgressCount}</FilterBadgeText>
            </FilterBadge>
          )}
        </FilterButtonContent>
      </FilterButton>

      <FilterButton
        isActive={activeFilter === 'completed'}
        onPress={() => onFilterChange('completed')}
      >
        <FilterButtonContent>
          <FilterText isActive={activeFilter === 'completed'}>
            Completadas
          </FilterText>
          {activeFilter === 'completed' && (
            <FilterBadge>
              <FilterBadgeText>{completedCount}</FilterBadgeText>
            </FilterBadge>
          )}
        </FilterButtonContent>
      </FilterButton>
    </FilterContainer>
  );
};

export default FilterTasks;
