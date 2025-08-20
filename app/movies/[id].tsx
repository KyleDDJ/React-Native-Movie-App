import { icons } from "@/constants/icons";
import { fetchMovieDetails } from "@/services/api";
import {
  getSavedMovies,
  removeSavedMovie,
  saveMovie,
} from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

interface MovieInfoProps {
  label: string;
  value?: string | number | null;
}

const MovieInfo = ({ label, value }: MovieInfoProps) => (
  <View className="flex-col items-start justify-center mt-5">
    <Text className="text-light-200 font-normal text-sm">{label}</Text>
    <Text className="text-light-100 font-bold text-sm mt-2">
      {value || "N/A"}
    </Text>
  </View>
);

const MovieDetails = () => {
  const { id } = useLocalSearchParams();
  const { data: movie } = useFetch(() => fetchMovieDetails(id as string));
  const [isSaved, setIsSaved] = useState(false);
  const [savedDocId, setSavedDocId] = useState<string | null>(null);

  useEffect(() => {
    const checkSaved = async () => {
      if (!movie) return;
      const saved = await getSavedMovies();
      const found = saved.find((m: any) => m.movie_id === movie.id.toString());
      if (found) {
        setIsSaved(true);
        setSavedDocId(found.$id);
      }
    };
    checkSaved();
  }, [movie?.id]);

  const toggleSave = async () => {
    if (!movie) return;
    try {
      if (isSaved && savedDocId) {
        await removeSavedMovie(savedDocId);
        setIsSaved(false);
        setSavedDocId(null);
        console.log("Removed from saved");
      } else {
        const doc = await saveMovie(movie);
        setIsSaved(true);
        setSavedDocId(doc.$id);
        console.log("Saved movie:", movie.title);
      }
    } catch (err) {
      console.log("Error saving/removing:", err);
    }
  };

  return (
    <View className="bg-primary flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`,
            }}
            className="w-full h-[500px]"
            resizeMode="cover"
          />
        </View>

        <View className="flex-col items-start justify-center mt-5 px-5">
          <View className="flex-row items-center justify-between">
            <Text className="text-white font-bold text-xl flex-1">
              {movie?.title}
            </Text>

            <TouchableOpacity onPress={toggleSave}>
              <Image
                source={icons.save}
                style={{
                  width: 28,
                  height: 28,
                  tintColor: isSaved ? "#FFD700" : "#FFF",
                }}
              />
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center gap-x-1 mt-2">
            <Text className="text-light-200 text-sm">
              {movie?.release_date?.split("-")[0]}
              <Text> {movie?.runtime}m</Text>
            </Text>
          </View>

          <View className="flex-row items-center bg-dark-200 px-2 py-1 rounded-md gap-x-1 mt-2">
            <Image source={icons.star} className="size-4" />
            <Text className="text-white font-bold text-sm">
              {Math.round(movie?.vote_average ?? 0)}/10
            </Text>
            <Text className="text-light-200 text-sm">
              ({movie?.vote_count} votes)
            </Text>
          </View>

          <MovieInfo label="Overview" value={movie?.overview} />
          <MovieInfo
            label="Genre"
            value={movie?.genres?.map((g) => g.name).join(" - ") || "N/A"}
          />
          <View className="flex flex-row justify-between w-1/2">
            <MovieInfo
              label="Budget"
              value={`$${(movie?.budget ?? 0) / 1_000_000} million`}
            />
            <MovieInfo
              label="Revenue"
              value={`$${Math.round((movie?.revenue ?? 0) / 1_000_000)}`}
            />
          </View>
          <MovieInfo
            label="Production Companies"
            value={
              movie?.production_companies.map((c) => c.name).join(" - ") ||
              "N/A"
            }
          />
        </View>
      </ScrollView>

      <TouchableOpacity
        className="absolute bottom-5 left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center z-50"
        onPress={router.back}
      >
        <Image
          source={icons.arrow}
          className="size-5 mr-1 mt-0.5 rotate-180"
          tintColor="#fff"
        />
        <Text className="text-white font-semibold text-base">Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MovieDetails;
