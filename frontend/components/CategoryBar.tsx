import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    name: "Laptops",
    icon: "/categories/laptop.png",
    gradient: "from-blue-500/20 to-blue-300/10",
  },
  {
    name: "Mobile",
    icon: "/categories/mobile.png",
    gradient: "from-fuchsia-500/20 to-pink-300/10",
  },
  {
    name: "Cameras",
    icon: "/categories/camera.png",
    gradient: "from-amber-500/20 to-orange-300/10",
  },
  {
    name: "Smart Home",
    icon: "/categories/smart.png",
    gradient: "from-emerald-500/20 to-teal-300/10",
  },
  {
    name: "Gaming",
    icon: "/categories/gaming.png",
    gradient: "from-violet-500/20 to-indigo-300/10",
  },
  {
    name: "Audio",
    icon: "/categories/speakers.png",
    gradient: "from-rose-500/20 to-red-300/10",
  },
];

const CategoryBar = () => {
  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-5">
      {categories.map((cat) => (
        <Link
          key={cat.name}
          href={`/products?category=${encodeURIComponent(cat.name)}`}
          className="group"
        >
          <div className="relative flex flex-col items-center justify-center rounded-2xl border border-border/60 bg-card p-4 md:p-5 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-primary/10 group-hover:border-primary/30 overflow-hidden">
            <div
              className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-60 group-hover:opacity-100 transition-opacity`}
              aria-hidden
            />
            <div className="relative w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-2xl bg-white/80 backdrop-blur shadow-sm">
              <Image
                src={cat.icon}
                alt={cat.name}
                className="object-contain w-12 h-12 md:w-14 md:h-14 transition-transform duration-300 ease-out group-hover:scale-110"
                width={100}
                height={100}
              />
            </div>
            <span className="relative mt-3 text-xs md:text-sm font-semibold text-center text-foreground">
              {cat.name}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CategoryBar;
