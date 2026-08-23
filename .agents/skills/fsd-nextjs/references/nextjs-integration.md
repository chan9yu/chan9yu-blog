# FSD와 Next.js 통합 상세

> 원천: fsd.how 공식 가이드 Usage with Next.js(2026-08 조회), Next.js 16.3 공식 문서와 소스, github.com/feature-sliced/skills(공식 에이전트 스킬 저장소, 2026-08 갱신).
> 공식 문서에 없는 실무 보충은 각 절에 그렇게 표시했다.

## 이름 충돌과 공식 해법

Next.js가 요구하는 `app`(App Router), `pages`(Pages Router) 폴더는 FSD의 `app`, `pages` 레이어와 이름이 충돌한다. 현행 공식 해법은 두 부분이다.

1. Next.js 라우팅 폴더는 프로젝트 루트에 두고 라우팅에 필요한 파일만 담는다. `src/`에는 FSD 코드만 남긴다.
2. FSD의 app과 pages 레이어 이름을 `_app`과 `_pages`로 바꾼다. 공식 가이드 원문은 어떤 라우터를 쓰든 두 레이어를 모두 바꾸라고 명시한다.

> "To avoid conflicts, rename both `app` and `pages` FSD layers to `_app` and `_pages`, regardless of which router you use."

### 왜 개명인가 (충돌의 실제 메커니즘)

Next.js는 `pages`와 `app` 디렉토리를 각각 루트에서 먼저 찾고 없으면 `src/`에서 찾는다. 루트에 `app/`(라우팅)이 있고 `src/pages/`(FSD 레이어)가 있으면 Next.js는 이 둘을 한 쌍으로 집는데, 두 디렉토리의 부모가 달라서 오류 E801("pages and app directories should be under the same folder")로 빌드가 즉시 실패한다. Next.js 16.3의 `find-pages-dir.js` 소스에서 확인된 동작이다. `src/pages`라는 경로 자체를 없애는 개명이 근본 해법인 이유다.

### 과거 우회책은 쓰지 않는다

예전 가이드는 루트에 빈 `pages/` 폴더를 두어 탐색을 루트에서 멈추게 했다. 이 요령은 현행 공식 가이드에서 사라졌고, 공식 에이전트 스킬 저장소는 Next.js 13.5 이후 빌드를 깨뜨릴 수 있다고 명시한다. 새 프로젝트에 쓰지 말고, 기존 프로젝트에서 발견하면 레이어 개명으로 옮긴다.

레이어 개명의 도구 지원: Steiger는 0.5.8(2026-05)부터 밑줄 접두사 레이어(`_app`, `_pages`)를 정식 인식한다. 커뮤니티에는 pages 레이어를 `views`로 부르는 사례도 있으나 Steiger가 인식하는 이름이 아니므로 공식 표기인 `_pages`를 쓴다.

## App Router 통합

### 디렉토리 구조 (공식 예시)

```
app/                        Next.js 라우팅 (루트)
├── api/
│   └── example/
│       └── route.ts
└── example/
    └── page.tsx

proxy.ts                    루트. Next.js 15 이하는 middleware.ts

src/
├── _app/                   FSD app 레이어
│   └── api-routes/
├── _pages/                 FSD pages 레이어 (실제 페이지 구현)
│   └── example/
│       ├── index.ts
│       └── ui/
│           └── example.tsx
├── widgets/
├── features/
├── entities/
└── shared/
```

### 라우트 파일은 한 줄 re-export

```tsx
// app/example/page.tsx
export { ExamplePage as default, metadata } from "@/_pages/example";
```

- 실제 구현은 `src/_pages/example/ui/example.tsx`에 있고 슬라이스 public API(`index.ts`)를 거쳐 노출된다.
- `metadata`도 FSD `_pages` 슬라이스가 소유하고 라우트 파일이 re-export한다. SEO까지 FSD 레이어에 두는 것이 공식 예시의 원리다.
- `@/` alias는 `src/`를 가리키게 설정한다(tsconfig `paths`).

