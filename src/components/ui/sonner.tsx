import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:rounded-xl group-[.toaster]:border group-[.toaster]:border-outline-variant group-[.toaster]:bg-surface-container-lowest group-[.toaster]:font-body group-[.toaster]:text-on-surface group-[.toaster]:shadow-lg",
          title: "group-[.toast]:font-headline group-[.toast]:text-label-lg",
          description: "group-[.toast]:font-body group-[.toast]:text-body-md group-[.toast]:text-on-surface-variant",
          actionButton: "group-[.toast]:rounded-md group-[.toast]:bg-primary group-[.toast]:font-headline group-[.toast]:text-on-primary",
          cancelButton: "group-[.toast]:rounded-md group-[.toast]:bg-surface-container-low group-[.toast]:font-headline group-[.toast]:text-on-surface-variant",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
