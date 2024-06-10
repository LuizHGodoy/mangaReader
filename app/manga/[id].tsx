import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

export default function Manga() {
	const [chapters, setChapters] = useState([]);
	const { id } = useLocalSearchParams();
	const router = useRouter();

	console.log(chapters);

	useEffect(() => {
		axios
			.get(`https://api.mangadex.org/manga/${id}/feed`)
			.then((response) => setChapters(response.data.data))
			.catch((error) => console.error(error));
	}, [id]);

	return (
		<View>
			<FlatList
				data={chapters}
				keyExtractor={(item: any) => item.id}
				renderItem={({ item }) => (
					<TouchableOpacity
						onPress={() => router.push(`/chapter/${item.id}`)}
						style={{ borderWidth: 1, borderColor: "#fff" }}
					>
						<Text style={{ color: "#fff" }}>
							Chapter {item.attributes.chapter}
						</Text>

						<Text style={{ color: "#fff" }}>{item.attributes.title}</Text>
					</TouchableOpacity>
				)}
			/>
		</View>
	);
}
