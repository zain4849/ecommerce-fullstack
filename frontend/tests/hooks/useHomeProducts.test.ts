import { renderHook } from "@testing-library/react";
import { useQuery } from "@tanstack/react-query";
import { useFeaturedProducts, useTrendingProducts } from "@/src/features/products/hooks/useHomeProducts";

vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn(),
}));

describe("useHomeProducts hooks", () => {
  it("uses featured query key", () => {
    (useQuery as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ data: [] });
    renderHook(() => useFeaturedProducts());
    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ["products", "featured"],
      }),
    );
  });

  it("uses trending query key", () => {
    (useQuery as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ data: [] });
    renderHook(() => useTrendingProducts());
    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ["products", "trending"],
      }),
    );
  });
});
