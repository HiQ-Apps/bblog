import Image from "next/image";
import { EnvelopeClosedIcon } from "@radix-ui/react-icons";
import { FaEtsy } from "react-icons/fa6";

const ContactCard = () => {
  return (
    <div className="bg-primary text-popover-foreground px-4 z-20">
      <div
        className="
          mx-auto
          flex flex-row items-center justify-center
          xl:grid xl:grid-cols-2 xl:gap-3
        "
      >
        <a
          href="https://www.instagram.com/thegoodstandard"
          target="_blank"
          rel="noopener"
          aria-label="Instagram"
          className="shrink-0 hover:bg-secondary p-3 rounded-full flex items-center justify-center"
        >
          <Image
            src="/instagram.svg"
            alt="Instagram Icon"
            width={24}
            height={24}
            className="shrink-0"
          />
        </a>
        <a
          href="https://www.pinterest.com/thegoodstandardco"
          target="_blank"
          rel="noopener"
          aria-label="Pinterest"
          className="shrink-0 hover:bg-secondary p-3 rounded-full flex items-center justify-center"
        >
          <Image
            src="/pinterest.svg"
            alt="Pinterest Icon"
            width={24}
            height={24}
            className="shrink-0"
          />
        </a>
        <a
          href="mailto:contact@thegoodstandard.org"
          aria-label="Email"
          className="shrink-0 hover:bg-secondary p-3 rounded-full flex items-center justify-center"
        >
          <EnvelopeClosedIcon className="h-6 w-6" />
        </a>
        <a
          href="https://www.etsy.com/shop/TheGoodStandard"
          target="_blank"
          rel="noopener"
          aria-label="Etsy"
          className="shrink-0 hover:bg-secondary p-3 h-12 w-12 rounded-full flex items-center justify-center"
        >
          <FaEtsy className="h-5 w-5" />
        </a>
      </div>
    </div>
  );
};

export default ContactCard;
