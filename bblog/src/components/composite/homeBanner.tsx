"use client";
import Link from "next/link";
import Image from "next/image";

const HomeBanner = () => {
  return (
    <div className="bg-primary flex w-full justify-center font-playfair text-7xl py-8 text-center">
      <Link href="/">
        <div className="flex flex-row items-center">
          <Image
            src="/LOGO.png"
            alt="The Good Standard"
            width={140}
            height={140}
          />
          <div className="flex flex-col">
            The Good Standard
            <p className="text-accent text-xl">
              sustainable style for the modern life
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default HomeBanner;
