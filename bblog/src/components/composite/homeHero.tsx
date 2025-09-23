import Image from "next/image";

const HomeHero = () => {
  return (
    <div className="relative flex w-full h-64 md:h-[400px] lg:h-[500px]">
      <Image
        src="/Home.png"
        alt="Hero Image"
        fill
        priority
        className="object-cover object-center"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-transparent">
        <div className="flex flex-col border border-black py-4 px-4 md:py-6 md:px-8 md:space-y-2 bg-primary/80 text-center">
          <h1 className="font-lora text-3xl md:text-4xl lg:text-5xl font-bold">
            Elevate Your Everyday
          </h1>
          <p className="font-mont text-md md:text-lg lg:text-xl">
            Discover natural materials, clean living, and eco-friendly style for
            a healthier home.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomeHero;
