import Constants from 'expo-constants';
import { Platform } from 'react-native';

type ConstantsWithLegacyManifest = typeof Constants & {
  manifest?: {
    debuggerHost?: string;
  };
};

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '');
}

function getConfiguredApiUrl(): string | null {
  const envUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (envUrl) {
    return trimTrailingSlash(envUrl);
  }

  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    return `http://${window.location.hostname}:8000`;
  }

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8000';
  }

  const debuggerHost =
    Constants.expoConfig?.hostUri ??
    Constants.manifest2?.extra?.expoGo?.debuggerHost ??
    (Constants as ConstantsWithLegacyManifest).manifest?.debuggerHost ??
    null;

  if (debuggerHost) {
    const host = debuggerHost.split(':')[0];
    return `http://${host}:8000`;
  }

  return 'http://127.0.0.1:8000';
}

export const API_BASE_URL = getConfiguredApiUrl();
