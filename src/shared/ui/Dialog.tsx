"use client";

import type { ComponentProps, KeyboardEvent, MouseEvent, PointerEvent } from "react";
import { useEffect, useRef } from "react";

type DialogProps = Omit<ComponentProps<"dialog">, "open" | "onClose"> & {
	open: boolean;
	onClose: () => void;
	panelClassName?: string;
};

const TABBABLE_SELECTOR = "a[href], button, input, select, textarea, [tabindex]";

function unlockScroll() {
	if (document.querySelector("dialog[open]")) {
		return;
	}

	delete document.documentElement.dataset.modalOpen;
}

function getTabbables(root: HTMLElement) {
	const candidates = root.querySelectorAll<HTMLElement>(TABBABLE_SELECTOR);

	return Array.from(candidates).filter(
		(el) => el.tabIndex >= 0 && !el.matches(":disabled") && el.checkVisibility({ checkVisibilityCSS: true })
	);
}

export function Dialog({
	open,
	onClose,
	onClick,
	onPointerDown,
	onKeyDown,
	panelClassName,
	children,
	...rest
}: DialogProps) {
	const ref = useRef<HTMLDialogElement>(null);
	const opener = useRef<Element | null>(null);
	const pressedOnBackdrop = useRef(false);

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
			unlockScroll();
		};
	}, []);

	const handleClose = () => {
		unlockScroll();

		if (opener.current instanceof HTMLElement) {
			opener.current.focus();
		}

		onClose();
	};

	const handleKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
		onKeyDown?.(event);

		if (event.key !== "Tab" || event.defaultPrevented) {
			return;
		}

		const el = ref.current;
		if (!el) {
			return;
		}

		const tabbables = getTabbables(el);
		const first = tabbables[0];
		const last = tabbables[tabbables.length - 1];
		if (!first || !last) {
			return;
		}

		if (event.shiftKey && document.activeElement === first) {
			event.preventDefault();
			last.focus();
		} else if (!event.shiftKey && document.activeElement === last) {
			event.preventDefault();
			first.focus();
		}
	};

	// click은 눌린 곳과 뗀 곳의 공통 조상에서 발생해, click의 target만 보면 패널 안에서 시작한 드래그로도 닫힌다
	const handlePointerDown = (event: PointerEvent<HTMLDialogElement>) => {
		onPointerDown?.(event);
		pressedOnBackdrop.current = event.target === ref.current;
	};

	const handleClick = (event: MouseEvent<HTMLDialogElement>) => {
		onClick?.(event);

		const clickedBackdrop = event.target === ref.current && pressedOnBackdrop.current;
		pressedOnBackdrop.current = false;

		if (clickedBackdrop && !event.defaultPrevented) {
			ref.current?.close();
		}
	};

	return (
		<dialog
			ref={ref}
			data-dialog=""
			onClose={handleClose}
			onPointerDown={handlePointerDown}
			onClick={handleClick}
			onKeyDown={handleKeyDown}
			{...rest}
		>
			<div data-dialog-panel="" className={panelClassName}>
				{children}
			</div>
		</dialog>
	);
}
