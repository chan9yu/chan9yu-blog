import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Dialog } from "../Dialog";

describe("Dialog 바깥 클릭", () => {
	it("배경에서 눌러 배경에서 뗀 클릭은 닫는다", () => {
		const onClose = vi.fn();
		render(
			<Dialog open onClose={onClose}>
				<button type="button">안쪽</button>
			</Dialog>
		);

		const dialog = screen.getByRole("dialog");
		fireEvent.pointerDown(dialog);
		fireEvent.click(dialog);

		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it("패널 안에서 시작한 드래그가 배경에서 끝나면 닫지 않는다", () => {
		const onClose = vi.fn();
		render(
			<Dialog open onClose={onClose}>
				<button type="button">안쪽</button>
			</Dialog>
		);

		fireEvent.pointerDown(screen.getByRole("button", { name: "안쪽" }));
		fireEvent.click(screen.getByRole("dialog"));

		expect(onClose).not.toHaveBeenCalled();
		expect(screen.getByRole("dialog")).toHaveAttribute("open");
	});

	it("pointerdown 없이 배경에 합성된 click은 닫지 않는다", () => {
		const onClose = vi.fn();
		render(
			<Dialog open onClose={onClose}>
				내용
			</Dialog>
		);

		fireEvent.click(screen.getByRole("dialog"));

		expect(onClose).not.toHaveBeenCalled();
	});
});

describe("Dialog 스크롤 잠금", () => {
	it("열리면 html에 잠금 표식이 달린다", () => {
		render(
			<Dialog open onClose={vi.fn()}>
				내용
			</Dialog>
		);

		expect(document.documentElement.dataset.modalOpen).toBeDefined();
	});

	it("닫히면 잠금 표식이 제거된다", () => {
		const { rerender } = render(
			<Dialog open onClose={vi.fn()}>
				내용
			</Dialog>
		);

		rerender(
			<Dialog open={false} onClose={vi.fn()}>
				내용
			</Dialog>
		);

		expect(document.documentElement.dataset.modalOpen).toBeUndefined();
	});

	it("겹친 둘 중 위쪽만 닫히면 잠금이 유지된다", () => {
		const { rerender } = render(
			<>
				<Dialog open onClose={vi.fn()}>
					첫째
				</Dialog>
				<Dialog open onClose={vi.fn()}>
					둘째
				</Dialog>
			</>
		);

		rerender(
			<>
				<Dialog open onClose={vi.fn()}>
					첫째
				</Dialog>
				<Dialog open={false} onClose={vi.fn()}>
					둘째
				</Dialog>
			</>
		);

		expect(document.documentElement.dataset.modalOpen).toBeDefined();
	});
});
