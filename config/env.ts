import Constants from "expo-constants";

export const ENV = {
	API_URL: Constants.expoConfig?.extra?.apiUrl || "https://api.mangadex.org",
	AUTH_URL: Constants.expoConfig?.extra?.AUTH_URL as string,
	CLIENT_ID: Constants.expoConfig?.extra?.CLIENT_ID as string,
	CLIENT_SECRET: Constants.expoConfig?.extra?.CLIENT_SECRET as string,
};

const requiredEnvVars = [
	"API_URL",
	"AUTH_URL",
	"CLIENT_ID",
	"CLIENT_SECRET",
] as const;
for (const key of requiredEnvVars) {
	if (!ENV[key]) {
		throw new Error(`Missing required environment variable: ${key}`);
	}
}
