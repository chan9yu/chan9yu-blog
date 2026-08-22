import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ThemeSwitcher } from "../ThemeSwitcher";

function Wrapper({ children, defaultTheme = "light" }: { children: ReactNode; defaultTheme?: string }) {
	return (
		<ThemeProvider attribute="class" enableColorScheme={false} defaultTheme={defaultTheme} disableTransitionOnChange>
			{children}
		</ThemeProvider>
	);
}

function setupMatchMedia(matches = false) {
	Object.defineProperty(window, "matchMedia", {
		writable: true,
		configurable: true,
		value: vi.fn().mockImplementation((query: string) => ({
			matches,
			media: query,
			onchange: null,
			addListener: vi.fn(),
			removeListener: vi.fn(),
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
			dispatchEvent: vi.fn()
		}))
	});
}

beforeEach(() => {
	localStorage.clear();
	document.documentElement.classList.remove("dark", "light");
	setupMatchMedia(false);
});

afterEach(() => {
	cleanup();
	vi.restoreAllMocks();
});

describe("ThemeSwitcher", () => {
	it("버튼은 `button` role + aria-label 제공", () => {
		render(
			<Wrapper>
				<ThemeSwitcher />
			</Wrapper>
		);
		const btn = screen.getByRole("button");
		expect(btn).toHaveAttribute("aria-label");
		expect(btn.getAttribute("aria-label") ?? "").toMatch(/모드/);
	});

	it("light 기본에서 클릭 시 dark 전환 (aria-pressed 및 html.dark 클래스)", async () => {
		const user = userEvent.setup();
		render(
			<Wrapper>
				<ThemeSwitcher />
			</Wrapper>
		);

		const btn = await screen.findByRole("button", { name: /다크 모드로 변경/ });
		expect(btn).toHaveAttribute("aria-pressed", "false");

		await user.click(btn);

		const updatedBtn = await screen.findByRole("button", { name: /라이트 모드로 변경/ });
		expect(updatedBtn).toHaveAttribute("aria-pressed", "true");
		expect(document.documentElement.classList.contains("dark")).toBe(true);
	});

	it("dark에서 토글 시 light로 복귀", async () => {
		localStorage.setItem("theme", "dark");
		const user = userEvent.setup();
		render(
			<Wrapper defaultTheme="dark">
				<ThemeSwitcher />
			</Wrapper>
		);

		const btn = await screen.findByRole("button", { name: /라이트 모드로 변경/ });
		await user.click(btn);

		await screen.findByRole("button", { name: /다크 모드로 변경/ });
		expect(document.documentElement.classList.contains("dark")).toBe(false);
	});

	it("View Transitions API 지원 시 startViewTransition 경유로 apply", async () => {
		const startViewTransitionSpy = vi.fn((cb: () => void) => {
			cb();
			return { finished: Promise.resolve(), ready: Promise.resolve(), updateCallbackDone: Promise.resolve() };
		});
		vi.stubGlobal("document", Object.assign(document, { startViewTransition: startViewTransitionSpy }));

		const user = userEvent.setup();
		render(
			<Wrapper>
				<ThemeSwitcher />
			</Wrapper>
		);

		const btn = await screen.findByRole("button", { name: /다크 모드로 변경/ });
		await user.click(btn);

		expect(startViewTransitionSpy).toHaveBeenCalledTimes(1);
		expect(document.documentElement.classList.contains("dark")).toBe(true);
	});

	it("View Transitions API 미지원 환경에서도 테마 전환 동작 (progressive enhancement)", async () => {
		const originalST = (document as unknown as { startViewTransition?: unknown }).startViewTransition;
		delete (document as unknown as { startViewTransition?: unknown }).startViewTransition;

		try {
			const user = userEvent.setup();
			render(
				<Wrapper>
					<ThemeSwitcher />
				</Wrapper>
			);

			const btn = await screen.findByRole("button", { name: /다크 모드로 변경/ });
			await user.click(btn);

			await screen.findByRole("button", { name: /라이트 모드로 변경/ });
			expect(document.documentElement.classList.contains("dark")).toBe(true);
		} finally {
			if (originalST) {
				(document as unknown as { startViewTransition?: unknown }).startViewTransition = originalST;
			}
		}
	});

	it("토글 후 localStorage에 theme 저장 (재방문 복원 기반)", async () => {
		const user = userEvent.setup();
		render(
			<Wrapper>
				<ThemeSwitcher />
			</Wrapper>
		);

		const btn = await screen.findByRole("button", { name: /다크 모드로 변경/ });
		await user.click(btn);

		expect(localStorage.getItem("theme")).toBe("dark");
	});
});
