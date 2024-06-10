// app/(tabs)/index.tsx
import axios from "axios";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
	FlatList,
	SafeAreaView,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";

import { HelloWave } from "@/components/HelloWave";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function HomeScreen() {
	const [mangas, setMangas] = useState([]);
	const router = useRouter();

	useEffect(() => {
		axios
			.get("https://api.mangadex.org/manga")
			.then((response) => {
				setMangas(response.data.data);
				console.log(response.data.data);
			})
			.catch((error) => console.error(error));
	}, []);

	const renderHeader = () => (
		<SafeAreaView style={styles.header}>
			<View style={styles.header}>
				<ThemedView style={styles.titleContainer}>
					<ThemedText type="title" style={{ fontSize: 20 }}>
						Bem vindo ao vuc mangás!
					</ThemedText>
					<HelloWave />
				</ThemedView>
			</View>
		</SafeAreaView>
	);

	return (
		<FlatList
			ListHeaderComponent={renderHeader}
			data={mangas}
			keyExtractor={(item: any) => item.id}
			renderItem={({ item }) => (
				<TouchableOpacity onPress={() => router.push(`/manga/${item.id}`)}>
					<ThemedView style={styles.mangaContainer}>
						<ThemedText type="subtitle">{item.attributes.title.en}</ThemedText>
					</ThemedView>
				</TouchableOpacity>
			)}
		/>
	);
}

const styles = StyleSheet.create({
	header: {
		flex: 1,
		padding: 16,
		backgroundColor: "#000",
	},
	titleContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		backgroundColor: "#000",
	},
	stepContainer: {
		gap: 8,
		marginBottom: 8,
	},
	reactLogo: {
		height: 178,
		width: 290,
		bottom: 0,
		left: 0,
		position: "absolute",
	},
	mangaContainer: {
		marginBottom: 16,
		padding: 16,
		backgroundColor: "#000",
		borderRadius: 8,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.3,
		shadowRadius: 1,
	},
	mangaCover: {
		width: 50,
		height: 75,
		marginRight: 16,
	},
});
