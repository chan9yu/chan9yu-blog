import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { resetMockViews, seedMockView } from "@/shared/test/msw/handlers";
import { server } from "@/shared/test/msw/server";

import { ViewCounter } from "../ViewCounter";

beforeEach(() => {
	vi.spyOn(console, "warn").mockImplementation(() => {});
	sessionStorage.clear();
});

afterEach(() => {
	cleanup();
	vi.restoreAllMocks();
	resetMockViews();
});

describe("ViewCounter", () => {
	it("초기 렌더는 로딩 placeholder 표시", () => {
		render(<ViewCounter slug="react-19-use" />);
		expect(screen.getByText("조회수 불러오는 중")).toBeInTheDocument();
	});

	it("마운트 후 POST +1 + GET으로 실 숫자 표시 (seeded 1233 → toLocaleString ko-KR로 1,234)", async () => {
		seedMockView("react-19-use", 1233);
		render(<ViewCounter slug="react-19-use" />);

		await waitFor(() => {
			expect(screen.getByText(/조회 1,234/)).toBeInTheDocument();
		});
	});

	it("동일 세션에서 같은 slug 재마운트 시 POST 재호출 금지 (sessionStorage dedup은 slug별)", async () => {
		seedMockView("dedup-post", 10);
		seedMockView("other-post", 20);

		const { unmount } = render(<ViewCounter slug="dedup-post" />);
		await waitFor(() => {
			expect(screen.getByText(/조회 11/)).toBeInTheDocument();
		});
		unmount();

		render(<ViewCounter slug="dedup-post" />);
		await waitFor(() => {
			expect(screen.getByText(/조회 11/)).toBeInTheDocument();
		});
		cleanup();

		render(<ViewCounter slug="other-post" />);
		await waitFor(() => {
			expect(screen.getByText(/조회 21/)).toBeInTheDocument();
		});
	});

	it("GET 500 실패 시 숫자 대신 대시 표시", async () => {
		server.use(http.get("/api/views", () => HttpResponse.json({ error: "boom" }, { status: 500 })));

		render(<ViewCounter slug="broken" />);
		await waitFor(() => {
			expect(screen.getByText("조회수를 불러오지 못했습니다")).toBeInTheDocument();
		});
		expect(screen.getByText("조회 –")).toBeInTheDocument();
	});

	it("조회수가 0이면 대시가 아니라 0을 표시", async () => {
		server.use(http.get("/api/views", () => HttpResponse.json({ views: 0 })));

		render(<ViewCounter slug="zero-views" />);
		await waitFor(() => {
			expect(screen.getByText(/조회 0/)).toBeInTheDocument();
		});
		expect(screen.queryByLabelText("조회수를 불러오지 못했습니다")).not.toBeInTheDocument();
	});
});
