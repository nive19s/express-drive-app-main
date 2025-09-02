import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.aecd524bd87a438aaab6338553ffd98b',
  appName: 'SwiftTrack',
  webDir: 'dist',
  plugins: {
    Camera: {
      permissions: ["camera", "photos"]
    }
  }
};

export default config;