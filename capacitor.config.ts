import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.estccomputer.ekeeper',
  appName: 'ekeeper',
  webDir: 'dist',
  server: {
    cleartext: true, // Allow HTTP
  },
  plugins: {
    CapacitorHttp: {
      enabled: true
    },
    StatusBar: {
      overlaysWebView: false,
      style: "DARK",
      backgroundColor: "#ffffffff"
    }
  }
};

export default config;
