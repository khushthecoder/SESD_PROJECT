import React from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  message?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md", message, fullScreen = false,
}) => {
  const sizes = { sm: 24, md: 40, lg: 64 };
  const dim = sizes[size];

  const spinner = (
    <div className="spinner-wrapper">
      <svg className="spinner" width={dim} height={dim} viewBox="0 0 50 50">
        <circle className="spinner-path" cx="25" cy="25" r="20" fill="none" strokeWidth="5" />
      </svg>
      {message && <p className="spinner-message">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return <div className="spinner-fullscreen">{spinner}</div>;
  }
  return spinner;
};
