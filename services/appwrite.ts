import { Client, Databases, ID, Query } from "react-native-appwrite";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!; // Metrics/Search
const SAVED_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_SAVED_COLLECTION_ID!; // Saved movies

const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

const database = new Databases(client);

export const updateSearchCount = async (query: string, movie: Movie) => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("searchTerm", query)
    ]);

    if (result.documents.length > 0) {
      const existingMovie = result.documents[0];
      await database.updateDocument(DATABASE_ID, COLLECTION_ID, existingMovie.$id, {
        count: existingMovie.count + 1
      });
    } else {
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm: query,
        movie_id: Number(movie.id),
        title: movie.title,
        count: 1,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      });
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getTrendingMovies = async (): Promise<TrendingMovie[] | undefined> => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(5),
      Query.orderDesc("count")
    ]);
    return result.documents as unknown as TrendingMovie[];
  } catch (error) {
    console.log(error);
    return undefined;
  }
};

export const saveMovie = async (movie: Movie) => {
  const genreIds =
    movie.genre_ids && movie.genre_ids.length > 0
      ? movie.genre_ids
      : movie.genres
      ? movie.genres.map((g: { id: number }) => g.id)
      : [];

  return database.createDocument(
    DATABASE_ID,
    SAVED_COLLECTION_ID,
    ID.unique(),
    {
      movie_id: movie.id.toString(),
      title: movie.title,
      poster_path: movie.poster_path || "",
      genre_ids: genreIds,
    }
  );
};

export const removeSavedMovie = async (docId: string) => {
  return database.deleteDocument(DATABASE_ID, SAVED_COLLECTION_ID, docId);
};

export const getSavedMovies = async () => {
  const res = await database.listDocuments(DATABASE_ID, SAVED_COLLECTION_ID);
  return res.documents;
};
