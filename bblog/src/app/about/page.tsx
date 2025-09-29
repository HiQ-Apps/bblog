import Image from "next/image";

const AboutPage = () => {
  return (
    <section className="xl:mx-30 sm:mx-8 px-3 py-12">
      <Image
        src="/about_me.png"
        alt="Picture of Ana"
        width={200}
        height={200}
        className="mx-auto mb-6 rounded-full"
      />
      <h1 className="font-lora text-4xl font-bold mb-6 text-center">
        Hi, I&apos;m Ana — welcome to my little corner of the web.
      </h1>
      <div className="font-mont space-y-5 text-lg leading-relaxed text-gray-800">
        <p>
          I spent a great deal of my youth partying and being careless of what I
          put into my body. I don&apos;t have a time machine, but I did stumble
          across a concept called neuroplasticity that opened my eyes to the
          incredible resilience of the human body. As I reached my 30s, I began
          a quest for better health, and to erase the damage I&apos;d done. Changing
          my habits meant changing my choices, and I learned that many of the
          products I grew up with in my parents&apos; house — soaps, cleaners, even
          food packaging — were full of hidden microplastics and harmful
          materials. It was eye-opening.
        </p>
        <p>
          As I kept digging, I saw how all this waste and consumerism was not
          only destroying our planet, its ecosystems, and its people, but was
          also weighing heavily on my own physical and mental health. That
          realization was the turning point: I wanted to stop just consuming and
          start questioning, learning, and making small changes that actually
          mattered.
        </p>
        <p>
          For me, curiosity and resilience are two of the greatest joys of being
          human. Learning about both the beauty and the dangers in this world
          gives me fresh perspectives on how I continue to live my life. Writing
          here is my creative outlet and my way of sharing that journey with
          you. I&apos;m still shaping my writing voice, but to me, that&apos;s part of the
          fun — growing, reflecting, and finding new ways to connect. Over time,
          see me as your quirky guardian angel that reminds you to think harder
          about choices. I&apos;m really delighted that you&apos;re spending your precious
          time with me!
        </p>
        <p>
          On <strong>The Good Standard</strong>, you&apos;ll find simple upgrades for
          your home, lifestyle, and daily routines. Some are as small as reusing
          what you already have in new ways; others involve finding
          eco-friendly, “buy it for life” products that actually last. None of
          it is about being perfect — it&apos;s about choosing better, little by
          little.
        </p>
        <p>
          If you&apos;ve ever felt overwhelmed by all the noise out there, please
          know you&apos;re not alone. I&apos;m not here to fearmonger or shame anyone —
          after all, we didn&apos;t grow up knowing these things were harmful. But
          now that we do, we can be more intentional.
        </p>

        <p>
          Sustainable, intentional, natural living is a journey that lasts a
          lifetime. The more we learn, the more empowered we are in our choices.
          My hope is that this space comforts you, sparks curiosity, and
          inspires you to slow down, simplify, and choose well.
        </p>
        <p>Thanks for stopping by, I&apos;m so glad you&apos;re here!</p>
      </div>
    </section>
  );
};

export default AboutPage;
