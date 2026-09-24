import type { ComponentProps } from "react";

type ButtonProps = ComponentProps<"button"> & {
  variant?: "primary" | "secondary";
};

const baseClassName =
  "cursor-pointer rounded-md border px-4 py-2 transition-colors " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 " +
  "disabled:cursor-not-allowed disabled:opacity-50";

const variantClassNames = {
  primary: "border-zinc-900 bg-zinc-900 text-white hover:bg-zinc-700",
  secondary: "border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-50",
};

export function Button({
  variant = "secondary",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${baseClassName} ${variantClassNames[variant]} ${className}`}
      {...props}
    />
  );
}
