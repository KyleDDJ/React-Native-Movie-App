// Import function to fetch user's saved movies from Appwrite backend
import { getSavedMovies } from "@/services/appwrite";

// Import router from Expo for navigation (to movie detail pages)
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Get screen width → used to calculate movie card width (2 per row)
const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 40) / 2; // subtract margin then divide by 2

const Saved = () => {
  const router = useRouter(); // for navigation
  const [savedMovies, setSavedMovies] = useState<any[]>([]); // state for saved movies

  // Fetch saved movies when component mounts
  useEffect(() => {
    const fetchSaved = async () => {
      const res = await getSavedMovies(); // fetch from Appwrite
      setSavedMovies(res || []); // fallback to empty array if nothing is returned
    };
    fetchSaved();
  }, []);

  // Navigate to movie detail screen when card is clicked
  const handlePress = (movie: any) => {
    router.push(`/movies/${movie.movie_id}`);
  };

  // Render each saved movie card
  const renderMovie = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => handlePress(item)} activeOpacity={0.7}>
      <View
        className="bg-gray-800 rounded-2xl mb-4 overflow-hidden"
        style={{ width: CARD_WIDTH, marginRight: 10 }}
      >
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
          className="w-full h-80"
          style={{ resizeMode: "cover" }}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="bg-primary flex-1 px-5 pt-10">
      <Text className="text-white text-xl font-bold mb-6 text-left">
        Saved Movies
      </Text>
      <FlatList
        data={savedMovies}
        renderItem={renderMovie}
        keyExtractor={(item) => item.$id}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-between",
          marginBottom: 10,
        }}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default Saved;
