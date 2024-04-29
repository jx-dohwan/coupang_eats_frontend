import { gql, useQuery } from "@apollo/client";
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CategoryQuery, CategoryQueryVariables } from "../../__api__/graphql";
import { Helmet } from "react-helmet";
import { RestaurantView } from "../../components/restaurant_view";
const CATEGORY_QUERY = gql`
  query category($input: CategoryInput!) {
    category(input: $input) {
      ok
      error
      totalPages
      totalResults
      restaurants {
        ...RestaurantParts
      }
      category {
        ...CategoryParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${CATEGORY_FRAGMENT}
`;

export const Category = () => {
    const [page, setPage] = useState(1);
    const params = useParams<{ slug: string }>();
 
    const { data, loading } = useQuery<CategoryQuery, CategoryQueryVariables>(
        CATEGORY_QUERY,
        {
            variables: {
                input: {
                    page: 1,
                    slug: params.slug + "", //이 표현식은 params.slug의 값이 undefined일 경우에도 문자열 타입으로 강제 변환을 시도하기 때문에, 결국 undefined가 "undefined"라는 문자열로 변환됩니다.
                },
            },
        }
    );

    const onNextPageClick = () => setPage((current) => current + 1);
    const onPrevPageClick = () => setPage((current) => current - 1);

    return (
        <div>
            <Helmet>
                <title>카테고리 | Coupang Eats</title>
            </Helmet>
            {!loading && (
                <div className="max-w-screen-2xl pb-20 mx-auto mt-8">
                    <div className="grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
                        {data?.category.restaurants?.map((restaurant) => (
                            <RestaurantView
                                key={restaurant.id}
                                id={restaurant.id + ""}
                                coverImg={restaurant.coverImg}
                                name={restaurant.name}
                                categoryName={restaurant.category?.name}
                            />
                        ))}
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
                            Page {page} of {data?.category.totalPages}
                        </span>
                        {page !== data?.category.totalPages ? (
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
    );
};