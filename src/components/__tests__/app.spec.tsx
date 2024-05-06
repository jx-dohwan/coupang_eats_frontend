import { render, screen, waitFor } from "@testing-library/react";
import { LoggedInRouter } from "../../routers/logged_in_router";
import { LoggedOutRouter } from "../../routers/logged_out_router"
import App from "../app";
import { isLoggedInVar } from "../../apollo";

// logged_out_router 모듈을 모팅하여 LoggedOutRouter 컴포넌트를 정
jest.mock("../../routers/logged_out_router", () => {
    return {
        LoggedOutRouter: () => <span>logged out</span> // 모킹된 컴포넌트 반환
    };
});

// logged_in_router 모듈을 모팅하여 loggedInRouter 컴포넌트를 정의
jest.mock("../../routers/logged_in_router", () => {
    return {
        LoggedInRouter: () => <span>logged in</span>
    };
});


describe("<App/>", () => {
    it("renders LoggedOutRouter", () => {
        render(<App />) // App 컴포넌트를 렌더링
        screen.getByText("logged out"); // logged out 텍스트를 가진 요소가 화면에 렌더링되는지 확인
    });
    it("renders LoggedInRouter", async () => {
        render(<App />) // App 컴포넌트를 레넏링
        await waitFor(() => { // 로그인 상태를 변경하여 loggedInRouter가 렌더링 되는지 확인
            isLoggedInVar(true); // 로그인 상태로 변경
            expect(screen.getByText("logged in")).toBeInTheDocument(); // logged in 텍스트 확인
        });
    });
});