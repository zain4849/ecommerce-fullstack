import jwt from "jsonwebtoken";
import { createToken } from "../../src/modules/auth/auth.service.js";
// This test is to ensure that the createToken function is working as expected
// It creates a token with the expected payload and then verifies the token
// It then checks that the decoded token has the expected id and role
// It does this by creating a token with the createToken function
// Then it verifies the token with the jwt.verify function
// Then it checks that the decoded token has the expected id and role
// It does this by checking the decoded token's id and role
// It does this by checking the decoded token's id and role
describe("auth.service", () => {
  it("creates a token with expected payload", () => {
    process.env.JWT_SECRET = "12345678901234567890123456789012";
    const token = createToken("user-1", "CUSTOMER");
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string; role: string };
    expect(decoded.id).toBe("user-1");
    expect(decoded.role).toBe("CUSTOMER");
  });
});

/*

 Note that during runtime, the JwtPayload is roughly:
{
  id: "user-1",
  role: "CUSTOMER",
  iat: 1716123456,   // number — when token was issued
  exp: 1716209856    // number — when it expires (1 day later)
}

But at compile time, TypeScript only knows the return type from the library: JwtPayload | string. And the JwtPayload interface doesn't list id or role as known properties. So TS won't let you use decoded.id until you narrow or assert.

*/
