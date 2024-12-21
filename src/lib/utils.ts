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
  borderRadius = 8,
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

// export function getNextVideoClipPath(
//   hitAreaWidth: number,
//   windowDimensions: WindowDimensions,
//   borderRadius = 8,
//   cursorPosition: { x: number; y: number }, // x and y range from -1 to 1
// ) {
//   // Clip path center
//   const centerX = windowDimensions.width / 2;
//   const centerY = windowDimensions.height / 2;

//   // Clip path lengths
//   const halfSideLength = hitAreaWidth / 2;

//   // Ensure the borderRadius doesn't exceed half the side length
//   const clampedRadius = Math.min(borderRadius, halfSideLength);

//   // Cursor influence factors
//   const influenceX = cursorPosition.x * halfSideLength * 0.5;
//   const influenceY = cursorPosition.y * halfSideLength * 0.5;

//   // Adjusted corner points based on tilt
//   const topLeftX = centerX - halfSideLength + influenceX;
//   const topLeftY = centerY - halfSideLength + influenceY;

//   const topRightX = centerX + halfSideLength + influenceX;
//   const topRightY = centerY - halfSideLength + influenceY;

//   const bottomRightX = centerX + halfSideLength + influenceX;
//   const bottomRightY = centerY + halfSideLength + influenceY;

//   const bottomLeftX = centerX - halfSideLength + influenceX;
//   const bottomLeftY = centerY + halfSideLength + influenceY;

//   // Generate the clip path
//   const clipPath = `
//     M ${topLeftX + clampedRadius} ${topLeftY}
//     L ${topRightX - clampedRadius} ${topRightY}
//     Q ${topRightX} ${topRightY} ${topRightX} ${topRightY + clampedRadius}
//     L ${bottomRightX} ${bottomRightY - clampedRadius}
//     Q ${bottomRightX} ${bottomRightY} ${bottomRightX - clampedRadius} ${bottomRightY}
//     L ${bottomLeftX + clampedRadius} ${bottomLeftY}
//     Q ${bottomLeftX} ${bottomLeftY} ${bottomLeftX} ${bottomLeftY - clampedRadius}
//     L ${topLeftX} ${topLeftY + clampedRadius}
//     Q ${topLeftX} ${topLeftY} ${topLeftX + clampedRadius} ${topLeftY}
//     Z
//   `.replace(/\s+/g, " "); // Remove extra spaces for a single-line path

//   return clipPath;
// }

export function getAboutImageClipPath(
  windowDimensions: WindowDimensions,
  borderRadius = 8,
) {
  // Clip path center
  const centerX = windowDimensions.width / 2;
  const centerY = windowDimensions.height / 2;

  // Set maximum dimensions for the clip path
  const imageHeight = windowDimensions.height * 0.6;
  const imageWidth = imageHeight * 0.67;

  // Half side lengths for width and height
  const halfHeight = imageHeight / 2;
  const halfWidth = imageWidth / 2;

  // Ensure the borderRadius doesn't exceed the minimum of halfWidth and halfHeight
  const clampedRadius = Math.min(borderRadius, halfWidth, halfHeight);

  // Corner points adjusted for the border radius
  const topLeftX = centerX - halfWidth - 10;
  const topLeftY = centerY - halfHeight + 52;

  const topRightX = centerX + halfWidth - 50;
  const topRightY = topLeftY + 50;

  const bottomRightX = topRightX + 50;
  const bottomRightY = centerY + halfHeight + 52 - 50;

  const bottomLeftX = topLeftX + 20;
  const bottomLeftY = bottomRightY + 50;

  // Create the SVG path string
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

// export function getAboutImageClipPath(
//   windowDimensions: WindowDimensions,
//   borderRadius = 8,
// ) {
//   // Clip path center
//   const centerX = windowDimensions.width / 2;
//   const centerY = windowDimensions.height / 2;

//   // Set maximum dimensions for the clip path
//   const imageHeight = windowDimensions.height * 0.4;
//   const imageWidth = imageHeight * 0.67;

//   // Half side lengths for width and height
//   const halfHeight = imageHeight / 2;
//   const halfWidth = imageWidth / 2;

//   // Ensure the borderRadius doesn't exceed the minimum of halfWidth and halfHeight
//   const clampedRadius = Math.min(borderRadius, halfWidth, halfHeight);

//   // Corner points adjusted for the border radius
//   const topLeftX = centerX - halfWidth;
//   const topLeftY = centerY - halfHeight + 52;

//   const topRightX = centerX + halfWidth;
//   const topRightY = topLeftY;

//   const bottomRightX = topRightX;
//   const bottomRightY = centerY + halfHeight + 52;

//   const bottomLeftX = topLeftX;
//   const bottomLeftY = bottomRightY;

//   // Create the SVG path string
//   const clipPath = `
//     M ${topLeftX + clampedRadius} ${topLeftY}
//     L ${topRightX - clampedRadius} ${topRightY}
//     Q ${topRightX} ${topRightY} ${topRightX} ${topRightY + clampedRadius}
//     L ${bottomRightX} ${bottomRightY - clampedRadius}
//     Q ${bottomRightX} ${bottomRightY} ${bottomRightX - clampedRadius} ${bottomRightY}
//     L ${bottomLeftX + clampedRadius} ${bottomLeftY}
//     Q ${bottomLeftX} ${bottomLeftY} ${bottomLeftX} ${bottomLeftY - clampedRadius}
//     L ${topLeftX} ${topLeftY + clampedRadius}
//     Q ${topLeftX} ${topLeftY} ${topLeftX + clampedRadius} ${topLeftY}
//     Z
//   `.replace(/\s+/g, " "); // Remove extra spaces for a single-line path

//   return clipPath;
// }

export function getFullScreenClipPath(
  windowDimensions: WindowDimensions,
  borderRadius = 0,
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
