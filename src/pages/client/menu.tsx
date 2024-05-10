import { gql, useMutation, useQuery } from '@apollo/client';
import { CiCircleMinus, CiCirclePlus } from 'react-icons/ci'
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from '../../fragments';
import { CreateOrderItemInput, CreateOrderMutation, CreateOrderMutationVariables, RestaurantQuery, RestaurantQueryVariables } from '../../__api__/graphql';
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

// type SelectedOptions = { 추후 다중 choice를 위해 남겨둠
//     [key: string]: number;
// };
type SelectedOptions = {
    [optionName: string]: string | null;
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

    console.log('menudata', data)
    const [orderCount, setOrderCount] = useState(1)
    const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({});
    const [totalPrice, setTotalPrice] = useState<number>((menu?.price! + data?.restaurant.restaurant?.deliveryFee!) * orderCount || 0);
    const [minimumPriceMet, setMinimumPriceMet] = useState(false);
    const [orderItems, setOrderItems] = useState<CreateOrderItemInput[]>([]);


    const handleOptionChange = (optionName: string, choiceName: string, isChecked: boolean) => {
        setSelectedOptions(prev => ({
            ...prev,
            [optionName]: isChecked ? choiceName : null  // 선택되면 choiceName을 저장, 아니면 null
        }));
    };

    // 가격 계산 부분도 업데이트
    useEffect(() => {
        let extraTotal = 0;
        for (const [optionName, choiceName] of Object.entries(selectedOptions)) {
            const option = menu?.options?.find(o => o.name === optionName);
            const choice = option?.choices?.find(c => c.name === choiceName);
            if (choice) {
                extraTotal += choice.extra || 0;
            }
        }
        const calculatedTotal = (menu?.price! + data?.restaurant.restaurant?.deliveryFee! || 0) * orderCount + extraTotal;
        setTotalPrice(calculatedTotal);
        setMinimumPriceMet(calculatedTotal >= data?.restaurant.restaurant?.minimumPrice!);
    }, [orderCount, menu?.price, selectedOptions]);



    const decrementCount = () => {
        if (orderCount > 1) setOrderCount((prev) => prev - 1)
    }
    const incrementCount = () => {
        setOrderCount((prev) => prev + 1)
    }

    // 주문 상태 관리

    const getItem = (dishId: number) => {
        return orderItems.find((order) => order.dishId === dishId)
    }
    useEffect(() => {
        const dishId = parseInt(menuId, 10);
        if (menu) { // `menu` 데이터가 로드된 후에 함수를 실행
            addItemToOrder(dishId);
        }
        return () => {
            if (menu) {
                removeFromOrder(dishId);
            }
        };
    }, [menuId, menu]); // `menu`를 의존성 배열에 추가


    const addItemToOrder = (dishId: number) => {
        if (!getItem(dishId)) {
            setOrderItems(current => [{ dishId, options: [] }, ...current]);
        }
    };

    const removeFromOrder = (dishId: number) => {
        setOrderItems((current) =>
            current.filter((dish) => dish.dishId !== dishId)
        );
    };


    const addOptionToItem = (dishId: number, optionName: string, choice: string) => {
        // 해당 위치에서 getIte의 order.dishId와 해당 함수의 인자인 dishId가 같은데 oldItem이 undefined로 뜬다 무엇이 문제인가?
        const oldItem = getItem(dishId);
        if (oldItem) {
            const optionsToUpdate = oldItem.options ? [...oldItem.options] : [];
            const existingOptionIndex = optionsToUpdate.findIndex(option => option.name === optionName);
            if (existingOptionIndex > -1) {
                // 옵션의 선택 업데이트
                optionsToUpdate[existingOptionIndex] = { ...optionsToUpdate[existingOptionIndex], choice: choice };
            } else {
                // 새 옵션 추가
                optionsToUpdate.push({ name: optionName, choice });
            }
            // 주문 항목 업데이트
            removeFromOrder(dishId);
            setOrderItems(current => [
                { dishId, options: optionsToUpdate },
                ...current.filter(item => item.dishId !== dishId)
            ]);
        }
    };


    const removeOptionFromItem = (dishId: number, optionName: string) => {

        const oldItem = getItem(dishId);
        if (oldItem) {
            const updatedOptions = oldItem.options?.filter(option => option.name !== optionName) || [];
            removeFromOrder(dishId);
            setOrderItems(current => [
                { dishId, options: updatedOptions },
                ...current.filter(item => item.dishId !== dishId)
            ]);
        }
    };

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

    const ConfirmOrder = () => {
        if (placingOrder) {
            return;
        }
        const ok = window.confirm("주문하시겠습니까?")
        if (ok) {
            createOrderMutation({
                variables: {
                    input: {
                        restaurantId: +restaurantId,
                        items: orderItems,
                    }
                }
            })
        }
    }

    return (
        <>
            <div>
                <Helmet>
                    <title>
                        {data?.restaurant.restaurant?.name || ""} | Coupang Eats
                    </title>
                </Helmet>
                <div className='max-w-screen-2xl pb-20 mx-auto mt-8 '>
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
                                    className='flex items-center justify-between bg-gray-100 p-4 font-bold'>
                                    <div>{option.name}</div>
                                    <div className='text-sm font-normal text-orange-600'>
                                        필수 사항
                                    </div>
                                </h3>

                                {option.choices?.map((choice, index) => (
                                    <div>
                                        <fieldset>
                                            <div
                                                key={choice.name}
                                                className='flex items-center gap-2 p-4 ml-1'
                                            >
                                                <input
                                                    id={`${option.name}-${choice.name}`}
                                                    type='checkbox'
                                                    name={choice.name}
                                                    className='p-3 focus:outline-none focus:ring-0'
                                                    checked={selectedOptions[option.name] === choice.name}
                                                    onChange={(e) => {
                                                        // 기존 옵션 변경 처리
                                                        handleOptionChange(option.name, choice.name, e.target.checked);

                                                        // 옵션 추가 또는 제거 로직
                                                        if (e.target.checked) {
                                                            // 옵션을 주문 항목에 추가
                                                            addOptionToItem(parseInt(menuId, 10), option.name, choice.name);
                                                        } else {
                                                            // 옵션에서 선택 해제
                                                            removeOptionFromItem(parseInt(menuId, 10), option.name);
                                                        }
                                                    }}

                                                />
                                                <label htmlFor={`${option.name}-${choice.name}`}>
                                                    {choice.name}
                                                    {choice.extra && (
                                                        <span className='text-gray-400 ml-2'>
                                                           (+ <KRW price={choice.extra} />)
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
                </div>
                <button
                    className={`fixed bottom-0 flex h-20 w-screen items-center justify-center pb-4 text-lg text-white
                    ${minimumPriceMet ? "bg-sky-500 hover:bg-sky-600" : "bg-gray-300 pointer-events-none"}
                    `}
                    onClick={ConfirmOrder}
                >
                    결제하기
                </button>
            </div>
        </>
    );
}