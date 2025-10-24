"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Download } from "lucide-react";

type Props = {
  url: string; // raw Sanity file URL
  filename?: string; // suggested name for download
  label?: string; // button label (e.g., "Preview Gratitude Journal 1")
  className?: string;
};

export default function PreviewPdf({
  url,
  filename = "download.pdf",
  label = "Preview PDF",
  className,
}: Props) {
  const downloadHref = `${url}?dl=${encodeURIComponent(filename)}`;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className={className ?? "inline-flex items-center gap-2"}
        >
          {label}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-5xl w-[94vw] h-[71vh] p-0 overflow-hidden">
        {/* Header */}
        <div className="flex flex-col items-center justify-between border-b px-4 pt-4 space-y-4">
          <DialogHeader className="p-0">
            <DialogTitle className="text-base font-medium truncate">
              {filename}
            </DialogTitle>
          </DialogHeader>

          <div className="flex items-center space-x-4">
            <Button asChild size="sm" variant="secondary">
              <a href={downloadHref}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </a>
            </Button>
            <div>
              <DialogClose />
            </div>
          </div>
        </div>

        {/* Preview body */}
        <div className="h-[calc(85vh-52px)]">
          <object data={url} type="application/pdf" className="w-full h-full">
            <div className="h-full w-full grid place-items-center p-6 text-sm">
              <p className="text-center opacity-80">
                Your browser can’t display the PDF inline.{" "}
                <a
                  className="underline"
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open in a new tab
                </a>{" "}
                or{" "}
                <a className="underline" href={downloadHref}>
                  download it
                </a>
                .
              </p>
            </div>
          </object>
        </div>
      </DialogContent>
    </Dialog>
  );
}
