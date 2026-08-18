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

// @react-native-community/datetimepicker has no web implementation (its cross-platform
// fallback renders null and just console.warns), so on web this renders a native HTML
// date/time input instead. A separate DateTimePickerField.web.tsx platform file was tried
// first but Metro's lazy/hermes web bundling profile doesn't resolve .web.tsx here, so the
// branch is inline behind a runtime Platform.OS check instead.
function WebInput({ mode, value, onChange }: Pick<Props, 'mode' | 'value' | 'onChange'>) {
  const pad = (n: number) => String(n).padStart(2, '0');
  const inputValue =
    mode === 'date'
      ? `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`
      : `${pad(value.getHours())}:${pad(value.getMinutes())}`;

  const handleChange = (e: { target: EventTarget | null }) => {
    const el = e.target as HTMLInputElement;
    const next = new Date(value);
    if (mode === 'date') {
      const picked = el.valueAsDate;
      if (!picked) return;
      next.setFullYear(picked.getUTCFullYear(), picked.getUTCMonth(), picked.getUTCDate());
    } else {
      const ms = el.valueAsNumber;
      if (Number.isNaN(ms)) return;
      next.setHours(Math.floor(ms / 3600000), Math.floor(ms / 60000) % 60, 0, 0);
    }
    onChange(next);
  };

  return (
    <input
      type={mode}
      value={inputValue}
      onChange={handleChange}
      onInput={handleChange}
      style={{
        width: '100%',
        boxSizing: 'border-box',
        border: '1px solid #d1d5db',
        borderRadius: 16,
        padding: '14px 16px',
        fontSize: 16,
        color: '#1f2937',
        fontFamily: 'inherit',
        outline: 'none',
      }}
    />
  );
}

export function DateTimePickerField({ label, mode, value, onChange, displayText }: Props) {
  const [show, setShow] = useState(false);

  return (
    <View className="mb-4">
      <Text className="text-sm font-semibold text-gray-700 mb-2">{label}</Text>

      {Platform.OS === 'web' ? (
        <WebInput mode={mode} value={value} onChange={onChange} />
      ) : (
        <>
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
        </>
      )}
    </View>
  );
}