### 나머지 라우팅 파일 (공식 문서 외 보충)

`layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`에 대한 공식 예시는 없지만 `page.tsx`와 같은 re-export 원리를 적용하는 것이 자연스럽다. `generateMetadata`와 `generateStaticParams`도 페이지 슬라이스가 소유하고 라우트 파일이 re-export한다.

```tsx
// app/blog/[slug]/page.tsx
export { PostPage as default, generateMetadata, generateStaticParams } from "@/_pages/post";
```

주의 두 가지.

- `error.tsx`는 파일 첫 줄에 `"use client"`가 필요하다. 지시어는 re-export로 전달되지 않으므로 구현 파일(`src/_pages/.../ui/post-error.tsx`) 쪽에 붙이고, 라우트 파일은 그 클라이언트 컴포넌트를 re-export한다.
- 병렬 라우트(`@slot`)를 쓰면 Next.js 16부터 모든 슬롯에 `default.tsx`가 필수다. 없으면 빌드가 실패한다.

### Next.js 16.3의 라우팅 파일 규약 목록

`page`, `layout`, `loading`, `error`, `global-error`, `not-found`, `forbidden`, `unauthorized`, `route`, `template`, `default`. 여기에 metadata 파일 규약(`favicon`, `icon`, `apple-icon`, `opengraph-image`, `twitter-image`, `sitemap`, `robots`)과 루트 규약(`proxy`, `instrumentation`, `instrumentation-client`)이 있다. `forbidden`과 `unauthorized`는 15 후반에 추가된 인가 오류 화면 규약이다.

### 라우트 그룹과 레이아웃

App Router의 라우트 그룹 `(group)` 더하기 `layout.tsx` 중첩은 "app 레이어에서 레이아웃을 한 번 적용한다"는 FSD 사고와 정확히 대응한다. 레이아웃 골격 컴포넌트는 `shared/ui`나 `src/_app/`에 두고, 루트 `app/(group)/layout.tsx`가 이를 조립한다. 레이아웃은 프레임만 제공하고 구체 콘텐츠는 children과 props로 받는다.

| 상황                                    | 배치                                                             |
| --------------------------------------- | ---------------------------------------------------------------- |
| 비즈니스 로직 없는 단순 마크업 레이아웃 | `shared/ui` 또는 `src/_app/`의 세그먼트                          |
| 인증이나 데이터 로딩이 필요한 레이아웃  | `src/_app/` 세그먼트에 구현 (app 레이어는 전 레이어 import 가능) |
| 2~3개 페이지만 쓰는 레이아웃            | 페이지별 wrapper 중복 허용. 레이아웃은 자주 바뀌지 않는다        |

위젯 레이아웃을 만들기 전에 이 레이아웃이 정말 필요한지, 꼭 위젯이어야 하는지를 먼저 자문한다.

## Route Handler (API)

핸들러 구현은 FSD `_app` 레이어의 `api-routes` 세그먼트에 두고, 루트 라우트 파일은 HTTP 메서드 이름으로 re-export만 한다.

```ts
// src/_app/api-routes/get-example-data.ts
import { getExamplesList } from "@/shared/db";

export const getExampleData = () => {
	const examplesList = getExamplesList();
	return Response.json({ examplesList });
};
```

```ts
// app/api/example/route.ts
export { getExampleData as GET } from "@/_app/api-routes";
```

데이터베이스 쿼리는 `shared`의 `db` 세그먼트에 정의하고 상위 레이어에서 가져다 쓴다. 캐싱과 revalidate 로직도 쿼리 정의와 같은 자리에 둔다. 서버 측 코드가 많아지면 FSD는 프론트엔드 방법론이므로 모노레포 별도 패키지 분리가 공식 권장이다.

## Pages Router 통합

### 디렉토리 구조

