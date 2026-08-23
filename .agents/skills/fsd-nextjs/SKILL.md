---
name: fsd-nextjs
description: "Next.js 프로젝트에 Feature-Sliced Design(FSD) 아키텍처를 적용, 설계, 마이그레이션하는 방법. 사용자가 FSD, Feature-Sliced Design, 레이어, 슬라이스, 세그먼트, 폴더 구조 설계, 아키텍처 마이그레이션, entities와 features와 widgets 배치, public API와 배럴 규칙, 크로스 임포트 문제, Steiger를 언급할 때 사용한다. 'FSD'라는 단어가 없어도 Next.js 프로젝트의 디렉토리 구조를 어떻게 나눌지, 어떤 레이어에 코드를 둘지, 모듈 경계를 어떻게 지킬지, 서버와 클라이언트 코드를 어떻게 나눌지 고민하면 반드시 이 스킬을 사용할 것."
metadata:
  version_basis: "FSD v2.1 (2024-11 릴리스, 2026-08 현재 최신), Next.js 16.3, Steiger 0.6.0, steiger-plugin 0.7.0"
  sources: "fsd.how (FSD 공식 문서), github.com/feature-sliced, nextjs.org 공식 문서와 Next.js 16.3 소스"
  date_updated: "2026-08-22"
---

# FSD와 Next.js

Feature-Sliced Design(FSD)을 Next.js(App Router, Pages Router)에 적용하기 위한 범용 스킬. 특정 프로젝트에 종속되지 않는다.

기준 버전: FSD 정본은 v2.1이다(2024년 11월 릴리스, 2026년 8월 현재 이후 릴리스 없음). 공식 문서는 fsd.how에 있다. feature-sliced.design 도메인은 스팸이 주입된 옛 사본이므로 출처로 쓰지 않는다. Next.js는 16.3, Steiger는 0.6.0을 기준으로 쓴다.

## FSD 한눈에 보기

FSD는 프론트엔드 코드를 책임 수준과 의존 방향에 따라 3단으로 구조화한다.

```
Layer (레이어)  >  Slice (슬라이스)  >  Segment (세그먼트)
책임 수준           비즈니스 도메인        기술적 역할
```

핵심 가치는 일관된 구조로 온보딩이 쉬워지고, 슬라이스 격리로 수정이 안전해지고, 재사용 범위가 통제되는 것이다.

## 레이어 (6개, 위에서 아래로)

| 레이어       | 슬라이스 | import 가능 대상                    | 책임                                        |
| ------------ | -------- | ----------------------------------- | ------------------------------------------- |
| **app**      | 없음     | 아래 전부                           | 전역 설정. providers, 전역 스타일, 진입점   |
| **pages**    | 있음     | widgets, features, entities, shared | 화면 단위. 페이지 하나가 슬라이스 하나      |
| **widgets**  | 있음     | features, entities, shared          | 독립적으로 동작하는 큰 UI 블록              |
| **features** | 있음     | entities, shared                    | 사용자 상호작용. 재사용될 때만 추출         |
| **entities** | 있음     | shared (예외로 `@x`)                | 핵심 비즈니스 개념 (User, Post 같은 도메인) |
| **shared**   | 없음     | 없음 (최하단)                       | 기반 도구. UI 킷, API 클라이언트, 유틸      |

- processes 레이어는 폐기됐다. 기존 코드는 features나 app으로 옮긴다.
- 모든 레이어를 쓸 필요 없다. 대부분 shared와 pages, app만으로 시작한다. entities 레이어가 없어도 FSD 위반이 아니다.
- app과 shared는 슬라이스 없이 세그먼트로만 구성되고 내부 세그먼트끼리 자유롭게 import한다.

## Pages-First (v2.1의 핵심 원칙)

**코드는 우선 페이지 슬라이스 안에 둔다.** 다른 페이지에서 재사용하지 않는 큰 UI 블록과 폼, 데이터 로직을 entities나 features로 쪼개지 않는다. 페이지 간 중복이 생겨도 곧바로 추출 사유가 되지 않는다. 여러 곳에서 실제로 쓰이고 경계가 분명해졌을 때만 아래 레이어로 내린다.

페이지 슬라이스에 코드를 얼마나 두어도 제한이 없다. 팀이 코드를 쉽게 찾을 수 있으면 된다. v2.0처럼 entities와 features부터 설계하면 응집도가 깨진다. 이것이 v2.1이 나온 이유다.

## Import 규칙

