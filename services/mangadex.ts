import { ENV } from "@/config/env";
import axios from "axios";

const api = axios.create({
	baseURL: ENV.API_URL,
});

const auth = axios.create({
	baseURL: "https://auth.mangadex.org/realms/mangadex/protocol/openid-connect",
	headers: {
		"Content-Type": "application/x-www-form-urlencoded",
	},
});

export interface MangaList {
	id: string;
	type: string;
	attributes: {
		name: string;
		visibility: string;
	};
	relationships: Array<{
		id: string;
		type: string;
		attributes?: any;
	}>;
}

export interface MangaSearchResponse {
	result: string;
	response: string;
	data: Array<{
		id: string;
		type: string;
		attributes: {
			title: Record<string, string>;
			altTitles: Array<Record<string, string>>;
			description: Record<string, string>;
			status: string;
			year: number | null;
			contentRating: string;
			tags: Array<{
				id: string;
				type: string;
				attributes: {
					name: Record<string, string>;
					group: string;
				};
			}>;
		};
		relationships: Array<{
			id: string;
			type: string;
			attributes?: {
				fileName?: string;
			};
		}>;
	}>;
	limit: number;
	offset: number;
	total: number;
}

export interface Chapter {
	id: string;
	type: string;
	attributes: {
		volume: string | null;
		chapter: string | null;
		title: string | null;
		translatedLanguage: string;
		publishAt: string;
	};
	relationships: Array<{
		id: string;
		type: string;
		attributes?: {
			name?: string;
			fileName?: string;
		};
	}>;
}

export interface ChapterResponse {
	result: string;
	response: string;
	data: Chapter[];
	limit: number;
	offset: number;
	total: number;
}

export const mangadexApi = {
	login: async (username: string, password: string) => {
		const params = {
			grant_type: "password",
			username,
			password,
			client_id:
				"personal-client-ee2a9dac-ff6c-4eb5-9063-f64a70d8e8e1-cecb5825",
			client_secret: "05aOeGZ9vRIEOxJCRu4m4ZD2YVMQtcC2",
		};

		// Converte os parâmetros para string no formato x-www-form-urlencoded
		const formBody = Object.entries(params)
			.map(
				([key, value]) =>
					`${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
			)
			.join("&");

		const response = await auth.post("/token", formBody);
		return response.data;
	},

	refreshToken: async (refreshToken: string) => {
		const params = {
			grant_type: "refresh_token",
			refresh_token: refreshToken,
			client_id:
				"personal-client-ee2a9dac-ff6c-4eb5-9063-f64a70d8e8e1-cecb5825",
			client_secret: "05aOeGZ9vRIEOxJCRu4m4ZD2YVMQtcC2",
		};

		const formBody = Object.entries(params)
			.map(
				([key, value]) =>
					`${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
			)
			.join("&");

		const response = await auth.post("/token", formBody);
		return response.data;
	},

	getCurrentUser: async (token: string) => {
		const response = await api.get("/user/me", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	},

	getLatestUpdates: async () => {
		const response = await api.get("/manga", {
			params: {
				limit: 20,
				offset: 0,
				order: {
					updatedAt: "desc",
				},
				includes: ["cover_art"],
			},
		});
		return response.data;
	},

	getList: async (listId: string) => {
		const response = await api.get(`/list/${listId}?includes[]=user`);
		return response.data;
	},

	getMangaDetails: async (mangaIds: string[]) => {
		const response = await api.get("/manga", {
			params: {
				ids: mangaIds,
				includes: ["cover_art"],
			},
		});
		return response.data;
	},

	getCoverUrl: (mangaId: string, filename: string) => {
		return `https://uploads.mangadex.org/covers/${mangaId}/${filename}`;
	},

	getSelfPublishedList: async () => {
		return mangadexApi.getList("f66ebc10-ef89-46d1-be96-bb704559e04a");
	},

	getSeasonalList: async () => {
		return mangadexApi.getList("a5ba5473-07b2-4d0a-aefd-90d9d4a04521");
	},

	searchManga: async (query: string) => {
		const response = await api.get<MangaSearchResponse>("/manga", {
			params: {
				title: query,
				includes: ["cover_art"],
				limit: 20,
			},
		});
		return response.data;
	},

	getChapters: async (mangaId: string, language?: string) => {
		const params: Record<string, any> = {
			manga: mangaId,
			limit: 100,
			order: {
				chapter: "desc",
			},
			includes: ["scanlation_group"],
		};

		if (language) {
			params.translatedLanguage = [language];
		}

		const response = await api.get<ChapterResponse>("/chapter", { params });
		return response.data;
	},

	getChapterPages: async (chapterId: string) => {
		const response = await api.get(`/at-home/server/${chapterId}`);
		const { baseUrl, chapter } = response.data;

		// Usar as imagens em qualidade reduzida para economizar dados
		return chapter.dataSaver.map((page: string, index: number) => ({
			id: `${chapterId}-${index}`,
			url: `${baseUrl}/data-saver/${chapter.hash}/${page}`,
			chapter,
		}));
	},

	getNextChapter: async (currentChapterId: string) => {
		try {
			const currentChapter = await api.get(`/chapter/${currentChapterId}`);
			const mangaId = currentChapter.data.data.relationships.find(
				(rel: any) => rel.type === "manga",
			).id;

			const response = await api.get("/chapter", {
				params: {
					manga: mangaId,
					translatedLanguage: [
						currentChapter.data.data.attributes.translatedLanguage,
					],
					order: {
						chapter: "asc",
					},
					offset: 0,
					limit: 1,
					chapter: [
						`${Number(currentChapter.data.data.attributes.chapter) + 1}`,
					],
				},
			});

			return response.data.data[0] || null;
		} catch (error) {
			console.error("Erro ao buscar próximo capítulo:", error);
			return null;
		}
	},
};

export default mangadexApi;
