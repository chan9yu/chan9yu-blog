import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { CommentsSection } from "../CommentsSection";

type IntersectionCb = (entries: Array<{ isIntersecting: boolean }>) => void;

let observeCallbacks: Array<IntersectionCb> = [];

class MockIntersectionObserver {
	constructor(cb: IntersectionCb) {
		observeCallbacks.push(cb);
	}
	observe() {
		const cb = observeCallbacks[observeCallbacks.length - 1];
		cb?.([{ isIntersecting: true }]);
	}
	disconnect() {}
	unobserve() {}
}

const giscusEnv = {
	NEXT_PUBLIC_GISCUS_REPO: "chan9yu/dev-blog",
	NEXT_PUBLIC_GISCUS_REPO_ID: "R_kgDO_test",
	NEXT_PUBLIC_GISCUS_CATEGORY: "Comments",
	NEXT_PUBLIC_GISCUS_CATEGORY_ID: "DIC_kwDO_test"
};

beforeEach(() => {
	observeCallbacks = [];
	vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
});

afterEach(() => {
	cleanup();
	vi.unstubAllGlobals();
	vi.unstubAllEnvs();
});

describe("CommentsSection", () => {
	it("isPrivate=true면 섹션 비렌더 (댓글 제목도 없음)", () => {
		for (const [k, v] of Object.entries(giscusEnv)) vi.stubEnv(k, v);
		const { container } = render(<CommentsSection slug="private-post" isPrivate />);
		expect(container.firstChild).toBeNull();
		expect(screen.queryByText("댓글")).not.toBeInTheDocument();
	});

	it("환경변수 누락 시 config 안내 placeholder 렌더", () => {
		render(<CommentsSection slug="react-19-use" />);
		expect(screen.getByRole("heading", { name: "댓글" })).toBeInTheDocument();
		expect(screen.getByText(/Giscus 환경변수.*설정/)).toBeInTheDocument();
	});

	it("환경변수 + intersection 후 giscus.app/client.js script 주입", () => {
		for (const [k, v] of Object.entries(giscusEnv)) vi.stubEnv(k, v);
		const { container } = render(<CommentsSection slug="react-19-use" />);

		const script = container.querySelector<HTMLScriptElement>('script[src="https://giscus.app/client.js"]');
		expect(script).not.toBeNull();
		expect(script?.dataset.repo).toBe(giscusEnv.NEXT_PUBLIC_GISCUS_REPO);
		expect(script?.dataset.repoId).toBe(giscusEnv.NEXT_PUBLIC_GISCUS_REPO_ID);
		expect(script?.dataset.category).toBe(giscusEnv.NEXT_PUBLIC_GISCUS_CATEGORY);
		expect(script?.dataset.categoryId).toBe(giscusEnv.NEXT_PUBLIC_GISCUS_CATEGORY_ID);
		expect(script?.dataset.term).toBe("posts/react-19-use");
		expect(script?.dataset.mapping).toBe("specific");
		expect(script?.crossOrigin).toBe("anonymous");
		expect(script?.async).toBe(true);
	});

	it("언마운트 시 script 정리 (메모리 누수 방지)", () => {
		for (const [k, v] of Object.entries(giscusEnv)) vi.stubEnv(k, v);
		const { container, unmount } = render(<CommentsSection slug="react-19-use" />);

		expect(container.querySelector('script[src*="giscus.app"]')).not.toBeNull();
		unmount();
		expect(document.querySelector('script[src*="giscus.app"]')).toBeNull();
	});
});