**슬라이스 안의 코드는 자신보다 아래 레이어의 슬라이스만 import할 수 있다.**

```
가능   features/comments 가 entities/user, shared/ui 를 import
가능   features/comments/ui 가 features/comments/lib 를 import   (같은 슬라이스 내부)
금지   features/comments 가 features/auth 를 import              (같은 레이어 크로스 임포트)
금지   shared 가 entities 를 import                              (아래에서 위로)
```

- 같은 슬라이스 내부는 상대 경로, 다른 슬라이스는 절대 경로(alias)로 import한다. 배럴 순환 참조를 막는다.
- 크로스 임포트는 절대 금지가 아니라 구조적 경고 신호다. 의도적으로 쓸 때는 근거를 문서화하고 주기적으로 재검토한다. 해소 전략 4가지는 `references/antipatterns.md`에 있다.
- entities 간 불가피한 도메인 관계만 `@x` 표기로 허용된다. 최후의 타협책이다.

## 세그먼트

| 세그먼트 | 용도                                       |
| -------- | ------------------------------------------ |
| `ui`     | 컴포넌트, 스타일, 포맷터                   |
| `api`    | 백엔드 통신. 요청 함수, DTO, Server Action |
| `model`  | 스키마, 스토어, 비즈니스 로직              |
| `lib`    | 슬라이스 내부 라이브러리 코드              |
| `config` | 설정, feature flag                         |

**명명 원칙**: 폴더 이름은 파일의 타입이 아니라 존재 목적을 드러낸다. `components/`, `hooks/`, `types/`, `utils/` 같은 이름은 금지다. Steiger의 segments-by-purpose 규칙이 이를 검사하고, 0.7.0부터는 프레임워크 특화 세그먼트 이름까지 잡는다.

## Next.js 통합 핵심

Next.js의 `app`, `pages` 폴더와 FSD의 `app`, `pages` 레이어는 이름만 같고 역할이 다르다. 공식 해법은 두 부분이다. 루트는 Next.js 라우팅 전용으로 얇게 두고 FSD 레이어 전체를 `src/`에 두되, **FSD의 app과 pages 레이어 이름을 `_app`과 `_pages`로 바꾼다.** 공식 가이드는 라우터 종류와 무관하게 두 레이어 모두 바꾸라고 명시한다.

```
app/                       Next.js App Router. 라우팅 파일만, 한 줄 re-export
├── example/
│   └── page.tsx
└── api/
    └── example/
        └── route.ts
proxy.ts                   Next.js 16 이상. 15 이하는 middleware.ts. 루트에 둔다
src/
├── _app/                  FSD app 레이어 (providers, api-routes, styles)
├── _pages/                FSD pages 레이어 (실제 페이지 구현)
│   └── example/
│       ├── index.ts
│       └── ui/example.tsx
├── widgets/
├── features/
├── entities/
└── shared/
```

### 3가지 핵심 규칙

1. **레이어 이름을 `_app`, `_pages`로 바꾼다.** `src/pages`가 존재하면 루트 `app/`과 조합될 때 Next.js가 Pages Router 디렉토리로 인식해 빌드를 중단한다(오류 E801). 과거 우회책이던 "루트에 빈 pages 폴더 두기"는 현행 공식 가이드에서 사라졌고 최신 Next.js에서 빌드를 깨뜨릴 수 있다. Steiger는 0.5.8부터 밑줄 접두사 레이어를 인식한다.

2. **라우트 파일은 한 줄 re-export만 남긴다.** 구현과 metadata까지 FSD 레이어가 소유한다.

   ```tsx
   // app/example/page.tsx
   export { ExamplePage as default, metadata } from "@/_pages/example";
   ```

3. **서버 전용 수출은 `index.server.ts`로 분리한다.** 서버 전용 모듈을 `index.ts`로 내보내면 클라이언트 컴포넌트가 그 슬라이스를 import할 때 서버 전용 부작용이 클라이언트 모듈 그래프로 번져 빌드가 깨진다. 서버 컴포넌트와 `server-only` 데이터 접근 함수는 `index.server.ts`에만 둔다.

API 핸들러 배치, Pages Router, Server Actions, use cache, RSC 경계 설계는 `references/nextjs-integration.md`에 있다.

## Public API 요점

