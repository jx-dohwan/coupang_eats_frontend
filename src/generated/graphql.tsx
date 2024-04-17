import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
};

export type AllCategoriesOutput = {
  __typename?: 'AllCategoriesOutput';
  categories?: Maybe<Array<Category>>;
  error?: Maybe<Scalars['String']['output']>;
  ok: Scalars['Boolean']['output'];
};

export type Category = {
  __typename?: 'Category';
  coverImg?: Maybe<Scalars['String']['output']>;
  createAt: Scalars['DateTime']['output'];
  id: Scalars['Float']['output'];
  name: Scalars['String']['output'];
  restaurantCount: Scalars['Int']['output'];
  restaurants?: Maybe<Array<Restaurant>>;
  slug: Scalars['String']['output'];
  updateAt: Scalars['DateTime']['output'];
};

export type CategoryInput = {
  page?: Scalars['Int']['input'];
  slug: Scalars['String']['input'];
};

export type CategoryOutput = {
  __typename?: 'CategoryOutput';
  category?: Maybe<Category>;
  error?: Maybe<Scalars['String']['output']>;
  ok: Scalars['Boolean']['output'];
  restaurants?: Maybe<Array<Restaurant>>;
  totalPages?: Maybe<Scalars['Int']['output']>;
  totalResults?: Maybe<Scalars['Int']['output']>;
};

export type CreateAccountInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  role: UserRole;
};

export type CreateAccountOutput = {
  __typename?: 'CreateAccountOutput';
  error?: Maybe<Scalars['String']['output']>;
  ok: Scalars['Boolean']['output'];
};

export type CreateDishInput = {
  description: Scalars['String']['input'];
  name: Scalars['String']['input'];
  options?: InputMaybe<Array<DishOptionInputType>>;
  price: Scalars['Int']['input'];
  restaurantId: Scalars['Int']['input'];
};

export type CreateDishOutput = {
  __typename?: 'CreateDishOutput';
  error?: Maybe<Scalars['String']['output']>;
  ok: Scalars['Boolean']['output'];
};

export type CreateOrderInput = {
  items: Array<CreateOrderItemInput>;
  restaurantId: Scalars['Int']['input'];
};

export type CreateOrderItemInput = {
  dishId: Scalars['Int']['input'];
  options?: InputMaybe<Array<OrderItemOptionInputType>>;
};

export type CreateOrderOutput = {
  __typename?: 'CreateOrderOutput';
  error?: Maybe<Scalars['String']['output']>;
  ok: Scalars['Boolean']['output'];
  orderId?: Maybe<Scalars['Int']['output']>;
};

export type CreatePaymentInput = {
  transactionId: Scalars['Int']['input'];
};

export type CreatePaymentOutput = {
  __typename?: 'CreatePaymentOutput';
  error?: Maybe<Scalars['String']['output']>;
  ok: Scalars['Boolean']['output'];
};