```
pages/                      Next.js 라우팅 (루트)
├── _app.tsx
├── api/
│   └── example.ts
└── example/
    └── index.tsx

src/
├── _app/
│   ├── custom-app/
│   └── api-routes/
├── _pages/
│   └── example/
│       ├── index.ts
│       └── ui/example.tsx
└── (widgets, features, entities, shared)
```

### 라우트 파일과 Custom App

```tsx
// pages/example/index.tsx
export { Example as default } from "@/_pages/example";
```

Custom App(providers가 놓이는 곳)은 `src/_app/custom-app/`에 구현하고 `pages/_app.tsx`가 re-export한다.

### API 라우트의 config 규약

Pages Router API는 named export `config`와 default export 규약이 있으므로, FSD 레이어에서 둘을 하나의 객체로 소유하고 라우팅 파일에서 분해한다.

```ts
// src/_app/api-routes/get-example-data.ts
import type { NextApiRequest, NextApiResponse } from "next";

const config = { api: { bodyParser: { sizeLimit: "1mb" } } };

const handler = (req: NextApiRequest, res: NextApiResponse) => {
	res.status(200).json({ message: "Hello from FSD" });
};

export const getExampleData = { config, handler } as const;
```

```ts
// pages/api/example.ts
import { getExampleData } from "@/_app/api-routes";

export const config = getExampleData.config;
export default getExampleData.handler;
```

## proxy, instrumentation, 규약 파일

- Next.js 16부터 요청 가로채기 파일은 `proxy.ts`다(내보내는 함수 이름도 `proxy`). `middleware.ts`는 deprecated 상태로 남아 있고 이후 버전에서 제거된다. 이전 코드는 codemod로 옮긴다: `npx @next/codemod middleware-to-proxy .`
- `proxy.ts`(또는 15 이하의 `middleware.ts`)와 `instrumentation.ts`는 FSD 레이어 안이 아니라 프로젝트 루트에 둔다. Next.js 규약상 라우팅 폴더와 나란히 있어야 한다.
- `next.config.ts` 같은 나머지 규약 파일도 같은 원리로 루트에 유지한다.

## 서버와 클라이언트 public API 분리

App Router에서는 서버 전용 모듈과 클라이언트에서 쓸 수 있는 모듈이 한 슬라이스에 공존한다. 서버 전용 모듈을 `index.ts`로 내보내면 클라이언트 컴포넌트가 그 슬라이스를 import할 때 서버 전용 부작용이 클라이언트 모듈 그래프로 번져 빌드 오류가 난다. 공식 해법은 public API를 둘로 나누는 것이다.

- `index.ts`: 클라이언트에서도 안전한 수출
- `index.server.ts`: 서버에서만 import해야 하는 수출. 서버 컴포넌트, `server-only`로 표시된 데이터 접근 함수

```ts
// src/_pages/post/index.server.ts
export { PostPage, generateMetadata, generateStaticParams } from "./ui/post-page";

// src/_pages/post/index.ts
export { PostCardSkeleton } from "./ui/post-card-skeleton";
```

Steiger는 0.5.5부터 `index.client.ts`, `index.server.ts` 같은 복수 public API를 인식한다.

관련 함정: 서버 컴포넌트와 클라이언트 컴포넌트를 한 배럴에 섞어 내보내면 서버 컴포넌트가 클라이언트 컴포넌트로 표시되는 문제가 보고돼 있다(Next.js 이슈 63441). 분리가 답이다.

### RSC 경계 설계 (공식 문서 외 보충)