- 모든 슬라이스는 `index.ts`에서 필요한 것만 선별해 re-export한다. 외부는 이 경로로만 접근한다.
- `export * from` 형태의 wildcard는 금지다. 제공 기능을 파악할 수 없게 되고 내부 구현에 외부 의존이 생겨 리팩터링이 불가능해진다.
- `shared/ui`와 `shared/lib`은 거대 배럴 하나 대신 컴포넌트와 라이브러리 단위 index를 둔다(`@/shared/ui/button`). 개발 서버는 tree-shaking을 하지 않아 배럴 비용이 개발 모드에 그대로 드러난다.
- 서버 컴포넌트와 클라이언트 컴포넌트를 한 배럴에 섞지 않는다. 서버 컴포넌트가 클라이언트로 표시되는 알려진 문제가 있다.

상세한 조건과 배럴 성능 문제는 `references/core-concepts.md`와 `references/antipatterns.md`에 있다.

## 경계 강제 도구

공식 린터 Steiger를 기본으로 쓴다. 설정 없이 동작한다.

```bash
npx steiger src          # 검사
npx steiger src --watch  # 감시 모드
```

Steiger는 베타라 버전을 고정해 설치하고, 에디터 실시간 피드백이 필요하면 ESLint 경계 규칙을 함께 쓴다. 설정 예시와 규칙 목록, ESLint 조합은 `references/tooling.md`에 있다.

## 판단 기준 (자주 틀리는 결정)

| 질문                              | 답                                                                                      |
| --------------------------------- | --------------------------------------------------------------------------------------- |
| 이 UI를 feature로 뽑을까?         | 여러 페이지에서 재사용될 때만 뽑는다. 아니면 페이지 슬라이스 안에 둔다                  |
| 이 블록을 widget으로?             | 여러 페이지에서 재사용되거나 페이지 안의 큰 독립 섹션일 때만 만든다                     |
| entity를 만들까?                  | 재사용이 확인된 뒤에 만든다. 단순 CRUD는 shared/api로 충분하다                          |
| 인증 토큰과 로그인 사용자 정보는? | shared/auth 또는 shared/api에 둔다. entity가 아니다                                     |
| 백엔드 응답 타입은?               | shared/api에 둔다. 백엔드 구조와 프론트 구조는 다르다                                   |
| Server Action은?                  | 그 동작을 소유한 슬라이스의 api 세그먼트에 둔다                                         |
| 라우트 상수와 전역 설정값은?      | v2.1부터 shared에 두어도 된다. 비즈니스 로직은 여전히 shared에 둘 수 없다               |
| 레이아웃은?                       | 단순 마크업이면 shared/ui에 둔다. 데이터 로딩이 필요하면 라우터의 layout.tsx가 조립한다 |
| feature끼리 조합하고 싶다         | 상위 레이어에서 props와 slot으로 조립한다. 직접 import는 위반이다                       |

## 적용 워크플로

### 신규 프로젝트

1. 루트 `app/`(라우팅 전용)과 `src/` 골격을 만들고 `@/` alias를 `src/`로 잡는다. FSD 레이어는 `_app`, `_pages`, `shared`만으로 시작한다.
2. 페이지 목록을 먼저 도출한다. 페이지 하나가 `src/_pages/`의 슬라이스 하나가 된다.
3. UI와 로직을 페이지 슬라이스 안에 만들고, shared로 내릴 코드는 계획이 아니라 개발 중 발견으로 뽑는다.
4. 여러 페이지에서 재사용이 확인된 것만 widgets, features, entities로 내린다.
5. Steiger를 CI에 붙여 회귀를 막는다.

### 기존 프로젝트

점진 마이그레이션 절차와 기술 폴더(components, hooks, utils) 대응표는 `references/migration.md`에 있다.

## References (필요할 때만 읽기)

| 파일                               | 언제 읽나                                                                                    |
| ---------------------------------- | -------------------------------------------------------------------------------------------- |
| `references/nextjs-integration.md` | 디렉토리 골격 생성, 라우트 파일 작성, API 핸들러, Server Actions, RSC 경계, use cache, proxy |
| `references/core-concepts.md`      | 레이어별 상세 책임, 슬라이스와 세그먼트 규칙, public API, `@x`, 타입 배치                    |
| `references/tooling.md`            | Steiger 설정과 규칙, ESLint 경계 강제, CI 연동                                               |
| `references/antipatterns.md`       | 크로스 임포트 해소, 과잉 분할, 배럴 성능 문제, FSD가 맞지 않는 경우                          |
| `references/migration.md`          | 기존 Next.js 코드베이스의 FSD 전환, v2.0에서 v2.1로 이동                                     |
