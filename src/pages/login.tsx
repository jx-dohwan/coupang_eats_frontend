
import { useForm } from "react-hook-form";
import coupangEatsLogo from "../images/coupang-eats-delivery-190910-04.png";
import {
    LoginMutation,
    LoginMutationVariables,
} from "../generated/graphql";
import { LOCALSTORAGE_TOKEN } from "../constants";
import { authTokenVar, isLoggedInVar } from "../apollo";
import { gql, useMutation } from "@apollo/client";
import { Helmet } from "react-helmet";
import { FormError } from "../components/form-error";
import { Button } from "../components/button";
import { Link } from "react-router-dom";

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
            login: { ok, token },
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
        if (!loading) {
            const { email, password } = getValues();
            loginMutation({
                variables: {
                    loginInput: {
                        email,
                        password,
                    },
                },
            });
        }
    };

    return (
        <div className="h-screen flex items-center flex-col mt-10 lg:mt-28">
            <Helmet>
                <title>로그인 | Coupang Eats</title>
            </Helmet>
            <div className="w-full max-w-screen-sm flex flex-col px-5 items-center">
                <img src={coupangEatsLogo} className="w-52 mb-5" alt="Coupang Eats" />

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="grid gap-3 mb-3 mt-5 w-full"
                >
                    <input
                        {...register("email", {
                            required: "이메일은 필수입니다.",
                            pattern:
                                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                        })}
                        required
                        type="email"
                        placeholder="이메일"
                        className="input"
                    />
                    {errors.email?.type === "pattern" && (
                        <FormError errorMessage={"유효한 이메일을 입력해주세요."} />
                    )}
                    {errors.email?.message && (
                        <FormError errorMessage={errors.email.message} />
                    )}

                    <input
                        {...register("password", {
                            required: "비밀번호는 필수입니다.",
                            minLength: 5,
                        })}
                        type="password"
                        placeholder="비밀번호"
                        className="input"
                    />
                    {errors.password?.message && (
                        <FormError errorMessage={errors.password.message} />
                    )}
                    {errors.password?.type === "minLength" && (
                        <FormError errorMessage="비밀번호는 5자 이상이어야 합니다." />
                    )}

                    <Button
                        canClick={isValid}
                        loading={loading}
                        actionText="로그인"
                    />
                    {loginMutationResult?.login.error && (
                        <FormError errorMessage={loginMutationResult.login.error} />
                    )}
                </form>
                <div>
                    Coupang이 처음이십니까?{" "}
                    <Link to="/create-account" className="text-sky-500 hover:underline">
                        계정 만들기
                    </Link>
                </div>
            </div>
        </div>
    )
}