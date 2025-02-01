type Theme = "light" | "dark";

interface ThemeContextType {
	theme: Theme;
	toggleTheme?: () => void;
}
