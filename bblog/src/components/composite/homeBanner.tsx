"use client";
import Link from "next/link";
import Image from "next/image";
import { useDimensions } from "@/hooks/useDimensions";

const HomeBanner = () => {
  const { width } = useDimensions();

  return (
    <div className="bg-primary flex w-full justify-center font-playfair text-7xl py-8 text-center">
      <Link href="/">
        <div className="flex flex-row items-center">
          {width > 768 && (
            <Image
              src="/LOGO.png"
              alt="The Good Standard"
              width={140}
              height={140}
            />
          )}
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
