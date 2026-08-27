# FSD 경계 강제 도구

> 원천: github.com/feature-sliced/steiger README와 npm 메타데이터(2026-08 조회), fsd.how의 ESLint 가이드(2026-01).
> 버전 기준: steiger 0.6.0, @feature-sliced/steiger-plugin 0.7.0 (둘 다 2026-07-14 발행).

경계 규칙은 사람의 주의로 지켜지지 않는다. 도구 없이 FSD를 도입하면 개발자마다 해석이 갈려 코드베이스가 일관성을 잃는다. 도입 첫날부터 린터를 건다.

## Steiger (공식 FSD 린터)

feature-sliced 조직이 만든 공식 아키텍처 린터다. 본체 `steiger`와 FSD 규칙 플러그인 `@feature-sliced/steiger-plugin`으로 나뉜다.

```bash
npm i -D steiger @feature-sliced/steiger-plugin
npx steiger src            # 검사
npx steiger src --watch    # 감시 모드
```

- 설정 없이 동작한다. FSD 표준 구조면 바로 검사할 수 있다.
- 베타 상태다. 저장소가 직접 1.0 이전이고 API가 바뀔 수 있다고 밝힌다. CI에 넣을 때는 버전을 고정하고(`--save-exact`) 올릴 때 규칙 변화를 확인한다.
- 커스텀 규칙 추가는 아직 불가능하다. 프로젝트 고유 규칙이 필요하면 ESLint로 보완한다.

### 설정 파일

설정이 필요하면 `steiger.config.ts`를 만든다. ESLint flat config와 비슷한 형식이고 0.5.0에서 도입됐다(이전 형식에서 옮기는 codemod 제공).

```ts
// steiger.config.ts
import { defineConfig } from "steiger";
import fsd from "@feature-sliced/steiger-plugin";

export default defineConfig([
	...fsd.configs.recommended,
	{
		files: ["./src/shared/**"],
		rules: {
			"fsd/public-api": "off"
		}
	},
	{
		ignores: ["**/__mocks__/**"]
	}
]);
```

### 주요 규칙

| 규칙                         | 검사 내용                                                       |
| ---------------------------- | --------------------------------------------------------------- |
| `fsd/forbidden-imports`      | 상위 레이어 import와 같은 레이어 크로스 임포트 금지             |
| `fsd/public-api`             | 슬라이스에 public API(index) 요구                               |
| `fsd/no-public-api-sidestep` | public API를 우회한 내부 파일 직접 import 금지                  |
| `fsd/no-processes`           | 폐기된 processes 레이어 사용 검출                               |
| `fsd/insignificant-slice`    | 한 페이지에서만 쓰이는 entity나 feature를 그 페이지로 병합 제안 |
| `fsd/excessive-slicing`      | 한 레이어의 슬라이스가 지나치게 많으면 과잉 분할로 경고         |
| `fsd/segments-by-purpose`    | `components`, `hooks` 같은 목적 없는 세그먼트 이름 금지         |
| `fsd/no-ui-in-app`           | app 레이어에 ui 세그먼트 금지                                   |

전체 목록은 플러그인 README에 있다. `import-locality`처럼 기본 비활성인 규칙도 있다.

### Next.js 통합에 중요한 버전 이력

| 버전  | 시기    | 변화                                                                |
| ----- | ------- | ------------------------------------------------------------------- |
| 0.5.5 | 2025-03 | `index.client.ts`, `index.server.ts` 같은 복수 public API 인식      |
| 0.5.6 | 2025-05 | `sliceA/@x/sliceB` 크로스 임포트 public API(@x 표기) 인식           |
| 0.5.8 | 2026-05 | 밑줄 접두사 레이어(`_app`, `_pages`) 지원. Next.js 개명 패턴의 전제 |
| 0.6.0 | 2026-06 | 의존성 추출을 tree-sitter로 교체                                    |
| 0.7.0 | 2026-07 | segments-by-purpose가 프레임워크 특화 세그먼트 이름까지 금지        |

0.5.8 미만 버전은 `_pages`를 레이어로 인식하지 못한다. Next.js 프로젝트라면 최소 0.5.8, 가능하면 최신을 쓴다.

