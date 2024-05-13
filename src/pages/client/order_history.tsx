import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link, useParams } from "react-router-dom"
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { BiSearch } from 'react-icons/bi'
import { gql, useQuery } from "@apollo/client";
import { RESTAURANT_FRAGMENT } from "../../fragments";
import { GetOrdersQuery, GetOrdersQueryVariables, OrderStatus } from "../../__api__/graphql";
import { useEffect, useState } from "react";
import { useMe } from "../../hooks/useMe";
import moment from "moment";
import FormattedDate from "../../components/formatted_date";
import KRW from "../../components/currency_formatter";


const ORDER_HISTORY_QUERY = gql`
    query getOrders($input: GetOrdersInput!) {
        getOrders(input: $input) {
            ok
            error
            orders {
                id
                customerId
                status
                total
                createdAt
                restaurant {
                    id
                    name
                }
                items {
                    options {
                        name
                        choice
                    }
                    dishName
                }
            }
        }
    }
`


export const OrderHistory = () => {
    const myData = useMe();
    const { loading, data, error } = useQuery<GetOrdersQuery, GetOrdersQueryVariables>(
        ORDER_HISTORY_QUERY,
        {
            variables: {
                input: {
                    status: OrderStatus.Delivered // 'DESIRED_STATUS_HERE'를 실제 필터링하고자 하는 상태로 교체하세요. 상태를 필터링하고 싶지 않다면 프론트엔드 코드에서 이 상태를 선택적으로 만들 수 있습니다.
                },
            },
        }
    );

    console.log('확인용 data', data)
    const matchingOrders = data?.getOrders?.orders?.filter(order => order.customerId === myData.data?.me.id);

    return (
        <div className="max-w-screen-2xl pb-20 mx-auto mt-8">
            <div className="flex flex-row border-b-8 border-b-gray-100 p-4">

            </div>
            {/* map으로 감싸줘야함 */}
            <div className="grid gap-2 p-4">
                {
                    matchingOrders && matchingOrders.length > 0 ? (
                        matchingOrders.map((order) => (
                            <div key={order.id}>
                                <div className="rounded-lg border border-gray-200 g-4 p-4">
                                    <div className="flex flex-row pb-2">
                                        <div className="flex flex-grow flex-col">
                                            <div className="text-ellipsis text-xl font-bold">
                                                {order.restaurant?.name}
                                            </div>
                                            <div className="pb-1 text-sm text-gray-500">
                                                <FormattedDate dateString={order.createdAt} />
                                            </div>
                                            <div>배달 완료</div>
                                        </div>
                                        <div>

                                        </div>
                                    </div>
                                    <div className="grid gap-2 pl-2">
                                        <div className="flex items-center">
                                            <span className="align-center inline-block h-6 w-6 rounded-full bg-gray-200 text-center">
                                                {order.id}
                                            </span>
                                            <span className="ml-2"> {order.items[0]?.dishName}</span>
                                        </div>
                                        {/* {order.items.map((item, index) => ( 옵션 보여주기 기능(필요시 주석 삭제)
                                            <div key={index}>
                                                <div> &nbsp;{item.dishName}</div>
                                                {item && item.options?.map((option, optIndex) => (
                                                    <div key={optIndex} className="pl-4 pt-1">
                                                        <span>추가 옵션: {option.name} - {option.choice}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ))} */}

                                    </div>
                                    <div className="pb-4 pt-2">합계 : <KRW price={order.total!} /></div>
                                    <div className="grid place-items-center rounded-lg border border-sky-500 hover:border-sky-600 py-2 font-bold text-sky-500">
                                        <Link to={`/create-review/${order.restaurant?.id}`}>
                                            리뷰 작성
                                        </Link>
                                    </div>

                                </div>
                            </div>
                        ))
                    ) : (
                        <p>주문 내역이 없습니다.</p> // 조건이 거짓일 때 렌더링할 내용
                    )
                }





                <div className="grid place-items-center rounded-lg border border-sky-500 hover:border-sky-600 py-2 font-bold text-sky-500">
                    <Link to="/edit-profile"> {/*여기에 바로 edit을 만들지 말고, 주문내역 및 리뷰달기를 할 수 있도록 추가 즉 주문내역리스트에 각각의 내역에 리뷰달기 및 맨 마지막에 edit으로 이동하기를 해야한다 */}
                        <FontAwesomeIcon icon={faUser} className="text-3xl" />
                    </Link>
                </div>
            </div>
        </div>

    )
}