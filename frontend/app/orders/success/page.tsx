import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SuccessPage() {
  return (
    <div className="container mx-auto text-center py-20 min-h-[60vh]">
      <div className="max-w-md mx-auto">
        <div className="text-6xl mb-6">✓</div>
        <h1 className="text-3xl font-semibold text-green-600 mb-4">
          Payment Successful
        </h1>
        <p className="text-muted-foreground mb-8">
          Thank you for your order! Your payment has been processed and your
          order is being prepared.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/orders">
            <Button variant="default">View My Orders</Button>
          </Link>
          <Link href="/products">
            <Button variant="outline">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
