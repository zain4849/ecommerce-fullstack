import Image from "next/image";

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
    // note the properties on the div right below give us "Overflow slider" for mobile
    <div className="flex items-end h-80 relative py-10 gap-12 border-gray-200 border-b overflow-x-auto justify-center">
      {categories.map((cat) => (
        <div key={cat.name} className="relative flex flex-col items-center justify-end group cursor-pointer">

          <button
            className="self-end justify-self-end h-20 w-50 bg-accent rounded-[50%] transition group-hover:bg-foreground"
          />

          <div className="absolute -top-20 w-30 h-30 flex items-center justify-center">
            <Image
              src={cat.icon}
              alt={cat.name}
              className="object-contain w-full h-full transition-transform duration-200 ease-in-out group-hover:-translate-y-3"
              width={100}
              height={100}
            />
          </div>

          <span className="mt-3 text-lg font-bold">{cat.name}</span>
        </div>
      ))}
    </div>
  );
};


export default CategoryBar;
