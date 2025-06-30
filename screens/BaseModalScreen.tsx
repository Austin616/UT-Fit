import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';

interface BaseModalScreenProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  enableSwipeToClose?: boolean;
  maxHeight?: string;
}

export default function BaseModalScreen({
  visible,
  onClose,
  title,
  children,
  showCloseButton = true,
  enableSwipeToClose = true,
  maxHeight = "90%"
}: BaseModalScreenProps) {
  const translateY = useSharedValue(1000);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 200 });
      translateY.value = withSpring(0, {
        damping: 15,
        stiffness: 150,
      });
    } else {
      opacity.value = withTiming(0, { duration: 150 });
      translateY.value = withTiming(1000, { duration: 200 });
    }
  }, [visible]);

  const animatedBackdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const animatedModalStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const handleSwipeGesture = (event: any) => {
    if (enableSwipeToClose && event.nativeEvent.translationY > 100) {
      runOnJS(onClose)();
    }
  };

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Animated.View 
          style={[animatedBackdropStyle]} 
          className="flex-1 bg-black/50 justify-end"
        >
          <TouchableOpacity 
            className="flex-1" 
            activeOpacity={1} 
            onPress={onClose}
          />
          
          <PanGestureHandler onGestureEvent={handleSwipeGesture}>
            <Animated.View
              style={[animatedModalStyle, { maxHeight }]}
              className="bg-white rounded-t-3xl"
            >
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
              >
                <SafeAreaView className="flex-1" edges={['left', 'right']}>
                  {/* Handle Bar */}
                  {enableSwipeToClose && (
                    <View className="w-12 h-1 bg-gray-300 rounded-full self-center mt-2 mb-4" />
                  )}
                  
                  {/* Header */}
                  <View className="flex-row items-center justify-between px-6 pb-4">
                    <Text className="text-xl font-bold text-gray-900">{title}</Text>
                    {showCloseButton && (
                      <TouchableOpacity onPress={onClose} className="p-2 -mr-2">
                        <X size={24} color="#6B7280" />
                      </TouchableOpacity>
                    )}
                  </View>
                  
                  {/* Content */}
                  <ScrollView 
                    className="flex-1 px-6"
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                  >
                    {children}
                  </ScrollView>
                </SafeAreaView>
              </KeyboardAvoidingView>
            </Animated.View>
          </PanGestureHandler>
        </Animated.View>
      </GestureHandlerRootView>
    </Modal>
  );
} 