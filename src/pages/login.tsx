
import { useForm } from "react-hook-form";
import {
    LoginMutation,
    LoginMutationVariables,
} from "../generated/graphql";
import { LOCALSTORAGE_TOKEN } from "../constants";
import { authTokenVar, isLoggedInVar } from "../apollo";
import { gql, useMutation } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation login($loginInput: LoginInput!) {
    login(input: $loginInput) {
      ok
      token
      error
    }
  }
`;

interface ILoginForm {
    email: string;
    password: string
}

export const Login = () => {
    const {
        register,
        getValues,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<ILoginForm>({
        mode: "onChange",
    });

    const onCompleted = (data: LoginMutation) => {
        const {
            login: { error, ok, token },
        } = data;
        if (ok && token) {
            localStorage.setItem(LOCALSTORAGE_TOKEN, token);
            authTokenVar(token);
            isLoggedInVar(true);
        }
    };


    const [loginMutation, { data: loginMutationResult, loading }] = useMutation<
        LoginMutation,
        LoginMutationVariables
    >(LOGIN_MUTATION, {
        onCompleted,
    });

    const onSubmit = () => {
        if(!loading) {
            const {email, password} = getValues();
        }
    }
}