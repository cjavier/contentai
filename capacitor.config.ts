import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.improvitz.contentai',
  appName: 'contentai',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  }
};

export default config;