export type CreateRestaurantInput = {
  address: Scalars['String']['input'];
  categoryName: Scalars['String']['input'];
  coverImg: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type CreateRestaurantOutput = {
  __typename?: 'CreateRestaurantOutput';
  error?: Maybe<Scalars['String']['output']>;
  ok: Scalars['Boolean']['output'];
  restaurantId: Scalars['Int']['output'];
};

export type CreateReviewInput = {
  clientId: Scalars['Int']['input'];
  restaurantId: Scalars['Int']['input'];
  reviewImg?: InputMaybe<Array<ReviewImgInputType>>;
  reviewText?: InputMaybe<Scalars['String']['input']>;
  score: Scalars['Int']['input'];
};

export type CreateReviewOutput = {
  __typename?: 'CreateReviewOutput';
  error?: Maybe<Scalars['String']['output']>;
  ok: Scalars['Boolean']['output'];
};

export type DeleteDishInput = {
  dishId: Scalars['Int']['input'];
};

export type DeleteDishOutput = {
  __typename?: 'DeleteDishOutput';
  error?: Maybe<Scalars['String']['output']>;
  ok: Scalars['Boolean']['output'];
};

export type DeleteRestaurantInput = {
  restaurantId: Scalars['Float']['input'];
};

export type DeleteRestaurantOutput = {
  __typename?: 'DeleteRestaurantOutput';
  error?: Maybe<Scalars['String']['output']>;
  ok: Scalars['Boolean']['output'];
};

export type DeleteReviewOutput = {
  __typename?: 'DeleteReviewOutput';
  error?: Maybe<Scalars['String']['output']>;
  ok: Scalars['Boolean']['output'];
};

export type Dish = {
  __typename?: 'Dish';
  createAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  id: Scalars['Float']['output'];
  name: Scalars['String']['output'];
  options?: Maybe<Array<DishOption>>;
  photo?: Maybe<Scalars['String']['output']>;
  price: Scalars['Int']['output'];
  restaurant: Restaurant;
  updateAt: Scalars['DateTime']['output'];
};

export type DishChoice = {
  __typename?: 'DishChoice';
  extra?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
};

export type DishChoiceInputType = {
  extra?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
};

export type DishOption = {
  __typename?: 'DishOption';
  choices?: Maybe<Array<DishChoice>>;
  extra?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
};

export type DishOptionInputType = {
  choices?: InputMaybe<Array<DishChoiceInputType>>;
  extra?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
};

export type EditDishInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  dishId: Scalars['Int']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  options?: InputMaybe<Array<DishOptionInputType>>;
  price?: InputMaybe<Scalars['Int']['input']>;
};

export type EditDishOutput = {
  __typename?: 'EditDishOutput';
  error?: Maybe<Scalars['String']['output']>;
  ok: Scalars['Boolean']['output'];
};

export type EditOrderInput = {
  id: Scalars['Float']['input'];
  status: OrderStatus;
};

export type EditOrderOutput = {
  __typename?: 'EditOrderOutput';
  error?: Maybe<Scalars['String']['output']>;
  ok: Scalars['Boolean']['output'];
};

export type EditProfileInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
};

export type EditProfileOutput = {
  __typename?: 'EditProfileOutput';
  error?: Maybe<Scalars['String']['output']>;
  ok: Scalars['Boolean']['output'];
};

export type EditRestaurantInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  categoryName?: InputMaybe<Scalars['String']['input']>;
  coverImg?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  restaurantId: Scalars['Float']['input'];
};

export type EditRestaurantOutput = {
  __typename?: 'EditRestaurantOutput';
  error?: Maybe<Scalars['String']['output']>;
  ok: Scalars['Boolean']['output'];
};

export type EditReviewInput = {
  reviewId: Scalars['Int']['input'];
  reviewImg?: InputMaybe<Array<ReviewImgInputType>>;
  reviewText?: InputMaybe<Scalars['String']['input']>;
  score?: InputMaybe<Scalars['Int']['input']>;
};

export type EditReviewOutput = {
  __typename?: 'EditReviewOutput';
  error?: Maybe<Scalars['String']['output']>;
  ok: Scalars['Boolean']['output'];
};

export type GetOrderInput = {
  id: Scalars['Float']['input'];
};

export type GetOrderOutput = {
  __typename?: 'GetOrderOutput';
  error?: Maybe<Scalars['String']['output']>;
  ok: Scalars['Boolean']['output'];
  order?: Maybe<Order>;
};

export type GetOrdersInput = {
  status?: InputMaybe<OrderStatus>;
};

export type GetOrdersOutput = {
  __typename?: 'GetOrdersOutput';
  error?: Maybe<Scalars['String']['output']>;
  ok: Scalars['Boolean']['output'];
  orders?: Maybe<Array<Order>>;
};

