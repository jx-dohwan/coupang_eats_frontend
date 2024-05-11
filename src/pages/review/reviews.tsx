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
                <div className="relative grid place-items-center p-4 text-lg font-bold">
                    <div>{data?.restaurant.restaurant?.name} 리뷰</div>
                    <div className="flex p-4">
                        <h1 className="pr-4 text-3xl font-bold">
                            {Number(averageScore).toFixed(1)}
                        </h1>
                        <div>
                            <div className="text-lg text-yellow-400">
                                <StarRating rating={averageScore} />
                            </div>
                            <div>
                                리뷰 <span className="font-bold">{reviewCount}</span>개
                            </div>
                        </div>
                    </div>
                </div>
                {data?.restaurant.restaurant?.reviews ? (
                    data.restaurant.restaurant.reviews.map((review) => (
                        <div className="p-4">
                            <div className="border-b border-b-gray-200 pb-4">
                                <div className="flex flex-col">
                                    <div className="text-yellow-400">
                                        <StarRating rating={review.score} />
                                    </div>
                                    {review.reviewImg && review.reviewImg.map((img) => (
                                        <div className="md:h-85">
                                            <img src={img.url} alt="Review Image" key={img.url} className="mb-2" />
                                        </div>
                                    ))}
                                    {review.reviewText && <p>{review.reviewText}</p>}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <>
                        <p>리뷰가 존재하지 않습니다.</p>
                    </>
                )}

                {/* 여기에 map으로 해서 돌려야함 */}
            </div>
        </>
    )
}