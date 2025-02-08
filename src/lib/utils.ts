import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { WindowDimensions } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getHitAreaSideLength(windowDimensions: WindowDimensions) {
  const minHitAreaSideLength = 100;
  const maxHitAreaSideLength = 250;
  const scale = 0.25;

  const hitAreaMinSideLength = Math.max(
    Math.min(windowDimensions.width * scale, windowDimensions.height * scale),
    minHitAreaSideLength,
  );

  return Math.min(hitAreaMinSideLength, maxHitAreaSideLength);
}

export function getPreloaderMaskPath(
  windowDimensions: WindowDimensions,
  hidden = false,
  borderRadius = 8,
) {
  const minWidth = 450;
  const maxWidth = 650;

  // Calculate width as a percentage of both width and height
  const widthFromHeight = windowDimensions.height * 0.8;
  const widthFromWidth = windowDimensions.width * 0.8;

  const pathMinWidth = Math.max(
    Math.min(widthFromHeight, widthFromWidth),
    minWidth,
  );
  const pathMinMaxWidth = Math.min(pathMinWidth, maxWidth);

  // Maintain the aspect ratio
  const pathHeight = pathMinMaxWidth;

  // Half side lengths for width and height
  const halfHeight = pathHeight / 2;
  const halfWidth = pathMinMaxWidth / 2;

  const scalingFactor = pathMinMaxWidth / maxWidth;

  let clampedBorderRadius = 0;

  // Path center
  const centerX = windowDimensions.width / 2;
  const centerY = windowDimensions.height / 2;

  let topLeftX = centerX;
  let topLeftY = centerY;

  let topRightX = centerX;
  let topRightY = centerY;

  let bottomRightX = centerX;
  let bottomRightY = centerY;

  let bottomLeftX = centerX;
  let bottomLeftY = centerY;

  if (!hidden) {
    // Ensure the borderRadius doesn't exceed the minimum of halfWidth and halfHeight
    clampedBorderRadius = Math.min(
      borderRadius * scalingFactor,
      halfWidth,
      halfHeight,
    );

    topLeftX = centerX - halfWidth - 50 * scalingFactor;
    topLeftY = centerY - halfHeight + 100 * scalingFactor;

    topRightX = centerX + halfWidth - 50 * scalingFactor;
    topRightY = topLeftY - 125 * scalingFactor;

    bottomRightX = topRightX + 75 * scalingFactor;
    bottomRightY = centerY + halfHeight + 25 * scalingFactor;

    bottomLeftX = topLeftX + 50 * scalingFactor;
    bottomLeftY = bottomRightY - 75 * scalingFactor;
  }

  const path = `
    M ${topLeftX + clampedBorderRadius} ${topLeftY}
    L ${topRightX - clampedBorderRadius} ${topRightY}
    Q ${topRightX} ${topRightY} ${topRightX} ${topRightY + clampedBorderRadius}
    L ${bottomRightX} ${bottomRightY - clampedBorderRadius}
    Q ${bottomRightX} ${bottomRightY} ${bottomRightX - clampedBorderRadius} ${bottomRightY}
    L ${bottomLeftX + clampedBorderRadius} ${bottomLeftY}
    Q ${bottomLeftX} ${bottomLeftY} ${bottomLeftX} ${bottomLeftY - clampedBorderRadius}
    L ${topLeftX} ${topLeftY + clampedBorderRadius}
    Q ${topLeftX} ${topLeftY} ${topLeftX + clampedBorderRadius} ${topLeftY}
    Z
  `.replace(/\s+/g, " "); // Remove extra spaces for a single-line path

  return path;
}

