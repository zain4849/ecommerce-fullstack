import Image from "next/image";
import Link from "next/link";

const categories = [
  { name: "Laptops", icon: "/categories/laptop.png" },
  { name: "Mobile", icon: "/categories/mobile.png" },
  { name: "Cameras", icon: "/categories/camera.png" },
  { name: "Smart Home", icon: "/categories/smart.png" },
  { name: "Gaming", icon: "/categories/gaming.png" },
  { name: "Audio", icon: "/categories/speakers.png" },
];

const CategoryBar = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
      {categories.map((cat) => (
        <Link
          key={cat.name}
          href={`/products?category=${encodeURIComponent(cat.name)}`}
          className="group"
        >
          <div className="relative flex flex-col items-center justify-center rounded-2xl border border-border/60 bg-white/70 backdrop-blur p-6 transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-accent/10">
            <div className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center rounded-full bg-gradient-to-br from-muted to-background">
              <Image
                src={cat.icon}
                alt={cat.name}
                className="object-contain w-14 h-14 md:w-16 md:h-16 transition-transform duration-200 ease-in-out group-hover:scale-105"
                width={100}
                height={100}
              />
            </div>

            <span className="mt-4 text-sm md:text-base font-semibold text-center">
              {cat.name}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CategoryBar;
