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
		expect(screen.getByLabelText("조회수 불러오는 중")).toBeInTheDocument();
	});

	it("마운트 후 POST +1 + GET으로 실 숫자 표시 (seeded 42 → 43)", async () => {
		seedMockView("react-19-use", 42);
		render(<ViewCounter slug="react-19-use" />);

		await waitFor(() => {
			expect(screen.getByText(new RegExp(`조회 43`.replace(",", ",")))).toBeInTheDocument();
		});
		expect(screen.getByText(/조회 43/)).toBeInTheDocument();
	});

	it("3자리 이상 숫자는 toLocaleString(ko-KR) 포맷", async () => {
		seedMockView("popular", 1233);
		render(<ViewCounter slug="popular" />);

		await waitFor(() => {
			expect(screen.getByText(new RegExp(`조회 1,234`.replace(",", ",")))).toBeInTheDocument();
		});
		expect(screen.getByText(/조회 1,234/)).toBeInTheDocument();
	});

	it("동일 세션에서 같은 slug 재마운트 시 POST 재호출 금지 (sessionStorage dedup)", async () => {
		seedMockView("dedup-post", 10);

		const { unmount } = render(<ViewCounter slug="dedup-post" />);
		await waitFor(() => {
			expect(screen.getByText(new RegExp(`조회 11`.replace(",", ",")))).toBeInTheDocument();
		});
		unmount();

		render(<ViewCounter slug="dedup-post" />);
		await waitFor(() => {
			expect(screen.getByText(new RegExp(`조회 11`.replace(",", ",")))).toBeInTheDocument();
		});
	});

	it("서로 다른 slug는 각각 POST (dedup은 slug별)", async () => {
		seedMockView("post-a", 5);
		seedMockView("post-b", 20);

		render(<ViewCounter slug="post-a" />);
		await waitFor(() => {
			expect(screen.getByText(new RegExp(`조회 6`.replace(",", ",")))).toBeInTheDocument();
		});
		cleanup();

		render(<ViewCounter slug="post-b" />);
		await waitFor(() => {
			expect(screen.getByText(new RegExp(`조회 21`.replace(",", ",")))).toBeInTheDocument();
		});
	});

	it("GET 500 실패 시 조회 정보 없음으로 표시", async () => {
		server.use(http.get("/api/views", () => HttpResponse.json({ error: "boom" }, { status: 500 })));

		render(<ViewCounter slug="broken" />);
		await waitFor(() => {
			expect(screen.getByText(/조회 정보 없음/)).toBeInTheDocument();
		});
		expect(screen.getByText(/조회 정보 없음/)).toBeInTheDocument();
	});

	it("POST 실패도 UI 블록 없이 GET 결과 표시 (POST는 best-effort)", async () => {
		seedMockView("post-c", 99);
		server.use(http.post("/api/views", () => HttpResponse.error()));

		render(<ViewCounter slug="post-c" />);
		await waitFor(() => {
			expect(screen.getByText(new RegExp(`조회 99`.replace(",", ",")))).toBeInTheDocument();
		});
	});
});
