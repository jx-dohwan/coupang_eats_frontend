describe("Log In", () => {
    const user = cy;
    it("should see login page", () => {
        user.visit("/").title().should("eq", "로그인 | Coupang Eats");
    });
    
    it("can see email / password validation errors", () => {
        user.visit("/");
        user.findByPlaceholderText(/이메일/i).type("test@test");
        user.findByPlaceholderText(/이메일/i).clear();
        user.findByPlaceholderText(/이메일/i).type("test10@test.com");
        user
        .findByPlaceholderText(/비밀번호/i)
        .type("a")
        .clear();
    })

    it("can fill out the form and log in", () => {
        user.login("test10@test.com","12345")
    })
})