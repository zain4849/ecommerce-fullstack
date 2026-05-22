import reducer, { logout, setCurrentUser } from "@/store/authSlice";

describe("authSlice", () => {
  it("sets current user and persists to localStorage", () => {
    const next = reducer(
      { user: null },
      setCurrentUser({
        userData: { id: "u1", name: "Demo", email: "demo@example.com", role: "CUSTOMER" },
      }),
    );
    expect(next.user?.email).toBe("demo@example.com");
    expect(localStorage.getItem("user")).toContain("demo@example.com");
  });

  it("clears user on logout", () => {
    localStorage.setItem("user", JSON.stringify({ id: "u1" }));
    const next = reducer(
      { user: { id: "u1", name: "Demo", email: "demo@example.com", role: "CUSTOMER" } },
      logout(),
    );
    expect(next.user).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();
  });
});