export function getNextVideoClipPath(
  hitAreaWidth: number,
  windowDimensions: WindowDimensions,
  cursorPosition?: { x: number; y: number },
  borderRadius = 8,
) {
  // Clip path center
  const centerX = windowDimensions.width / 2;
  const centerY = windowDimensions.height / 2;

  // Clip path lengths
  const halfSideLength = hitAreaWidth / 2;

  // Ensure the borderRadius doesn't exceed half the side length
  const clampedBorderRadius = Math.min(borderRadius, halfSideLength);

  // Cursor influence factors
  const influenceX = cursorPosition ? cursorPosition.x * halfSideLength : 0;
  const influenceY = cursorPosition ? cursorPosition.y * halfSideLength : 0;

  // Adjusted corner points based on cursor influence
  const topLeftX = centerX - halfSideLength + influenceX;
  const topLeftY = centerY - halfSideLength + influenceY;

  const topRightX = centerX + halfSideLength + influenceX;
  const topRightY = centerY - halfSideLength + influenceY;

  const bottomRightX = centerX + halfSideLength + influenceX;
  const bottomRightY = centerY + halfSideLength + influenceY;

  const bottomLeftX = centerX - halfSideLength + influenceX;
  const bottomLeftY = centerY + halfSideLength + influenceY;

  // Generate the clip path
  const clipPath = `
    M ${topLeftX + clampedBorderRadius} ${topLeftY}
    L ${topRightX - clampedBorderRadius} ${topRightY}
    Q ${topRightX} ${topRightY} ${topRightX} ${topRightY + clampedBorderRadius}
    L ${bottomRightX} ${bottomRightY - clampedBorderRadius}
    Q ${bottomRightX} ${bottomRightY} ${bottomRightX - clampedBorderRadius} ${bottomRightY}
    L ${bottomLeftX + clampedBorderRadius} ${bottomLeftY}
    Q ${bottomLeftX} ${bottomLeftY} ${bottomLeftX} ${bottomLeftY - clampedBorderRadius}
    L ${topLeftX} ${topLeftY + clampedBorderRadius}
    Q ${topLeftX} ${topLeftY} ${topLeftX + clampedBorderRadius} ${topLeftY}
    Z
  `.replace(/\s+/g, " "); // Remove extra spaces for a single-line path

  return clipPath;
}

export function getIntroImageClipPath(
  windowDimensions: WindowDimensions,
  borderRadius = 8,
) {
  const minWidth = 200;
  const maxWidth = 450;

  // Calculate width as a percentage of both width and height
  const widthFromHeight = windowDimensions.height * 0.4;
  const widthFromWidth = windowDimensions.width * 0.3;

  const imageMinWidth = Math.max(
    Math.min(widthFromHeight, widthFromWidth),
    minWidth,
  );
  const imageMinMaxWidth = Math.min(imageMinWidth, maxWidth);

  // Maintain the aspect ratio
  const imageHeight = imageMinMaxWidth * 1.5;

  // Half side lengths for width and height
  const halfHeight = imageHeight / 2;
  const halfWidth = imageMinMaxWidth / 2;

  const scalingFactor = imageMinMaxWidth / maxWidth;

  // Ensure the borderRadius doesn't exceed the minimum of halfWidth and halfHeight
  const clampedBorderRadius = Math.min(
    borderRadius * scalingFactor,
    halfWidth,
    halfHeight,
  );

  // Clip path center
  const centerX = windowDimensions.width / 2;
  const centerY = windowDimensions.height / 2;

  // Corner points adjusted for the border radius
  const topLeftX = centerX - halfWidth - 50 * scalingFactor;
  const topLeftY = centerY - halfHeight - 125 * scalingFactor;

  const topRightX = centerX + halfWidth - 50 * scalingFactor;
  const topRightY = topLeftY + 30 * scalingFactor;

  const bottomRightX = topRightX + 75 * scalingFactor;
  const bottomRightY = centerY + halfHeight - 75 * scalingFactor;

  const bottomLeftX = topLeftX + 50 * scalingFactor;
  const bottomLeftY = bottomRightY + 75 * scalingFactor;

  const clipPath = `
    M ${topLeftX + clampedBorderRadius} ${topLeftY}
    L ${topRightX - clampedBorderRadius} ${topRightY}
    Q ${topRightX} ${topRightY} ${topRightX} ${topRightY + clampedBorderRadius}
    L ${bottomRightX} ${bottomRightY - clampedBorderRadius}
    Q ${bottomRightX} ${bottomRightY} ${bottomRightX - clampedBorderRadius} ${bottomRightY}
    L ${bottomLeftX + clampedBorderRadius} ${bottomLeftY}
    Q ${bottomLeftX} ${bottomLeftY} ${bottomLeftX} ${bottomLeftY - clampedBorderRadius}
    L ${topLeftX} ${topLeftY + clampedBorderRadius}
    Q ${topLeftX} ${topLeftY} ${topLeftX + clampedBorderRadius} ${topLeftY}
    Z
  `.replace(/\s+/g, " "); // Remove extra spaces for a single-line path

  return clipPath;
}

