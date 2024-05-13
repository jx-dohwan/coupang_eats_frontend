import { gql, useQuery } from "@apollo/client";
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import { useParams } from "react-router-dom";
import { RestaurantQuery, RestaurantQueryVariables } from "../../__api__/graphql";
import { useEffect, useState } from "react";
import { StarRating } from "../../components/star_rating";
import { calculateAverageScore } from "../../lib/calculate_average_score";
import { countReviews } from "../../lib/count_reviews";


const RESTAURANT_QUERY = gql`
  query restaurant($input: RestaurantInput!) {
    restaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantParts
        menu {
          ...DishParts
        }
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${DISH_FRAGMENT}
`;

type TRestaurantParams = {
    id: string;
};

export const Reviews = () => {
    const { id } = useParams() as unknown as TRestaurantParams;

    const { loading, data } = useQuery<RestaurantQuery, RestaurantQueryVariables>(
        RESTAURANT_QUERY, {
        variables: {
            input: {
                restaurantId: +id,  // 숫자형 ID가 필요하다면 변환
            },
        },
    }
    );
    const [averageScore, setAverageScore] = useState<number>(0);
    const [reviewCount, setReviewCount] = useState<number>(0);
    console.log("reviews data",)
    useEffect(() => {
        if (data && data.restaurant && data.restaurant.restaurant && data.restaurant.restaurant.reviews) {
            const averageScore = calculateAverageScore(data.restaurant.restaurant.reviews);
            const reviewCount = countReviews(data.restaurant.restaurant.reviews)
            setAverageScore(averageScore);
            setReviewCount(reviewCount);
        }
    }, [data]);

    return (
        <>
            <div className="w-full md:py-20 py-10 flex flex-col items-center justify-center">
                <div className="w-full md:py-20 py-10 flex flex-col items-center justify-center">
                    <div className="relative w-full max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
                        <div className="text-center text-lg font-bold mb-4">
                            {data?.restaurant.restaurant?.name} 리뷰
                        </div>
                        <div className="flex justify-center items-center">
                            <div className="flex items-center mr-4">
                                <h1 className="text-3xl font-bold text-gray-800">
                                    {Number(averageScore).toFixed(1)}
                                </h1>
                                <div className="ml-4 text-yellow-500">
                                    <StarRating rating={averageScore} />
                                </div>
                            </div>
                            <div className="text-gray-600">
                                리뷰 <span className="font-bold">{reviewCount}</span>개
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full md:py-20 py-10 flex flex-col items-center justify-center">
                    {data?.restaurant.restaurant?.reviews ? (
                        data.restaurant.restaurant.reviews.map((review) => (
                            <div className="p-4 w-full max-w-7xl mx-auto">
                                <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-5">
                                    <div className="md:flex">
                                        {review.reviewImg && review.reviewImg.map((img) => (
                                            <div className="md:w-1/2">
                                                <img src={img.url} alt="Review Image" key={img.url} className="object-cover w-full h-full" />
                                            </div>
                                        ))}
                                        <div className="p-6">
                                            <div className="text-yellow-500 text-sm font-medium flex items-center mb-1">
                                                <StarRating rating={review.score} />
                                            </div>
                                            <p className="text-gray-700 text-base mb-4">
                                                {review.reviewText}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-600">리뷰가 존재하지 않습니다.</p>
                    )}
                </div>

            </div>


        </>
    )
}