import { gql, useQuery } from "@apollo/client";
import { RESTAURANT_FRAGMENT } from "../../fragments";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { MyRestaurantsQuery } from "../../__api__/graphql";

export const MY_RESTAURANTS_QUERY = gql`
  query myRestaurants {
    myRestaurants {
      ok
      error
      restaurants {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

export const MyRestaurants = () => {
    const { data } = useQuery<MyRestaurantsQuery>(MY_RESTAURANTS_QUERY);

    return (
        <div>
            <Helmet>
                <title>나의 매장 | Coupang Eats</title>
            </Helmet>
            <div className="max-w-screen-2xl mx-auto mt-32">
                <h2 className="text-4xl font-medium mb-10">나의 매장</h2>
                {data?.myRestaurants.ok && data.myRestaurants.restaurants.length === 0 ? (
                    <>
                        <h4 className="text-xl mb-5">당신의 매장이 없습니다.</h4>
                        <Link
                            className="text-sky-500 hover:underline"
                            to="/add-restaurant"
                        >
                            매장 만들기 &rarr;
                        </Link>
                    </>
                ) : (
                    <div className="grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">

                    </div>
                )}
            </div>
        </div>
    );
};