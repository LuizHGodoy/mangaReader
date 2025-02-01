import { mangadexApi } from "@/services/mangadex";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { atomWithStorage, createJSONStorage } from "jotai/utils";

export interface AuthData {
	accessToken: string;
	refreshToken: string;
	user: {
		id: string;
		username: string;
	};
}

const storage = createJSONStorage<AuthData | null>(() => AsyncStorage);

export const authAtom = atomWithStorage<AuthData | null>("auth", null, storage);

export const saveAuthData = async (data: AuthData) => {
	await AsyncStorage.setItem("auth", JSON.stringify(data));
};

export const clearAuthData = async () => {
	await AsyncStorage.removeItem("auth");
};

export const loadAuthData = async (): Promise<AuthData | null> => {
	const data = await AsyncStorage.getItem("auth");
	return data ? JSON.parse(data) : null;
};

export const refreshAuthToken = async (refreshToken: string) => {
	try {
		const response = await mangadexApi.refreshToken(refreshToken);
		return {
			accessToken: response.access_token,
			refreshToken: response.refresh_token,
		};
	} catch (error) {
		console.error("Erro ao atualizar token:", error);
		return null;
	}
};