export type GetPaymentsOutput = {
  __typename?: 'GetPaymentsOutput';
  error?: Maybe<Scalars['String']['output']>;
  ok: Scalars['Boolean']['output'];
  payments?: Maybe<Array<Payment>>;
};

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type LoginOutput = {
  __typename?: 'LoginOutput';
  error?: Maybe<Scalars['String']['output']>;
  ok: Scalars['Boolean']['output'];
  token?: Maybe<Scalars['String']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createAccount: CreateAccountOutput;
  createDish: CreateDishOutput;
  createOrder: CreateOrderOutput;
  createPayment: CreatePaymentOutput;
  createRestaurant: CreateRestaurantOutput;
  createReview: CreateReviewOutput;
  deleteDish: DeleteDishOutput;
  deleteRestaurant: DeleteRestaurantOutput;
  deleteReview: DeleteReviewOutput;
  editDish: EditDishOutput;
  editOrder: EditOrderOutput;
  editProfile: EditProfileOutput;
  editRestaurant: EditRestaurantOutput;
  editReview: EditReviewOutput;
  login: LoginOutput;
  takeOrder: TakeOrderOutput;
  verifyEmail: VerifyEmailOutput;
};


export type MutationCreateAccountArgs = {
  input: CreateAccountInput;
};


export type MutationCreateDishArgs = {
  input: CreateDishInput;
};


export type MutationCreateOrderArgs = {
  input: CreateOrderInput;
};


export type MutationCreatePaymentArgs = {
  input: CreatePaymentInput;
};


export type MutationCreateRestaurantArgs = {
  input: CreateRestaurantInput;
};


export type MutationCreateReviewArgs = {
  input: CreateReviewInput;
};


export type MutationDeleteDishArgs = {
  input: DeleteDishInput;
};


export type MutationDeleteRestaurantArgs = {
  input: DeleteRestaurantInput;
};


export type MutationDeleteReviewArgs = {
  input: EditReviewInput;
};


export type MutationEditDishArgs = {
  input: EditDishInput;
};


export type MutationEditOrderArgs = {
  input: EditOrderInput;
};


export type MutationEditProfileArgs = {
  input: EditProfileInput;
};


export type MutationEditRestaurantArgs = {
  input: EditRestaurantInput;
};


