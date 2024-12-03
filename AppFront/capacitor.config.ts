import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.dentalcare_web',
  appName: 'dentalcare mobile',
  webDir: 'dist',
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
      pushNotificationsBackgroundMode: true
    },
  },
};

export default config;
