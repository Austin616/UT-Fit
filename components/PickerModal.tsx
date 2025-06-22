import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { X, Check } from 'lucide-react-native';

interface PickerModalProps<T extends string> {
  visible: boolean;
  onClose: () => void;
  title: string;
  options: readonly T[];
  selectedOptions: T[];
  onToggle: (option: T) => void;
}

export function PickerModal<T extends string>({
  visible,
  onClose,
  title,
  options,
  selectedOptions,
  onToggle
}: PickerModalProps<T>) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-3xl">
          <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#000" />
            </TouchableOpacity>
            <Text className="text-lg font-semibold">{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text className="text-ut_orange font-semibold">Done</Text>
            </TouchableOpacity>
          </View>
          <ScrollView className="max-h-96 p-4">
            {options.map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => onToggle(option)}
                className="flex-row items-center justify-between py-3 px-4"
              >
                <Text className="text-lg">{option}</Text>
                {selectedOptions.includes(option) && (
                  <Check size={24} color="#bf5700" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
} 