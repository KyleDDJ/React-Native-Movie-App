/**
 * Search Screen
 *
 * - Allows users to search for movies using TMDB API (`fetchMovies`).
 * - Displays results in a 3-column grid of `MovieCard` components.
 * - Debounces input (500ms delay before fetching results).
 * - Tracks search count in Appwrite (`updateSearchCount`).
 */

import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMovies } from "@/services/api";
import { updateSearchCount } from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";

const search = () => {
  const [searchQuery, setSearchQuery] = useState("");

  /**
   * Fetch movies from TMDB based on `searchQuery`.
   * - `useFetch` is initialized with fetchMovies but won't auto-run (`false`).
   * - Controlled manually via `loadMovies`.
   */
  const {
    data: movies,
    is_loading,
    error,
    refetch: loadMovies,
    reset,
  } = useFetch(
    () =>
      fetchMovies({
        query: searchQuery,
      }),
    false
  );

  /**
   * Debounced search effect.
   * - Waits 500ms after user stops typing before fetching.
   * - Clears results if input is empty.
   */
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchQuery.trim()) {
        await loadMovies();
      } else {
        reset();
      }
    }, 500);

    return () => clearTimeout(timeoutId); // Cleanup on re-typing
  }, [searchQuery]);

  /**
   * Track searches in Appwrite.
   * - Updates search count when results are found.
   * - Uses the first movie in results for analytics.
   */
  useEffect(() => {
    if (movies?.length > 0 && movies?.[0])
      updateSearchCount(searchQuery, movies[0]);
  }, movies);

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="flex-1 absolute w-full z-0"
        resizeMode="cover"
      />

      <FlatList
        data={movies}
        renderItem={({ item }) => <MovieCard {...item} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 100 }}
        numColumns={3}
        className="px-5"
        columnWrapperStyle={{
          justifyContent: "center",
          gap: 16,
          marginVertical: 16,
        }}
        ListHeaderComponent={
          <>
            <View className="w-full flex-row justify-center mt-20 items-center">
              <Image source={icons.logo} className="w-12 h-10" />
            </View>
            <View className="my-5">
              <SearchBar
                value={searchQuery}
                onChangeText={(text: string) => setSearchQuery(text)}
                placeholder="Search movies..."
              />
            </View>

            {is_loading && (
              <ActivityIndicator
                size="large"
                color="#0000ff"
                className="my-3"
              />
            )}
            {error && (
              <Text className="text-red-500 px-5 my-3">
                Error: {error.message}
              </Text>
            )}
            {!is_loading &&
              !error &&
              searchQuery.trim() &&
              movies?.length > 0 && (
                <Text className="text-xl text-white font-bold">
                  Search Results for{" "}
                  <Text className="text-accent">{searchQuery}</Text>
                </Text>
              )}
          </>
        }
        ListEmptyComponent={
          !is_loading && !error ? (
            <View className="mt-10 px-5">
              <Text className="text-center text-gray-500">
                {searchQuery.trim()
                  ? "No results found."
                  : "Start searching for movies!"}
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default search;
