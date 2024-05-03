import { gql, useQuery } from "@apollo/client";
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import { useParams } from "react-router-dom";
import { RestaurantQuery, RestaurantQueryVariables } from "../../__api__/graphql";
import { useEffect, useState } from "react";
import { StarRating } from "../../components/star_rating";


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
            const reviews = data.restaurant.restaurant.reviews;
            const totalScore = reviews.reduce((acc, review) => acc + review.score, 0);
            const average = reviews.length > 0 ? totalScore / reviews.length : 0;
            setAverageScore(average);
            setReviewCount(reviews.length);
        }
    }, [data]);
    return (
        <>
            <div className="relative grid place-items-center p-4 text-lg font-bold">
                <div className="absolute left-4 top-0 flex h-full items-center">
                    {/* <BackButton href={`/store/${storeId}`} /> */}
                </div>
                <div>{data?.restaurant.restaurant?.name} 리뷰</div>
                <div className="flex p-4">
                    <h1 className="pr-4 text-3xl font-bold">
                        리뷰 평균
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
   
        </>
    )
}