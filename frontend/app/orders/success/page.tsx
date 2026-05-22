import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export default function SuccessPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24 min-h-[60vh]">
      <div className="max-w-lg mx-auto text-center bg-card rounded-3xl border border-border/60 p-8 md:p-12 shadow-lg shadow-primary/5">
        <div className="size-20 rounded-full bg-success/10 text-success mx-auto flex items-center justify-center mb-6">
          <CheckCircle2 className="size-10" />
        </div>
        <h1 className="text-3xl md:text-4xl font-black mb-3">
          Payment Successful
        </h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Thank you for your order! Your payment has been processed and your
          order is being prepared. A confirmation email is on its way.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/orders" className="flex-1">
            <Button variant="default" className="w-full">
              View My Orders
            </Button>
          </Link>
          <Link href="/products" className="flex-1">
            <Button variant="outline" className="w-full">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
