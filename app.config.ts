export default {
    name: "Grow-Buddy",
    slug: "grow-buddy",
    version: process.env.GROW_BUDDY_VERSION || 'dev',
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
        supportsTablet: true,
        bundleIdentifier: "app.growbuddy",
        buildNumber: "0.0.4"
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
                    organization: "grow-buddy",
                    project: "grow-buddy",
                    authToken: "e1f0ddbee5e34dcfa58eeab329b1b903f48dbcfff77340b19b69353752f48a58",
                    setCommits: true
                }
            }
        ]
    },
    "plugins": [
        "sentry-expo"
    ]
}
