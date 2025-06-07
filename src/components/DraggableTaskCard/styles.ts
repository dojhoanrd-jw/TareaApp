import styled from 'styled-components/native';

export const DragHandle = styled.View`
  width: 32px;
  height: 60px;
  justify-content: center;
  align-items: center;
  padding: 8px 4px;
  margin-right: 8px;
  background-color: ${({ theme }) => theme.inputBackground};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
`;

export const DragIndicator = styled.View`
  width: 14px;
  height: 2px;
  background-color: ${({ theme }) => theme.textSecondary};
  border-radius: 1px;
  margin: 1px 0;
`;

export const DraggableContainer = styled.View`
  flex-direction: row;
  align-items: stretch;
  margin-bottom: 12px;
  padding-horizontal: 16px;
  width: 100%;
`;

export const TaskCardContainer = styled.View`
  flex: 1;
  min-height: 100px;
`;
