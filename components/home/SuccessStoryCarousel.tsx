import { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Text, View } from 'react-native';
import type { SuccessStory } from '../../mocks/successStories';

const CARD_WIDTH = Math.min(Dimensions.get('window').width - 48, 400);

export function SuccessStoryCarousel({ stories }: { stories: SuccessStory[] }) {
  const listRef = useRef<FlatList<SuccessStory>>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (stories.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => {
        const next = (prev + 1) % stories.length;
        listRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 3000);
    return () => clearInterval(timer);
  }, [stories.length]);

  if (stories.length === 0) return null;

  return (
    <View className="mt-10">
      <Text className="text-[13px] font-semibold text-gray-400 mb-3">실시간 매칭 성공 소식</Text>
      <FlatList
        ref={listRef}
        data={stories}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH}
        decelerationRate="fast"
        getItemLayout={(_, i) => ({ length: CARD_WIDTH, offset: CARD_WIDTH * i, index: i })}
        onMomentumScrollEnd={(e) => setIndex(Math.round(e.nativeEvent.contentOffset.x / CARD_WIDTH))}
        renderItem={({ item }) => (
          <View style={{ width: CARD_WIDTH }} className="bg-primary-50 rounded-3xl p-5">
            <Text className="text-primary-800 text-[15px] font-semibold leading-5">{item.text}</Text>
          </View>
        )}
      />
      {stories.length > 1 && (
        <View className="flex-row justify-center mt-3">
          {stories.map((s, i) => (
            <View
              key={s.id}
              className={`rounded-full mx-0.5 ${
                i === index ? 'bg-primary-500 w-4 h-1.5' : 'bg-gray-200 w-1.5 h-1.5'
              }`}
            />
          ))}
        </View>
      )}
    </View>
  );
}
