import React from "react";

const MovieCard = ({ movie, onClick }) => {
  const { title, vote_average, poster_path, release_date, original_language } = movie;

  return (
    <div
      className="movie-card movie-card-clickable"
      onClick={() => onClick && onClick(movie)}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${title}`}
      onKeyDown={(e) => e.key === "Enter" && onClick && onClick(movie)}
    >
      <div className="movie-card-img-wrapper">
        <img
          src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : '/no-movie.png'}
          alt={title}
        />
        <div className="movie-card-hover-overlay">
          <div className="movie-card-play-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
          <span className="movie-card-hover-label">View Details</span>
        </div>
      </div>

      <div className="mt-4">
        <h3>{title}</h3>
        <div className="content">
          <div className="rating">
            <img src="star.svg" alt="Star Icon" />
            <p>{vote_average ? vote_average.toFixed(1) : 'N/A'}</p>
          </div>
          <span>•</span>
          <p className="lang">{original_language}</p>
          <span>•</span>
          <p className="year">{release_date ? release_date.split('-')[0] : 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;