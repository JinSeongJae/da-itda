import { forwardRef } from 'react';
import GorhomBottomSheet, {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetView,
} from '@gorhom/bottom-sheet';

interface Props {
  snapPoints?: (string | number)[];
  children: React.ReactNode;
  onDismiss?: () => void;
}

export const AppBottomSheet = forwardRef<GorhomBottomSheet, Props>(
  ({ snapPoints = ['50%', '85%'], children, onDismiss }, ref) => {
    return (
      <GorhomBottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        onClose={onDismiss}
        backdropComponent={(props: BottomSheetBackdropProps) => (
          <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
        )}
      >
        <BottomSheetView style={{ flex: 1, padding: 16 }}>{children}</BottomSheetView>
      </GorhomBottomSheet>
    );
  }
);
AppBottomSheet.displayName = 'AppBottomSheet';
