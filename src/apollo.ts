import {
  ApolloClient,
  InMemoryCache,
  makeVar,
  createHttpLink,
  split,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { LOCALSTORAGE_TOKEN } from "./constants";
import { getMainDefinition } from "@apollo/client/utilities";

// 로컬 스토리지에서 토큰을 가져옴
const token = sessionStorage.getItem(LOCALSTORAGE_TOKEN); // localStorage
// Apollo Client의 Reactive Variable을 사용하여 로컬 상태를 관리
// 로그인 상태와 인증 토큰을 관리하는 두 개의 Reactive variable을 생성
export const isLoggedInVar = makeVar(Boolean(token));
export const authTokenVar = makeVar(token);

// 웹소켓 링크를 생성하여 GraphQL 구독을 처리
const wsLink = new GraphQLWsLink(
  createClient({
    url: "wss://coupang-eats-backend.onrender.com/graphql", // 구독을 위한 웹소켓 URL
    connectionParams: {
      "x-jwt": authTokenVar() || "", // 인증 토큰을 웹소켓 연결 시 전
    },
  })
);

// HTTP 링크를 생성하여 일반적인 GraphQL 요청을 처
const httpLink = createHttpLink({
  uri: "https://coupang-eats-backend.onrender.com/graphql", // GraphQK 서버의 URI
});

// HTTP 요청 시마다 헤더에 인증 토큰을 추가하는 링크를 생성
const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      "x-jwt": authTokenVar() || "", // 인증토큰 헤더에 추가
    },
  };
});

// 요청 유형에 따라 HTTP 링크와 웹소켓 링크를 분기하는 split 링크를 생성
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    // 요청이 subscription인지 확인
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink, // subscription 요청이면 wsLink 사용
  authLink.concat(httpLink) // 그 외의 요청이면 authLink와 httpLink를 연결하여 사용
);

// Apollo client 인스턴스를 생성
export const client = new ApolloClient({
  link: splitLink, // 분기된 링크를 사용
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          // isLoggedIn 필드를 읽을 때 Reactive Variable을 사용
          isLoggedIn: {
            read() {
              return isLoggedInVar();
            },
          },
          // token 필드를 읽을 때 REactive Variable을 사용
          token: {
            read() {
              return authTokenVar();
            },
          },
        },
      },
    },
  }),
});