import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import { RestaurantsPageQuery, RestaurantsPageQueryVariables } from "../../__api__/graphql";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

const RESTAURANTS_QUERY = gql`
  query restaurantsPage($input: RestaurantsInput!) {
    allCategories {
      ok
      error
      categories {
        ...CategoryParts
      }
    }
    restaurants(input: $input) {
      ok
      error
      totalPages
      totalResults
      results {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${CATEGORY_FRAGMENT}
`;



interface IFormProps {
    searchTerm: string;
}


export const Restaurants = () => {
    const [page, setPage] = useState(1);
    const { data, loading } = useQuery<
        RestaurantsPageQuery,
        RestaurantsPageQueryVariables
    >(RESTAURANTS_QUERY, {
        variables: {
            input: {
                page,
            },
        },
    });

    console.log("data : ", data)
    const onNextPageClick = () => setPage((current) => current + 1);
    const onPrevPageClick = () => setPage((current) => current - 1);
    const { register, handleSubmit, getValues } = useForm<IFormProps>();

    const navigate = useNavigate();
    const onSearchSubmit = () => {
        // console.log(getValues());
        const searchTerm = getValues().searchTerm;
        navigate({
            pathname: "/search",
            search: `?term=${searchTerm}`,
        });
    };
    const getGridCol = (col: number) => {
        if (col in Object.keys(gridColMap)) return gridColMap[col]
        return gridColMap[4]
    }

    const gridColMap: Record<number, string> = {
        1: 'grid-cols-1',
        2: 'grid-cols-2',
        3: 'grid-cols-3',
        4: 'grid-cols-4',
        5: 'grid-cols-5',
        6: 'grid-cols-6',
        7: 'grid-cols-7',
        8: 'grid-cols-8',
        9: 'grid-cols-9',
        10: 'grid-cols-10',
        11: 'grid-cols-11',
        12: 'grid-cols-12',
    }
    const categoriesCount = data?.allCategories.categories?.length ?? 0;
    const roundedUp = Math.ceil(categoriesCount / 2);

    return (
        <div>
            <Helmet>
                <title>Home | Coupang Eats</title>
            </Helmet>
            <form
                onSubmit={handleSubmit(onSearchSubmit)}
                className="w-full md:py-20 py-10 flex items-center justify-center"
            >
                <div
                    className="flex items-center justify-stretch rounded-full border border-b-4 border-gray-300 p-2  w-3/4 md:w-3/4">
                  
                    {/* 여기 input을 누를때 가로 테두리를 없애야 할것 같은데 일단 넘어가자*/}
                    <input
                        {...register("searchTerm", { required: true, minLength: 1 })}
                        type="Search"
                        className="ml-4 w-11/12 md:w-11/12 focus:outline-none py-1"
                        placeholder="음식점을 검색해보세요..."
                    />
                </div>
            </form>
            {!loading && (
                <div className="max-w-screen-2xl pb-20 mx-auto mt-8">
                    <div className={`md:flex md:justify-center md:items-center md:gap-6 md:px-8 md:max-w-sm md:mx-auto grid ${getGridCol(roundedUp)} gap-2 p-4`}>
                        {data?.allCategories.categories?.map((category) => (
                            <Link key={category.id} to={`/category/${category.slug}`}>
                                <div className="flex flex-col group items-center cursor-pointer">
                                    <div
                                        className=" w-16 h-16 bg-cover group-hover:bg-gray-100 rounded-full"
                                        style={{ backgroundImage: `url(${category.coverImg})` }}
                                    ></div>
                                    <span className="mt-1 text-sm text-center font-medium">
                                        {category.name}
                                    </span>
                                </div>
                            </Link>
                        ))}

                    </div>
                    <div className="bg-gray-50 h-4 my-6 border"></div>
                    <div className="grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
                      
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
                            Page {page} of {data?.restaurants.totalPages}
                        </span>
                        {page !== data?.restaurants.totalPages ? (
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
}