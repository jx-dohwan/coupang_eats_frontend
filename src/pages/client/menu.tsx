import { gql, useMutation, useQuery } from '@apollo/client';
import { CiCircleMinus, CiCirclePlus } from 'react-icons/ci'
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from '../../fragments';
import { CreateOrderMutation, CreateOrderMutationVariables, RestaurantQuery, RestaurantQueryVariables } from '../../__api__/graphql';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import KRW from '../../components/currency_formatter';
import { NotFound } from '../404';

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

const CREATE_ORDER_MUTATION = gql`
  mutation createOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      ok
      error
      orderId
    }
  }
`;


type TMenuParams = {
    restaurantId: string;
    menuId: string;
};

type SelectedOptions = {
    [key: string]: number;
};

type OptionAccumulator = {
    [key: string]: any[];  // 이렇게 문자열 키에 대한 인덱스 시그니처를 추가합니다.
};

export const Menu = () => {
    const { restaurantId, menuId } = useParams() as unknown as TMenuParams;

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

    const [orderCount, setOrderCount] = useState(1)
    const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({});
    const [totalPrice, setTotalPrice] = useState<number>(menu?.price! * orderCount || 0);
    const [orderStarted, setOrderStarted] = useState(false);

    console.log('menu.option?', menu?.options)
    // 갯수 증감 및 옵션 추가에 의한 가격 변동
    const handleOptionChange = (optionName: string, extra: number, isChecked: boolean) => {
        setSelectedOptions(prev => ({
            ...prev,
            [optionName]: isChecked ? extra : 0  // 선택되면 가격을 저장, 아니면 0
        }));
    };

    useEffect(() => {
        const extraTotal = Object.values(selectedOptions).reduce((acc: number, value: number) => acc + value, 0);
        setTotalPrice((menu?.price || 0) * orderCount + extraTotal);
    }, [orderCount, menu?.price, selectedOptions]);


    const decrementCount = () => {
        if (orderCount > 1) setOrderCount((prev) => prev - 1)
    }
    const incrementCount = () => {
        setOrderCount((prev) => prev + 1)
    }

    // 주문 상태 관리
    const addMenuToOrder = (dishId: number) => {

    }
    // 주문하기
    const navigate = useNavigate();
    const onCompleted = (data: CreateOrderMutation) => {
        const {
            createOrder: { ok, orderId },
        } = data;
        if (data.createOrder.ok) {
            navigate(`/order/${orderId}`)
        }
    }
    const [createOrderMutation, { loading: placingOrder }] = useMutation<
        CreateOrderMutation, CreateOrderMutationVariables
    >(CREATE_ORDER_MUTATION, {
        onCompleted
    });
    // const ConfirmOrder = () => {
    //     if(placingOrder) {
    //         return;
    //     }
    //     const ok = window.confirm("주문하시겠습니까?")
    //     if(ok) {
    //         createOrderMutation({
    //             variables: {
    //                 input:{
    //                     restaurantId: +restaurantId,
    //                     items: orderItems,
    //                 }
    //             }
    //         })
    //     }
    // }


    return (
        <>
            <div>
                <Helmet>
                    <title>
                        {data?.restaurant.restaurant?.name || ""} | Coupang Eats
                    </title>
                </Helmet>
                {/* 내 생각에는 수량을 0을 1이상으로 만들면 주문 가능하도록 만들면 될 것 같고
                아래의 옵션을 추가하는 버튼을 누르면 해당 옵션이 선택되도록 하고
                결제하면 될 것 같은데 */}

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
                                <p className="text-lg">  <KRW price={totalPrice} /></p>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <div className="flex items-center">
                                <p className="text-lg font-semibold">수량</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <CiCircleMinus
                                    className="text-4xl text-gray-400"
                                    onClick={decrementCount}
                                />
                                <p className="text-lg">{orderCount}</p>
                                <CiCirclePlus
                                    className="text-4xl text-gray-400"
                                    onClick={incrementCount}
                                />
                            </div>
                        </div>
                    </div>


                </div>

                {menu?.options ? (
                    menu?.options?.map((option, index) => (
                        <div key={option.name}>
                            <h3
                                id={option.name}
                                className='flex items-center justify-between bg-gray-100 p4 font-bold'>
                                <div>{option.name}</div>
                                <div className='text-sm font-normal text-orange-600'>
                                    선택 사항
                                </div>
                            </h3>

                            {option.choices?.map((choice, index) => (
                                <div>
                                    <fieldset>

                                        <div
                                            key={choice.name}
                                            className='flex items-center gap-2 p-4'
                                        >
                                            <input
                                                id={`${option.name}-${choice.name}`}
                                                type='checkbox'
                                                name={choice.name}
                                                className='p-3 focus:outline-none focus:ring-0'
                                                checked={selectedOptions[choice.name] > 0}
                                                onChange={(e) => handleOptionChange(choice.name, choice.extra || 0, e.target.checked)}
                                            />
                                            <label htmlFor={`${option.name}-${choice.name}`}>
                                                {choice.name}
                                                {choice.extra && (
                                                    <span className='text-gray-400'>
                                                        <KRW price={choice.extra} />
                                                    </span>
                                                )}
                                            </label>
                                        </div>

                                    </fieldset>

                                </div>
                            ))}

                        </div>
                    ))
                ) : (
                    <NotFound />
                )}

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