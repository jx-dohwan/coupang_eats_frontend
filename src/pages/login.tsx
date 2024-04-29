
import { useForm } from "react-hook-form";
import coupangEatsLogo from "../images/coupang-eats-delivery-190910-04.png";
import {
    LoginMutation,
    LoginMutationVariables,
} from "../__api__/graphql";
import { LOCALSTORAGE_TOKEN } from "../constants";
import { authTokenVar, isLoggedInVar } from "../apollo";
import { gql, useMutation } from "@apollo/client";
import { Helmet } from "react-helmet";
import { FormError } from "../components/form_error";
import { Button } from "../components/button";
import { Link } from "react-router-dom";

// 로그인을 위한 GraphQL 뮤테이션 정의, 입력 타입은 LoginInput, 결과로는 성공 여부(ok), 토큰(token), 에러 메시지(error)를 반환
export const LOGIN_MUTATION = gql`
  mutation login($loginInput: LoginInput!) {
    login(input: $loginInput) {
      ok
      token
      error
    }
  }
`;

// 로그인 폼 데이터의 인터페이스 정의: 이메일과 비밀번호
interface ILoginForm {
    email: string;
    password: string;
}

// 로그인 컴포넌트
export const Login = () => {
    // useForm 훅을 사용하여 폼 관리, mode: "onChange"는 입력 필드가 변경될 때마다 폼 검증을 실행
    const {
        register,
        getValues,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<ILoginForm>({
        mode: "onChange",
    });

    // 뮤테이션 완료 후 실행되는 콜백 함수
    const onCompleted = (data: LoginMutation) => {
        const {
            login: { ok, token },
        } = data;
        // 로그인 성공 및 토큰이 있는 경우
        if (ok && token) {
            alert("로그인을 했습니다.");  // 사용자에게 로그인 성공 알림
            localStorage.setItem(LOCALSTORAGE_TOKEN, token);  // 로컬 스토리지에 토큰 저장
            authTokenVar(token);  // Apollo local state에 토큰 저장 (Reactive Variable)
            isLoggedInVar(true);  // 로그인 상태를 true로 설정 (Reactive Variable)
        }
    };

    // loginMutation 초기화, 실행 상태와 결과를 관리
    const [loginMutation, { data: loginMutationResult, loading }] = useMutation<
        LoginMutation,
        LoginMutationVariables
    >(LOGIN_MUTATION, {
        onCompleted,
    });

    // 폼 제출 함수
    const onSubmit = () => {
        // 현재 로딩 중이 아니라면
        if (!loading) {
            const { email, password } = getValues();  // 폼에서 이메일과 비밀번호 값 추출
            loginMutation({
                variables: {
                    loginInput: {  // 로그인 뮤테이션에 사용할 변수 설정
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
                <img src={coupangEatsLogo} className="w-100 mb-10" alt="Coupang Eats" />
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