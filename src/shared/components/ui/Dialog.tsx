"use client";

import type { ComponentProps, MouseEvent } from "react";
import { useEffect, useRef } from "react";

type DialogProps = Omit<ComponentProps<"dialog">, "open" | "onClose"> & {
	open: boolean;
	onClose: () => void;
	panelClassName?: string;
};

export function Dialog({ open, onClose, panelClassName, children, ...rest }: DialogProps) {
	const ref = useRef<HTMLDialogElement>(null);
	const opener = useRef<Element | null>(null);

	useEffect(() => {
		const el = ref.current;
		if (!el) {
			return;
		}

		if (open && !el.open) {
			opener.current = document.activeElement;
			el.showModal();
			document.documentElement.dataset.modalOpen = "";
		} else if (!open && el.open) {
			el.close();
		}
	}, [open]);

	useEffect(() => {
		return () => {
			if (!document.querySelector("dialog[open]")) {
				delete document.documentElement.dataset.modalOpen;
			}
		};
	}, []);

	const handleClose = () => {
		if (!document.querySelector("dialog[open]")) {
			delete document.documentElement.dataset.modalOpen;
		}

		if (opener.current instanceof HTMLElement) {
			opener.current.focus();
		}

		onClose();
	};

	const handleClick = (event: MouseEvent<HTMLDialogElement>) => {
		if (event.target === ref.current) {
			ref.current?.close();
		}
	};

	return (
		<dialog ref={ref} data-dialog="" onClose={handleClose} onClick={handleClick} {...rest}>
			<div data-dialog-panel="" className={panelClassName}>
				{children}
			</div>
		</dialog>
	);
}
