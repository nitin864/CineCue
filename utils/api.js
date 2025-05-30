import axios from "axios";

class TMDBService {
  constructor() {
    this.baseURL = "https://api.themoviedb.org/3";
    this.apiKey = "c46ca2b4791f4cf722454d2be403d2ac";
    this.proxyURL = "https://tmdb-proxy.rajnitin793.workers.dev/";

    this.client = axios.create({
      baseURL: this.proxyURL,
    });
  }

  async fetchFromTMDB(endpoint, params = {}) {
    const url = `${this.baseURL}${endpoint}?api_key=${this.apiKey}`;
    const encodedUrl = encodeURIComponent(url);
    try {
      const response = await this.client.get(`?url=${encodedUrl}`, { params });
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching data from TMDB (endpoint: ${endpoint}):`,
        error
      );
      throw error;
    }
  }

  async serachFetchFromTMDB(endpoint, params = {}) {
    const url = `${this.baseURL}${endpoint}&api_key=${this.apiKey}`;
    const encodedUrl = encodeURIComponent(url);
    try {
      const response = await this.client.get(`?url=${encodedUrl}`, { params });
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching data from TMDB (endpoint: ${endpoint}):`,
        error
      );
      throw error;
    }
  }

  // Popular movies
  async fetchPopularMovies() {
    return this.fetchFromTMDB("/movie/popular");
  }

  // Movie details by ID
  async fetchMovieDetails(movieId) {
    return this.fetchFromTMDB(`/movie/${movieId}`);
  }

  // Similar movies
  async fetchSimilarMovies(movieId) {
    return this.fetchFromTMDB(`/movie/${movieId}/similar`);
  }

  // NEW: Fetch trailer videos
  async fetchMovieTrailer(movieId) {
    return this.fetchFromTMDB(`/movie/${movieId}/videos`);
  }
}

export default TMDBService;
