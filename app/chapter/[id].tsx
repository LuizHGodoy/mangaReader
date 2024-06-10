// app/chapter/[id].tsx
import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, ScrollView } from "react-native";

export default function Chapter() {
	const [pages, setPages] = useState([]);
	const { id } = useLocalSearchParams();

	useEffect(() => {
		axios
			.get(`https://api.mangadex.org/at-home/server/${id}`)
			.then((response) => {
				const baseUrl = response.data.baseUrl;
				const chapterHash = response.data.chapter.hash;
				const pageData = response.data.chapter.data;
				setPages(
					pageData.map((page: any) => `${baseUrl}/data/${chapterHash}/${page}`),
				);
			})
			.catch((error) => console.error(error));
	}, [id]);

	return (
		<ScrollView>
			{pages.map((page, index) => (
				<Image
					key={index}
					source={{ uri: page }}
					style={{ width: "100%", height: 400 }}
				/>
			))}
		</ScrollView>
	);
}
