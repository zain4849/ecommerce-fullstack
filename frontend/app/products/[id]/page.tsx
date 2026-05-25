import Link from "next/link";
import { Button } from "@/components/ui/button";
import { fetchProductByIdServer, fetchProductsServer } from "@/lib/products.server";
import { getProductId } from "@/types/product";
import ProductDetailClient from "./ProductDetailClient";

export const revalidate = 120;
export const dynamic = "force-dynamic";

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;

  try {
    const [product, productList] = await Promise.all([
      fetchProductByIdServer(id, { next: { revalidate } }), // next: { revalidate } is used to revalidate the page every 120 seconds
      fetchProductsServer({ limit: 12 }, { next: { revalidate } }),
    ]);

    const similarProducts = productList.products.filter((item) => getProductId(item) !== id).slice(0, 6);
    return <ProductDetailClient product={product} similarProducts={similarProducts} />;
  } catch {
    return (
      <div className="text-center py-20 min-h-[60vh]">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-semibold mb-2">Product Not Found</h2>
        <p className="text-gray-500 mb-6">
          This product may have been removed or doesn&apos;t exist.
        </p>
        <Link href="/products">
          <Button>Browse All Products</Button>
        </Link>
      </div>
    );
  }
}
