/**
 * Calculates the quadratic funding match amount for a project
 *
 * @param contributions Array of individual contribution amounts
 * @returns The match amount according to the quadratic funding formula
 */
export function calculateQuadraticMatch(contributions: number[]): number {
  // Sum of square roots of contributions
  const sumOfSquareRoots = contributions.reduce((sum, contribution) => {
    return sum + Math.sqrt(contribution)
  }, 0)

  // Square of the sum of square roots
  const squareOfSumOfSquareRoots = Math.pow(sumOfSquareRoots, 2)

  // Sum of contributions
  const sumOfContributions = contributions.reduce((sum, contribution) => {
    return sum + contribution
  }, 0)

  // Match amount = (Sum of square roots)^2 - Sum of contributions
  const matchAmount = squareOfSumOfSquareRoots - sumOfContributions

  return matchAmount
}

/**
 * Distributes a matching pool among projects according to the quadratic funding formula
 *
 * @param projects Array of projects with their contributions
 * @param matchingPool Total amount in the matching pool
 * @returns Array of projects with their match amounts
 */
export function distributeMatchingPool(
  projects: { id: string; contributions: number[] }[],
  matchingPool: number,
): { id: string; matchAmount: number }[] {
  // Calculate the raw match amount for each project
  const projectsWithRawMatch = projects.map((project) => {
    return {
      id: project.id,
      rawMatchAmount: calculateQuadraticMatch(project.contributions),
    }
  })

  // Sum of all raw match amounts
  const totalRawMatchAmount = projectsWithRawMatch.reduce((sum, project) => {
    return sum + project.rawMatchAmount
  }, 0)

  // Scale the raw match amounts to fit within the matching pool
  const scaleFactor = matchingPool / totalRawMatchAmount

  // Calculate the final match amount for each project
  return projectsWithRawMatch.map((project) => {
    return {
      id: project.id,
      matchAmount: project.rawMatchAmount * scaleFactor,
    }
  })
}

