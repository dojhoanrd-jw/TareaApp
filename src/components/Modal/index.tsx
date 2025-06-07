import React, { useCallback } from 'react';
import { Modal as RNModal, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'styled-components/native';
import { useModalAnimation } from '../../hooks/useModalAnimation';
import {
  ModalOverlay,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ModalBody,
  ModalFooter,
} from './styles';

interface ModalProps {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  animationType?: 'slide' | 'fade' | 'scale';
  keyboardAvoidingView?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  visible,
  title,
  onClose,
  children,
  footer,
  animationType = 'slide',
  keyboardAvoidingView = true,
}) => {
  const theme = useTheme();

  const { getBackdropStyle, getContentStyle, animateOut } = useModalAnimation({
    visible,
    animationType,
    duration: 300,
  });

  const handleClose = useCallback(() => {
    animateOut(() => {
      onClose();
    });
  }, [onClose, animateOut]);

  const ModalContent = (
    <Animated.View style={[{ flex: 1 }, getBackdropStyle()]}>
      <ModalOverlay>
        <Animated.View 
          style={[
            {
              width: '100%',
              maxHeight: '90%',
              backgroundColor: theme.background,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.25,
              shadowRadius: 8,
              elevation: 10,
              flex: 1,
              marginTop: 100,
            },
            getContentStyle(),
          ]}
        >
          <ModalHeader>
            <ModalTitle>{title}</ModalTitle>
            <CloseButton onPress={handleClose}>
              <Ionicons name="close" size={24} color={theme.text} />
            </CloseButton>
          </ModalHeader>

          <ModalBody style={{ flex: 1 }}>{children}</ModalBody>

          {footer && <ModalFooter>{footer}</ModalFooter>}
        </Animated.View>
      </ModalOverlay>
    </Animated.View>
  );

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
      presentationStyle="overFullScreen"
    >
      {keyboardAvoidingView ? (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          {ModalContent}
        </KeyboardAvoidingView>
      ) : (
        ModalContent
      )}
    </RNModal>
  );
};

export default Modal;
