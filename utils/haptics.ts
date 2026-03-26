import Constants from 'expo-constants';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export async function triggerSelectionHaptic(): Promise<void> {
  // iOS simulator in debug builds often spams CoreHaptics errors even though the app keeps working.
  if (Platform.OS === 'ios' && Constants.debugMode) {
    return;
  }

  try {
    await Haptics.selectionAsync();
  } catch {
    // Ignore haptics failures on unsupported devices/environments.
  }
}
