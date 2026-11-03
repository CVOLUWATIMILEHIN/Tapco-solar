/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

interface BrandLogoProps {
  /** Size modifier for the icon */
  size?: "sm" | "md" | "lg" | "xl";
  /** Whether to show the brand text "TAPCO SOLAR Energy Solutions" beside the icon */
  showText?: boolean;
  /** Force dark-mode text color styling even on lighter containers if needed */
  lightModeText?: boolean;
  /** Action when clicked */
  onClick?: () => void;
}

export default function BrandLogo({
  size = "md",
  showText = true,
  lightModeText = false,
  onClick
}: BrandLogoProps) {
  // Dimensions for the SVG icon
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
    xl: "h-24 w-24"
  };

  const textGapClass = {
    sm: "gap-2",
    md: "gap-3",
    lg: "gap-4",
    xl: "gap-5"
  };

  return (
    <div
      id="tapco-brand-logo-container"
      onClick={onClick}
      className={`flex items-center ${textGapClass[size]} ${onClick ? "cursor-pointer select-none" : ""}`}
    >
      {/* BRAND LOGO SVG MARK */}
      <svg
        id="tapco-brand-logo-svg"
        viewBox="0 0 100 100"
        className={`${sizeClasses[size]} flex-shrink-0`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* SUNRISE */}
        {/* Sun Dome (Semicircle rising above the panel cells) */}
        <path
          id="sun-dome-path"
          d="M 32 50.8 A 18 18 0 0 1 68 50.8 Z"
          fill="#F59E0B"
        />

        {/* Sunbeams (7 Radial Triangles pointing outwards) */}
        {/* 1. Low Left (9 o'clock) */}
        <polygon id="sunray-1" points="9,45 21,41 21,49" fill="#F59E0B" />
        {/* 2. Mid Left (10 o'clock) */}
        <polygon id="sunray-2" points="15,31 25,29 27,36" fill="#F59E0B" />
        {/* 3. Top Left (11 o'clock) */}
        <polygon id="sunray-3" points="30,16 37,19 41,25" fill="#F59E0B" />
        {/* 4. Top (12 o'clock) */}
        <polygon id="sunray-4" points="50,8 45,18 55,18" fill="#F59E0B" />
        {/* 5. Top Right (1 o'clock) */}
        <polygon id="sunray-5" points="70,16 59,25 63,19" fill="#F59E0B" />
        {/* 6. Mid Right (2 o'clock) */}
        <polygon id="sunray-6" points="85,31 73,36 75,29" fill="#F59E0B" />
        {/* 7. Low Right (3 o'clock) */}
        <polygon id="sunray-7" points="91,45 79,49 79,41" fill="#F59E0B" />

        {/* SOLAR PANEL CELLS (3x3 grid with transparent spacing) */}
        {/* Row 1 (Top) */}
        <polygon id="cell-1-1" points="32.8,50.8 43.2,50.8 41.8,59.7 28.6,59.7" fill="#0A2F5C" />
        <polygon id="cell-1-2" points="44.8,50.8 55.2,50.8 56.6,59.7 43.4,59.7" fill="#0A2F5C" />
        <polygon id="cell-1-3" points="56.8,50.8 67.2,50.8 71.4,59.7 58.2,59.7" fill="#0A2F5C" />

        {/* Row 2 (Middle) */}
        <polygon id="cell-2-1" points="28.4,61.3 41.8,61.3 40.2,71.4 23.9,71.4" fill="#0A2F5C" />
        <polygon id="cell-2-2" points="43.4,61.3 56.6,61.3 58.2,71.4 41.8,71.4" fill="#0A2F5C" />
        <polygon id="cell-2-3" points="58.2,61.3 71.6,61.3 76.1,71.4 59.8,71.4" fill="#0A2F5C" />

        {/* Row 3 (Bottom) */}
        <polygon id="cell-3-1" points="23.7,73.0 40.2,73.0 38.5,84.2 18.8,84.2" fill="#0A2F5C" />
        <polygon id="cell-3-2" points="41.8,73.0 58.2,73.0 59.9,84.2 40.1,84.2" fill="#0A2F5C" />
        <polygon id="cell-3-3" points="59.8,73.0 76.3,73.0 81.2,84.2 61.5,84.2" fill="#0A2F5C" />
      </svg>

      {/* BRAND TEXT */}
      {showText && (
        <div className="flex flex-col text-left leading-none">
          <span
            id="tapco-text"
            className={`font-black uppercase tracking-wider ${
              size === "sm" ? "text-base" : size === "md" ? "text-xl" : size === "lg" ? "text-2xl" : "text-3xl"
            } ${lightModeText ? "text-slate-900" : "text-slate-100"}`}
          >
            TAPCO
          </span>
          <span
            id="solar-text"
            className={`font-black uppercase tracking-wider text-amber-500 ${
              size === "sm" ? "text-base mt-0.5" : size === "md" ? "text-xl mt-0.5" : size === "lg" ? "text-2xl mt-1" : "text-3xl mt-1"
            }`}
          >
            SOLAR
          </span>
          <span
            id="energy-solutions-text"
            className={`font-bold tracking-widest uppercase ${
              size === "sm" ? "text-[8px] mt-0.5" : size === "md" ? "text-[10px] mt-1" : size === "lg" ? "text-xs mt-1.5" : "text-sm mt-2"
            } ${lightModeText ? "text-slate-600" : "text-slate-400"}`}
          >
            Energy Solutions
          </span>
        </div>
      )}
    </div>
  );
}
