import styled from 'styled-components/native';

export const FilterContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: ${({ theme }) => theme.background};
  gap: 6px;
`;

export const FilterButton = styled.TouchableOpacity<{ isActive: boolean }>`
  flex: 1;
  padding: 8px 12px;
  border-radius: 16px;
  background-color: ${({ theme, isActive }) => 
    isActive ? theme.primary : theme.inputBackground};
  border: 1px solid ${({ theme, isActive }) => 
    isActive ? theme.primary : theme.border};
  align-items: center;
  justify-content: center;
`;

export const FilterText = styled.Text<{ isActive: boolean }>`
  color: ${({ theme, isActive }) => 
    isActive ? '#FFFFFF' : theme.text};
  font-size: 12px;
  font-weight: 600;
`;

export const FilterBadge = styled.View`
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  padding: 1px 4px;
  margin-left: 3px;
  min-width: 14px;
  align-items: center;
`;

export const FilterBadgeText = styled.Text`
  color: #FFFFFF;
  font-size: 9px;
  font-weight: bold;
`;

export const FilterButtonContent = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
