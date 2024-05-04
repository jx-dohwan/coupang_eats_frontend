import { gql, useQuery } from "@apollo/client";
import { DISH_FRAGMENT, ORDERS_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import { useNavigate, useParams } from "react-router-dom";
import { MyRestaurantQuery, MyRestaurantQueryVariables } from "../../__api__/graphql";
import { useMe } from "../../hooks/useMe";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { Dish } from "../../components/dish";
import { StarsAndReviews } from "../../components/stars_and_reviews";
import { useEffect, useState } from "react";
import { calculateAverageScore } from "../../lib/calculate_average_score";
import { countReviews } from "../../lib/count_reviews";
import { BiChevronRight } from "react-icons/bi";
export const MY_RESTAURANT_QUERY = gql`
  query myRestaurant($input: MyRestaurantInput!) {
    myRestaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantParts
        menu {
          ...DishParts
        }
        orders {
          ...OrderParts
        }
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${DISH_FRAGMENT}
  ${ORDERS_FRAGMENT}
`;

type IParams = {
    id: string;
}

export const MyRestaurant = () => {
    const { id } = useParams() as unknown as IParams;
    const { data } = useQuery<MyRestaurantQuery, MyRestaurantQueryVariables>(
        MY_RESTAURANT_QUERY,
        {
            variables: {
                input: {
                    id: +id
                },
            },
        }
    );
    console.log('data', data)

    const { data: userData } = useMe()

    const navigate = useNavigate();

    const [averageScore, setAverageScore] = useState<number>(0);
    const [reviewCount, setReviewCount] = useState<number>(0);
  
  
    useEffect(() => {
      if (data && data.myRestaurant && data.myRestaurant.restaurant && data.myRestaurant.restaurant.reviews) {
        const averageScore = calculateAverageScore(data.myRestaurant.restaurant.reviews);
        const reviewCount = countReviews(data.myRestaurant.restaurant.reviews)
        setAverageScore(averageScore);
        setReviewCount(reviewCount);
      }
    }, [data]);

    return (
        <div>
            <Helmet>
                <title>
                    {data?.myRestaurant.restaurant?.name || "Loading..."} | Coupang Eats
                </title>
            </Helmet>
            <div className="relative pb-16">

                <div
                    className="bg-gray-800 bg-center bg-cover py-48"
                    style={{
                        backgroundImage: `url(${data?.myRestaurant.restaurant?.coverImg})`,
                    }}
                >
                    <div className="absolute bottom-0 flex w-full justify-center">
                        <div className="z-50 grid gap-2 border border-gray-300 bg-white md:px-30 px-10 py-5 shadow-md">
                            <h1 className="text-4xl py-5 px-10">
                                {data?.myRestaurant.restaurant?.name || "Loading..."}
                            </h1>
                            <Link
                                to={`/reviews/${id}`}
                                className="flex items-center justify-center text-sm"
                            >
                                <StarsAndReviews
                                    rating={averageScore}
                                    reviewCount={reviewCount}
                                />
                                <BiChevronRight className="text-xl"/>
                            </Link>
                        </div>

                    </div>

                </div>
            </div>
    
            <div className="container mt-10">
            
                <div className="flex md:flex-row flex-col items-center w-full">
                    <Link
                        to={`/restaurants/${id}/add-dish`}
                        className="text-center w-8/10 text-white bg-sky-500 hover:bg-sky-600 py-3 px-10 mb-4 md:mb-0 md:mr-8 mr-0 w-full md:w-auto"
                    >
                        음식 추가
                    </Link>
                    {/* 여기에 프로모션 구매 추가 */}
                </div>

                <div className="mt-10">
                    {data?.myRestaurant.restaurant?.menu.length === 0 ? (
                        <h4 className="text-xl mb-5">음식을 추가해주세요.</h4>
                    ) : (
                        <div className="grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
                            {data?.myRestaurant.restaurant?.menu.map((dish, index) => (
                                <Dish
                                    key={index}
                                    name={dish.name}
                                    description={dish.description}
                                    price={dish.price}
                                    isCustomer={true}
                                    options={dish.options}
                                />
                            ))}
                        </div>
                    )}
                </div>
                {/* 여기에 매출현황 추가 */}
            </div>
        </div>
    );
};