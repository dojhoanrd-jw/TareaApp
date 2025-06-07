import { useRef } from 'react';
import { Animated, PanResponder } from 'react-native';

interface UseSwipeGestureProps {
  actionWidth: number;
  swipeThreshold: number;
  onSwipeOpen?: () => void;
  onSwipeClose?: () => void;
}

export const useSwipeGesture = ({
  actionWidth,
  swipeThreshold,
  onSwipeOpen,
  onSwipeClose,
}: UseSwipeGestureProps) => {
  const pan = useRef(new Animated.Value(0)).current;
  const lastOffset = useRef(0);
  const currentValue = useRef(0);

  pan.addListener(({ value }) => {
    currentValue.current = value;
  });

  const resetPosition = () => {
    lastOffset.current = 0;
    Animated.spring(pan, {
      toValue: 0,
      useNativeDriver: false,
      tension: 120,
      friction: 8,
    }).start(() => {
      onSwipeClose?.();
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        const { dx, dy } = gestureState;
        return Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 3;
      },
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: () => {
        pan.setOffset(lastOffset.current);
        pan.setValue(0);
      },
      onPanResponderMove: (evt, gestureState) => {
        const { dx } = gestureState;
        const offset = lastOffset.current;
        let newValue = offset + dx;

        if (newValue > 0) {
          newValue = newValue * 0.2;
        } else if (newValue < -actionWidth) {
          const overflow = Math.abs(newValue + actionWidth);
          newValue = -actionWidth - overflow * 0.2;
        }

        pan.setValue(newValue - offset);
      },
      onPanResponderRelease: (evt, gestureState) => {
        pan.flattenOffset();
        const finalValue = currentValue.current;
        lastOffset.current = finalValue;

        const { dx, vx } = gestureState;
        const velocity = Math.abs(vx);

        const shouldOpen =
          dx < -swipeThreshold ||
          (velocity > 0.5 && dx < 0) ||
          finalValue < -actionWidth / 2;

        if (shouldOpen) {
          lastOffset.current = -actionWidth;
          Animated.spring(pan, {
            toValue: -actionWidth,
            useNativeDriver: false,
            tension: 120,
            friction: 8,
            velocity: vx,
          }).start(() => {
            onSwipeOpen?.();
          });
        } else {
          resetPosition();
        }
      },
    })
  ).current;

  return {
    pan,
    panResponder,
    resetPosition,
  };
};
