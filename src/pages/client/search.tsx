import { gql, useLazyQuery } from "@apollo/client";
import { RESTAURANT_FRAGMENT } from "../../fragments";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SearchRestaurantQuery, SearchRestaurantQueryVariables } from "../../__api__/graphql";
import { Helmet } from "react-helmet";
import { Restaurant } from "./restaurant";

const SEARCH_RESTAURANT = gql`
  query searchRestaurant($input: SearchRestaurantInput!) {
    searchRestaurant(input: $input) {
      ok
      error
      totalPages
      totalResults
      restaurants {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

export const Search = () => {
    const [page, setPage] = useState(1);
    const location = useLocation();
    const navigate = useNavigate();

    const [callQuery, { loading, data, called }] = useLazyQuery<
        SearchRestaurantQuery, SearchRestaurantQueryVariables
    >(SEARCH_RESTAURANT);

    console.log(data)
    const onNextPageClick = () => setPage((current) => current + 1);
    const onPrevPageClick = () => setPage((current) => current - 1);

    useEffect(() => {
        const [, encodedQuery] = location.search.split("?term=");
        const query = decodeURIComponent(encodedQuery || ''); // 인코딩된 query 디코딩
        console.log('query : ', query)
        if (!query) {
            return navigate('/', { replace: true }) // true를 쓰면 이동할 주소로 이동한후 뒤로가기가 안됨, 뒤로가기를 누르면 메인페이지("/")로 돌아가게된다.
        }
        callQuery({
            variables: {
                input: {
                    page: 1,
                    query,
                },
            },
        });
    }, [navigate, location]);

    return (
        <div>
            <Helmet>
                <title>검색 | Coupang Eats</title>
            </Helmet>
            {!loading && (
                <div className="max-w-screen-2xl pb-20 mx-auto mt-8">
                    <div className="mx-5 mt-16 grid md:grid-cols-3 gap-x-5 gap-y-10">
                        {data?.searchRestaurant.restaurants?.length !== 0 ? (
                            data?.searchRestaurant.restaurants?.map((restaurant) => (
                                <Restaurant
                                    key={restaurant.id}
                                    id={restaurant.id + ""}
                                    coverImg={restaurant.coverImg}
                                    name={restaurant.name}
                                    categoryName={restaurant.category?.name}
                                />
                            ))
                        ) : (
                            <div className="font-medium">해당 매장은 존재하지 않습니다.</div>
                        )}
                    </div>
                    <div className="grid grid-cols-3 text-center max-w-md items-center mx-auto mt-10">
                        {page > 1 ? (
                            <button
                                onClick={onPrevPageClick}
                                className="focus:outline-none font-medium text-2xl"
                            >
                                &larr;
                            </button>
                        ) : (
                            <div></div>
                        )}
                        <span>
                            Page {page} of {data?.searchRestaurant.totalPages}
                        </span>
                        {page !== data?.searchRestaurant.totalPages ? (
                            <button
                                onClick={onNextPageClick}
                                className="focus:outline-none font-medium text-2xl"
                            >
                                &rarr;
                            </button>
                        ) : (
                            <div></div>
                        )}
                    </div>

                </div>
            )}
        </div>
    )

}