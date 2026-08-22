import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { useLightbox } from "../../hooks/useLightbox";
import { LightboxProvider } from "../LightboxProvider";

function SingleOpener() {
	const { open } = useLightbox();
	return (
		<button type="button" onClick={() => open({ src: "/a.png", alt: "image-a" })}>
			open single
		</button>
	);
}

function MultiOpener({ startIndex = 0 }: { startIndex?: number }) {
	const { openMany } = useLightbox();
	const images = [
		{ src: "/a.png", alt: "image-a" },
		{ src: "/b.png", alt: "image-b" },
		{ src: "/c.png", alt: "image-c" }
	];
	return (
		<button type="button" onClick={() => openMany(images, startIndex)}>
			open many
		</button>
	);
}

afterEach(() => {
	cleanup();
});

describe("LightboxProvider + ImageLightbox", () => {
	it("단일 이미지 open: 오버레이 렌더 + 화살표 숨김", async () => {
		const user = userEvent.setup();
		render(
			<LightboxProvider>
				<SingleOpener />
			</LightboxProvider>
		);

		await user.click(screen.getByRole("button", { name: "open single" }));

		expect(await screen.findByRole("dialog")).toBeInTheDocument();
		expect(screen.queryByRole("button", { name: /이전 이미지/ })).not.toBeInTheDocument();
		expect(screen.queryByRole("button", { name: /다음 이미지/ })).not.toBeInTheDocument();
	});

	it("다중 이미지 openMany: 이전/다음 화살표 렌더", async () => {
		const user = userEvent.setup();
		render(
			<LightboxProvider>
				<MultiOpener />
			</LightboxProvider>
		);

		await user.click(screen.getByRole("button", { name: "open many" }));

		expect(await screen.findByRole("button", { name: /이전 이미지/ })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /다음 이미지/ })).toBeInTheDocument();
	});

	it("다음 이미지 버튼 클릭 시 index +1 (이미지 alt 변경)", async () => {
		const user = userEvent.setup();
		render(
			<LightboxProvider>
				<MultiOpener />
			</LightboxProvider>
		);

		await user.click(screen.getByRole("button", { name: "open many" }));
		expect((await screen.findByRole("img", { name: "image-a" })).tagName).toBe("IMG");

		await user.click(screen.getByRole("button", { name: /다음 이미지/ }));
		expect(await screen.findByRole("img", { name: "image-b" })).toBeInTheDocument();
	});

	it("이전 이미지 버튼 클릭 시 index -1", async () => {
		const user = userEvent.setup();
		render(
			<LightboxProvider>
				<MultiOpener startIndex={1} />
			</LightboxProvider>
		);

		await user.click(screen.getByRole("button", { name: "open many" }));
		expect(await screen.findByRole("img", { name: "image-b" })).toBeInTheDocument();

		await user.click(screen.getByRole("button", { name: /이전 이미지/ }));
		expect(await screen.findByRole("img", { name: "image-a" })).toBeInTheDocument();
	});

	it("마지막 이미지에서 다음 → 첫 이미지 (circular)", async () => {
		const user = userEvent.setup();
		render(
			<LightboxProvider>
				<MultiOpener startIndex={2} />
			</LightboxProvider>
		);

		await user.click(screen.getByRole("button", { name: "open many" }));
		expect(await screen.findByRole("img", { name: "image-c" })).toBeInTheDocument();

		await user.click(screen.getByRole("button", { name: /다음 이미지/ }));
		expect(await screen.findByRole("img", { name: "image-a" })).toBeInTheDocument();
	});

	it("첫 이미지에서 이전 → 마지막 이미지 (circular)", async () => {
		const user = userEvent.setup();
		render(
			<LightboxProvider>
				<MultiOpener startIndex={0} />
			</LightboxProvider>
		);

		await user.click(screen.getByRole("button", { name: "open many" }));
		await user.click(screen.getByRole("button", { name: /이전 이미지/ }));

		expect(await screen.findByRole("img", { name: "image-c" })).toBeInTheDocument();
	});

	it("ArrowRight 키보드로 다음 이미지 이동", async () => {
		const user = userEvent.setup();
		render(
			<LightboxProvider>
				<MultiOpener />
			</LightboxProvider>
		);

		await user.click(screen.getByRole("button", { name: "open many" }));
		await screen.findByRole("img", { name: "image-a" });

		await user.keyboard("{ArrowRight}");
		expect(await screen.findByRole("img", { name: "image-b" })).toBeInTheDocument();
	});

	it("ArrowLeft 키보드로 이전 이미지 이동", async () => {
		const user = userEvent.setup();
		render(
			<LightboxProvider>
				<MultiOpener startIndex={2} />
			</LightboxProvider>
		);

		await user.click(screen.getByRole("button", { name: "open many" }));
		await screen.findByRole("img", { name: "image-c" });

		await user.keyboard("{ArrowLeft}");
		expect(await screen.findByRole("img", { name: "image-b" })).toBeInTheDocument();
	});

	it("ESC 닫기: dialog 언마운트", async () => {
		const user = userEvent.setup();
		render(
			<LightboxProvider>
				<SingleOpener />
			</LightboxProvider>
		);

		await user.click(screen.getByRole("button", { name: "open single" }));
		expect(await screen.findByRole("dialog")).toBeInTheDocument();

		await user.keyboard("{Escape}");
		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
	});
});
