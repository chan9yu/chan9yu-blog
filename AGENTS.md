# chan9yu 개발 블로그

한국어권 프론트엔드 엔지니어를 위한 1인 저자 기술 블로그.

## 구조

Next.js 라우팅은 루트 `app/`이 맡고 라우트 파일은 `src/`의 구현을 재노출만 한다. `src/`는 FSD 레이어 여섯으로 나뉜다. 위에서부터 `app`과 `pages`, `widgets`, `features`, `entities`, `shared` 순이고 위 레이어가 아래 레이어만 참조한다. 슬라이스 밖에서는 public API(`index.ts`)로만 가져오고 서버 전용 수출은 `index.server.ts`로 분리한다. entities끼리는 import 대신 구조적 타입으로 경계를 지킨다. 레이어 경계는 도구 둘이 막는다. eslint 내장 no-restricted-imports가 위 레이어 참조와 깊은 import를 에디터에서 잡고, Steiger가 CI에서 같은 레이어 슬라이스끼리의 크로스 임포트까지 잡는다. glob 패턴만으로는 자기 슬라이스를 구분할 수 없어 크로스 임포트가 eslint를 통과한다.

```
app/             Next.js App Router. 재노출만 한다
pages/           README 하나만 둔다. 라우팅하지 않는다
src/app/         providers, styles, api-routes 구현, 루트 UI
src/pages/       home, posts, post, tags, tag, series, series-detail, about
src/widgets/     header, footer, mobile-menu, post-list, toc, mdx-content
src/features/    search, views, comments, theme, lightbox
src/entities/    post, tag, series
src/shared/      assets, config, lib, seo, test, ui
contents/        MDX 콘텐츠 (별도 저장소, Git 서브모듈)
docs/            문서. product, design, operations, prompts
```

루트 `pages/`는 지우지 않는다. 없으면 Next.js가 `src/pages`를 Pages Router로 잡아 빌드가 E801로 멈춘다. 여기에 라우트 파일을 만들지도 않는다. 자세한 근거는 `pages/README.md`에 있다. 이 폴더가 있으면 `usePathname`의 반환 타입이 `string | null`이 되므로 `null`을 활성 상태 아님으로 다룬다.

## 명령어

```bash
pnpm dev             # 개발 서버 (port 3100)
pnpm build           # 프로덕션 빌드
pnpm build:strict    # frontmatter SEO 게이트 포함. 배포와 같은 조건
pnpm lint            # ESLint
pnpm lint:arch       # Steiger. FSD 레이어와 슬라이스 경계 검사
pnpm format          # Prettier
pnpm type:check      # 타입 검사
pnpm test            # Vitest
pnpm test:e2e        # Playwright. dev 서버(3100)를 자동 기동, 로컬 전용
```

## 늘 지킬 것

**언어.** 응답과 주석, 커밋 메시지, 문서를 한국어로 쓴다. 코드 식별자는 영어로 쓴다. 가운뎃점과 화살표, em dash, 이모지, 한자를 쓰지 않는다. 나열은 조사와 쉼표로 풀고 흐름은 문장으로 쓴다.

**Git 쓰기.** `git commit`과 `git push`, `gh pr create`, 브랜치 생성은 사용자가 그때 명시적으로 요청할 때만 한다. 지난번 승인이 이번 작업까지 이어지지 않는다. 자세한 규약은 `.agents/rules/git-workflow.md`에 있다.

**UI는 직접 만든다.** shadcn/ui와 Radix를 쓰지 않는다. 새 UI 요소를 shadcn CLI로 가져오지 않는다.

**근본 원인.** 문제를 우회하지 않고 원인을 고친다. 의미 없는 `setTimeout`과 임시 플래그 변수, 재시도로 넘기지 않는다.

**오류를 감추지 않는다.** 파일 읽기나 네트워크 호출을 감싸 빈 값을 돌려주는 코드를 만들지 않는다. 오류가 안 나는 것처럼 보이게 하는 대신 오류가 날 수 없는 설계로 바꾼다. 이 규칙이 생긴 사고 이력은 `.agents/rules/no-fallback.md`에 있다.

