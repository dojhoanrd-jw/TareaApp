import { useRef, useEffect } from 'react';
import { Animated } from 'react-native';

interface UseModalAnimationProps {
  visible: boolean;
  animationType?: 'slide' | 'fade' | 'scale';
  duration?: number;
  onAnimationComplete?: () => void;
}

export const useModalAnimation = ({
  visible,
  animationType = 'slide',
  duration = 300,
  onAnimationComplete,
}: UseModalAnimationProps) => {
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Animate in
      const animations = [
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration,
          useNativeDriver: true,
        }),
      ];

      switch (animationType) {
        case 'slide':
          animations.push(
            Animated.timing(slideAnim, {
              toValue: 1,
              duration,
              useNativeDriver: true,
            })
          );
          break;
        case 'scale':
          animations.push(
            Animated.spring(scaleAnim, {
              toValue: 1,
              tension: 100,
              friction: 8,
              useNativeDriver: true,
            })
          );
          break;
        case 'fade':
          animations.push(
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration,
              useNativeDriver: true,
            })
          );
          break;
      }

      Animated.parallel(animations).start(() => {
        onAnimationComplete?.();
      });
    } else {
      // Reset animations
      backdropOpacity.setValue(0);
      slideAnim.setValue(0);
      scaleAnim.setValue(0.8);
      fadeAnim.setValue(0);
    }
  }, [visible, animationType, duration]);

  const animateOut = (onComplete: () => void) => {
    const animations = [
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: duration * 0.8,
        useNativeDriver: true,
      }),
    ];

    switch (animationType) {
      case 'slide':
        animations.push(
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: duration * 0.8,
            useNativeDriver: true,
          })
        );
        break;
      case 'scale':
        animations.push(
          Animated.timing(scaleAnim, {
            toValue: 0.8,
            duration: duration * 0.8,
            useNativeDriver: true,
          })
        );
        break;
      case 'fade':
        animations.push(
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: duration * 0.8,
            useNativeDriver: true,
          })
        );
        break;
    }

    Animated.parallel(animations).start(() => {
      onComplete();
    });
  };

  const getBackdropStyle = () => ({
    opacity: backdropOpacity,
  });

  const getContentStyle = () => {
    switch (animationType) {
      case 'slide':
        return {
          transform: [
            {
              translateY: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [500, 0],
              }),
            },
          ],
        };
      case 'scale':
        return {
          transform: [{ scale: scaleAnim }],
          opacity: fadeAnim,
        };
      case 'fade':
        return {
          opacity: fadeAnim,
        };
      default:
        return {};
    }
  };

  return {
    getBackdropStyle,
    getContentStyle,
    animateOut,
  };
};
