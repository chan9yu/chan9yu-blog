import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { siteHostname } from "@/shared/config/site";

import { MdxLink } from "../MdxLink";

describe("MdxLink", () => {
	it("다른 호스트 링크는 새 창으로 열고 안내를 붙인다", () => {
		render(<MdxLink href="https://developer.mozilla.org/ko/docs/Web/API/URL">URL</MdxLink>);

		const link = screen.getByRole("link", { name: /URL/ });
		expect(link).toHaveAttribute("href", "https://developer.mozilla.org/ko/docs/Web/API/URL");
		expect(link).toHaveAttribute("target", "_blank");
		expect(link).toHaveAttribute("rel", "noopener noreferrer");
		expect(link).toHaveTextContent("(새 창에서 열림)");
	});

	it("상대 경로 링크는 새 창으로 열지 않는다", () => {
		render(<MdxLink href="/posts/react-core-deep-dive">글</MdxLink>);

		const link = screen.getByRole("link", { name: "글" });
		expect(link).toHaveAttribute("href", "/posts/react-core-deep-dive");
		expect(link).not.toHaveAttribute("target");
		expect(link).not.toHaveAttribute("rel");
	});

	it("자기 호스트 절대 URL은 www가 붙어도 내부 링크가 되고 쿼리와 해시를 남긴다", () => {
		render(<MdxLink href={`https://${siteHostname}/posts/react-core-deep-dive`}>글</MdxLink>);

		const bare = screen.getByRole("link", { name: "글" });
		expect(bare).toHaveAttribute("href", "/posts/react-core-deep-dive");
		expect(bare).not.toHaveAttribute("target");

		render(<MdxLink href={`https://www.${siteHostname}/posts/2025-retrospective?tab=all#footer`}>회고</MdxLink>);

		const withWww = screen.getByRole("link", { name: "회고" });
		expect(withWww).toHaveAttribute("href", "/posts/2025-retrospective?tab=all#footer");
		expect(withWww).not.toHaveAttribute("target");
		expect(withWww).not.toHaveTextContent("새 창에서 열림");
	});
});
