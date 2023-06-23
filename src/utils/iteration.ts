/**
 * Generates a random iteration number within a specified range.
 *
 * @param {number} maxIterations - The maximum possible iteration number.
 * @param {number} remainingIterations - The number of iterations remaining. Default is maxIterations.
 *
 * @returns {number} - A random number between the (maxIterations - offset + 1) and maxIterations (inclusive).
 * This is used to represent a potential 'next' iteration number, given there are 'offset' number of iterations left.
 */
export const getRandomIteration = (
  maxIterations: number,
  remainingIterations = maxIterations
) =>
  Math.floor(Math.random() * remainingIterations) +
  (maxIterations - remainingIterations + 1)
