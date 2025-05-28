import React, { useState, useEffect } from 'react';

interface PlatformThumbnailProps {
  url: string;
  title: string;
  subject?: string;
  className?: string;
}

export const PlatformThumbnail: React.FC<PlatformThumbnailProps> = ({
  url,
  title,
  subject,
  className = ''
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Generate thumbnail URL using a screenshot service
  const getThumbnailUrl = (targetUrl: string): string => {
    // Using thum.io service - free tier available
    const encodedUrl = encodeURIComponent(targetUrl);
    return `https://image.thum.io/get/width/300/crop/200/noanimate/${encodedUrl}`;
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
    setIsLoading(false);
  };

  const handleImageError = () => {
    setImageLoaded(false);
    setImageError(true);
    setIsLoading(false);
  };

  const handleClick = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  useEffect(() => {
    setIsLoading(true);
    setImageLoaded(false);
    setImageError(false);
  }, [url]);

  return (
    <div
      onClick={handleClick}
      className={`
        relative w-80 h-52 bg-gray-800 rounded-lg border border-gray-700 
        cursor-pointer transition-all duration-300 ease-in-out
        hover:bg-gray-750 hover:border-gray-600 hover:shadow-lg hover:shadow-gray-900/20
        hover:scale-[1.02] active:scale-[0.98]
        focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50
        group overflow-hidden
        ${className}
      `}
      tabIndex={0}
      role="button"
      aria-label={`Open ${title} for ${subject || 'learning'} in new tab`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* Loading skeleton */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-750 to-gray-800 animate-pulse">
          <div className="h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
          </div>
        </div>
      )}

      {/* Website screenshot */}
      {!imageError && url && (
        <img
          src={getThumbnailUrl(url)}
          alt={`Screenshot of ${title}`}
          className={`
            absolute inset-0 w-full h-full object-cover transition-opacity duration-300
            ${imageLoaded ? 'opacity-100' : 'opacity-0'}
          `}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading="lazy"
        />
      )}

      {/* Fallback placeholder for failed loads or no URL */}
      {(imageError || !url) && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900">
          {/* Subtle pattern overlay */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='m0 40 40-40H20L0 20M40 40V20l-20 20'/%3E%3C/g%3E%3C/svg%3E")`
            }}
          />
          
          <div className="relative h-full flex flex-col items-center justify-center p-6">
            {/* Website icon */}
            <div className="mb-4 p-4 bg-gray-700 rounded-full group-hover:bg-gray-600 transition-colors duration-300">
              <svg 
                className="w-8 h-8 text-gray-400 group-hover:text-gray-300 transition-colors duration-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9a9 9 0 01-9-9m9 9c0 5-4 9-9 9s-9-4-9-9m9 9c5 0 9-4 9-9s-4-9-9-9" 
                />
              </svg>
            </div>
            
            {!url && (
              <p className="text-xs text-gray-500 mt-2">No URL assigned</p>
            )}
          </div>
        </div>
      )}

      {/* Content overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <h3 className="text-lg font-medium text-white mb-1 group-hover:text-gray-100 transition-colors duration-300">
            {title}
          </h3>
          {subject && (
            <p className="text-sm text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
              {subject}
            </p>
          )}
        </div>
      </div>
      
      {/* Hover indicator */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="bg-black bg-opacity-50 rounded-full p-2">
          <svg 
            className="w-4 h-4 text-white" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
            />
          </svg>
        </div>
      </div>
      
      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
};
