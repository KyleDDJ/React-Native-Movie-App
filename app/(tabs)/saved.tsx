import { getSavedMovies } from "@/services/appwrite";
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

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 40) / 2;

const Saved = () => {
  const router = useRouter();
  const [savedMovies, setSavedMovies] = useState<any[]>([]);

  useEffect(() => {
    const fetchSaved = async () => {
      const res = await getSavedMovies();
      setSavedMovies(res || []);
    };
    fetchSaved();
  }, []);

  const handlePress = (movie: any) => {
    router.push(`/movies/${movie.movie_id}`);
  };

  const renderMovie = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => handlePress(item)} activeOpacity={0.7}>
      <View
        className="bg-gray-800 rounded-2xl mb-4"
        style={{ width: CARD_WIDTH, marginRight: 10 }}
      >
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
          className="w-full h-60 rounded-t-2xl"
          style={{ resizeMode: "cover" }}
        />
        <Text
          className="text-white text-center font-semibold p-2 bg-light rounded-b-2xl"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item.title}
        </Text>
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
