import { render, screen } from "@testing-library/react"
import { Button } from "../button"


describe("<Button />", () => {
    it("should render OK with props", () => {
        render(<Button canClick={true} loading={false} actionText={"test"}/> // button을 렌더링한다.
        );
        screen.getByText("test"); // test 텍스트를 가진 버튼이 렌더링되었는지 확인
    });

    it("should display loading", () => {
        const {
            container: { firstChild },
        } = render(<Button canClick={false} loading={true} actionText={"test"}/>); // button을 렌더링
        screen.getByText("Loading..."); // 해당 텍스트가 화면에 렌더링 되었는지 확인
        expect(firstChild).toHaveClass("pointer-events-none") // pointer-events-none 클래스를 가진 첫 번째 자식 요소가 잇는 지 확인
    })
})