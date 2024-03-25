export default {
    name: "Project Plants",
    slug: "project-plants",
    owner: "project-plants",
    version: process.env.PROJECT_PLANTS_VERSION || 'dev',
    orientation: "portrait",
    icon: "./assets/icon.png",
    splash: {
        image: "./assets/splash.png",
        resizeMode: "contain",
        backgroundColor: "#ffffff"
    },
    userInterfaceStyle: "automatic",
    updates: {
        fallbackToCacheTimeout: 0
    },
    assetBundlePatterns: [
        "**/*"
    ],
    ios: {
        supportsTablet: false,
        bundleIdentifier: "app.growbuddy",
        buildNumber: process.env.PROJECT_PLANTS_VERSION || '0.0.0',
        infoPlist: {
            "NSCameraUsageDescription": "Erlaube den Zugriff auf die Kamera um ein Foto deiner Pflanze zu schiessen.",
            "NSPhotoLibraryUsageDescription": "Erlaube den Zugriff auf deine Fotos um ein Foto deiner Pflanze zu wählen."
        }
    },
    android: {
        adaptiveIcon: {
            foregroundImage: "./assets/adaptive-icon.png",
            backgroundColor: "#FFFFFF"
        }
    },
    web: {
        favicon: "./assets/favicon.png"
    },
    hooks: {
        postPublish: [
            {
                file: "sentry-expo/upload-sourcemaps",
                config: {
                    organization: "project-plants",
                    project: "project-plants",
                    authToken: process.env.SENTRY_TOKEN,
                    setCommits: true
                }
            }
        ]
    },
    plugins: [
        "sentry-expo",
        "expo-font"
    ],
    extra: {
        eas: {
            projectId: "15b0de1d-5590-4800-af42-ff51aedc5852"
        }
    }
}
