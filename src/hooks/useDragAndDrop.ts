import { useRef, useState } from 'react';
import { Animated } from 'react-native';

interface UseDragAndDropProps<T> {
  data: T[];
  onReorder: (newData: T[]) => void;
  keyExtractor: (item: T) => string;
  itemHeight?: number;
}

export const useDragAndDrop = <T>({
  data,
  onReorder,
  keyExtractor,
  itemHeight = 100,
}: UseDragAndDropProps<T>) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const onDragStart = (index: number) => {
    setDraggedIndex(index);
    setIsDragging(true);
  };

  const onDragMove = (gestureY: number) => {
    if (draggedIndex === null) return;
    
    // Calculate new index based on drag position
    const newIndex = Math.round(draggedIndex + gestureY / itemHeight);
    const clampedIndex = Math.max(0, Math.min(data.length - 1, newIndex));
    
    if (clampedIndex !== draggedIndex && Math.abs(gestureY) > itemHeight / 2) {
      // Reorder array
      const newData = [...data];
      const [draggedItem] = newData.splice(draggedIndex, 1);
      newData.splice(clampedIndex, 0, draggedItem);
      
      setDraggedIndex(clampedIndex);
      onReorder(newData);
    }
  };

  const onDragEnd = () => {
    setDraggedIndex(null);
    setIsDragging(false);
  };

  const getItemStyle = (index: number) => {
    if (draggedIndex === index && isDragging) {
      return {
        zIndex: 1000,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        transform: [{ scale: 1.02 }],
      };
    }
    
    return {
      zIndex: 1,
      elevation: 1,
    };
  };

  return {
    isDragging,
    draggedIndex,
    onDragStart,
    onDragMove,
    onDragEnd,
    getItemStyle,
  };
};
