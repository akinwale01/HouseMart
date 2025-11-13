"use client";

export default function AboutPage() {
  return (
    <main className="flex flex-col gap-24 lg:mx-auto lg:max-w-[1440px] pb-30 pt-50 px-4 md:px-14">

      {/* ===== HERO SECTION ===== */}
      <section className="w-full relative rounded-2xl overflow-hidden">
        <div
          className="w-full h-[50vh] sm:h-[60vh] md:h-[70vh] bg-center bg-cover"
          style={{ backgroundImage: 'url("/about-hero.jpg")' }}
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-start px-4 sm:px-6 md:px-16 gap-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-snug sm:leading-tight md:leading-tight tracking-[-0.02em]">
            Redefining Real Estate,<br />One Home at a Time
          </h1>
          <p className="text-white/90 text-sm sm:text-base md:text-lg lg:text-xl max-w-full sm:max-w-xl md:max-w-2xl leading-[165%]">
            At HouseMart, we turn every move into a confident, seamless experience,
            blending trust, innovation, and care into every connection.
          </p>
        </div>
      </section>

      {/* ===== OUR STORY ===== */}
      <section className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10 md:p-14 flex flex-col gap-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold leading-[140%] tracking-[-0.02em] text-black">
          Our Story
        </h2>
        <p className="text-[#444] text-[15px] sm:text-[16px] md:text-[17px] leading-[175%] max-w-full md:max-w-3xl">
          Born from a vision to simplify property ownership and rentals, HouseMart was
          built to bridge the gap between technology and trust. Our team of real estate
          professionals and tech innovators joined forces to make the property experience
          smoother, smarter, and human-centered.
          <br /><br />
          Whether you’re selling your property or searching for your dream home,
          HouseMart empowers you to make confident decisions — with clarity and ease.
        </p>
      </section>

{/* ===== OUR MISSION + VISION ===== */}
<section className="flex flex-col lg:flex-row items-stretch gap-8 sm:gap-10">
  {/* Mission Box */}
  <div className=" bg-[#fff6ef] rounded-2xl border border-orange-100 p-6 sm:p-10 md:p-14 shadow-sm flex flex-col gap-4 min-h-[300px]">
    <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-black leading-[140%]">
      Our Mission
    </h2>
    <p className="text-[#444] text-[15px] sm:text-[16px] md:text-[17px] leading-[175%]">
      To empower people to buy, sell, and rent homes with confidence through an
      experience that’s transparent, stress-free, and innovative. We combine modern
      technology with personal touch — creating a space where trust and simplicity
      thrive together. We are committed to making every transaction smooth, every
      interaction meaningful, and every client satisfied.
    </p>
  </div>

  {/* Vision Box */}
  <div className=" bg-black/40 rounded-2xl border border-orange-100 p-6 sm:p-10 md:p-14 shadow-sm flex flex-col gap-4  min-h-[300px]">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white leading-[140%]">
        Our Vision
      </h2>
      <p className="text-[#fffafa] text-[15px] sm:text-[16px] md:text-[17px] leading-[175%]">
        We envision a world where property transactions are seamless, transparent,
        and deeply rewarding — where every move feels like a step forward. Our goal
        is to empower clients with clarity, trust, and confidence in every decision
        they make, ensuring the experience is as fulfilling as it is effortless.
      </p>
  </div>
</section>

      {/* ===== CORE VALUES ===== */}
      <section className="w-full flex flex-col gap-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-black text-center">
          What Drives Us
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {[
            { icon: "🤝", title: "Integrity", desc: "We uphold transparency and honesty in every interaction and deal." },
            { icon: "💡", title: "Innovation", desc: "We use smart tools to simplify real estate and empower every client." },
            { icon: "🏠", title: "Trust", desc: "Every listing and transaction is verified for your peace of mind." },
            { icon: "💬", title: "Customer Care", desc: "We listen, guide, and support like partners — not just agents." }
          ].map((value, i) => (
            <div
              key={i}
              className="flex flex-col items-start bg-white rounded-2xl border border-orange-100 shadow-sm p-6 sm:p-8 hover:shadow-md hover:-translate-y-1 transition-all duration-300  gap-2"
            >
              <div className="text-4xl sm:text-5xl">{value.icon}</div>
              <h4 className="text-lg sm:text-[17px] font-semibold text-gray-900">
                {value.title}
              </h4>
              <p className="text-gray-600 leading-[165%] text-sm sm:text-base">{value.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== TEAM SECTION ===== */}
      <section className="w-full flex flex-col gap-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-black text-center">
          Meet Our Team
        </h2>

        <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
          {[
            { name: "John Doe", role: "Chief Executive Officer", img: "/team1.jpg" },
            { name: "Jane Smith", role: "Chief Technology Officer", img: "/team2.jpg" },
            { name: "Michael Brown", role: "Chief Operations Officer", img: "/team3.jpg" },
            { name: "Sophia Lee", role: "Marketing Director", img: "/team4.jpg" },
          ].map((member, i) => (
            <div key={i} className="flex flex-col items-center w-[150px] sm:w-[180px] md:w-[200px] lg:w-[230px] gap-2">
              <div
                className="w-full h-[150px] sm:h-[180px] md:h-[200px] lg:h-[230px] rounded-xl bg-cover bg-center border border-gray-200 shadow-sm hover:shadow-md hover:scale-[1.03] transition-all"
                style={{ backgroundImage: `url("${member.img}")` }}
              />
              <h3 className="text-lg sm:text-[17px] font-semibold text-black text-center">
                {member.name}
              </h3>
              <p className="text-[#666] text-[12px] sm:text-[14px] text-center">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}