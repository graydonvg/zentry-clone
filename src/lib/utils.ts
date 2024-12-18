import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type WindowDimensions = {
  width: number;
  height: number;
};

export function getNextVideoClipPath(
  minLength: number,
  maxLength: number,
  windowDimensions: WindowDimensions,
) {
  // Determine square side length
  const minSideLength = Math.max(windowDimensions.width * 0.2, minLength);
  const minMaxSideLength = Math.min(minSideLength, maxLength);

  // Square center
  const centerX = windowDimensions.width / 2;
  const centerY = windowDimensions.height / 2;

  // Square side lengths
  const halfSideLength = minMaxSideLength / 2;
  const quaterSideLength = minMaxSideLength / 4;

  // Square points
  const topLeftX = centerX - halfSideLength;
  const topLeftY = centerY - halfSideLength;

  const topRightX = centerX + halfSideLength;
  const topRightY = topLeftY;

  const bottomRightX = topRightX;
  const bottomRightY = centerY + halfSideLength;

  const bottomLeftX = topLeftX;
  const bottomLeftY = bottomRightY;

  const clipPath = `M ${topLeftX} ${topLeftY + quaterSideLength} C ${topLeftX} ${topLeftY} ${topLeftX} ${topLeftY} ${topLeftX + quaterSideLength} ${topLeftY} L ${topRightX - quaterSideLength} ${topRightY} C ${topRightX} ${topRightY} ${topRightX} ${topRightY} ${topRightX} ${topRightY + quaterSideLength} L ${bottomRightX} ${bottomRightY - quaterSideLength} C ${bottomRightX} ${bottomRightY} ${bottomRightX} ${bottomRightY} ${bottomRightX - quaterSideLength} ${bottomRightY} C ${centerX} ${bottomRightY} ${centerX} ${bottomRightY} ${bottomLeftX + quaterSideLength} ${bottomLeftY} C ${bottomLeftX} ${bottomLeftY} ${bottomLeftX} ${bottomLeftY} ${bottomLeftX} ${bottomLeftY - quaterSideLength} Z`;

  return clipPath;
}

export function getCurrentVideoClipPath(windowDimensions: WindowDimensions) {
  // Square center
  const centerX = windowDimensions.width / 2;

  // Square points
  const topLeftX = 0;
  const topLeftY = 0;

  const topRightX = windowDimensions.width;
  const topRightY = topLeftY;

  const bottomRightX = topRightX;
  const bottomRightY = windowDimensions.height;

  const bottomLeftX = topLeftX;
  const bottomLeftY = bottomRightY;

  const clipPath = `M ${topLeftX} ${topLeftY} C ${topLeftX} ${topLeftY} ${topLeftX} ${topLeftY} ${topLeftX} ${topLeftY} L ${topRightX} ${topRightY} C ${topRightX} ${topRightY} ${topRightX} ${topRightY} ${topRightX} ${topRightY} L ${bottomRightX} ${bottomRightY} C ${bottomRightX} ${bottomRightY} ${bottomRightX} ${bottomRightY} ${bottomRightX} ${bottomRightY} C ${centerX} ${bottomRightY} ${centerX} ${bottomRightY} ${bottomLeftX} ${bottomLeftY} C ${bottomLeftX} ${bottomLeftY} ${bottomLeftX} ${bottomLeftY} ${bottomLeftX} ${bottomLeftY} Z`;

  return clipPath;
}
