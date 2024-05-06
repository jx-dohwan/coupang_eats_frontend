import { render, screen } from "@testing-library/react";
import { RestaurantView } from "../restaurant_view";
import { BrowserRouter as Router } from "react-router-dom";

describe("<RestaurantView />", () => {
    it("renders OK with props", () => {
        // RestaurantView 컴포넌트에 필요한 props 정의
        const restaurantProps = {
            id:"1",
            name:"name",
            coverImg:"img"
        };

        // Router로 감싸서 RestaurantView 컴포넌트를 렌더링
        const {
            container:{firstChild},
        } = render(
            <Router>
                {/* restaurantProps 객체를 사용해 RestaurantView 컴포넌트에 props 전달 */}
                <RestaurantView {...restaurantProps}/>
            </Router>
        );

        screen.getByText(restaurantProps.name); // 레스토랑의 이름이 올바르게 화면에 렌더링되었는지 확인
        expect(firstChild).toHaveAttribute( // 첫 번째 자식 요소가 예상되는 href값을 가지고 있는지 확인
            "href",
            `/restaurants/${restaurantProps.id}`
        )
    })
})