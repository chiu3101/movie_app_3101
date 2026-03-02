import { Client, Databases, ID, Query } from 'appwrite';

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID; 
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID; 
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';

console.log("Appwrite Endpoint:", ENDPOINT);
console.log("Database ID:", DATABASE_ID);
console.log("Collection ID:", COLLECTION_ID);
console.log("Project ID:", PROJECT_ID);

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID);


const database = new Databases(client);

export const updateSearchMetrics = async (searchTerm , movie) => {
    console.log("updateSearchMetrics received", { searchTerm, movie });
    //1. Use Appwrite SDK to check if the search term exists in the database
    try {
        const results = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [Query.equal('searchterm', searchTerm)]
        );

       if (results.documents.length > 0){
        const doc = results.documents[0];

        const movieFields = {
            movie_id: movie.id,
            title: movie.title || movie.name || '',
            overview: movie.overview || '',
            release_date: movie.release_date || movie.first_air_date || '',
            poster_url: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
            vote_average: movie.vote_average ?? null,
            vote_count: movie.vote_count ? String(movie.vote_count) : null,
            popularity: movie.popularity ?? null,
            original_language: movie.original_language || ''
        };

        await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
            count: (doc.count || 0) + 1,
            ...movieFields,
            lastSearchedAt: new Date().toISOString()
        });
        console.log("Updated search metrics:", { searchterm: searchTerm, id: doc.$id, count: (doc.count || 0) + 1 });
       }
         else {
            const movieFields = {
                movie_id: movie.id,
                title: movie.title || movie.name || '',
                overview: movie.overview || '',
                release_date: movie.release_date || movie.first_air_date || '',
                poster_url: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
                vote_average: movie.vote_average ?? null,
                vote_count: movie.vote_count ? String(movie.vote_count) : null,
                popularity: movie.popularity ?? null,
                original_language: movie.original_language || ''
            };

            const newDoc = await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
                searchterm: searchTerm,
                count: 1,
                ...movieFields,
                lastSearchedAt: new Date().toISOString()
            });
            console.log("Created search metrics:", { searchTerm, id: newDoc.$id });
         }
    } catch (error) {
        console.error("Error updating search metrics:", error);
        // Appwrite exceptions include message and code properties
        try {
            if (error.message) console.error("Appwrite error message:", error.message);
            if (error.code) console.error("Appwrite error code:", error.code);
            if (error.response) console.error("Appwrite response:", error.response);
        } catch (e) {
            console.error('Error inspecting Appwrite exception:', e);
        }
        return false;
    }
    return true;
}