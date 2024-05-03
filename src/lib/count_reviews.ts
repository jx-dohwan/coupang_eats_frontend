import { Review } from "./calculate_average_score";

/**
 * Returns the number of reviews in the given array.
 * @param reviews Array of review objects.
 * @returns The count of reviews.
 */
export const countReviews = (reviews: Review[]): number => {
    return reviews.length;
}