- `"use client"`는 상호작용이 필요한 말단 컴포넌트에만 붙인다. features의 폼과 버튼, shared/ui의 인터랙티브 컴포넌트가 해당한다. `_pages` 슬라이스의 상위 컴포넌트는 서버 컴포넌트로 유지해 데이터 로딩을 맡긴다.
- 서버 전용 코드(`shared/db`의 쿼리 등)는 `server-only` 패키지를 import해서 클라이언트 번들 유입을 빌드 오류로 차단한다. 레이어 경계가 런타임 경계와 일치하게 된다.
- 레이어가 아래일수록 서버와 클라이언트 양쪽에서 쓰일 가능성이 크다. shared는 특별한 이유가 없으면 지시어 없이 양쪽에서 동작하게 만든다.

## Server Actions 배치 (공식 문서 외 보충)

공식 FSD 문서는 Server Actions의 배치를 다루지 않는다. FSD 원리에서 자연스럽게 도출되는 지침은 다음과 같다.

- Action은 그 변경(mutation)을 소유한 슬라이스의 `api` 세그먼트에 둔다. 페이지 전용 폼이면 `_pages/{slice}/api/actions.ts`, 재사용되는 상호작용이면 `features/{slice}/api/actions.ts`다.
- 파일 상단에 `"use server"`를 붙인 전용 파일로 만든다. 이 파일의 async 함수 수출은 클라이언트에서 import해도 원격 호출 스텁으로 컴파일되므로 일반 `index.ts`로 내보내도 안전하다. `server-only`를 import하는 모듈과는 성질이 다르다.
- Action 내부의 공통 로직(DB 쿼리, 인증 확인)은 `shared/db`, `shared/auth`로 내리고 action은 얇게 유지한다.

```ts
// src/features/comment-form/api/actions.ts
"use server";

import { db } from "@/shared/db";

export async function createComment(formData: FormData) {
	// 검증하고 저장한다
}
```

## use cache와 캐싱 (Next.js 16, 공식 문서 외 보충)

Next.js 16의 Cache Components(`next.config.ts`에 `cacheComponents: true`)를 켜면 `"use cache"` 지시어로 라우트, 컴포넌트, 함수를 캐시할 수 있다. 기존 `experimental.ppr`과 `experimental.dynamicIO` 플래그는 이 설정으로 흡수됐다.

FSD 관점의 배치 원칙은 데이터 함수와 같다. 캐시할 데이터 접근 함수는 그것을 소유한 슬라이스의 `api` 세그먼트나 `shared/api`, `shared/db`에 두고 그 자리에서 `"use cache"`와 `cacheTag`, `cacheLife`를 관리한다. 캐싱 여부는 호출자가 아니라 데이터 소유자가 결정하는 것이 재사용할 때 안전하다.

## API 요청 코드 배치

- 공통 API 로직은 `shared/api`에 둔다. base URL과 헤더, 직렬화를 일원화한 `client.ts`와 `endpoints/`, `index.ts`로 구성한다.
- 특정 페이지나 기능 전용 요청은 그 슬라이스의 `api` 세그먼트에 둔다. 슬라이스 public API로 re-export하지 않아도 된다.
- 백엔드 응답 타입과 API 함수를 entities에 직접 두지 않는다. `shared/api`가 백엔드 데이터를, entities가 프론트에 필요한 구조를 맡는다.
- OpenAPI 자동 생성물(Orval, openapi-typescript)은 `shared/api/openapi/`에 둔다.
- TanStack Query 같은 라이브러리의 공통 옵션과 캐시 키는 shared에 공유한다.

## Next.js 16 업그레이드 시 FSD 관련 주의

- `params`와 `searchParams` props, `cookies()`, `headers()`, `draftMode()`의 동기 접근이 제거됐다. 전부 await로 접근한다. 페이지 슬라이스의 구현 컴포넌트 시그니처가 바뀌는 변경이다.
- Turbopack이 dev와 build 모두의 기본 번들러다. webpack이 필요하면 `--webpack` 플래그를 명시한다. 배럴 파일에 주는 영향은 `references/antipatterns.md`의 배럴 절을 본다.
- React Compiler 설정(`reactCompiler`)이 최상위로 승격됐지만 기본 활성은 아니다.
