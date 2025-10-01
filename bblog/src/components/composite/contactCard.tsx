import Image from "next/image";
import { EnvelopeClosedIcon } from "@radix-ui/react-icons";

const ContactCard = () => {
  return (
    <div className="w-full bg-primary/5 text-popover-foreground px-4">
      <div className="inline-flex items-center justify-center gap-2 p-3">
        <a
          href="https://www.instagram.com/thegoodstandard"
          target="_blank"
          rel="noopener"
          aria-label="Instagram"
          className="shrink-0 hover:bg-secondary p-3 rounded-full"
        >
          <Image
            src="/instagram.svg"
            alt=""
            width={24}
            height={24}
            className="shrink-0"
          />
        </a>
        <a
          href="https://www.pinterest.com/thegoodstandardcompany"
          target="_blank"
          rel="noopener"
          aria-label="Pinterest"
          className="shrink-0 hover:bg-secondary p-3 rounded-full"
        >
          <Image
            src="/pinterest.svg"
            alt=""
            width={24}
            height={24}
            className="shrink-0"
          />
        </a>
        <a
          href="mailto:thegoodstandard.company@gmail.com"
          aria-label="Email"
          className="shrink-0 hover:bg-secondary p-3 rounded-full"
        >
          <EnvelopeClosedIcon className="h-6 w-6" />
        </a>
      </div>
    </div>
  );
};

export default ContactCard;
