module.exports = {
	expo: {
		name: "mangaReader",
		slug: "mangaReader",
		version: "1.0.0",
		orientation: "portrait",
		scheme: "mangareader",
		icon: "./assets/images/icon.png",
		userInterfaceStyle: "automatic",
		splash: {
			image: "./assets/images/splash.png",
			resizeMode: "contain",
			backgroundColor: "#ffffff",
		},
		extra: {
			API_URL: process.env.EXPO_PUBLIC_API_URL,
			AUTH_URL: process.env.EXPO_PUBLIC_AUTH_URL,
			CLIENT_ID: process.env.EXPO_PUBLIC_CLIENT_ID,
			CLIENT_SECRET: process.env.EXPO_PUBLIC_CLIENT_SECRET,
		},
		plugins: ["expo-router"],
		experiments: {
			typedRoutes: true,
		},
	},
};
