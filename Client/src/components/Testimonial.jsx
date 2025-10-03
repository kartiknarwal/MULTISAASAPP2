import { assets } from "../assets/assets";

const Testimonial = () => {
  const dummyTestimonialData = [
    {
      image:
        "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?q=80&w=200",
      name: "Sophia Carter",
      title: "Founder, GrowthLabs",
      content:
        "This platform has streamlined our creative workflow. What used to take days now takes hours without compromising quality.",
      rating: 5,
    },
    {
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200",
      name: "Michael Chen",
      title: "Head of Marketing, InnovateX",
      content:
        "Sleek, powerful, and intuitive. The AI suggestions have completely changed the way my team approaches content production.",
      rating: 4,
    },
    {
      image:
        "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=200",
      name: "Aarav Sharma",
      title: "Freelance Writer",
      content:
        "As a solo creator, this tool has become my secret weapon. It saves me time and keeps my work sharp and polished.",
      rating: 5,
    },
  ];

  return (
    <div className="px-4 sm:px-20 xl:px-32 py-24 bg-gradient-to-b from-[#0b0f19] to-[#111827]">
      {/* Heading */}
      <div className="text-center">
        <h2 className="text-white text-[38px] font-bold tracking-tight">
          Loved by Creators
        </h2>
        <p className="text-gray-400 max-w-lg mx-auto text-sm">
          Real stories from real people who use our platform every day.
        </p>
      </div>

      {/* Testimonials */}
      <div className="flex flex-wrap mt-12 justify-center">
        {dummyTestimonialData.map((testimonial, index) => (
          <div
            key={index}
            className="p-6 m-4 max-w-xs rounded-xl bg-[rgba(255,255,255,0.05)] backdrop-blur-sm border border-[rgba(255,255,255,0.08)] shadow-lg hover:shadow-xl hover:-translate-y-1 transition duration-300 cursor-pointer"
          >
            {/* Stars */}
            <div className="flex items-center gap-1">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <img
                    key={i}
                    src={
                      i < testimonial.rating
                        ? assets.star_icon
                        : assets.star_dull_icon
                    }
                    className="w-4 h-4"
                    alt="star"
                  />
                ))}
            </div>

            {/* Content */}
            <p className="text-gray-300 text-sm my-5 leading-relaxed">
              "{testimonial.content}"
            </p>
            <hr className="mb-5 border-gray-700" />

            {/* Profile */}
            <div className="flex items-center gap-4">
              <img
                src={testimonial.image}
                className="w-12 h-12 object-cover rounded-full border border-gray-700"
                alt={testimonial.name}
              />
              <div className="text-sm">
                <h3 className="font-semibold text-white">
                  {testimonial.name}
                </h3>
                <p className="text-xs text-gray-400">{testimonial.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonial;