export function getFullScreenPath(
  windowDimensions: WindowDimensions,
  borderRadius = 0,
) {
  const halfSideLength = windowDimensions.width / 2;

  // Ensure the borderRadius doesn't exceed half the side length
  const clampedBorderRadius = Math.min(borderRadius, halfSideLength);

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
    M ${topLeftX + clampedBorderRadius} ${topLeftY}
    L ${topRightX - clampedBorderRadius} ${topRightY}
    Q ${topRightX} ${topRightY} ${topRightX} ${topRightY + clampedBorderRadius}
    L ${bottomRightX} ${bottomRightY - clampedBorderRadius}
    Q ${bottomRightX} ${bottomRightY} ${bottomRightX - clampedBorderRadius} ${bottomRightY}
    L ${bottomLeftX + clampedBorderRadius} ${bottomLeftY}
    Q ${bottomLeftX} ${bottomLeftY} ${bottomLeftX} ${bottomLeftY - clampedBorderRadius}
    L ${topLeftX} ${topLeftY + clampedBorderRadius}
    Q ${topLeftX} ${topLeftY} ${topLeftX + clampedBorderRadius} ${topLeftY}
    Z
  `.replace(/\s+/g, " "); // Remove extra spaces for a single-line path

  return clipPath;
}

export function getFirstTransformedHeroClipPath(
  windowDimensions: WindowDimensions,
  borderRadius = 8,
) {
  const halfSideLength = windowDimensions.width / 2;

  // Ensure the borderRadius doesn't exceed half the side length
  const clampedBorderRadius = Math.min(borderRadius, halfSideLength);

  // Clip path points
  const topLeftX = windowDimensions.width * 0.14;
  const topLeftY = 0;

  const topRightX = windowDimensions.width * 0.72;
  const topRightY = topLeftY;

  const bottomRightX = windowDimensions.width * 0.9;
  const bottomRightY = windowDimensions.height * 0.9;

  const bottomLeftX = -20;
  const bottomLeftY = windowDimensions.height * 0.95;

  const clipPath = `
    M ${topLeftX + clampedBorderRadius} ${topLeftY}
    L ${topRightX - clampedBorderRadius} ${topRightY}
    Q ${topRightX} ${topRightY} ${topRightX} ${topRightY + clampedBorderRadius}
    L ${bottomRightX} ${bottomRightY - clampedBorderRadius}
    Q ${bottomRightX} ${bottomRightY} ${bottomRightX - clampedBorderRadius} ${bottomRightY}
    L ${bottomLeftX + clampedBorderRadius} ${bottomLeftY}
    Q ${bottomLeftX} ${bottomLeftY} ${bottomLeftX} ${bottomLeftY - clampedBorderRadius}
    L ${topLeftX} ${topLeftY + clampedBorderRadius}
    Q ${topLeftX} ${topLeftY} ${topLeftX + clampedBorderRadius} ${topLeftY}
    Z
  `.replace(/\s+/g, " "); // Remove extra spaces for a single-line path

  return clipPath;
}

export function getSecondTransformedHeroClipPath(
  windowDimensions: WindowDimensions,
  borderRadius = 8,
) {
  const halfSideLength = windowDimensions.width / 2;

  // Ensure the borderRadius doesn't exceed half the side length
  const clampedBorderRadius = Math.min(borderRadius, halfSideLength);

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
    M ${topLeftX + clampedBorderRadius} ${topLeftY}
    L ${topRightX - clampedBorderRadius} ${topRightY}
    Q ${topRightX} ${topRightY} ${topRightX} ${topRightY + clampedBorderRadius}
    L ${bottomRightX} ${bottomRightY - clampedBorderRadius}
    Q ${bottomRightX} ${bottomRightY} ${bottomRightX - clampedBorderRadius} ${bottomRightY}
    L ${bottomLeftX + clampedBorderRadius} ${bottomLeftY}
    Q ${bottomLeftX} ${bottomLeftY} ${bottomLeftX} ${bottomLeftY - clampedBorderRadius}
    L ${topLeftX} ${topLeftY + clampedBorderRadius}
    Q ${topLeftX} ${topLeftY} ${topLeftX + clampedBorderRadius} ${topLeftY}
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
    distanceFromCurrent < totalVideos;
    distanceFromCurrent++
  ) {
    hiddenVideoNumbers.push(
      (currentVideoNumber - distanceFromCurrent + totalVideos) % totalVideos,
    );
  }

  return hiddenVideoNumbers;
}