**SSG를 먼저 생각한다.** 콘텐츠 페이지는 빌드 타임에 만든다. 런타임에 `contents/`를 읽는 코드를 새로 넣지 않는다.

**contents 서브모듈.** 별도 저장소다. 글 본문을 사용자 승인 없이 고치지 않는다. 렌더링에 문제가 있으면 렌더링 쪽에서 푼다.

**승인이 필요한 것.** 의존성 추가와 삭제, 아키텍처 변경, 빌드 설정 변경, 공개 타입 변경, 규칙 파일 수정. 확신이 없으면 묻는다.

**주석.** 기본은 주석을 쓰지 않는 것이다. 코드가 표현하지 못하는 것만 적는다. 외부 제약, 호출 순서 가정, 우회 코드의 근거, 회귀를 막는 이유 넷이다.

## 문서

필요한 것만 찾아 읽는다. 전부 읽지 않는다.

| 문서                         | 언제 읽는가                        |
| ---------------------------- | ---------------------------------- |
| `docs/product/PRD.md`        | 무엇을 왜 만드는지, 범위를 정할 때 |
| `docs/product/SPEC.md`       | 기능 동작과 지난 기술 결정을 볼 때 |
| `docs/product/ROADMAP.md`    | 작업 순서와 하지 않기로 한 것      |
| `docs/design/DESIGN.md`      | 색과 타이포, 모션, 디자인 시스템   |
| `docs/design/DESIGN-SPEC.md` | 화면 배치와 반응형, 접근성 요구    |
| `docs/operations/RUNBOOK.md` | 배포하거나 무언가 깨졌을 때        |
| `docs/operations/SEO.md`     | 코드 밖 검색 유입 작업             |
| `docs/CLAUDE.md`             | 문서를 어디에 둘지 정할 때         |
| `CONTRIBUTING.md`            | 환경 설정과 명령어, 콘텐츠 작성법  |

## 룰

룰 본문은 `.agents/rules/`에 있다. Claude Code는 링크로 자동으로 읽고, 자동으로 읽지 않는 도구에서는 작업 전에 직접 연다. 링크 규약과 추가 방법은 `.agents/README.md`가 정본이다.

룰은 넷이다.

| 룰                | 무엇을 다루는가                                                   |
| ----------------- | ----------------------------------------------------------------- |
| `git-workflow.md` | 브랜치 전략과 커밋 메시지 형식, 머지 방식, 금지 패턴              |
| `no-fallback.md`  | 오류를 감싸 빈 값을 돌려주는 코드 금지. 허용되는 축소 동작의 조건 |
| `comments.md`     | 주석을 쓰는 네 가지 경우. 지우면 동작이 깨지는 지시문 주석        |
| `seo.md`          | 메타데이터와 JSON-LD 배치, RSS, OG 이미지, frontmatter 게이트     |

## 하네스

**목표.** 이 저장소에서 실제로 깨지는 자리를 지킨다. 레이어 경계와 직접 만든 UI, 접근성, 저장소 규칙 위반 넷이다. 에이전트 넷과 스킬 셋, 위 룰 절의 룰 넷이 이 자리를 나눠 맡는다.

**에이전트.** fsd-architect가 레이어 배치와 경계를 정하고, ui-builder가 토큰 위에 컴포넌트를 만들고, a11y-verifier가 접근성을 판정하고, code-reviewer가 규칙 위반을 잡는다. 만든 사람이 판정하지 않는다. 구현은 ui-builder가, 판정은 a11y-verifier와 code-reviewer가 한다.

**스킬.** 디렉토리 구조와 모듈 경계를 정할 때는 `fsd-nextjs`를, UI 프리미티브를 만들거나 고칠 때는 `primitive-build`를, 대화상자나 서랍을 만진 작업의 검증에는 `a11y-dialog-check`를 쓴다. 단순 질문과 문서 조회는 직접 답한다.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
