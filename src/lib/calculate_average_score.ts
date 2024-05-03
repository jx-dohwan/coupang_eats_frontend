// calculateAverageScore.ts
export interface Review {
    score: number;
}

/**
 * Calculates the average score from an array of reviews.
 * @param reviews Array of review objects with a 'score' property.
 * @returns Average score, returns 0 if no reviews are available.
 */
export const calculateAverageScore = (reviews: Review[]): number => {
    const totalScore = reviews.reduce((acc, review) => acc + review.score, 0);
    return reviews.length > 0 ? totalScore / reviews.length : 0;
}
