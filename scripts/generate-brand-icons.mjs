#!/usr/bin/env node

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

import { ImageResponse } from "next/og.js";

const MARK_SOURCE = join(process.cwd(), "public", "images", "logo-mark-white.png");
const OUTPUT_FILE = join(process.cwd(), "public", "favicons", "android-chrome-512x512.png");

const CANVAS_SIZE = 512;
const MARK_SIZE = 398;
const BACKGROUND_COLOR = "#1b1b1b";

function markDataUri() {
	const bytes = readFileSync(MARK_SOURCE);
	return `data:image/png;base64,${bytes.toString("base64")}`;
}

function iconElement(src) {
	return {
		type: "div",
		props: {
			style: {
				width: "100%",
				height: "100%",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				backgroundColor: BACKGROUND_COLOR
			},
			children: {
				type: "img",
				props: { src, width: MARK_SIZE, height: MARK_SIZE }
			}
		}
	};
}

async function main() {
	const response = new ImageResponse(iconElement(markDataUri()), {
		width: CANVAS_SIZE,
		height: CANVAS_SIZE
	});

	const png = Buffer.from(await response.arrayBuffer());

	mkdirSync(dirname(OUTPUT_FILE), { recursive: true });
	writeFileSync(OUTPUT_FILE, png);

	console.log(`[generate-brand-icons] ${CANVAS_SIZE}x${CANVAS_SIZE} 아이콘 생성. ${png.length}바이트`);
}

await main();
