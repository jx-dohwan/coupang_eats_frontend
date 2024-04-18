import { gql, useQuery } from "@apollo/client";
import { DISH_FRAGMENT, ORDERS_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import { useNavigate, useParams } from "react-router-dom";
import { MyRestaurantQuery, MyRestaurantQueryVariables } from "../../__api__/graphql";
import { useMe } from "../../hooks/useMe";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
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

interface IParams {
    id: string;
}

export const MyRestaurant : React.FC<IParams> = ({ id }) => {

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

    const { data: userData } = useMe()

    const navigate = useNavigate();


    return (
        <div>
            <Helmet>
                <title>
                    {data?.myRestaurant.restaurant?.name || "Loading..."} | Coupang Eats
                </title>
            </Helmet>
            <div className="checkout-container"></div>
            <div
                className="  bg-gray-700  py-28 bg-center bg-cover"
                style={{
                    backgroundImage: `url(${data?.myRestaurant.restaurant?.coverImg})`,
                }}

            >
            </div>

            <div className="container mt-10">
                <h2 className="text-4xl font-medium mb-10">
                    {data?.myRestaurant.restaurant?.name || "Loading..."}
                </h2>
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
                            {/* 여기에 dish 추가 */}
                        </div>
                    )}
                </div>
                {/* 여기에 매출현황 추가 */}

            </div>

        </div>
    );
};