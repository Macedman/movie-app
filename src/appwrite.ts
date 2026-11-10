import { Client, Databases, ID, Query } from "appwrite";
import type { Movie, TrendingMovie } from "./types";

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(PROJECT_ID);

const database = new Databases(client);

export const updateSearchCount = async (rawSearchTerm: string, movie: Movie): Promise<void> => {
    // Normalize so "Batman", "batman " and "BATMAN" count as the same search
    const searchTerm = rawSearchTerm.trim().toLowerCase();

    //1. Use appwrite SDK to check if the search term already exists in the database
    //2. If it exists, update the count
    //3. If it doesn't exist, create a new document with the search term and count as 1
  try {
    const result = await database.listDocuments<TrendingMovie>(DATABASE_ID, COLLECTION_ID, [
        Query.equal("searchTerm", searchTerm),
    ]);

    if(result.documents.length > 0) {
        const doc = result.documents[0];
        await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
            count: doc.count + 1,
        });
    } else {
        await database.createDocument(DATABASE_ID,COLLECTION_ID, ID.unique(), {
            searchTerm,
            count: 1,
            movie_id: movie.id,
            poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        })
    }
  } catch (error) {
    console.error("Error updating search count", error);
  }
};


export const getTrendingMovies = async (): Promise<TrendingMovie[]> => {
    try {
        const result = await database.listDocuments<TrendingMovie>(DATABASE_ID, COLLECTION_ID, [
            Query.limit(5),
            Query.orderDesc("count"),
        ])

        return result.documents;
    } catch(error) {
        console.error("Error loading trending movies", error);
        return [];
    }
}