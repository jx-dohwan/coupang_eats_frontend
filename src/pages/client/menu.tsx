import { gql, useQuery } from '@apollo/client';
import { CiCircleMinus, CiCirclePlus } from 'react-icons/ci'
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from '../../fragments';
import { RestaurantQuery, RestaurantQueryVariables } from '../../__api__/graphql';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import KRW from '../../components/currency_formatter';

// 백엔드에 해당 코드를 구행할  코드를 추가해야한다. 아니면 컴포넌트로 넘기던가 dish처럼 그게 나을듯 
// 
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

type TMenuParams = {
    restaurantId: string;
    menuId: string;
};

export const Menu = () => {
    const { restaurantId, menuId } = useParams() as unknown as TMenuParams;
    const [foundMenu, setFoundMenu] = useState<any>(null);
    const { loading, data } = useQuery<RestaurantQuery, RestaurantQueryVariables>(

        RESTAURANT_QUERY, {
        variables: {
            input: {
                restaurantId: +restaurantId,  // 숫자형 ID가 필요하다면 변환
            },
        },
    }
    );


    const menu = data?.restaurant?.restaurant?.menu.find((m) => m.id === parseInt(menuId, 10));
    console.log('menu다 : ', menu)
    return (
        <>
            <div>
                <Helmet>
                    <title>
                        {data?.restaurant.restaurant?.name || ""} | Coupang Eats
                    </title>
                </Helmet>

                <div className="border-b border-b-gray-100 p-4 pb-8">
                    <h1 className="text-2xl font-bold">{menu?.name}</h1>
                    {/* {description && <p className="text-sm text-gray-700">설명</p>} */}
                </div>
                <div className="pb-20">
                    <div className="p-4">
                        <div className="flex justify-between pb-4">
                            <div className="flex items-center">
                                <p className="text-lg font-semibold">가격</p>
                            </div>
                            <div className="flex items-center">
                                <p className="text-lg">  <KRW price={menu?.price} /></p>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <div className="flex items-center">
                                <p className="text-lg font-semibold">수량</p> {/*수량 올리면 extra도 자동으로 올라가고, 해당 추가 옵션이 선택되어야 함*/}
                            </div>
                            <div className="flex items-center gap-2">
                                <CiCircleMinus
                                    className="text-4xl text-gray-400"
                                //   onClick={decrementCount}
                                />
                                <p className="text-lg">주문 수량</p>
                                <CiCirclePlus
                                    className="text-4xl text-gray-400"
                                //   onClick={incrementCount}
                                />
                            </div>
                        </div>
                    </div>

                </div>
                <button
                    className="fixed bottom-0 flex h-20 w-screen items-center justify-center bg-sky-500 pb-4 text-lg text-white"
                //   onClick={addToCart}
                >
                    결제하기
                </button>
            </div>
        </>
    );
}