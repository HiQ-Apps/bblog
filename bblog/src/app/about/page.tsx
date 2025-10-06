import Image from "next/image";

const AboutPage = () => {
  return (
    <section className="xl:mx-30 sm:mx-8 px-3 py-12">
      {/* <Image
        src="/about.png"
        alt="A flat lay of sustainable materials including wood, linen, and cotton"
        width={200}
        height={200}
        className="mx-auto mb-6 roudned-md"
      /> */}
      <h1 className="font-lora text-4xl font-bold mb-6 text-center">
        Welcome to The Good Standard
      </h1>
      <div className="font-mont space-y-5 text-lg leading-relaxed text-gray-800">
        <p>
          <strong>The Good Standard</strong> is an independent editorial
          exploring sustainable living, ethical fashion, and natural design. We
          believe in thoughtful consumption, natural materials, and quiet,
          enduring style.
        </p>
        <p>
          Our focus is on practical upgrades you can feel good about. This means
          repairing, reusing, and choosing long-lasting pieces made from wool,
          linen, cotton, wood, glass, and steel. No fearmongering, no
          perfectionism—just clear, useful guidance to help you make better
          choices, little by little.
        </p>
        <p>
          You&apos;ll find seasonal guides, product roundups, and simple rituals
          for a healthier home. When we recommend products, it&apos;s because
          they align with our criteria: natural or recycled materials where
          possible, transparent sourcing, and design that&apos;s built to last.
        </p>
        <p>
          On The Good Standard, you&apos;ll find simple
          upgrades for your home, lifestyle, and daily routines. Some are as
          small as reusing what you already have in new ways; others involve
          finding eco-friendly, “buy it for life” products that actually last.
          None of it is about being perfect — it&apos;s about choosing better,
          little by little.
        </p>
        <p>
          You&apos;ll find seasonal guides, product roundups, and simple rituals
          for a healthier home. When we recommend products, it&apos;s because
          they align with our criteria: natural or recycled materials where
          possible, transparent sourcing, and design that&apos;s built to last.
        </p>
        <p>
          If you&apos;re new here, start with our latest features on natural
          fabrics, low-waste home basics, and slow wardrobe building. Settle in
          with a cup of tea, browse, and take what serves you. Ssutainable,
          natural, and intentional living is a lifetime journey.
        </p>
        📩 For partnerships or inquiries:{" "}
        <a
          href="mailto:contact@thegoodstandard.org"
          className="underline underline-offset-4 hover:opacity-80 text-blue-600"
        >
          contact@thegoodstandard.org
        </a>
        <p className="text-sm text-gray-600 mt-2">
Disclosures: Some articles may include affiliate links. Editorial
coverage remains independent and unsponsored unless clearly noted.
</p>
      </div>
    </section>
  );
};

export default AboutPage;
