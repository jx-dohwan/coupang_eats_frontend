import { ApolloProvider } from "@apollo/client";
import { createMockClient, MockApolloClient } from "mock-apollo-client";
import {
    render,
    waitFor,
    RenderResult,
    screen,
    fireEvent,
} from "../../test_utils";
import { useNavigate } from "react-router-dom";
import { CREATE_ACCOUNT_MUTATION, CreateAccount } from "../create_account";
import { UserRole } from "../../__api__/graphql";
import userEvent from "@testing-library/user-event";


const mockPush = jest.fn();

// react-router-dom 모듈을 모킹하여 useNavigate를 원하는 동작으로 교체
jest.mock("react-router-dom", () => {
    const realModule = jest.requireActual("react-router-dom");
    return {
        ...realModule, // 실제 모듈의 나머지 부분을 가져옴
        useNavigate: () => mockPush, // useNavigate 함수는 모킹된 mockPush 함수를 반환
    };
});

describe("<CreateAccount />", () => {
    let mockedClient: MockApolloClient; // MockApolloClient 인스턴스 변수
    let renderResult: RenderResult; // Render 결봐 변수

    // 각 테스트 케이스 전에 모의 Apollo 클라이언트를 초기화하고 CreateAccount를 렌더링
    beforeEach(async () => {
        mockedClient = createMockClient(); // 모의 클라이언트 생
        render(
            <ApolloProvider client={mockedClient}>
                <CreateAccount />
            </ApolloProvider>
        );
    });
    // 타이틀이 "계정 생성 | Coupang Eats"로 올바르게 렌더링되는지 확인
    it("renders OK", async () => {
        await waitFor(() => {
            expect(document.title).toBe("계정 생성 | Coupang Eats")
        });
    });

    // 검증 오류와 성공 메시지를 확인하는 테스트 케이스
    it("renders validation errors", async () => {
        // 이메일 및 비밀번호 입력 필드와 버튼을 식별합니다.
        const email = screen.getByPlaceholderText(/이메일/i);
        const password = screen.getByPlaceholderText(/비밀번호/i);
        const button = screen.getByTestId('button');
        // 테스트에 사용할 폼 데이터 정의
        const formData = {
            email: "test10@test.com",
            password: "12345",
            role: UserRole.Client,
        };

        // 모의 뮤테이션 응답을 정의합니다.
        const mockedLoginMutationResponse = jest.fn().mockResolvedValue({
            data: {
                createAccount: {
                    ok: true,
                    error: "mutation-error",
                },
            },
        });

        // 모의 클라이언트에 뮤테이션 요청 핸들러를 설정합니다.
        mockedClient.setRequestHandler(
            CREATE_ACCOUNT_MUTATION,
            mockedLoginMutationResponse
        );

        // window.alert 함수를 모킹하여 호출 여부를 확인합니다.
        jest.spyOn(window, "alert").mockImplementation(() => null);

        // 이메일과 비밀번호 입력 필드에 폼 데이터를 입력합니다.
        userEvent.type(email, formData.email);
        userEvent.type(password, formData.password);
        // "계정 생성하기" 버튼을 클릭합니다.
        fireEvent.click(button);
        // 뮤테이션 요청 핸들러가 올바르게 호출되었는지 확인합니다.
        await waitFor(() => {
            expect(mockedLoginMutationResponse).toHaveBeenCalledTimes(1);

        });
        // 뮤테이션 요청의 파라미터가 예상대로 호출되었는지 확인합니다.
        expect(mockedLoginMutationResponse).toHaveBeenCalledWith({
            createAccountInput: {
                email: formData.email,
                password: formData.password,
                role: formData.role,
            },
        });
        // window.alert가 "계정을 만들었습니다." 메시지로 호출되었는지 확인합니다.
        expect(window.alert).toHaveBeenCalledWith("계정을 만들었습니다.");
        // 경고 메시지("mutation-error")를 포함한 "alert" 역할의 요소를 확인합니다.
        const mutationError = screen.getByRole("alert");
        // useNavigate가 "/" 경로로 이동하도록 호출되었는지 확인합니다.
        expect(mockPush).toHaveBeenCalledWith("/");
        // 경고 메시지 내용이 "mutation-error"를 포함하는지 확인합니다.
        expect(mutationError).toHaveTextContent("mutation-error");
    });

    // 모든 테스트 케이스가 완료된 후 모킹된 모든 호출을 지웁니다.
    afterAll(() => {
        jest.clearAllMocks();
    });
});
