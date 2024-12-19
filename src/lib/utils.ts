import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getHitAreaWidth(
  minHitAreaWidth: number,
  maxHitAreaWidth: number,
  windowDimensions: WindowDimensions,
) {
  const hitAreaMinWidth = Math.max(
    windowDimensions.width * 0.2,
    minHitAreaWidth,
  );

  return Math.min(hitAreaMinWidth, maxHitAreaWidth);
}

type WindowDimensions = {
  width: number;
  height: number;
};

export function getNextVideoClipPath(
  hitAreaWidth: number,
  windowDimensions: WindowDimensions,
) {
  // Determine clip path min/max side length

  // Clip path center
  const centerX = windowDimensions.width / 2;
  const centerY = windowDimensions.height / 2;

  // Clip path lengths
  const halfSideLength = hitAreaWidth / 2;
  const quaterSideLength = hitAreaWidth / 4;

  // Clip path points
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
  // Determine clip path side length
  const centerX = windowDimensions.width / 2;

  // Clip path points
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
