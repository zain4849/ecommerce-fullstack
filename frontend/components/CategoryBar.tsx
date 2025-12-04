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
    <div className="flex items-end relative py-10 gap-4 border-gray-200 border-b overflow-x-auto justify-center h-60">
      {categories.map((cat) => (
        <div key={cat.name} className="relative flex flex-col items-center group cursor-pointer">

          <button
            className=" items-center justify-center h-25 w-50 bg-foreground rounded-full transition group-hover:bg-primary"
          />

          <div className="absolute top-[-40px] w-30 h-30 flex items-center justify-center">
            <img
              src={cat.icon}
              alt={cat.name}
              className="object-contain w-full h-full transition-transform duration-200 ease-in-out group-hover:-translate-y-3"
            />
          </div>

          <span className="mt-3 text-lg font-bold">{cat.name}</span>
        </div>
      ))}
    </div>
  );
};


export default CategoryBar;
