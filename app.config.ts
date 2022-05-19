export default {
    name: "Project Plants",
    slug: "project-plants",
    owner: "project-plants",
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
        supportsTablet: false,
        bundleIdentifier: "app.growbuddy",
        buildNumber: process.env.GROW_BUDDY_VERSION || '0.0.0'
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
    "plugins": [
        "sentry-expo"
    ]
}
