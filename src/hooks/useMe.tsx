import { gql, useQuery } from "@apollo/client";
import { Query } from "../generated/graphql";

export const ME_QUERY = gql`
  query meQuery {
    me {
      id
      email
      role
      verified
    }
  }
`;

export const useMe = () => {
  return useQuery<Query>(ME_QUERY);
};