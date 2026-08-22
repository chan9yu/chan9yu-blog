"use client";

import type { ComponentProps } from "react";

import { Dialog } from "./Dialog";

type DrawerProps = ComponentProps<typeof Dialog> & {
	side?: "bottom" | "right";
};

export function Drawer({ side = "bottom", ...rest }: DrawerProps) {
	return <Dialog data-drawer="" data-side={side} {...rest} />;
}
