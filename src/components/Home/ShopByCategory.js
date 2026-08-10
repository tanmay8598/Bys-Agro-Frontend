import Image from "next/image";

const categories = [
  {
    title: "Pulses & Dal",
    image:
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop",
    color: "#F3D3BD",
  },
  {
    title: "Cooking Oils",
    image:
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=300&fit=crop",
    color: "#E6B93C",
  },
  {
    title: "Spices",
    image:
      "https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=400&h=300&fit=crop",
    color: "#C95B21",
  },
  {
    title: "Sugar & Salt",
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop",
    color: "#ECE8E2",
  },
  {
    title: "Dry Fruits & Nuts",
    image:
      "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=400&h=300&fit=crop",
    color: "#C88B50",
  },
];
const ShopByCategory = () => {
  return (
    <section className="bg-[#F7F2EA] py-10">
      <div className="max-w-7xl mx-auto px-8">
        <h2 className="font-serif text-4xl font-semibold text-[#2B1C16] mb-14">
          Shop by Category
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {categories.map((item) => (
            <div key={item.title} className="group cursor-pointer">
              <div
                className="relative h-32 rounded-3xl overflow-hidden transition duration-300 group-hover:scale-105"
                style={{
                  background: item.color,
                }}
              >
                {/* Replace with actual images */}

                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>

              <h3 className="mt-5 text-center text-sm font-semibold text-[#312620]">
                {item.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByCategory;
