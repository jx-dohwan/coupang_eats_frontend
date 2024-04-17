import { gql, useApolloClient, useMutation } from "@apollo/client";
import { VerifyEmailMutation, VerifyEmailMutationVariables } from "../../__api__/graphql";
import { useMe } from "../../hooks/useMe";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet";

// VERIFY_EMAIL_MUTATION: 이메일 인증을 위한 GraphQL 뮤테이션 정의
const VERIFY_EMAIL_MUTATION = gql`
  mutation verifyEmail($input: VerifyEmailInput!) {
    verifyEmail(input: $input) {
      ok
      error
    }
  }
`;

// ConfirmEmail 컴포넌트 정의
export const ConfirmEmail = () => {
    // useMe 커스텀 훅을 통해 현재 로그인한 사용자의 데이터를 가져옴
    const { data: userData } = useMe();

    // useApolloClient 훅을 사용하여 Apollo 클라이언트 인스턴스를 가져옴
    const client = useApolloClient();

    // useNavigate 훅을 사용하여 네비게이션 함수를 가져옴
    const navigate = useNavigate();

    // onCompleted 함수: verifyEmail 뮤테이션이 완료된 후 실행될 콜백 함수
    const onCompleted = (data: VerifyEmailMutation) => {
        const {
            verifyEmail: { ok },
        } = data;

        // 뮤테이션 결과가 성공적이고 사용자 데이터가 유효한 경우
        if (ok && userData?.me.id) {
            // 사용자의 `verified` 상태를 true로 업데이트
            client.writeFragment({
                id: `User:${userData.me.id}`,  // Fragment의 ID 지정
                fragment: gql`
                fragment VerifiedUser on User {
                  verified
                }
              `,  // 업데이트할 Fragment 정의
                data: {
                    verified: true,  // 업데이트할 데이터
                },
            });

            // 루트 경로('/')로 네비게이션 실행
            navigate("/")
        }
    };

    // useMutation 훅을 사용하여 verifyEmail 뮤테이션을 설정
    const [verifyEmail] = useMutation<VerifyEmailMutation, VerifyEmailMutationVariables>(
        VERIFY_EMAIL_MUTATION,
        {
            onCompleted,  // 뮤테이션 완료 후 실행할 콜백 함수 지정
        }
    );

    // 컴포넌트가 마운트될 때 실행될 useEffect 훅
    useEffect(() => {
        // URL에서 'code' 파라미터 값을 추출
        const [, code] = window.location.href.split("code=");

        // verifyEmail 함수를 호출하여 뮤테이션 실행
         verifyEmail({
          variables: {
            input: {
              code,  // 이메일 인증 코드를 뮤테이션 입력 변수로 설정
            },
          },
        }); 
    }, [verifyEmail]);  // useEffect 의존성 배열에 verifyEmail 함수 추가


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