## ESLint로 보완

Steiger는 커밋과 CI 단계 검사에 강하고, 에디터 실시간 피드백과 프로젝트 고유 규칙은 ESLint가 맡는다. ESLint 9부터 flat config(`eslint.config.js`)가 기본이므로 아래 예시도 flat config다.

### 방법 1: 내장 no-restricted-imports (공식 가이드 방식)

fsd.how의 ESLint 가이드는 전용 플러그인 없이 내장 규칙의 glob 패턴으로 경계를 강제한다. public API 우회(깊은 import)를 막는 예시다.

```js
// eslint.config.js
export default [
	{
		files: ["src/**/*.{ts,tsx}"],
		rules: {
			"no-restricted-imports": [
				"error",
				{
					patterns: [
						{
							group: ["@/_pages/*/*", "@/widgets/*/*", "@/features/*/*", "@/entities/*/!(@x)/*"],
							message: "슬라이스는 public API(index)로만 import한다."
						}
					]
				}
			]
		}
	},
	{
		files: ["src/features/**"],
		rules: {
			"no-restricted-imports": [
				"error",
				{
					patterns: [
						{
							group: ["@/_app/*", "@/_pages/*", "@/widgets/*", "@/features/*"],
							message: "features는 entities와 shared만 import할 수 있다."
						}
					]
				}
			]
		}
	}
	// 같은 방식으로 entities, widgets, _pages, shared에 레이어별 블록을 추가한다
];
```

레이어별 files 블록을 레이어 수만큼 반복해야 해서 장황하지만 의존성이 없고 어디서나 동작한다.

### 방법 2: eslint-plugin-boundaries

레이어 규칙을 선언적으로 쓸 수 있다. FSD 커뮤니티 템플릿들이 실제로 쓰는 조합이다.

```js
// eslint.config.js
import boundaries from "eslint-plugin-boundaries";

export default [
	{
		files: ["src/**/*.{ts,tsx}"],
		plugins: { boundaries },
		settings: {
			"boundaries/elements": [
				{ type: "app", pattern: "src/_app/*" },
				{ type: "pages", pattern: "src/_pages/*" },
				{ type: "widgets", pattern: "src/widgets/*" },
				{ type: "features", pattern: "src/features/*" },
				{ type: "entities", pattern: "src/entities/*" },
				{ type: "shared", pattern: "src/shared/*" }
			]
		},
		rules: {
			"boundaries/element-types": [
				"error",
				{
					default: "disallow",
					rules: [
						{ from: "app", allow: ["pages", "widgets", "features", "entities", "shared"] },
						{ from: "pages", allow: ["widgets", "features", "entities", "shared"] },
						{ from: "widgets", allow: ["features", "entities", "shared"] },
						{ from: "features", allow: ["entities", "shared"] },
						{ from: "entities", allow: ["shared"] },
						{ from: "shared", allow: ["shared"] }
					]
				}
			]
		}
	}
];
```

이 설정은 레이어 방향만 강제한다. 슬라이스 격리와 public API, `@x` 예외는 Steiger가 맡게 두는 편이 단순하다.

### 방법 3: dependency-cruiser

레이어 규칙을 넘어 순환 의존 검출과 의존 그래프 시각화까지 필요할 때 쓴다. 규칙을 정규식으로 쓰므로 초기 설정 비용이 크다. Steiger와 ESLint로 충분하면 도입하지 않는다.

## 권장 조합

1. **Steiger를 정본으로.** FSD 의미론(슬라이스, public API, @x, 과잉 분할)을 아는 유일한 도구다.
2. **ESLint 경계 규칙을 에디터 피드백용으로.** 위반을 저장 시점에 보이게 한다.
3. **CI에 둘 다 건다.**

```jsonc
// package.json
{
	"scripts": {
		"lint:arch": "steiger src",
		"lint": "eslint ."
	}
}
```

pre-commit 훅이나 CI 파이프라인에서 `lint:arch`를 타입 검사와 함께 돌린다. 기존 코드베이스에 도입할 때 위반이 많으면 `migration.md`의 점진 강제 절을 본다.
