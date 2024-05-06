import { ApolloProvider } from "@apollo/client";
import { createMockClient, MockApolloClient } from "mock-apollo-client";
import { BrowserRouter as Router } from "react-router-dom";
import { Login, LOGIN_MUTATION } from "../login";
import { render, RenderResult, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

/*
/i: 대소문자 무시 (case-insensitive)
/g: 전역 검색 (global)
/m: 여러 줄 모드 (multi-line)
/s: 줄바꿈 문자 포함 (dot-all)
 */

describe("<Login />", () => {
    let mockedClient: MockApolloClient;
    let renderResult: RenderResult;

    // 각 테스트 케이스 전에 MockApolloClient를 생성하고 <Login /> 컴포넌트를 렌더링
    beforeEach(() => {
        mockedClient = createMockClient();
        renderResult = render(
            <Router>
                <ApolloProvider client={mockedClient}>
                    <Login />
                </ApolloProvider>
            </Router>
        );
    });

    // 페이지 타이틀이 "로그인 | Coupang Eats"로 올바르게 렌더링되는지 확인
    it("should render OK", async () => {
        await waitFor(() => {
            expect(document.title).toBe("로그인 | Coupang Eats");
        });
    });

    // 이메일 검증 오류 메시지와 비밀번호 필수 오류 메시지를 확인
    it("displays email validation errors", async () => {
        const email = screen.getByPlaceholderText(/이메일/i);

        // 이메일 필드에 유효하지 않은 이메일을 입력하고 검증 오류 메시지를 확인
        userEvent.type(email, 'invalid-email');

        await waitFor(() => {
            const errorMessages = screen.getAllByRole("alert");
            const specificMessage = errorMessages.find(message => message.textContent === "유효한 이메일을 입력해주세요.");
            expect(specificMessage).toBeInTheDocument();
        });

        // 이메일 필드를 비워서 필수 항목 오류 메시지를 확인
        userEvent.clear(email);
        await waitFor(() => {
            const errorMessages = screen.getAllByRole("alert");
            const specificMessage = errorMessages.find(message => message.textContent?.includes("이메일은 필수입니다."));
            expect(specificMessage).toBeInTheDocument();
        });
    });

    // 비밀번호 필수 오류 메시지를 확인
    it("displays password required errors", async () => {
        const email = screen.getByPlaceholderText(/이메일/i);
        const submitBtn = screen.getByRole("button");

        // 이메일 필드에 값을 입력하고 제출 버튼을 클릭하여 비밀번호 필수 오류 메시지를 확인
        userEvent.type(email, "test10@test.com");
        userEvent.click(submitBtn);

        await waitFor(() => {
            const errorMessage = screen.getByRole("alert");
            expect(errorMessage).toHaveTextContent(/비밀번호는 필수입니다./i);
        });
    });

    // 폼을 제출하고 뮤테이션을 호출하는지 확인
    it("submits form and calls mutation", async () => {
        const formData = {
            email: "test10@test.com",
            password: "12345",
        };

        const email = screen.getByPlaceholderText(/이메일/i);
        const password = screen.getByPlaceholderText(/비밀번호/i);
        const submitBtn = screen.getByRole("button");

        // 모의 뮤테이션 응답을 정의
        const mockedMutationResponse = jest.fn().mockResolvedValue({
            data: {
                login: { ok: true, token: "XXX", error: "mutation-error" },
            },
        });

        // MockApolloClient에 뮤테이션 요청 핸들러를 설정
        mockedClient.setRequestHandler(LOGIN_MUTATION, mockedMutationResponse);

        // localStorage.setItem 함수를 모킹하여 호출 여부를 확인
        jest.spyOn(Storage.prototype, "setItem");

        // 폼 데이터를 입력하고 제출 버튼을 클릭
        userEvent.type(email, formData.email);
        userEvent.type(password, formData.password);
        userEvent.click(submitBtn);

        // 뮤테이션 요청 핸들러가 올바르게 호출되었는지 확인합니다.
        await waitFor(() => {
            expect(mockedMutationResponse).toHaveBeenCalledTimes(1);
        });

        // 뮤테이션 요청의 파라미터가 예상대로 호출되었는지 확인
        expect(mockedMutationResponse).toHaveBeenCalledWith({
            loginInput: {
                email: formData.email,
                password: formData.password,
            },
        });

        // 경고 메시지("mutation-error")를 포함한 "alert" 역할의 요소를 확인
        const errorMessage = screen.getByRole("alert");
        expect(errorMessage).toHaveTextContent(/mutation-error/i);

        // localStorage.setItem 함수가 예상대로 호출되었는지 확인
        expect(localStorage.setItem).toHaveBeenCalledWith("coupang-token", "XXX");
    });
});
