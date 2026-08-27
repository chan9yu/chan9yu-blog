# FSD 핵심 개념 상세

> 원천: fsd.how 공식 레퍼런스(layers, slices-segments, public-api)와 공식 가이드(types, cross-imports). 기준은 v2.1이다.

## 목차

1. [레이어별 상세 책임](#1-레이어별-상세-책임)
2. [슬라이스 규칙](#2-슬라이스-규칙)
3. [슬라이스 그룹](#3-슬라이스-그룹)
4. [세그먼트 규칙](#4-세그먼트-규칙)
5. [Public API](#5-public-api)
6. [@x 크로스 임포트 표기법](#6-x-크로스-임포트-표기법)
7. [Import 규칙 정리](#7-import-규칙-정리)
8. [타입 배치 규칙](#8-타입-배치-규칙)

## 1. 레이어별 상세 책임

### app (최상위, 슬라이스 없음)

- 앱 전역에서 동작하는 설정과 공용 로직. 슬라이스 없이 세그먼트로만 구성된다.
- 대표 세그먼트: `routes`(라우터 설정), `store`(전역 스토어), `styles`(전역 스타일), `entrypoint`(진입점). Next.js 통합에서는 `api-routes`, `custom-app`이 추가된다.
- 애널리틱스와 providers 같은 앱 전역 관심사도 이 레이어의 세그먼트다.
- Next.js에서는 이름 충돌 때문에 `_app`으로 부른다.

### processes (폐기)

- 현행 스펙이 사용을 피하라고 명시한다. 기존 코드는 features 또는 app으로 옮긴다.
- 2024년 이전 커뮤니티 글에는 현행 레이어처럼 남아 있으니 오래된 자료를 볼 때 걸러 읽는다.

### pages (슬라이스 있음, Next.js에서는 _pages)

- 화면 단위. 페이지 하나가 슬라이스 하나가 기본이고, 구조가 비슷한 페이지들은 하나로 묶어도 된다. 코드 찾기가 쉽다면 슬라이스 크기에 제한이 없다.
- 흔한 세그먼트: `ui`(페이지 UI와 로딩, 오류 상태), `api`(페이지 전용 데이터 fetching과 mutation).
- 재사용되지 않는 UI는 페이지 안에 그대로 둔다. v2.1의 Pages-First 원칙이다.

### widgets (슬라이스 있음)

- 독립적으로 동작하는 비교적 큰 UI 블록. 쓰는 시점은 둘이다. 여러 페이지에서 재사용되는 큰 블록이거나, 한 페이지 안의 큰 독립 섹션일 때다.
- 특정 페이지 전용이고 크지도 않으면 widget으로 만들지 않고 페이지 안에 둔다.
- "재사용 가능한 작은 UI 컴포넌트"는 widget이 아니라 `shared/ui`의 일이다. 커뮤니티 글 일부가 이 둘을 섞어 쓴다.

### features (슬라이스 있음)

- 사용자에게 비즈니스 가치를 주는 재사용 가능한 상호작용. 보통 하나 이상의 entity와 연관된다.
- 모든 동작을 feature로 만들지 않는다. 여러 페이지에서 재사용될 때만 추출한다. feature가 너무 많으면 중요한 기능을 찾기 어렵다.
- 설계 목표: 새 팀원이 pages와 features만 훑어도 앱이 무엇을 하는지 대략 이해할 수 있어야 한다.
- 세그먼트: `ui`(폼, 검색 바), `api`(요청과 Server Actions), `model`(검증, 내부 상태), `config`(feature flag).

### entities (슬라이스 있음)

- 실제 도메인 용어(User, Post, Product)와 일치하는 핵심 비즈니스 개념.
- 세그먼트: `model`(데이터 상태, 도메인 로직, 검증 스키마), `api`, `ui`(엔티티의 시각적 표현).
- entity의 ui는 완성된 큰 블록일 필요가 없다. 비즈니스 로직은 props와 slot으로 외부에서 주입받는 것이 좋다.
- entity 슬라이스끼리는 서로 모르는 상태가 이상적이다. 상호작용이 필요하면 로직을 상위 레이어로 올리거나, 데이터 포함 관계가 필요할 때만 `@x`를 쓴다.
- feature와 entity의 구분: entity는 비즈니스 개체(user, product)이고 feature는 사용자가 그 개체로 수행하는 상호작용(로그인, 장바구니 담기)이다.

### shared (최하위, 슬라이스 없음)

- 기반 도구. 슬라이스 없이 세그먼트만 있다.
- 세그먼트 예시: `api`(API 클라이언트, 공통 요청), `ui`(비즈니스 로직 없는 UI 킷, 브랜드 테마는 가능), `lib`(하나의 주제에 집중한 내부 라이브러리, 단순 utils 덤프 금지), `config`(환경변수, 전역 flag), `routes`(라우트 상수), `i18n`, `db`(Next.js 서버 코드).
- v2.1부터 라우트 상수와 API 호출처럼 애플리케이션을 아는 코드를 shared에 두는 것이 명시적으로 허용됐다. 비즈니스 로직은 여전히 둘 수 없다.
- `components`, `hooks`, `types`처럼 역할이 모호한 세그먼트 이름은 금지다.

## 2. 슬라이스 규칙

- 슬라이스는 제품과 비즈니스 관점에서 관련 있는 코드를 묶는 단위다. 이름은 고정 규칙 없이 비즈니스 도메인을 따른다(`photo`, `comments`, `news-feed`). 개수 제한이 없다.
- 두 가지 핵심 원칙이 있다. 다른 슬라이스와 최대한 독립적일 것(낮은 결합), 핵심 목적과 직접 관련된 코드 대부분을 내부에 담을 것(높은 응집)이다.
- 분할 시점: 처음에는 페이지나 위젯의 `model` 세그먼트에 로직을 두고, 여러 곳에서 재사용이 확인됐을 때만 아래 레이어로 옮긴다.

## 3. 슬라이스 그룹

같은 레이어 안에서 관련 슬라이스를 폴더로 모아 탐색을 돕는 순수 편의 구조다. 필수가 아니다.

```
entities/payment/
├── invoice/
├── receipt/
└── transaction/
```

- 그룹은 슬라이스가 아니다. 세그먼트와 `index.ts`를 갖지 않고 여러 슬라이스의 공용 코드도 담지 않는다.
- 그룹 내부라도 슬라이스 간 코드 공유는 불가하다. 격리 규칙이 그대로 적용된다.
- 도입 기준: 동일 비즈니스 맥락의 슬라이스가 많아 파악이 어려울 때다. 2~3개 수준이면 불필요하다.

## 4. 세그먼트 규칙

표준 세그먼트는 `ui`, `api`, `model`, `lib`, `config` 다섯이다.

- 커스텀 세그먼트도 허용된다. 슬라이스가 없는 app과 shared에서 자주 쓴다(`routes`, `i18n`, `store`, `styles`, `entrypoint`, `api-routes`, `db`, `analytics`).
- 선택 기준: 백엔드 요청이면 `api`, 렌더링이면 `ui`, 폼 검증과 데이터 변환이면 `model`, 환경변수와 flag면 `config`다.
- 명명 원칙: 타입("무엇")이 아니라 목적("왜")이 드러나야 한다. `components/`, `hooks/`, `types/`, `modals/`는 금지다.
- Steiger의 segments-by-purpose 규칙이 이를 검사한다. 0.7.0부터 프레임워크 특화 세그먼트 이름까지 금지 대상에 넣는다.

## 5. Public API

Public API는 슬라이스 기능을 외부에서 접근하는 공식 경로이자 계약이다. `index` 파일에서 필요한 것만 선별해 re-export한다.

```ts
// _pages/auth/index.ts
export { LoginPage } from "./ui/login-page";
export { RegisterPage } from "./ui/register-page";
```

좋은 Public API의 세 가지 조건.

1. 내부 구조 변경과 독립: 슬라이스 폴더 구조를 바꿔도 외부 코드는 영향이 없어야 한다
2. 기능 변경은 API 변경: 주요 동작이 바뀌면 Public API도 함께 바뀌어야 한다
3. 선별된 노출: 전체 구현이 아니라 필수 기능만 공개한다

금지: wildcard re-export.

```ts
// 나쁜 예. features/comments/index.ts
export * from "./ui/comment";
export * from "./model/comments";
```

제공 기능을 한눈에 파악할 수 없게 되고, 숨겨야 할 내부 구현에 외부 의존이 생겨 리팩터링이 불가능해진다.

배치 관례.

- 슬라이스당 index 하나. 슬라이스 index가 있으면 `ui/index.ts` 같은 중첩 index는 불필요하다.
- 슬라이스 없는 레이어(shared, app)는 세그먼트당 index를 둔다.
- `shared/ui`와 `shared/lib`은 거대 배럴 하나 대신 컴포넌트와 라이브러리 단위 index를 둔다(`@/shared/ui/button`). 관련성 낮은 모듈이 많은 곳에서 배럴 하나로 묶으면 tree-shaking과 개발 서버 성능이 나빠진다. 상세한 성능 문제는 `antipatterns.md`의 배럴 절에 있다.
- Next.js App Router에서는 서버 전용 수출을 `index.server.ts`로 분리한다. `nextjs-integration.md`의 public API 분리 절에 있다.

## 6. @x 크로스 임포트 표기법

같은 레이어 안 슬라이스 간의 불가피한 도메인 관계를 명시적으로 처리하는 별도 진입점이다. v2.1에서 표준화됐고 사실상 entities 레이어에서만 쓴다.

```
entities/song/
├── @x/
│   └── artist.ts    artist 슬라이스 전용 공개 API
└── index.ts         일반 공개 API
```

```ts
// entities/song/@x/artist.ts
export type { Song } from "../model/song";

// entities/artist/model/artist.ts
import type { Song } from "entities/song/@x/artist";
```

`song/@x/artist`는 Song과 Artist가 만나는 자리라는 뜻이다. 관계가 코드에 명시적으로 남는다.

제약. 공식 문서는 이를 권장 방식이 아니라 최후 수단이자 어쩔 수 없는 타협으로 규정한다. 남발하면 entity 경계가 강하게 엮여 리팩터링 비용이 커진다. `@x` 이전에 슬라이스 병합(과도한 세분화 해소)을 먼저 검토한다. entities 밖 레이어에서는 의존 제거나 설계 재검토가 원칙이다. Steiger는 0.5.6부터 `@x` 경로를 인식한다.

## 7. Import 규칙 정리

- Layer Import Rule: 슬라이스 안의 코드는 자신보다 아래 레이어의 슬라이스만 import할 수 있다.
- 아래에서 위로의 참조는 금지다. shared에서 entities를 참조할 수 없다.
- 같은 레이어 안 크로스 임포트는 구조적 경고 신호다. 공식 문서는 절대 금지가 아니라 code smell로 규정하고, 의도적으로 도입할 때는 신중한 아키텍처 결정으로 다뤄 근거를 문서화하고 주기적으로 재검토하라고 요구한다. 해소 전략은 `antipatterns.md`에 있다.
- app과 shared는 슬라이스가 없으므로 내부 세그먼트끼리 자유롭게 import한다.
- feature 여러 개의 조합은 상위 레이어(page, widget)에서만 한다. props, children, slot으로 주입한다.
- 같은 슬라이스 내부는 상대 경로, 다른 슬라이스는 절대 경로(alias)를 쓴다. 슬라이스 내부 파일이 자기 슬라이스의 index를 다시 import하는 순환을 막는다.
- 예외적 완화 하나: Redux의 `RootState`처럼 app에서 정의되는 전역 타입을 shared의 typed hooks가 써야 할 때, 자주 바뀌지 않는다는 전제로 `declare type` 전역 선언의 암묵 의존이 허용된다.

## 8. 타입 배치 규칙

최고 원칙: 타입의 위치는 그 타입의 용도와 책임에서 나온다.

| 타입 종류                | 권장 위치                                                                          |
| ------------------------ | ---------------------------------------------------------------------------------- |
| 유틸리티 타입            | 사용처 근처, 또는 `shared/lib/utility-types` (type-fest 같은 외부 라이브러리 우선) |
| 엔티티 타입              | `entities/{slice}/model`. 상호 참조는 제네릭 매개변수화 또는 `@x`                  |
| DTO                      | `shared/api` 또는 request 함수 바로 옆                                             |
| Mapper (DTO 변환)        | DTO와 같은 위치                                                                    |
| Enum                     | 사용처 기준. UI 상태면 `ui`, 백엔드 응답 상태면 `api`, 전역 공통값이면 shared      |
| Zod 등 검증 스키마       | 백엔드 응답 검증이면 `api`, 폼 입력 검증이면 `ui` 또는 `model`                     |
| Props와 Context 타입     | 컴포넌트와 같은 파일                                                               |
| Ambient (`*.d.ts`)       | `src/` 또는 app 레이어의 `ambient/` 세그먼트                                       |
| 타입 없는 외부 패키지    | `shared/lib/untyped-packages/{라이브러리명}.d.ts`                                  |
| 자동 생성 타입 (OpenAPI) | `shared/api/{tool}/`에 두고 재생성 명령을 README로 문서화                          |

`shared/types` 폴더는 금지다. 제네릭 타입도 기능별 세그먼트에 둔다.

엔티티 상호 참조를 푸는 두 전략.

1. 제네릭 타입 매개변수화: `Song<ArtistType extends { id: string }>`. 단순 구조에 맞고, Country와 City처럼 강하게 결합된 관계에는 맞지 않는다.
2. `@x` Public API: 중첩 DTO는 정규화(normalizr 방식)한 뒤 `@x`로 처리한다.
