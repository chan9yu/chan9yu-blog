import "@testing-library/jest-dom/vitest";

import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll } from "vitest";

import { installDialogPolyfill } from "./dialog-polyfill";
import { resetMockViews } from "./msw/handlers";
import { server } from "./msw/server";

installDialogPolyfill();

beforeAll(() => {
	server.listen({ onUnhandledRequest: "error" });
});

afterEach(() => {
	cleanup();
	server.resetHandlers();
	resetMockViews();
});

afterAll(() => {
	server.close();
});
