import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useParams } from "react-router-dom";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { BiSearch } from "react-icons/bi";
import { gql, useQuery } from "@apollo/client";
import { RESTAURANT_FRAGMENT } from "../../fragments";
import {
  GetOrdersQuery,
  GetOrdersQueryVariables,
  OrderStatus,
} from "../../__api__/graphql";
import { useEffect, useState, useMemo } from "react";
import { useMe } from "../../hooks/useMe";
import moment from "moment";
import FormattedDate from "../../components/formatted_date";
import KRW from "../../components/currency_formatter";
import { LoadingSkeleton } from "./_components/order-history-loding";

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
        totalCount
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
`;



export const OrderHistory = () => {
  const myData = useMe();
  const { loading, data, error } = useQuery<GetOrdersQuery, GetOrdersQueryVariables>(
    ORDER_HISTORY_QUERY,
    {
      variables: {
        input: {
          status: OrderStatus.Delivered,
        },
      },
    }
  );

  const matchingOrders = useMemo(
    () => data?.getOrders?.orders?.filter((order) => order.customerId === myData.data?.me.id),
    [data, myData.data?.me.id]
  );

  const sortedOrders = useMemo(
    () =>
      matchingOrders
        ? [...matchingOrders].sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return dateB - dateA;
        })
        : [],
    [matchingOrders]
  );

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="max-w-screen-2xl pb-20 mx-auto mt-8">
      <div className="flex flex-row border-b-8 border-b-gray-100 p-4"></div>
      <div className="grid gap-2 p-4">
        {sortedOrders && sortedOrders.length > 0 ? (
          sortedOrders.map((order) => (
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
                  <div></div>
                </div>
                <div className="grid gap-2 pl-2">
                  <div className="flex items-center">
                    <span className="align-center inline-block h-6 w-6 rounded-full bg-gray-200 text-center">
                      {order.id}
                    </span>
                    <span className="ml-2"> {order.items[0]?.dishName}</span>
                    {order.totalCount && `${order.totalCount}개`}
                  </div>
                </div>
                <div className="pb-4 pt-2">
                  합계 : <KRW price={order.total!} />
                </div>
                <div className="grid place-items-center rounded-lg border border-sky-500 hover:border-sky-600 py-2 font-bold text-sky-500">
                  <Link to={`/create-review/${order.restaurant?.id}`}>리뷰 작성</Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">주문 내역이 없습니다.</div>
        )}
      </div>
    </div>
  );
};
