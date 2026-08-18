import { useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

interface Props {
  label: string;
  mode: 'date' | 'time';
  value: Date;
  onChange: (date: Date) => void;
  displayText: string;
}

export function DateTimePickerField({ label, mode, value, onChange, displayText }: Props) {
  const [show, setShow] = useState(false);

  return (
    <View className="mb-4">
      <Text className="text-sm font-semibold text-gray-700 mb-2">{label}</Text>
      <Pressable
        onPress={() => setShow(true)}
        className="flex-row items-center justify-between border border-gray-300 rounded-2xl px-4 py-3.5"
      >
        <Text className="text-base text-gray-800">{displayText}</Text>
        <Feather name={mode === 'date' ? 'calendar' : 'clock'} size={18} color="#6b7280" />
      </Pressable>
      {show && (
        <DateTimePicker
          value={value}
          mode={mode}
          is24Hour
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(_event, selected) => {
            setShow(Platform.OS === 'ios');
            if (selected) onChange(selected);
          }}
        />
      )}
    </View>
  );
}
