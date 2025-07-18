import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface TestimonialData {
  id: string;
  name: string;
  handle: string;
  content: string;
  avatar: string;
  color: string;
}

const testimonialsData: TestimonialData[] = [
  {
    id: "1",
    name: "Sarah Chen",
    handle: "@sarahdesigns",
    content:
      "Working with design requests was absolutely incredible! They transformed our brand identity completely. The attention to detail and creative vision exceeded all our expectations. Can't wait for our next project!",
    avatar: "SC",
    color: "from-festival-orange to-festival-pink",
  },
  {
    id: "2",
    name: "Marcus Rodriguez",
    handle: "@marcustech",
    content:
      "The UI/UX design for our mobile app is phenomenal. The team understood our vision perfectly and delivered something even better than we imagined. Professional, creative, and always on time!",
    avatar: "MR",
    color: "from-festival-pink to-festival-amber",
  },
  {
    id: "3",
    name: "Emily Watson",
    handle: "@emilycreative",
    content:
      "From concept to completion, the design process was seamless. The branding package we received was comprehensive and beautifully executed. Our customers love the new look!",
    avatar: "EW",
    color: "from-festival-yellow to-festival-coral",
  },
  {
    id: "4",
    name: "David Kim",
    handle: "@davidstartup",
    content:
      "Outstanding design work! The logo and brand guidelines they created perfectly capture our company's essence. The whole team was responsive and incorporated our feedback brilliantly.",
    avatar: "DK",
    color: "from-festival-coral to-festival-magenta",
  },
  {
    id: "5",
    name: "Lisa Thompson",
    handle: "@lisabiz",
    content:
      "The website design they created for us is absolutely stunning. Clean, modern, and user-friendly. Our conversion rates have improved significantly since the launch. Highly recommended!",
    avatar: "LT",
    color: "from-festival-magenta to-festival-orange",
  },
];

