import React, { useEffect, useState, useCallback } from "react";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const MovieModal = ({ movieId, onClose }) => {
  const [details, setDetails] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);

  const fetchDetails = useCallback(async () => {
    if (!movieId) return;
    setLoading(true);
    try {
      const [detailRes, videoRes] = await Promise.all([
        fetch(`${API_BASE_URL}/movie/${movieId}?append_to_response=external_ids`, API_OPTIONS),
        fetch(`${API_BASE_URL}/movie/${movieId}/videos`, API_OPTIONS),
      ]);
      const detailData = await detailRes.json();
      const videoData = await videoRes.json();

      setDetails(detailData);

      const officialTrailer =
        videoData.results?.find(
          (v) => v.type === "Trailer" && v.site === "YouTube" && v.official
        ) ||
        videoData.results?.find(
          (v) => v.type === "Trailer" && v.site === "YouTube"
        ) ||
        videoData.results?.find((v) => v.site === "YouTube");

      setTrailer(officialTrailer || null);
    } catch (err) {
      console.error("Failed to fetch movie details:", err);
    } finally {
      setLoading(false);
    }
  }, [movieId]);

  useEffect(() => {
    fetchDetails();
    // Lock body scroll
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [fetchDetails]);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!movieId) return null;

  const backdropUrl = details?.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${details.backdrop_path}`
    : null;
  const posterUrl = details?.poster_path
    ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
    : "/no-movie.png";
  const imdbId = details?.imdb_id || details?.external_ids?.imdb_id;
  const title = details?.title || "";
  const year = details?.release_date ? details.release_date.split("-")[0] : "";

  const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(`${title} ${year} movie`)}`;
  const wikiUrl = `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(`${title} film`)}`;
  const imdbUrl = imdbId ? `https://www.imdb.com/title/${imdbId}` : null;

  const runtime = details?.runtime
    ? `${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m`
    : null;

  return (
    <div className="modal-overlay" onClick={handleBackdropClick} role="dialog" aria-modal="true" aria-label={`${title} details`}>
      <div className="modal-container">
        {/* Backdrop image blurred top banner */}
        {backdropUrl && (
          <div
            className="modal-backdrop-banner"
            style={{ backgroundImage: `url(${backdropUrl})` }}
          >
            <div className="modal-backdrop-gradient" />
          </div>
        )}

        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="modal-body">
          {loading ? (
            <div className="modal-loading">
              <div className="modal-spinner" />
              <p>Loading details…</p>
            </div>
          ) : (
            <>
              {/* Left: Poster */}
              <div className="modal-poster-col">
                <img src={posterUrl} alt={title} className="modal-poster" />

                {/* Action Buttons */}
                <div className="modal-action-btns">
                  <a href={googleUrl} target="_blank" rel="noopener noreferrer" className="modal-btn modal-btn-google">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 1 1 0-12.064c1.498 0 2.866.549 3.921 1.453l2.814-2.814A9.969 9.969 0 0 0 12.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z" />
                    </svg>
                    Google
                  </a>
                  <a href={wikiUrl} target="_blank" rel="noopener noreferrer" className="modal-btn modal-btn-wiki">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                    </svg>
                    Wikipedia
                  </a>
                  {imdbUrl && (
                    <a href={imdbUrl} target="_blank" rel="noopener noreferrer" className="modal-btn modal-btn-imdb">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V10L14 3zm-1 2l5 5h-5V5zM5 19V5h7v6h6v8H5z" />
                      </svg>
                      IMDb
                    </a>
                  )}
                </div>
              </div>

              {/* Right: Details */}
              <div className="modal-details-col">
                <div className="modal-title-row">
                  <h2 className="modal-title">{title}</h2>
                  {year && <span className="modal-year">{year}</span>}
                </div>

                {details?.tagline && (
                  <p className="modal-tagline">"{details.tagline}"</p>
                )}

                {/* Meta chips */}
                <div className="modal-meta-chips">
                  {details?.vote_average != null && (
                    <span className="modal-chip modal-chip-rating">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="#f5c518" stroke="#f5c518" strokeWidth="1">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                      {details.vote_average.toFixed(1)}/10
                      {details.vote_count && <span className="modal-chip-sub">({details.vote_count.toLocaleString()} votes)</span>}
                    </span>
                  )}
                  {runtime && (
                    <span className="modal-chip">
                      🕐 {runtime}
                    </span>
                  )}
                  {details?.status && (
                    <span className="modal-chip">
                      {details.status}
                    </span>
                  )}
                </div>

                {/* Genres */}
                {details?.genres?.length > 0 && (
                  <div className="modal-genres">
                    {details.genres.map((g) => (
                      <span key={g.id} className="modal-genre-tag">{g.name}</span>
                    ))}
                  </div>
                )}

                {/* Overview */}
                {details?.overview && (
                  <div className="modal-section">
                    <h3 className="modal-section-title">Overview</h3>
                    <p className="modal-overview">{details.overview}</p>
                  </div>
                )}

                {/* Trailer */}
                {trailer && (
                  <div className="modal-section">
                    <h3 className="modal-section-title">Trailer</h3>
                    {!showTrailer ? (
                      <button
                        className="modal-trailer-thumb"
                        onClick={() => setShowTrailer(true)}
                        aria-label="Play trailer"
                      >
                        <img
                          src={`https://img.youtube.com/vi/${trailer.key}/hqdefault.jpg`}
                          alt="Trailer thumbnail"
                          className="modal-trailer-img"
                        />
                        <div className="modal-play-overlay">
                          <div className="modal-play-btn">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                              <polygon points="5 3 19 12 5 21 5 3" />
                            </svg>
                          </div>
                          <span>Play Trailer</span>
                        </div>
                      </button>
                    ) : (
                      <div className="modal-iframe-wrapper">
                        <iframe
                          src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0`}
                          title="Movie Trailer"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="modal-iframe"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieModal;
