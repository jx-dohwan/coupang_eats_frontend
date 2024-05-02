import { gql, useMutation, useQuery } from "@apollo/client";
import { FULL_ORDER_FRAGMENT } from "../fragments";
import { useParams } from "react-router-dom";
import { useMe } from "../hooks/useMe";
import { EditOrderMutation, EditOrderMutationVariables, GetOrderQuery, GetOrderQueryVariables, OrderStatus, OrderUpdatesSubscription, UserRole } from "../__api__/graphql";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import KRW from "../components/currency_formatter";

const GET_ORDER = gql`
  query getOrder($input: GetOrderInput!) {
    getOrder(input: $input) {
      ok
      error
      order {
        ...FullOrderParts
      }
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

const ORDER_SUBSCRIPTION = gql`
  subscription orderUpdates($input: OrderUpdatesInput!) {
    orderUpdates(input: $input) {
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

const EDIT_ORDER = gql`
  mutation editOrder($input: EditOrderInput!) {
    editOrder(input: $input) {
      ok
      error
    }
  }
`;

interface IParams {
    id: string;
}

type OrderStatusCheck = 'Pending' | 'Cooking' | 'Cooked' | 'PickedUp' | 'Delivered';

const statusDisplay: { [key in OrderStatusCheck]: string } = {
    Pending: '대기중',
    Cooking: '조리중',
    Cooked: '조리완료',
    PickedUp: '픽업완료',
    Delivered: '배달완료',
};

function getStatusDisplay(status: OrderStatusCheck | undefined): string {
    if (status && status in statusDisplay) {
        return statusDisplay[status];
    }
    return '상태 확인 중'; // 예외 상황에 대한 기본값
}


const defaultStatusMessage = '상태 확인 중';
export const Order = () => {
    const params = useParams() as unknown as IParams;
    const { data: userData } = useMe();
    const [editOrderMutation] = useMutation<
        EditOrderMutation,
        EditOrderMutationVariables
    >(EDIT_ORDER);
    const { data, subscribeToMore } = useQuery<
        GetOrderQuery,
        GetOrderQueryVariables
    >(GET_ORDER, {
        variables: {
            input: { id: +params.id },
        },
    });
    useEffect(() => {
        if (data?.getOrder.ok) {
            subscribeToMore({
                document: ORDER_SUBSCRIPTION,
                variables: {
                    input: {
                        id: +params.id,
                    },
                },
                updateQuery: (
                    prev,
                    {
                        subscriptionData: { data },
                    }: { subscriptionData: { data: OrderUpdatesSubscription } }
                ) => {
                    if (!data) return prev;
                    return {
                        getOrder: {
                            ...prev.getOrder,
                            order: {
                                ...data.orderUpdates,
                            },
                        },
                    };
                },
            });
        }
    }, [data]);
    const onButtonClick = (newStatus: OrderStatus) => {
        editOrderMutation({
            variables: {
                input: {
                    id: +params.id,
                    status: newStatus,
                },
            },
        });
    };

    return (
        <div className="mt-32 container flex justify-center">
            <Helmet>
                <title>주문 #{params.id} | Coupang Eats</title>
            </Helmet>
            <div className="border border-gray-800 w-full max-w-screen-sm flex flex-col justify-center">
                <h4 className="bg-sky-600 w-full py-5 text-white text-center text-xl">
                    주문 번호 #{params.id}
                </h4>
                <h5 className="p-5 pt-10 text-3xl text-center">
                    <KRW price={data?.getOrder.order?.total!} />
                </h5>
                <div className="p-5 text-xl grid gap-6">
                    <div className="border-t pt-5 borderogray-700">
                        매장 : {" "}
                        <span className="font-medium">
                            {data?.getOrder.order?.restaurant?.name}
                        </span>
                    </div>
                    <div className="border-t pt-5 border-gray-700">
                        배달 대상 : {" "}
                        <span className="font-medium">
                            {data?.getOrder.order?.customer?.email}
                        </span>
                    </div>
                    <div className="border-t border-b py-5 border-gray-700">
                        배달 상태 : {" "}
                        <span className="font-medium">
                            {data?.getOrder.order?.driver?.email || "배달중"}
                        </span>
                    </div>
                    {userData?.me.role === UserRole.Client && (
                        <span className="text-center mt-5 mb-3 text-2xl text-sky-600">
                            현재 상태 :  {getStatusDisplay(data?.getOrder.order?.status)}
                        </span>
                    )}
                    {userData?.me.role === UserRole.Owner && (
                        <>
                            {data?.getOrder.order?.status === OrderStatus.Pending && (
                                <button
                                    onClick={() => onButtonClick(OrderStatus.Cooking)}
                                    className="btn bg-sky-500 hover:bg-sky-600"
                                >
                                    주문 수락
                                </button>
                            )}
                            {data?.getOrder.order?.status === OrderStatus.Cooking && (
                                <button
                                    onClick={() => onButtonClick(OrderStatus.Cooked)}
                                    className="btn bg-sky-500 hover:bg-sky-600"
                                >
                                    요리 시작
                                </button>
                            )}
                            {data?.getOrder.order?.status !== OrderStatus.Cooking &&
                                data?.getOrder.order?.status !== OrderStatus.Pending && (
                                    <span className="text-center mt-5 mb-3 text-2xl text-sky-600">
                                        현재 상태 :  {getStatusDisplay(data?.getOrder.order?.status)}
                                    </span>
                                )}
                        </>
                    )}
                    {userData?.me.role === UserRole.Delivery && (
                        <>
                            {data?.getOrder.order?.status === OrderStatus.Cooked && (
                                <button
                                    onClick={() => onButtonClick(OrderStatus.PickedUp)}
                                    className="btn bg-sky-500 hover:bg-sky-600"
                                >
                                    픽업
                                </button>
                            )}
                            {data?.getOrder.order?.status === OrderStatus.PickedUp && (
                                <button
                                    onClick={() => onButtonClick(OrderStatus.Delivered)}
                                    className="btn bg-sky-500 hover:bg-sky-600"
                                >
                                    배달 완료
                                </button>
                            )}
                        </>
                    )}
                    {data?.getOrder.order?.status === OrderStatus.Delivered && (
                        <span className="text-center mt-5 mb-3 text-2xl text-sky-600">
                            쿠팡이츠를 이용해 주셔서 감사합니다.
                        </span>
                    )}

                </div>
            </div>

        </div>
    );
};