import { renderHook } from "@testing-library/react";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useCurrentUser } from "@/src/features/auth/hooks/useCurrentUser";

vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn(),
}));

vi.mock("react-redux", () => ({
  useDispatch: vi.fn(),
}));

describe("useCurrentUser", () => {
  it("dispatches user when query has data", () => {
    const dispatch = vi.fn();
    (useDispatch as unknown as ReturnType<typeof vi.fn>).mockReturnValue(dispatch);
    (useQuery as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: {
        userData: { id: "u1", email: "demo@example.com", name: "Demo", role: "CUSTOMER" },
      },
    });

    renderHook(() => useCurrentUser());
    expect(dispatch).toHaveBeenCalled();
  });
});
