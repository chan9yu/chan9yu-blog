const dialogs = new Set<HTMLDialogElement>();

function openDialog(this: HTMLDialogElement) {
	this.open = true;
	dialogs.add(this);
}

function closeDialog(this: HTMLDialogElement, returnValue?: string) {
	if (!this.open) {
		return;
	}

	this.open = false;
	dialogs.delete(this);

	if (returnValue !== undefined) {
		this.returnValue = returnValue;
	}

	this.dispatchEvent(new Event("close"));
}

function handleEscape(event: KeyboardEvent) {
	if (event.key !== "Escape" || dialogs.size === 0) {
		return;
	}

	const topmost = Array.from(dialogs).at(-1);
	if (!topmost) {
		return;
	}

	const cancel = new Event("cancel", { cancelable: true });
	if (topmost.dispatchEvent(cancel)) {
		topmost.close();
	}
}

export function installDialogPolyfill() {
	if (typeof HTMLDialogElement === "undefined") {
		return;
	}

	const proto = HTMLDialogElement.prototype as Partial<HTMLDialogElement>;
	if (typeof proto.showModal === "function") {
		return;
	}

	HTMLDialogElement.prototype.showModal = openDialog;
	HTMLDialogElement.prototype.show = openDialog;
	HTMLDialogElement.prototype.close = closeDialog;
	document.addEventListener("keydown", handleEscape);
}
