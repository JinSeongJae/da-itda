import { Feather } from '@expo/vector-icons';
import { View } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { CULTURAL_PIN_CATEGORY_META, GYEONGSAN_CENTER } from '../../constants/theme';
import type { CulturalPin } from '../../types';

/** Native-only MapView rendering — mirrors components/safezone/SafeZoneMapView.tsx's pattern. */
export function CulturalPinMapView({
  pins,
  onSelectPin,
}: {
  pins: CulturalPin[];
  onSelectPin: (pin: CulturalPin) => void;
}) {
  return (
    <MapView
      provider={PROVIDER_DEFAULT}
      style={{ flex: 1 }}
      initialRegion={{
        latitude: GYEONGSAN_CENTER.lat,
        longitude: GYEONGSAN_CENTER.lng,
        latitudeDelta: 0.08,
        longitudeDelta: 0.08,
      }}
    >
      {pins.map((pin) => {
        const meta = CULTURAL_PIN_CATEGORY_META[pin.category];
        return (
          <Marker
            key={pin.id}
            coordinate={{ latitude: pin.lat, longitude: pin.lng }}
            onPress={() => onSelectPin(pin)}
          >
            <View className="w-9 h-9 rounded-full bg-primary-500 items-center justify-center border-2 border-white shadow">
              <Feather name={(meta?.iconName as any) ?? 'map-pin'} size={16} color="#fff" />
            </View>
          </Marker>
        );
      })}
    </MapView>
  );
}
