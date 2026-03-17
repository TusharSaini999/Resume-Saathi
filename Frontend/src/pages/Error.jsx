import React from "react";
import { Link, useRouteError } from "react-router";

const GlobalError = () => {
  const error = useRouteError();

  const status = error?.status || 404;
  const message = error?.statusText || "Something went wrong!";

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen p-6 transition-colors"
      style={{
        backgroundColor: document.documentElement.classList.contains('dark')
          ? '#111827' // dark-background
          : '#FFFFFF', // background
        color: document.documentElement.classList.contains('dark')
          ? '#FFFFFF' // dark-text
          : '#1E293B', // text-primary
      }}
    >
      {/* Animated Status Number */}
      <h1
        className="text-[6rem] font-extrabold bg-clip-text text-transparent animate-bounce"
        style={{
          backgroundImage: document.documentElement.classList.contains('dark')
            ? 'linear-gradient(90deg, #FF5FA7, #D340BD, #9D65D5)' // dark gradient
            : 'linear-gradient(90deg, #FE3E91, #CA25AF, #803AD1)', // light gradient
        }}
      >
        {status}
      </h1>

      {/* Error Message */}
      <p
        className="mt-3 text-xl font-medium text-center max-w-xs"
        style={{
          color: document.documentElement.classList.contains('dark')
            ? '#94A3B8' // dark-muted
            : '#475569', // text-secondary
        }}
      >
        {message}
      </p>

      {/* Decorative Emoji */}
      <div
        className="mt-6 w-24 h-24 flex items-center justify-center rounded-full shadow-md animate-pulse"
        style={{
          backgroundImage: document.documentElement.classList.contains('dark')
            ? 'linear-gradient(45deg, #FF5FA733, #D340BD33, #9D65D533)'
            : 'linear-gradient(45deg, #FE3E9133, #CA25AF33, #803AD133)',
          boxShadow: '0 4px 6px rgba(128, 58, 209, 0.25)', // Purple Shadow
        }}
      >
        <span className="text-4xl">😢</span>
      </div>

      {/* Go Home Button */}
      <Link
        to="/"
        className="mt-6 px-6 py-2 font-semibold rounded-lg shadow-md hover:scale-105 active:scale-95 transition-transform duration-200"
        style={{
          backgroundImage: document.documentElement.classList.contains('dark')
            ? 'linear-gradient(90deg, #FF5FA7, #D340BD, #9D65D5)'
            : 'linear-gradient(90deg, #FE3E91, #CA25AF, #803AD1)',
          color: '#FFFFFF',
          boxShadow: '0 4px 6px rgba(128, 58, 209, 0.25)', // Purple Shadow
        }}
      >
        Go Home
      </Link>
    </div>
  );
};

export default GlobalError;