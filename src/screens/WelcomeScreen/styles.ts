import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.background};
`;

export const BackgroundGradient = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.primary};
  opacity: 0.05;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

export const ContentContainer = styled.View`
  flex: 1;
  padding: 24px;
  justify-content: space-between;
`;

export const TopSection = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding-top: 60px;
`;

export const LogoContainer = styled.View`
  width: 120px;
  height: 120px;
  border-radius: 60px;
  background-color: ${({ theme }) => theme.primary};
  justify-content: center;
  align-items: center;
  margin-bottom: 40px;
  shadow-color: ${({ theme }) => theme.primary};
  shadow-offset: 0px 8px;
  shadow-opacity: 0.3;
  shadow-radius: 16px;
  elevation: 12;
`;

export const LogoText = styled.Text`
  color: #fff;
  font-size: 32px;
  font-weight: bold;
  letter-spacing: 1px;
`;

export const Title = styled.Text`
  color: ${({ theme }) => theme.text};
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 16px;
  text-align: center;
  letter-spacing: 0.5px;
`;

export const Subtitle = styled.Text`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 18px;
  text-align: center;
  line-height: 26px;
  margin-bottom: 20px;
  font-weight: 400;
`;

export const FeaturesList = styled.View`
  margin-top: 30px;
  padding: 0 20px;
`;

export const FeatureItem = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 16px;
`;

export const FeatureIcon = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.primary};
  opacity: 0.1;
  justify-content: center;
  align-items: center;
  margin-right: 16px;
`;

export const FeatureText = styled.Text`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 16px;
  flex: 1;
  font-weight: 500;
`;

export const BottomSection = styled.View`
  padding: 20px 0 40px 0;
`;

export const ButtonContainer = styled.View`
  gap: 16px;
`;

export const WaveContainer = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100px;
  overflow: hidden;
`;

export const Wave = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100px;
  background-color: ${({ theme }) => theme.primary};
  opacity: 0.05;
  border-top-left-radius: 50px;
  border-top-right-radius: 50px;
`;
