/**
 * Saved Screen
 *
 * Features:
 * - Fetches and displays movies saved by the user (from Appwrite backend).
 * - Fetches TMDB genres and provides filter buttons (chips).
 * - Allows filtering saved movies by selected genre.
 * - Displays movies in a responsive 2-column grid layout.
 * - Clicking a movie navigates to its detail page.
 */

import { fetchGenres } from "@/services/api"; // Fetch TMDB
import { getSavedMovies } from "@/services/appwrite"; // Fetch user's saved movies
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Get screen width for responsive card layout
const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 40) / 2; // Each card takes half the screen width with padding

const Saved = () => {
  const router = useRouter();

  // State: pull to reload the movies
  const [refreshing, setRefreshing] = useState(false);
  // State: user's saved movies
  const [saved_movies, setSavedMovies] = useState<any[]>([]);
  // State: TMDB genres (Action, Comedy, etc.)
  const [genres, setGenres] = useState<any[]>([]);
  // State: currently selected genre filter
  const [selected_genre, setSelectedGenre] = useState<number | null>(null);

  const fetchSaved = useCallback(async () => {
    try {
      setRefreshing(true);
      const response = await getSavedMovies();
      setSavedMovies(response || []);
    } finally {
      setRefreshing(false);
    }
  }, []);

  /**
   * Fetch user's saved movies from Appwrite when screen mounts
   */
  useEffect(() => {
    fetchSaved();
  }, [fetchSaved]);

  /**
   * Fetch list of TMDB genres when screen mounts
   */
  useEffect(() => {
    const loadGenres = async () => {
      const list = await fetchGenres();
      setGenres(list);
    };
    loadGenres();
  }, []);

  /**
   * Handle navigation to movie details page
   */
  const handlePress = (movie: any) => {
    router.push(`/movies/${movie.movie_id}`);
  };

  /**
   * Filter movies based on selected genre
   * - If no genre selected, show all saved movies
   * - Otherwise filter by `movie.genre_ids`
   */
  const filteredMovies =
    selected_genre === null
      ? saved_movies
      : saved_movies.filter((movie) =>
          movie.genre_ids?.includes(selected_genre)
        );

  /**
   * Render a single movie card
   */
  const renderMovie = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => handlePress(item)} activeOpacity={0.7}>
      <View
        className="mb_4 rounded-2xl mb-4 overflow-hidden"
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
      <Text className="text-white text-xl font-bold mb-6 text-left">Saved</Text>

      <ScrollView
        showsHorizontalScrollIndicator={false}
        horizontal
        className="mb-4"
      >
        <TouchableOpacity
          onPress={() => setSelectedGenre(null)}
          className={`mr-2 rounded-full items-center mb-2 justify-center ${
            selected_genre === null ? "bg-accent" : "bg-dark-200"
          }`}
          style={{ paddingHorizontal: 16, height: 36 }}
        >
          <Text
            style={{ lineHeight: 16 }}
            numberOfLines={1}
            className="text-white text-sm font-medium"
          >
            All
          </Text>
        </TouchableOpacity>

        {genres.map((genre) => (
          <TouchableOpacity
            key={genre.id}
            onPress={() => setSelectedGenre(genre.id)}
            className={`mr-2 rounded-full items-center justify-center ${
              selected_genre === genre.id ? "bg-accent" : "bg-dark-200"
            }`}
            style={{ paddingHorizontal: 16, height: 36 }}
          >
            <Text
              style={{ lineHeight: 16 }}
              numberOfLines={1}
              className="text-white text-sm font-medium"
            >
              {genre.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredMovies}
        renderItem={renderMovie}
        keyExtractor={(item) => item.$id}
        numColumns={2}
        contentContainerStyle={{ paddingBottom: 20 }}
        columnWrapperStyle={{
          flexGrow: 1,
          justifyContent: "space-between",
          marginBottom: 10,
        }}
        refreshing={refreshing}
        onRefresh={fetchSaved}
      />
    </View>
  );
};

export default Saved;
