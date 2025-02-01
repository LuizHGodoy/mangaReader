import AsyncStorage from "@react-native-async-storage/async-storage";
import { atom } from "jotai";
import { atomWithStorage, createJSONStorage } from "jotai/utils";

type Theme = "light" | "dark";

const storage = createJSONStorage<Theme>(() => AsyncStorage);

export const themeAtom = atomWithStorage<Theme>("theme", "dark", storage);

export const isDarkAtom = atom((get) => get(themeAtom) === "dark");
