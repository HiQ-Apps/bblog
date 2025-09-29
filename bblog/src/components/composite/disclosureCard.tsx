import Link from "next/link";

const Disclosure = () => {
  return (
    <div className="flex bg-secondary text-primary text-sm p-3 rounded border mt-4">
      <p>
        This post contains affiliate links. If you click and purchase, I may
        earn a small commission at no extra cost to you. Read my full disclosure
        here. &nbsp;
        <Link href="/disclosure" className="underline text-accent">
          Learn more
        </Link>
      </p>
    </div>
  );
};

export default Disclosure;
