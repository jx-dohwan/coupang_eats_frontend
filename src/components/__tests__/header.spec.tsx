import { MockedProvider } from "@apollo/client/testing";
import { render, screen, waitFor } from "@testing-library/react";
import { ME_QUERY } from "../../hooks/useMe";
import { BrowserRouter as Router } from "react-router-dom";
import { Header } from "../header";

describe("<Header />", () => {

    it("renders verify banner", async () => {
        // GraphQL 쿼리 모킹 데이터 
        render(
            <MockedProvider
                mocks={[
                    {
                        request: {
                            query: ME_QUERY,
                        },
                        result: {
                            data: {
                                me: {
                                    id: 1,
                                    email: "",
                                    role: "",
                                    verified: false, // 이메일이 검증되지 않은 상태
                                },
                            },
                        },
                    },
                ]}
            >
                {/* Router로 감싸서 Header 컴포넌트의 라우팅 기능을 활성화 */}
                <Router>
                    <Header />
                </Router>
            </MockedProvider>
        );
        await waitFor(async () => {  // 아래의 텍스트가 렌더링 되는지 확인
            // 모킹된 응답을 기다리기 위해 잠시 지연
            await new Promise((resolve) => setTimeout(resolve, 5));
            screen.getByText("이메일을 확인해 주세요.");
        });
    });

    it("renders without verify banner", async () => {
        // GraphQL 쿼리 모킹 데이터
        render(
            <MockedProvider
                mocks={[
                    {
                        request: {
                            query: ME_QUERY,
                        },
                        result: {
                            data: {
                                me: {
                                    id: 1,
                                    email: "",
                                    role: "",
                                    verified: true, // 이메일이 검증된 상태
                                },
                            },
                        },
                    },
                ]}
            >
                 {/* Router로 감싸서 Header 컴포넌트의 라우팅 기능을 활성화 */}
                <Router>
                    <Header />
                </Router>
            </MockedProvider>
        );

        await waitFor(async () => {// 아래의 해당 텍스트가 화면에 없는지 확인
            await new Promise((resolve) => setTimeout(resolve, 5)); // 모킹된 응답을 기다리기 위해 잠시 지연
            expect(screen.queryByText("이메일을 확인해 주세요.")).toBeNull(); // get...없으면 오류지만 query...은 HTMLElement 또는 null을 return한다. 해당 문구가 존재하지 않는다는 것을 테스트 한다
        })
    })
});