const TestimonialCard: React.FC<{
  testimonial: TestimonialData;
  index: number;
  totalCards: number;
}> = ({ testimonial, index, totalCards }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current || !imgRef.current) return;

    const card = cardRef.current;
    const img = imgRef.current;

    // Set initial z-index - higher index = higher z-index (cards stack in front)
    gsap.set(card, { zIndex: totalCards + index });

    // Calculate mapped values based on card index - reduced blur intensity
    const yPos = gsap.utils.mapRange(0, totalCards - 1, 0, -100, index);
    const scaleValue = gsap.utils.mapRange(0, totalCards - 1, 1, 0.85, index);

    // GSAP scroll-triggered animation for the image element
    gsap.fromTo(
      img,
      {
        scale: 1,
        transformOrigin: "center top",
        filter: "blur(0px)",
      },
      {
        y: yPos,
        scale: scaleValue,
        filter: "blur(0px)", // Start with no blur
        scrollTrigger: {
          trigger: card,
          scrub: true,
          start: "top 25vh",
          end: "+=200vh",
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // Only apply blur in the last 40% of the animation
            const progress = self.progress;
            if (progress > 0.6) {
              const blurProgress = gsap.utils.mapRange(0.6, 1, 0, 1, progress);
              const blurValue = blurProgress * 2; // Further reduced max blur
              gsap.set(img, { filter: `blur(${blurValue}px)` });
            }
          },
        },
      },
    );

    // Separate ScrollTrigger for pinning each card
    ScrollTrigger.create({
      trigger: card,
      start: "top top",
      endTrigger: ".following-content",
      end: "top 400",
      pin: true,
      pinSpacing: false,
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === card || st.pin === card) {
          st.kill();
        }
      });
      gsap.killTweensOf([card, img]);
    };
  }, [testimonial, index, totalCards]);

  return (
    <div
      ref={cardRef}
      className="testimonial-card w-full h-screen flex items-center justify-center p-4"
    >
      <div
        ref={imgRef}
        className="bg-white border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden w-full max-w-4xl"
      >
        {/* Header with gradient background */}
        <div
          className={`p-6 border-b-4 border-black bg-gradient-to-r ${testimonial.color}`}
        >
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full bg-white border-4 border-black flex items-center justify-center text-black font-black text-xl shadow-lg">
              {testimonial.avatar}
            </div>
            <div className="ml-6">
              <h4 className="font-black text-2xl text-white mb-1 drop-shadow-lg">
                {testimonial.name}
              </h4>
              <p className="text-white/90 font-bold text-lg drop-shadow">
                {testimonial.handle}
              </p>
            </div>
            <div className="ml-auto">
              <div className="w-8 h-8 bg-white rounded-full border-2 border-black flex items-center justify-center">
                <span className="text-black">✨</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <p className="text-black text-xl leading-relaxed font-medium">
            "{testimonial.content}"
          </p>

          {/* Rating stars */}
          <div className="flex items-center mt-6 gap-1">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-festival-amber text-2xl">
                ���
              </span>
            ))}
            <span className="ml-3 text-black/70 font-bold">5.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Testimonials: React.FC = () => {
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize header animation
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 80%",
            once: true,
          },
        },
      );
    }

    // Cleanup on unmount
    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <section className="relative">
      {/* Header */}
      <div
        ref={headerRef}
        className="h-screen flex items-center justify-center"
      >
        <div className="text-center px-4">
          <div className="inline-block mb-6" />

          <h2
            className="flex items-center justify-center gap-8 md:gap-16 font-display font-black text-black mb-6 tracking-tight"
            style={{
              fontSize: "171px",
              lineHeight: "154px",
              fontFamily: '"Fredoka One", cursive',
            }}
          >
            <span style={{ fontSize: "88px" }}>Client</span>
            <span
              className="relative inline-flex items-center justify-center px-6 md:px-12 py-2 md:py-4 bg-festival-amber text-white rounded-2xl md:rounded-3xl border-4 border-black"
              style={{
                fontSize: "88px",
                lineHeight: "144px",
                boxShadow: "0px 11px 0px rgba(0, 0, 0, 0.15)",
                transform: "rotate(-1deg)",
                marginLeft: "-41px",
              }}
            >
              Love
            </span>
          </h2>

          <p className="text-2xl md:text-3xl text-black/80 font-bold max-w-3xl mx-auto leading-relaxed">
            Real stories from clients who{" "}
            <span
              style={{ color: "rgba(220, 122, 18, 1)", padding: "0 3px 0 2px" }}
            >
              adore
            </span>{" "}
            our work!&nbsp;
          </p>
        </div>
      </div>

      {/* Testimonial Cards */}
      {testimonialsData.map((testimonial, index) => (
        <TestimonialCard
          key={testimonial.id}
          testimonial={testimonial}
          index={index}
          totalCards={testimonialsData.length}
        />
      ))}

      {/* Following Content - End marker for pinning */}
      <div
        className="following-content h-[717px] flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url(https://cdn.builder.io/api/v1/image/assets%2Facd55bb5271f4561b7d7bc5a988f49b5%2F84f10231392747c98c3aa24600cbfdbe)",
        }}
      >
        <div className="text-center pt-[167px] flex flex-col">
          <h3 className="text-6xl font-black text-white mb-4 drop-shadow-lg">
            Ready for your story?
          </h3>
          <button
            className="bg-white text-festival-orange font-black text-2xl px-12 py-6 rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 transform hover:-rotate-1 w-[869px] mx-auto"
            onClick={() => {
              document.querySelector("[data-contact-form]")?.scrollIntoView({
                behavior: "smooth",
              });
            }}
          >
            Join Our Happy Clients! 🚀
          </button>
          <img
            loading="lazy"
            srcSet="https://cdn.builder.io/api/v1/image/assets%2Facd55bb5271f4561b7d7bc5a988f49b5%2F181fa2e971fa4203bec6c049fb0e4084?width=100 100w, https://cdn.builder.io/api/v1/image/assets%2Facd55bb5271f4561b7d7bc5a988f49b5%2F181fa2e971fa4203bec6c049fb0e4084?width=200 200w, https://cdn.builder.io/api/v1/image/assets%2Facd55bb5271f4561b7d7bc5a988f49b5%2F181fa2e971fa4203bec6c049fb0e4084?width=400 400w, https://cdn.builder.io/api/v1/image/assets%2Facd55bb5271f4561b7d7bc5a988f49b5%2F181fa2e971fa4203bec6c049fb0e4084?width=800 800w, https://cdn.builder.io/api/v1/image/assets%2Facd55bb5271f4561b7d7bc5a988f49b5%2F181fa2e971fa4203bec6c049fb0e4084?width=1200 1200w, https://cdn.builder.io/api/v1/image/assets%2Facd55bb5271f4561b7d7bc5a988f49b5%2F181fa2e971fa4203bec6c049fb0e4084?width=1600 1600w, https://cdn.builder.io/api/v1/image/assets%2Facd55bb5271f4561b7d7bc5a988f49b5%2F181fa2e971fa4203bec6c049fb0e4084?width=2000 2000w, https://cdn.builder.io/api/v1/image/assets%2Facd55bb5271f4561b7d7bc5a988f49b5%2F181fa2e971fa4203bec6c049fb0e4084"
            className="aspect-square object-cover object-center w-[30%] min-h-0 min-w-[20px] overflow-hidden mx-auto mt-[221px] mb-[-251px]"
            alt=""
          />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
