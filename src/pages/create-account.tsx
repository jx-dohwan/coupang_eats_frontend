import { Helmet } from "react-helmet"
import coupangEatsLogo from "../images/coupang-eats-delivery-190910-04.png";
import { Button } from "../components/button";
import { gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { CreateAccountMutation, CreateAccountMutationVariables } from "../__api__/graphql";
import { UserRole } from "../__api__/graphql";

import { Link, useNavigate } from "react-router-dom";
import { FormError } from "../components/form-error";


// GraphQL mutation 정의: 새 계정 생성, 입력 타입은 CreateAccountInput이며, 결과로는 성공 여부(ok)와 에러 메시지(error)를 반환함
export const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccount($createAccountInput: CreateAccountInput!) {
    createAccount(input: $createAccountInput) {
      ok
      error
    }
  }
`;

// 폼 데이터 타입 정의: 이메일, 비밀번호, 역할(Role)
interface ICreateAccountForm {
  email: string;
  password: string;
  role: UserRole;
}

// 계정 생성 컴포넌트
export const CreateAccount = () => {
  // useForm 훅을 사용하여 폼 관리. 폼 상태의 변화가 있을 때마다 검증하고, 기본적으로 role은 UserRole.Client로 설정
  const {
    register,
    getValues,
    watch,
    formState: { errors },
    handleSubmit,
    formState,
  } = useForm<ICreateAccountForm>({
    mode: "onChange",
    defaultValues: {
      role: UserRole.Client,
    },
  });

  // 페이지 이동을 위한 훅
  const navigate = useNavigate();

  // GraphQL 뮤테이션이 완료되었을 때 실행되는 함수
  const onCompleted = (data: CreateAccountMutation) => {
    const {
      createAccount: { ok },
    } = data;
    // 뮤테이션 실행이 성공했을 경우
    if (ok) {
      alert("계정을 만들었습니다.");  // 사용자에게 계정 생성 성공 알림
      navigate("/");  // 홈페이지로 리다이렉션
    }
  };

  // createAccountMutation 초기화, 실행 상태와 결과를 감시
  const [
    createAccountMutation,
    { loading, data: createAccountMutationResult },
  ] = useMutation<CreateAccountMutation, CreateAccountMutationVariables>(
    CREATE_ACCOUNT_MUTATION,
    {
      onCompleted,
    }
  );

  // 폼 제출 함수
  const onSubmit = () => {
    // 현재 로딩 중이 아니라면
    if (!loading) {
      const { email, password, role } = getValues();  // 폼에서 입력값 추출
      // 추출된 입력값을 변수로 사용하여 뮤테이션 실행
      createAccountMutation({
        variables: {
          createAccountInput: { email, password, role },
        },
      });
    }
  };


  return (
    <div className="h-screen flex items-center flex-col mt-10 lg:mt-28">
      <Helmet>
        <title>계정 생성 | Coupang Eats</title>
      </Helmet>
      <div className="w-full max-w-screen-sm flex flex-col px-5 items-center">
        <img src={coupangEatsLogo} className="w-100 mb-10" alt="Coupang Eats" />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-3 mt-5 w-full mb-5"
        >
          <input
            {...register("email", {
              required: "이메일은 필수입니다.",
              pattern:
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            })}
            type="email"
            placeholder="이메일"
            className="input"
          />

          {errors.email?.message && (
            <FormError errorMessage={errors.email.message} />
          )}
          {errors.email?.type === "pattern" && (
            <FormError errorMessage={"유효한 이메일을 입력해주세요."} />
          )}

          <input
            {...register("password", { required: "비밀번호는 필수입니다." })}
            required
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
          <select
            {...register("role", { required: true })}
            className="input"
          >
            {Object.keys(UserRole).map((role, index) => (
              <option key={index}>{role}</option>
            ))}
          </select>

          <Button
            canClick={formState.isValid}
            loading={loading}
            actionText={"계정 생성하기"}
          />
          {createAccountMutationResult?.createAccount.error && (
            <FormError
              errorMessage={createAccountMutationResult.createAccount.error}
            />
          )}
        </form>
        <div>
          이미 계정이 있습니까? {" "}
          <Link to="/" className="text-sky-500 hover:underline">
            로그인 하기
          </Link>
        </div>
      </div>

    </div>
  )
}