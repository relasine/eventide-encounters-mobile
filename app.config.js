const IS_DEV = process.env.APP_VARIANT === 'development' || process.env.NODE_ENV === 'development';
const IS_STAGING = process.env.APP_VARIANT === 'staging';

const getAppName = () => {
  if (IS_STAGING) return 'Eventide Encounters';
  if (IS_DEV) return 'Eventide Encounters (Dev)';
  return 'Eventide Encounters';
};

const getBundleIdentifier = () => {
  if (IS_STAGING) return 'com.eventideencounters.staging';
  if (IS_DEV) return 'com.eventideencounters.dev';
  return 'com.eventideencounters';
};

const getScheme = () => {
  if (IS_STAGING) return 'eventideencounters-staging';
  if (IS_DEV) return 'eventideencounters-dev';
  return 'eventideencounters';
};

export default {
  expo: {
    name: getAppName(),
    slug: 'eventide-encounters',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: getScheme(),
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: getBundleIdentifier(),
    },
    android: {
      adaptiveIcon: {
        backgroundColor: '#E6F4FE',
        foregroundImage: './assets/images/android-icon-foreground.png',
        backgroundImage: './assets/images/android-icon-background.png',
        monochromeImage: './assets/images/android-icon-monochrome.png',
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: IS_STAGING 
        ? 'com.eventideencounters.staging' 
        : IS_DEV 
        ? 'com.eventideencounters.dev' 
        : 'com.eventideencounters',
    },
    web: {
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: './assets/images/splash-icon.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#ffffff',
          dark: {
            backgroundColor: '#000000',
          },
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      appVariant: process.env.APP_VARIANT || 'production',
    },
  },
};

