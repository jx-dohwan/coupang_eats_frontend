import { render, screen } from "@testing-library/react";
import { FormError } from "../form_error";

describe("<FormError />", () => {
    it("renders OK with props", () => {
        render(<FormError errorMessage="test"/>); // FormError에 errorMessage를 test로 설정해서 렌더링
        screen.getByText("test"); // test 텍스트를 가진 요소가 화면에 렌덜이되었는지 확인
    });
});