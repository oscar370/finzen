import { CircleCheck, Info, LoaderCircle, OctagonX, TriangleAlert, X } from "lucide-react";
import type { ToasterProps } from "sonner";
import { Toaster as Sonner } from "sonner";

export function Toaster(props: ToasterProps) {
  return (
    <Sonner
      toastOptions={{
        classNames: {
          toast: "bg-base-200! rounded-full! text-white! border-none!",
          closeButton:
            "right-0! top-[45%]! left-auto! [background:none]! border-none! text-white! shadow-none!",
        },
      }}
      closeButton={true}
      position="bottom-center"
      icons={{
        success: <CircleCheck className="size-4" />,
        info: <Info className="size-4" />,
        warning: <TriangleAlert className="size-4" />,
        error: <OctagonX className="size-4" />,
        loading: <LoaderCircle className="size-4 animate-spin" />,
        close: <X className="size-4" />,
      }}
      {...props}
    ></Sonner>
  );
}
