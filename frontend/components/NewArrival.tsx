export default function NewArrival() {
  return (
    <section className="w-full py-12">
      <h2 className="text-3xl font-bold mb-8">New Arrival</h2>

      <div className="grid grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Women’s Collection */}
        <div className="relative h-[450px] lg:col-span-2 overflow-hidden rounded-xl">
          <img
            src="/images/women.png"
            alt="Women’s Collection"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />

          <div className="absolute bottom-6 left-6 text-white">
            <h3 className="text-xl font-semibold">Gaming Collection</h3>
            <p className="text-sm text-gray-200 max-w-xs">
              Featured collections that give you another vibe.
            </p>
            <button className="mt-3 underline text-sm">Shop Now</button>
          </div>
        </div>
        {/* PlayStation - Big Card */}
        <div className="relative lg:row-span-2 lg:col-span-2 overflow-hidden rounded-xl">
          <img
            src="/images/ps5.png"
            alt="PlayStation 5"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />

          <div className="absolute bottom-6 left-6 text-white">
            <h3 className="text-xl font-semibold">IPhone 17 Pro Max</h3>
            <p className="text-sm text-gray-200 max-w-xs">
              Black and white version of the PS5 coming out on sale.
            </p>
            <button className="mt-3 underline text-sm">Shop Now</button>
          </div>
        </div>


        {/* Speakers */}
        <div className="relative h-[250px] overflow-hidden rounded-xl">
          <img
            src="/images/speakers.png"
            alt="Speakers"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />

          <div className="absolute bottom-6 left-6 text-white">
            <h3 className="text-xl font-semibold">Speakers</h3>
            <p className="text-sm text-gray-200">Amazon wireless speakers</p>
            <button className="mt-3 underline text-sm">Shop Now</button>
          </div>
        </div>

        {/* Perfume */}
        <div className="relative h-[250px] overflow-hidden rounded-xl">
          <img
            src="/images/perfume.png"
            alt="Perfume"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />

          <div className="absolute bottom-6 left-6 text-white">
            <h3 className="text-xl font-semibold">Perfume</h3>
            <p className="text-sm text-gray-200">GUCCI INTENSE-OUD EDP</p>
            <button className="mt-3 underline text-sm">Shop Now</button>
          </div>
        </div>
      </div>
    </section>
  );
}
