
describe("Create Account", () => {
    const user = cy;
    it("should see email / password validation errors", () => {
      user.visit("/");
      user.findByText(/계정 만들기/i).click();
      user.findByPlaceholderText(/이메일/i).type("test10@test.com");
      user.findByPlaceholderText(/이메일/i).clear();
      user.findByPlaceholderText(/이메일/i).type("test10@test.com");
      user.findByPlaceholderText(/비밀번호/i).type("a").clear();
    });
  
    it("should be able to create account and login", () => {
      //DB에도 존재하는척 하는 것임
      user.intercept("http://localhost:4000/graphql", (req) => {
        const { operationName } = req.body;
        if (operationName && operationName === "createAccountMutation") {
          req.reply((res) => {
            res.send({
              data: {
                createAccount: {
                  ok: true,
                  error: null,
                  __typename: "CreateAccountOutput",
                },
              },
            });
          });
        }
      });
      user.visit("/create-account");
      user.findByPlaceholderText(/이메일/i).type("test11@test.com");
      user.findByPlaceholderText(/비밀번호/i).type("12345");
      user.findByRole("button").click();
      user.wait(1000);
      // @ts-ignore
      user.login("test11@test.com", "12345");
    });
  });