describe("Edit Profile", () => {
    const user = cy;
    beforeEach(() => {
        user.login("admin3@admin.com", "12345");
    });

    it('can go to / edit-profile using the header', () => {
        user.get('a[href="/edit-profile"]').click();
        user.title().should("eq", "프로필 수정 | Coupang Eats");
    });

    it("can change email", () => {
        user.intercept("POST", "https://coupang-eats-backend.onrender.com/graphql", (req) => {
            if (req.body?.operationName === "editProfile") {
                // @ts-ignore
                req.body?.variables?.input?.email = "admin3@admin.com";
            }
        });
        user.visit("/edit-profile");
        user.findByPlaceholderText("이메일").clear().type("adminEdit@admin.com");
        user.findByRole("button").click();
    });

})