import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { WindowDimensions } from "./types";

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

export function getNextVideoClipPath(
  hitAreaWidth: number,
  windowDimensions: WindowDimensions,
  borderRadius = 8, // Add borderRadius as a parameter
) {
  // Clip path center
  const centerX = windowDimensions.width / 2;
  const centerY = windowDimensions.height / 2;

  // Clip path lengths
  const halfSideLength = hitAreaWidth / 2;

  // Ensure the borderRadius doesn't exceed half the side length
  const clampedRadius = Math.min(borderRadius, halfSideLength);

  // Corner points adjusted for the border radius
  const topLeftX = centerX - halfSideLength;
  const topLeftY = centerY - halfSideLength;

  const topRightX = centerX + halfSideLength;
  const topRightY = topLeftY;

  const bottomRightX = topRightX;
  const bottomRightY = centerY + halfSideLength;

  const bottomLeftX = topLeftX;
  const bottomLeftY = bottomRightY;

  const clipPath = `
    M ${topLeftX + clampedRadius} ${topLeftY}
    L ${topRightX - clampedRadius} ${topRightY}
    Q ${topRightX} ${topRightY} ${topRightX} ${topRightY + clampedRadius}
    L ${bottomRightX} ${bottomRightY - clampedRadius}
    Q ${bottomRightX} ${bottomRightY} ${bottomRightX - clampedRadius} ${bottomRightY}
    L ${bottomLeftX + clampedRadius} ${bottomLeftY}
    Q ${bottomLeftX} ${bottomLeftY} ${bottomLeftX} ${bottomLeftY - clampedRadius}
    L ${topLeftX} ${topLeftY + clampedRadius}
    Q ${topLeftX} ${topLeftY} ${topLeftX + clampedRadius} ${topLeftY}
    Z
  `.replace(/\s+/g, " "); // Remove extra spaces for a single-line path

  return clipPath;
}

export function getCurrentVideoClipPath(
  windowDimensions: WindowDimensions,
  borderRadius = 0, // Add borderRadius as a parameter
) {
  const halfSideLength = windowDimensions.width / 2;

  // Ensure the borderRadius doesn't exceed half the side length
  const clampedRadius = Math.min(borderRadius, halfSideLength);

  // Clip path points
  const topLeftX = 0;
  const topLeftY = 0;

  const topRightX = windowDimensions.width;
  const topRightY = topLeftY;

  const bottomRightX = topRightX;
  const bottomRightY = windowDimensions.height;

  const bottomLeftX = topLeftX;
  const bottomLeftY = bottomRightY;

  const clipPath = `
    M ${topLeftX + clampedRadius} ${topLeftY}
    L ${topRightX - clampedRadius} ${topRightY}
    Q ${topRightX} ${topRightY} ${topRightX} ${topRightY + clampedRadius}
    L ${bottomRightX} ${bottomRightY - clampedRadius}
    Q ${bottomRightX} ${bottomRightY} ${bottomRightX - clampedRadius} ${bottomRightY}
    L ${bottomLeftX + clampedRadius} ${bottomLeftY}
    Q ${bottomLeftX} ${bottomLeftY} ${bottomLeftX} ${bottomLeftY - clampedRadius}
    L ${topLeftX} ${topLeftY + clampedRadius}
    Q ${topLeftX} ${topLeftY} ${topLeftX + clampedRadius} ${topLeftY}
    Z
  `.replace(/\s+/g, " "); // Remove extra spaces for a single-line path

  return clipPath;
}

export function getFirstTransformedHeroClipPath(
  windowDimensions: WindowDimensions,
  borderRadius = 8,
) {
  // Clip path lengths
  const halfSideLength = windowDimensions.width / 2;

  // Ensure the borderRadius doesn't exceed half the side length
  const clampedRadius = Math.min(borderRadius, halfSideLength);

  // Clip path points
  const topLeftX = windowDimensions.width * 0.14;
  const topLeftY = 0;

  const topRightX = windowDimensions.width * 0.72;
  const topRightY = topLeftY;

  const bottomRightX = windowDimensions.width * 0.9;
  const bottomRightY = windowDimensions.height * 0.9;

  const bottomLeftX = -20;
  const bottomLeftY = windowDimensions.height;

  const clipPath = `
    M ${topLeftX + clampedRadius} ${topLeftY}
    L ${topRightX - clampedRadius} ${topRightY}
    Q ${topRightX} ${topRightY} ${topRightX} ${topRightY + clampedRadius}
    L ${bottomRightX} ${bottomRightY - clampedRadius}
    Q ${bottomRightX} ${bottomRightY} ${bottomRightX - clampedRadius} ${bottomRightY}
    L ${bottomLeftX + clampedRadius} ${bottomLeftY}
    Q ${bottomLeftX} ${bottomLeftY} ${bottomLeftX} ${bottomLeftY - clampedRadius}
    L ${topLeftX} ${topLeftY + clampedRadius}
    Q ${topLeftX} ${topLeftY} ${topLeftX + clampedRadius} ${topLeftY}
    Z
  `.replace(/\s+/g, " "); // Remove extra spaces for a single-line path

  return clipPath;
}

export function getSecondTransformedHeroClipPath(
  windowDimensions: WindowDimensions,
  borderRadius = 8,
) {
  // Clip path lengths
  const halfSideLength = windowDimensions.width / 2;

  // Ensure the borderRadius doesn't exceed half the side length
  const clampedRadius = Math.min(borderRadius, halfSideLength);

  // Clip path points
  const topLeftX = windowDimensions.width * 0.28;
  const topLeftY = 0;

  const topRightX = windowDimensions.width * 0.86;
  const topRightY = topLeftY;

  const bottomRightX = windowDimensions.width * 0.85;
  const bottomRightY = windowDimensions.height * 0.9;

  const bottomLeftX = 0;
  const bottomLeftY = windowDimensions.height * 0.8;

  const clipPath = `
    M ${topLeftX + clampedRadius} ${topLeftY}
    L ${topRightX - clampedRadius} ${topRightY}
    Q ${topRightX} ${topRightY} ${topRightX} ${topRightY + clampedRadius}
    L ${bottomRightX} ${bottomRightY - clampedRadius}
    Q ${bottomRightX} ${bottomRightY} ${bottomRightX - clampedRadius} ${bottomRightY}
    L ${bottomLeftX + clampedRadius} ${bottomLeftY}
    Q ${bottomLeftX} ${bottomLeftY} ${bottomLeftX} ${bottomLeftY - clampedRadius}
    L ${topLeftX} ${topLeftY + clampedRadius}
    Q ${topLeftX} ${topLeftY} ${topLeftX + clampedRadius} ${topLeftY}
    Z
  `.replace(/\s+/g, " "); // Remove extra spaces for a single-line path

  return clipPath;
}

export function getHiddenHeroVideoNumbers(
  currentVideoNumber: number,
  totalVideos: number,
) {
  const hiddenVideoNumbers: number[] = [];

  // Start hiding videos after the minimum visible videos
  const MIN_VISIBLE_VIDEOS = 2;

  for (
    let distanceFromCurrent = MIN_VISIBLE_VIDEOS;
    distanceFromCurrent < totalVideos - 1;
    distanceFromCurrent++
  ) {
    hiddenVideoNumbers.push(
      ((currentVideoNumber - distanceFromCurrent + totalVideos - 1) %
        totalVideos) +
        1,
    );
  }

  return hiddenVideoNumbers;
}
