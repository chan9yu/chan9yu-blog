import Link from "next/link";
import type { ComponentProps } from "react";

import { cn } from "@/shared/lib/cn";

type ButtonVariantName = "outline" | "accent" | "ghost";

const BUTTON_DEFAULT_VARIANT: ButtonVariantName = "outline";

const BUTTON_BASE_CLASS =
	"inline-flex h-11 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg border px-4 text-sm leading-none font-semibold whitespace-nowrap transition-[background-color,border-color,color,transform] outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 motion-safe:active:scale-[0.98]";

const BUTTON_VARIANT_CLASS: Record<ButtonVariantName, string> = {
	outline: "bg-card border-border-default text-foreground hover:border-accent/40 hover:bg-bg-subtle",
	accent: "bg-accent border-accent text-accent-foreground hover:bg-accent-hover hover:border-accent-hover",
	ghost: "text-muted-foreground hover:text-foreground hover:bg-bg-subtle border-transparent"
};

type ButtonVariant = { variant?: ButtonVariantName };

type ButtonAsButton = ComponentProps<"button"> & ButtonVariant & { href?: undefined };
type ButtonAsLink = ComponentProps<typeof Link> & ButtonVariant;
type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({ className, variant = BUTTON_DEFAULT_VARIANT, ...props }: ButtonProps) {
	const classes = cn(BUTTON_BASE_CLASS, BUTTON_VARIANT_CLASS[variant], className);

	if (props.href !== undefined) {
		return <Link data-button="" data-variant={variant} className={classes} {...props} />;
	}

	const { type = "button", ...rest } = props;

	return <button type={type} data-button="" data-variant={variant} className={classes} {...rest} />;
}
