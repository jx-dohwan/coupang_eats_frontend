import { Helmet } from "react-helmet"
import coupangEatsLogo from "../images/coupang-eats-delivery-190910-04.png";
import { Button } from "../components/button";
import { gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { createAccountMutation, createAccountMutationVariables } from "../__generated__/createAccountMutation";
import { UserRole } from "../__generated__/globalTypes";
import { Link, useHistory } from "react-router-dom";
import { FormError } from "../components/form-error";


export const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccountMutation($createAccountInput: CreateAccountInput!) {
    createAccount(input: $createAccountInput) {
      ok
      error
    }
  }
`;

interface ICreateAccountForm {
    email: string;
    password: string;
    role: UserRole;
}

export const CreateAccount = () => {
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

    const history = useHistory();
    const onCompleted = (data: createAccountMutation) => {
        const {
            createAccount: { ok },
        } = data;
        if (ok) {
            alert("계정을 만들었습니다.");
            history.push("/");
        }
    };
    const [
        createAccountMutation,
        { loading, data: createAccountMutationResult },
    ] = useMutation<createAccountMutation, createAccountMutationVariables>(
        CREATE_ACCOUNT_MUTATION,
        {
            onCompleted,
        }
    );
    const onSubmit = () => {
        if (!loading) {
            const { email, password, role } = getValues();
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