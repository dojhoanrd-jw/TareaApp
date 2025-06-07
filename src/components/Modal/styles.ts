import styled from 'styled-components/native';

export const ModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: flex-end;
  align-items: center;
`;

export const ModalHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px 10px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

export const ModalTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${({ theme }) => theme.text};
`;

export const CloseButton = styled.TouchableOpacity`
  padding: 4px;
`;

export const ModalBody = styled.View`
  flex: 1;
  padding: 10px 20px;
  min-height: 200px;
`;

export const ModalFooter = styled.View`
  padding: 10px 20px 20px 20px;
  border-top: 1px solid ${({ theme }) => theme.border};
`;
