import { describe, expect, it } from "vitest";

import { stripSeriesPrefix } from "../stripSeriesPrefix";

describe("stripSeriesPrefix", () => {
	it("대괄호 접두어와 뒤따르는 공백을 걷어낸다", () => {
		expect(stripSeriesPrefix("[RADIO로 시스템 디자인하기 #2] 자동완성 검색창 설계 부숴보기")).toBe(
			"자동완성 검색창 설계 부숴보기"
		);
	});

	it("번호가 없는 대괄호와 본문 중간의 대괄호, 접두어가 없는 제목은 그대로 둔다", () => {
		expect(stripSeriesPrefix("[초안] 제목")).toBe("[초안] 제목");
		expect(stripSeriesPrefix("배열 [0] 인덱스 다루기")).toBe("배열 [0] 인덱스 다루기");
		expect(stripSeriesPrefix("항해 플러스 프론트엔드 6기 1주차, Chapter 1-1")).toBe(
			"항해 플러스 프론트엔드 6기 1주차, Chapter 1-1"
		);
	});
});

describe("stripSeriesPrefix 시리즈명 인자", () => {
	it("대괄호가 없어도 시리즈명으로 시작하면 걷어낸다", () => {
		expect(stripSeriesPrefix("항해 플러스 프론트엔드 6기 1주차, Chapter 1-1", "항해 플러스 프론트엔드 6기")).toBe(
			"1주차, Chapter 1-1"
		);
	});

	it("띄어쓰기가 달라도 걷어낸다", () => {
		expect(stripSeriesPrefix("항해플러스 프론트엔드 6기 완주 후기", "항해 플러스 프론트엔드 6기")).toBe("완주 후기");
	});

	it("걷어내면 빈 문자열이 되는 제목은 그대로 둔다", () => {
		expect(stripSeriesPrefix("WebRTC 박살내기", "WebRTC 박살내기")).toBe("WebRTC 박살내기");
	});
});
