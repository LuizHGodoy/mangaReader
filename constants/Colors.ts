const tintColorLight = "#2f95dc";
const tintColorDark = "#fff";

export default {
	light: {
		text: "#000",
		background: "#fff",
		tint: tintColorLight,
		tabIconDefault: "#ccc",
		tabIconSelected: tintColorLight,
		card: "#fff",
		border: "#e1e1e1",
	},
	dark: {
		text: "#fff",
		background: "#000",
		tint: tintColorDark,
		tabIconDefault: "#ccc",
		tabIconSelected: tintColorDark,
		card: "#1c1c1c",
		border: "#2c2c2c",
	},
} as const;
