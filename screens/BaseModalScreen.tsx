import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Dimensions,
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

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface BaseModalScreenProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  enableSwipeToClose?: boolean;
  maxHeight?: string | number;
}

export default function BaseModalScreen({
  visible,
  onClose,
  title,
  children,
  showCloseButton = true,
  enableSwipeToClose = true,
  maxHeight = SCREEN_HEIGHT * 0.9
}: BaseModalScreenProps) {
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 150 });
      translateY.value = withSpring(0, {
        damping: 20,
        stiffness: 200,
        mass: 1,
        velocity: 1
      });
    } else {
      opacity.value = withTiming(0, { duration: 150 });
      translateY.value = withSpring(SCREEN_HEIGHT, {
        damping: 20,
        stiffness: 200,
        mass: 1,
        velocity: 1
      });
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

  const modalHeight = typeof maxHeight === 'string' ? 
    SCREEN_HEIGHT * (parseInt(maxHeight) / 100) : 
    maxHeight;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <GestureHandlerRootView style={[StyleSheet.absoluteFill, { zIndex: 1000 }]}>
        <Animated.View 
          style={[animatedBackdropStyle, StyleSheet.absoluteFill]} 
          className="bg-black/50"
        >
          <TouchableOpacity 
            style={StyleSheet.absoluteFill}
            activeOpacity={1} 
            onPress={onClose}
          />
          
          <PanGestureHandler onGestureEvent={handleSwipeGesture}>
            <Animated.View
              style={[
                animatedModalStyle,
                {
                  height: modalHeight,
                  zIndex: 1001,
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  backgroundColor: 'white',
                  borderTopLeftRadius: 24,
                  borderTopRightRadius: 24,
                }
              ]}
            >
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1, zIndex: 1002 }}
              >
                <SafeAreaView style={{ flex: 1 }} edges={['left', 'right']}>
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