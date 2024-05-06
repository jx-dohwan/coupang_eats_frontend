import { render, waitFor } from "@testing-library/react"
import { NotFound } from "../404"
import { BrowserRouter as Router } from "react-router-dom";

describe("<NotFound />", () => {
    it("renders OK", async () => {
        render(
            // Router로 NotFound 컴포넌트를 감싸서 렌더링
            <Router>
                <NotFound />
            </Router>);

        // Helmet을 통해 설정된 페이지 타이틀을 기다려서 확인
        await waitFor(() => {
            expect(document.title).toBe("Not Found | Coupang Eats");
        });
    });
});