import { act, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { pushActiveTag, useActiveTag } from "../useActiveTag";

function ActiveTagView() {
	const activeTag = useActiveTag();

	return <span data-testid="active-tag">{activeTag ?? "없음"}</span>;
}

function activeTag() {
	return screen.getByTestId("active-tag");
}

describe("useActiveTag", () => {
	beforeEach(() => {
		window.history.replaceState(null, "", "/posts");
	});

	it("URL의 tag 파라미터를 활성 태그로 읽는다", () => {
		window.history.replaceState(null, "", "/posts?tag=WebRTC");

		render(<ActiveTagView />);

		expect(activeTag()).toHaveTextContent("WebRTC");
	});

	it("태그를 고르면 URL에 인코딩된 tag가 붙고 활성 태그가 따라온다", async () => {
		render(<ActiveTagView />);

		await act(async () => {
			pushActiveTag("실시간통신");
		});

		expect(window.location.pathname).toBe("/posts");
		expect(window.location.search).toBe(`?tag=${encodeURIComponent("실시간통신")}`);
		expect(activeTag()).toHaveTextContent("실시간통신");
	});

	it("바깥 코드가 부른 pushState도 반영한다 (next/link 내비게이션은 popstate를 내지 않는다)", async () => {
		window.history.replaceState(null, "", "/posts?tag=WebRTC");

		await act(async () => {
			render(<ActiveTagView />);
		});
		expect(activeTag()).toHaveTextContent("WebRTC");

		await act(async () => {
			window.history.pushState(null, "", "/posts");
		});

		expect(activeTag()).toHaveTextContent("없음");
	});
});
