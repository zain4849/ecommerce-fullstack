import Image from "next/image";
import Link from "next/link";

export default function NewArrival() {
  return (
    <section className="w-full py-14">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.22em] text-muted-foreground mb-2">
          Fresh drops
        </p>
        <h2 className="text-3xl md:text-4xl font-black">New Arrival</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
        {/* Gaming Collection */}
        <Link
          href="/products?category=Gaming"
          className="relative h-[340px] md:h-[420px] lg:h-[450px] lg:col-span-2 overflow-hidden rounded-2xl group shadow-lg"
        >
          <Image
            src="/categories/gaming.png"
            alt="Gaming Collection"
            fill
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/10" />
          <div className="absolute bottom-6 left-6 text-white">
            <h3 className="text-xl font-semibold">Gaming Collection</h3>
            <p className="text-sm text-gray-200 max-w-xs">
              Consoles, controllers & accessories for every gamer.
            </p>
            <span className="mt-3 underline text-sm">Shop Now</span>
          </div>
        </Link>

        {/* Mobile - Big Card */}
        <Link
          href="/products?category=Mobile"
          className="relative h-[340px] md:h-[420px] lg:h-auto lg:row-span-2 lg:col-span-2 overflow-hidden rounded-2xl group shadow-lg"
        >
          <Image
            src="/categories/mobile.png"
            alt="Mobile Phones"
            fill
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/10" />
          <div className="absolute bottom-6 left-6 text-white">
            <h3 className="text-xl font-semibold">Latest Smartphones</h3>
            <p className="text-sm text-gray-200 max-w-xs">
              Flagship phones from top brands, now available.
            </p>
            <span className="mt-3 underline text-sm">Shop Now</span>
          </div>
        </Link>

        {/* Audio */}
        <Link
          href="/products?category=Audio"
          className="relative h-[240px] md:h-[260px] overflow-hidden rounded-2xl group shadow-lg"
        >
          <Image
            src="/categories/speakers.png"
            alt="Audio Equipment"
            fill
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/10" />
          <div className="absolute bottom-6 left-6 text-white">
            <h3 className="text-xl font-semibold">Audio</h3>
            <p className="text-sm text-gray-200">Premium headphones & speakers</p>
            <span className="mt-3 underline text-sm">Shop Now</span>
          </div>
        </Link>

        {/* Smart Home */}
        <Link
          href="/products?category=Smart Home"
          className="relative h-[240px] md:h-[260px] overflow-hidden rounded-2xl group shadow-lg"
        >
          <Image
            src="/categories/smart.png"
            alt="Smart Home"
            fill
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/10" />
          <div className="absolute bottom-6 left-6 text-white">
            <h3 className="text-xl font-semibold">Smart Home</h3>
            <p className="text-sm text-gray-200">Automate your living space</p>
            <span className="mt-3 underline text-sm">Shop Now</span>
          </div>
        </Link>
      </div>
    </section>
  );
}
