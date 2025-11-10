"use client";

import { useState } from "react";
import { CopyIcon, CheckIcon } from "@radix-ui/react-icons";

type DiscountCode = {
  _key: string;
  code: string;
  description?: string;
};

export default function DiscountCodes({ codes }: { codes: DiscountCode[] }) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = async (code: string, key: string) => {
    if (!navigator?.clipboard) {
      console.error("Clipboard API not available");
      return;
    }

    try {
      await navigator.clipboard.writeText(code);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1500);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <section className="mt-8">
      <h2 className="font-lora text-2xl font-bold">Discount Codes</h2>
      <div className="mt-4 flex flex-wrap gap-4">
        {codes.map((code) => (
          <div
            key={code._key}
            className="flex items-center gap-2 p-2 rounded max-w-sm"
          >
            <p className="font-bold">{code.code}</p>
            <button
              type="button"
              onClick={() => handleCopy(code.code, code._key)}
              className="p-1 cursor-pointer hover:bg-secondary rounded-sm"
              aria-label={`Copy discount code ${code.code}`}
            >
              {copiedKey === code._key ? (
                <CheckIcon className="h-5 w-5" />
              ) : (
                <CopyIcon className="h-5 w-5" />
              )}
            </button>
            {code.description && (
              <p className="text-sm text-neutral-700">{code.description}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
