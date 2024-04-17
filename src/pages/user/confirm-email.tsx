import { gql, useApolloClient, useMutation } from "@apollo/client";
import { VerifyEmailMutation, VerifyEmailMutationVariables } from "../../__api__/graphql";
import { useMe } from "../../hooks/useMe";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet";

const VERIFY_EMAIL_MUTATION = gql`
  mutation verifyEmail($input: VerifyEmailInput!) {
    verifyEmail(input: $input) {
      ok
      error
    }
  }
`;

export const ConfirmEmail = () => {
    const { data: userData } = useMe();
    const client = useApolloClient();
    const navigate = useNavigate();
    const onCompleted = (data: VerifyEmailMutation) => {
        const {
            verifyEmail: { ok },
        } = data;
        if (ok && userData?.me.id) {
            client.writeFragment({
                id: `User:${userData.me.id}`,
                fragment: gql`
                fragment VerifiedUser on User {
                  verified
                }
              `,
                data: {
                    verified: true,
                },
            });
            navigate("/")
        }
    };

    const [verifyEmail] = useMutation<VerifyEmailMutation, VerifyEmailMutationVariables>(
        VERIFY_EMAIL_MUTATION,
        {
            onCompleted,
        }
    );

    useEffect(() => {
        const [_, code] = window.location.href.split("code=");
       /* verifyEmail({
          variables: {
            input: {
              code,
            },
          },
        });*/
      }, [verifyEmail]);

    return (
        <div className="mt-52 flex flex-col items-center justify-center">
            <Helmet>
                <title>Not Found | Coupang Eats</title>
            </Helmet>
            <h2 className="text-lg mb-1 font-medium">이메일 확인 중...</h2>
            <h4 className="text-gray-700 text-sm">
                잠시만 기다려 주세요. 이 페이지를 닫지 마세요...
            </h4>
        </div>
    );
};
