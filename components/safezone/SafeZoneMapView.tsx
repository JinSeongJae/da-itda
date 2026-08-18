import { Feather } from '@expo/vector-icons';
import { View } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { GYEONGSAN_CENTER, SAFE_ZONE_TYPE_META, scoreColor } from '../../constants/theme';
import type { SafeZone } from '../../types';

export function SafeZoneMapView({
  zones,
  onSelectZone,
}: {
  zones: SafeZone[];
  onSelectZone: (zone: SafeZone) => void;
}) {
  return (
    <MapView
      provider={PROVIDER_DEFAULT}
      style={{ flex: 1 }}
      initialRegion={{
        latitude: GYEONGSAN_CENTER.lat,
        longitude: GYEONGSAN_CENTER.lng,
        latitudeDelta: 0.06,
        longitudeDelta: 0.06,
      }}
    >
      {zones.map((zone) => {
        const meta = SAFE_ZONE_TYPE_META[zone.type];
        const color = scoreColor(zone.safetyScore);
        return (
          <Marker
            key={zone.id}
            coordinate={{ latitude: zone.lat, longitude: zone.lng }}
            onPress={() => onSelectZone(zone)}
          >
            <View
              style={{ backgroundColor: color }}
              className="w-9 h-9 rounded-full items-center justify-center border-2 border-white shadow"
            >
              <Feather name={(meta?.iconName as any) ?? 'map-pin'} size={16} color="#fff" />
            </View>
          </Marker>
        );
      })}
    </MapView>
  );
}
