import { gql, useQuery } from "@apollo/client";
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import { useParams } from "react-router-dom";
import { RestaurantQuery, RestaurantQueryVariables } from "../../__api__/graphql";
import { Helmet } from "react-helmet";
import { StarsAndReviews } from "../../components/stars_and_reviews";
import { Fragment } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import { BiCartAdd } from 'react-icons/bi'
import { useEffect } from "react";
import KRW from "../../components/currency_formatter";
import { MenuList } from "../../components/menu_list";

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


export const Restaurant = () => {
  const { id } = useParams() as unknown as TRestaurantParams;
  // 사용 가능한 ID는 props의 ID 또는 URL 파라미터에서 추출한 ID

  const { loading, data } = useQuery<RestaurantQuery, RestaurantQueryVariables>(
    RESTAURANT_QUERY, {
    variables: {
      input: {
        restaurantId: +id,  // 숫자형 ID가 필요하다면 변환
      },
    },
  }
  );

  useEffect(() => {
    console.log("data", data)
    console.log("menu", data?.restaurant.restaurant?.menu)
  }, [data])
  return (
    <div>
      <Helmet>
        <title>
          {data?.restaurant.restaurant?.name || ""} | Coupang Eats
        </title>
      </Helmet>

      <div className="relative pb-16">
        <div
          className=" bg-gray-800 bg-center bg-cover py-48"
          style={{
            backgroundImage: `url(${data?.restaurant.restaurant?.coverImg})`,
          }}
        >
          <div className="absolute bottom-0 flex w-full justify-center">

            <div className="z-50 grid gap-2 border border-gray-300 bg-white md:px-30 px-10 py-5 shadow-md">
              <h1 className="text-4xl py-5 px-10">{data?.restaurant.restaurant?.name}</h1>
              <div className="flex items-center justify-center text-sm">
                <StarsAndReviews
                  // 여기에 실제 Review데이터 가져와야함
                  rating={4}
                  reviewCount={50}
                />
              </div>
            </div>

          </div>
        </div>
      </div>
      <div className="flex md:justify-center">

        <div className="grid grid-cols-4 gap-2 px-4 py-4 ml-5 text-gray-700 md:w-7/12 ">
          <div>배달비</div>
          <div className="col-span-3">3500</div>
          <div>최소주문</div>
          <div className="col-span-3">10000</div>
        </div>

      </div>
      <div className="py-2 whitespace-nowrap px-4">
        <div className="border-b border-b-blue-500 font-bold text-blue-500">
          <div className="grid gap-4">

          </div>
        </div>
      </div>

      <div className="grid gap-4 px-4">
        <div className="grid gap-4">
          {data?.restaurant.restaurant?.menu.map((menu) => (
            <MenuList
              key={menu.id}
              id={menu.id}
              name={menu.name}
              price={menu.price}
              description={menu.description}
            />
          ))}

        </div>
      </div>

    </div>
  );
};


