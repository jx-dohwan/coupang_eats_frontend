import { gql, useApolloClient, useMutation } from "@apollo/client";
import { useMe } from "../../hooks/useMe";
import { EditProfileMutation, EditProfileMutationVariables } from "../../__api__/graphql";
import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet";
import { Button } from "../../components/button";

const EDIT_PROFILE_MUTATION = gql`
    mutation editProfile($input: EditProfileInput!) {
      editProfile(input: $input) {
        ok
        error
      }
    }
  `;

interface IFormProps {
    email?: string;
    password?: string;
}

export const EditProfile = () => {
    const { data: userData } = useMe();
    const client = useApolloClient();
    const onCompleted = (data: EditProfileMutation) => {
        const {
            editProfile: { ok },
        } = data;
        if (ok && userData) {
            const {
                me: { email: prevEmail, id },
            } = userData;
            const { email: newEmail } = getValues();
            if (prevEmail !== newEmail) {
                client.writeFragment({
                    id: `User:${id}`,
                    fragment: gql`
                  fragment EditedUser on User {
                    verified
                    email
                  }
                `,
                    data: {
                        email: newEmail,
                        verified: false,
                    },
                });
            }
        }
    };

    const [editProfile, { loading }] = useMutation<EditProfileMutation, EditProfileMutationVariables>(
        EDIT_PROFILE_MUTATION, {
        onCompleted,
    });

    const { register, handleSubmit, getValues, formState } = useForm<IFormProps>({
        mode: "onChange",
        defaultValues: {
            email: userData?.me.email,
        },
    });

    const onSubmit = () => {
        const { email, password } = getValues();
        editProfile({
            variables: {
                input: {
                    email,
                    ...(password !== "" && { password }),
                },
            },
        });
    };

    return (
        <div className="mt-52 flex flex-col justify-center items-center">
            <Helmet>
                <title>프로필 수정 | Coupang Eats</title>
            </Helmet>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid max-w-screen-sm gap-3 mt-5 w-full mb-5"
            >
                <input
                    {...register("email", {
                        required: "이메일은 필수입니다.",
                        pattern: {
                            value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                            message: "유효한 이메일을 입력해주세요."
                        }
                    })}

                    className="input"
                    type="email"
                    placeholder="이메일"
                />
                <input
                    {...register("password")}
                    className="input"
                    type="password"
                    placeholder="비밀번호"
                />
                <Button
                    loading={loading}
                    canClick={formState.isValid}
                    actionText="프로필 저장"
                />
            </form>

        </div>
    );

};