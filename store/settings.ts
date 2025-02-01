import AsyncStorage from "@react-native-async-storage/async-storage";
import { atom } from "jotai";
import { atomWithStorage, createJSONStorage } from "jotai/utils";

export type Language = "en" | "pt-br" | "ja";

const storage = createJSONStorage<Language>(() => AsyncStorage);

export const languageAtom = atomWithStorage<Language>(
	"language",
	"en",
	storage,
);

export const languageNameAtom = atom((get) => {
	const language = get(languageAtom);
	const names: Record<Language, string> = {
		en: "English",
		"pt-br": "Português",
		ja: "日本語",
	};
	return names[language];
});

export type ChapterOrder = "asc" | "desc";

export const chapterOrderAtom = atomWithStorage<ChapterOrder>(
	"chapterOrder",
	"desc",
	storage,
);