export type MutationEditReviewArgs = {
  input: EditReviewInput;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationTakeOrderArgs = {
  input: TakeOrderInput;
};


export type MutationVerifyEmailArgs = {
  input: VerifyEmailInput;
};

export type MyRestaurantInput = {
  id: Scalars['Float']['input'];
};

export type MyRestaurantOutput = {
  __typename?: 'MyRestaurantOutput';
  error?: Maybe<Scalars['String']['output']>;
  ok: Scalars['Boolean']['output'];
  restaurant?: Maybe<Restaurant>;
};

export type MyRestaurantsOutput = {
  __typename?: 'MyRestaurantsOutput';
  error?: Maybe<Scalars['String']['output']>;
  ok: Scalars['Boolean']['output'];
  restaurants: Array<Restaurant>;
};

export type Order = {
  __typename?: 'Order';
  createAt: Scalars['DateTime']['output'];
  customer?: Maybe<User>;
  driver?: Maybe<User>;
  id: Scalars['Float']['output'];
  items: Array<OrderItem>;
  restaurant?: Maybe<Restaurant>;
  status: OrderStatus;
  total?: Maybe<Scalars['Float']['output']>;
  updateAt: Scalars['DateTime']['output'];
};

export type OrderItem = {
  __typename?: 'OrderItem';
  createAt: Scalars['DateTime']['output'];
  dish: Dish;
  id: Scalars['Float']['output'];
  options?: Maybe<Array<OrderItemOption>>;
  updateAt: Scalars['DateTime']['output'];
};

export type OrderItemOption = {
  __typename?: 'OrderItemOption';
  choice?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
};

export type OrderItemOptionInputType = {
  choice?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export enum OrderStatus {
  Cooked = 'Cooked',
  Cooking = 'Cooking',
  Delivered = 'Delivered',
  Pending = 'Pending',
  PickedUp = 'PickedUp'
}

export type OrderUpdatesInput = {
  id: Scalars['Float']['input'];
};

export type Payment = {
  __typename?: 'Payment';
  createAt: Scalars['DateTime']['output'];
  id: Scalars['Float']['output'];
  restaurant: Restaurant;
  transactionId: Scalars['Int']['output'];
  updateAt: Scalars['DateTime']['output'];
  user: User;
};

export type Query = {
  __typename?: 'Query';
  allCategories: AllCategoriesOutput;
  category: CategoryOutput;
  getOrder: GetOrderOutput;
  getOrders: GetOrdersOutput;
  getPayments: GetPaymentsOutput;
  me: User;
  myRestaurant: MyRestaurantOutput;
  myRestaurants: MyRestaurantsOutput;
  restaurant: RestaurantOutput;
  restaurants: RestaurantsOutput;
  searchRestaurant: SearchRestaurantOutput;
  userProfile: UserProfileOutput;
};


export type QueryCategoryArgs = {
  input: CategoryInput;
};


export type QueryGetOrderArgs = {
  input: GetOrderInput;
};


export type QueryGetOrdersArgs = {
  input: GetOrdersInput;
};


export type QueryMyRestaurantArgs = {
  input: MyRestaurantInput;
};


export type QueryRestaurantArgs = {
  input: RestaurantInput;
};


export type QueryRestaurantsArgs = {
  input: RestaurantsInput;
};


export type QuerySearchRestaurantArgs = {
  input: SearchRestaurantInput;
};


export type QueryUserProfileArgs = {
  userId: Scalars['Float']['input'];
};

export type Restaurant = {
  __typename?: 'Restaurant';
  address: Scalars['String']['output'];
  category?: Maybe<Category>;
  coverImg: Scalars['String']['output'];
  createAt: Scalars['DateTime']['output'];
  id: Scalars['Float']['output'];
  isPromoted: Scalars['Boolean']['output'];
  menu: Array<Dish>;
  name: Scalars['String']['output'];
  orders: Array<Order>;
  owner: User;
  promotedUntil?: Maybe<Scalars['DateTime']['output']>;
  reviews: Array<Reviews>;
  updateAt: Scalars['DateTime']['output'];
};

export type RestaurantInput = {
  restaurantId: Scalars['Int']['input'];
};

export type RestaurantOutput = {
  __typename?: 'RestaurantOutput';
  error?: Maybe<Scalars['String']['output']>;
  ok: Scalars['Boolean']['output'];
  restaurant?: Maybe<Restaurant>;
};

export type RestaurantsInput = {
  page?: Scalars['Int']['input'];
};

export type RestaurantsOutput = {
  __typename?: 'RestaurantsOutput';
  error?: Maybe<Scalars['String']['output']>;
  ok: Scalars['Boolean']['output'];
  results?: Maybe<Array<Restaurant>>;
  totalPages?: Maybe<Scalars['Int']['output']>;
  totalResults?: Maybe<Scalars['Int']['output']>;
};

export type ReviewImges = {
  __typename?: 'ReviewImges';
  url: Scalars['String']['output'];
};

export type Reviews = {
  __typename?: 'Reviews';
  client: Array<User>;
  createAt: Scalars['DateTime']['output'];
  id: Scalars['Float']['output'];
  restaurant: Array<Restaurant>;
  reviewImg?: Maybe<Array<ReviewImges>>;
  reviewText?: Maybe<Scalars['String']['output']>;
  score: Scalars['Int']['output'];
  updateAt: Scalars['DateTime']['output'];
};

export type SearchRestaurantInput = {
  page?: Scalars['Int']['input'];
  query: Scalars['String']['input'];
};

export type SearchRestaurantOutput = {
  __typename?: 'SearchRestaurantOutput';
  error?: Maybe<Scalars['String']['output']>;
  ok: Scalars['Boolean']['output'];
  restaurants?: Maybe<Array<Restaurant>>;
  totalPages?: Maybe<Scalars['Int']['output']>;
  totalResults?: Maybe<Scalars['Int']['output']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  cookedOrders: Order;
  orderUpdates: Order;
  pendingOrders: Order;
};


export type SubscriptionOrderUpdatesArgs = {
  input: OrderUpdatesInput;
};

export type TakeOrderInput = {
  id: Scalars['Float']['input'];
};

export type TakeOrderOutput = {
  __typename?: 'TakeOrderOutput';
  error?: Maybe<Scalars['String']['output']>;
  ok: Scalars['Boolean']['output'];
};

export type User = {
  __typename?: 'User';
  createAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  id: Scalars['Float']['output'];
  orders: Array<Order>;
  password: Scalars['String']['output'];
  payments: Array<Payment>;
  restaurants: Array<Restaurant>;
  reviews: Array<Reviews>;
  rides: Array<Order>;
  role: UserRole;
  updateAt: Scalars['DateTime']['output'];
  verified: Scalars['Boolean']['output'];
};

export type UserProfileOutput = {
  __typename?: 'UserProfileOutput';
  error?: Maybe<Scalars['String']['output']>;
  ok: Scalars['Boolean']['output'];
  user?: Maybe<User>;
};

export enum UserRole {
  Client = 'Client',
  Delivery = 'Delivery',
  Owner = 'Owner'
}

export type VerifyEmailInput = {
  code: Scalars['String']['input'];
};

export type VerifyEmailOutput = {
  __typename?: 'VerifyEmailOutput';
  error?: Maybe<Scalars['String']['output']>;
  ok: Scalars['Boolean']['output'];
};

export type ReviewImgInputType = {
  url: Scalars['String']['input'];
};

export type MeQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQueryQuery = { __typename?: 'Query', me: { __typename?: 'User', id: number, email: string, role: UserRole, verified: boolean } };

export type CreateAccountMutationVariables = Exact<{
  createAccountInput: CreateAccountInput;
}>;


export type CreateAccountMutation = { __typename?: 'Mutation', createAccount: { __typename?: 'CreateAccountOutput', ok: boolean, error?: string | null } };

export type LoginMutationVariables = Exact<{
  loginInput: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'LoginOutput', ok: boolean, token?: string | null, error?: string | null } };


export const MeQueryDocument = gql`
    query meQuery {
  me {
    id
    email
    role
    verified
  }
}
    `;

/**
 * __useMeQueryQuery__
 *
 * To run a query within a React component, call `useMeQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQueryQuery(baseOptions?: Apollo.QueryHookOptions<MeQueryQuery, MeQueryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQueryQuery, MeQueryQueryVariables>(MeQueryDocument, options);
      }
export function useMeQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQueryQuery, MeQueryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQueryQuery, MeQueryQueryVariables>(MeQueryDocument, options);
        }
export function useMeQuerySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<MeQueryQuery, MeQueryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MeQueryQuery, MeQueryQueryVariables>(MeQueryDocument, options);
        }
export type MeQueryQueryHookResult = ReturnType<typeof useMeQueryQuery>;
export type MeQueryLazyQueryHookResult = ReturnType<typeof useMeQueryLazyQuery>;
export type MeQuerySuspenseQueryHookResult = ReturnType<typeof useMeQuerySuspenseQuery>;
export type MeQueryQueryResult = Apollo.QueryResult<MeQueryQuery, MeQueryQueryVariables>;
export const CreateAccountDocument = gql`
    mutation createAccount($createAccountInput: CreateAccountInput!) {
  createAccount(input: $createAccountInput) {
    ok
    error
  }
}
    `;
export type CreateAccountMutationFn = Apollo.MutationFunction<CreateAccountMutation, CreateAccountMutationVariables>;

/**
 * __useCreateAccountMutation__
 *
 * To run a mutation, you first call `useCreateAccountMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAccountMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAccountMutation, { data, loading, error }] = useCreateAccountMutation({
 *   variables: {
 *      createAccountInput: // value for 'createAccountInput'
 *   },
 * });
 */
export function useCreateAccountMutation(baseOptions?: Apollo.MutationHookOptions<CreateAccountMutation, CreateAccountMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateAccountMutation, CreateAccountMutationVariables>(CreateAccountDocument, options);
      }
export type CreateAccountMutationHookResult = ReturnType<typeof useCreateAccountMutation>;
export type CreateAccountMutationResult = Apollo.MutationResult<CreateAccountMutation>;
export type CreateAccountMutationOptions = Apollo.BaseMutationOptions<CreateAccountMutation, CreateAccountMutationVariables>;
export const LoginDocument = gql`
    mutation login($loginInput: LoginInput!) {
  login(input: $loginInput) {
    ok
    token
    error
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      loginInput: // value for 'loginInput'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;