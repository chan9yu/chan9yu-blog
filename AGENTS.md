# chan9yu 개발 블로그

한국어권 프론트엔드 엔지니어를 위한 1인 저자 기술 블로그.

## 스택

Next.js 16 App Router, React 19 (Compiler), TypeScript 6 strict, Tailwind CSS 4, lucide-react, next-themes.

v1.3.0에서 shadcn/ui와 Radix 의존을 걷어내고 UI 컴포넌트를 직접 만든다. 새 UI 요소를 shadcn CLI로 가져오지 않는다.

## 구조

의존은 한 방향으로만 흐른다. `app/`에서 `features/`로, `features/`에서 `shared/`로 간다. feature끼리 직접 import하지 않고 `shared/`가 `features/`를 import하지 않는다.

```
src/app/         라우팅, metadata, providers
src/features/    posts, tags, series, search, views, comments, theme, lightbox, about
src/shared/      assets, components, config, hooks, libs, seo, styles, test, types, utils
contents/        MDX 콘텐츠 (별도 저장소, Git 서브모듈)
docs/            문서. product, design, operations, prompts
```

## 명령어

```bash
pnpm dev             # 개발 서버 (port 3100)
pnpm build           # 프로덕션 빌드
pnpm build:strict    # frontmatter SEO 게이트 포함. 배포와 같은 조건
pnpm lint            # ESLint
pnpm format          # Prettier
pnpm type:check      # 타입 검사
pnpm test            # Vitest
```

## 늘 지킬 것

**언어.** 응답과 주석, 커밋 메시지, 문서를 한국어로 쓴다. 코드 식별자는 영어로 쓴다. 가운뎃점과 화살표, em dash, 이모지, 한자를 쓰지 않는다. 나열은 조사와 쉼표로 풀고 흐름은 문장으로 쓴다.

**Git 쓰기.** `git commit`과 `git push`, `gh pr create`, 브랜치 생성은 사용자가 그때 명시적으로 요청할 때만 한다. 지난번 승인이 이번 작업까지 이어지지 않는다. 자세한 규약은 `.agents/rules/git-workflow.md`에 있다.

**근본 원인.** 문제를 우회하지 않고 원인을 고친다. 의미 없는 `setTimeout`과 임시 플래그 변수, 재시도로 넘기지 않는다.

**오류를 감추지 않는다.** 파일 읽기나 네트워크 호출을 감싸 빈 값을 돌려주는 코드를 만들지 않는다. 오류가 안 나는 것처럼 보이게 하는 대신 오류가 날 수 없는 설계로 바꾼다. 실제로 이 방식 때문에 검색 색인이 조용히 비어버린 적이 있다.

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

룰 본문은 `.agents/rules/`에 있고 `.claude/rules/`에 링크가 걸려 있다. Claude Code는 링크된 룰을 자동으로 읽는다. 룰을 자동으로 읽지 않는 도구에서는 작업을 시작하기 전에 해당 파일을 직접 열어 읽는다.

현재 `git-workflow.md` 하나다.

## 하네스: v1.3.0 재작성

**목표.** 기능을 v1.2.0과 같게 유지하면서 코드를 처음부터 다시 만든다.

**트리거.** FSD 레이어 배치, 컴포넌트 직접 구현, 디자인 적용, 접근성 검증이 걸린 작업을 요청받으면 `v130-rewrite` 스킬을 쓴다. 단순 질문과 문서 조회는 직접 답한다.

**배치.** 스킬 본문은 `.agents/skills/`에 두고 `.claude/skills/`에서 링크로 읽는다. `.claude/skills/`에 실제 파일을 만들면 링크 스크립트가 멈춘다. 에이전트 정의는 도구마다 형식이 달라 링크하지 않고 `.claude/agents/`에 직접 둔다.

**변경 이력.**

| 날짜       | 변경 내용             | 대상                                                    | 사유                                   |
| ---------- | --------------------- | ------------------------------------------------------- | -------------------------------------- |
| 2026-08-20 | 기존 하네스 제거      | 에이전트 15개, 스킬 15종, 룰 17개                       | v1.3.0 방향과 어긋남                   |
| 2026-08-20 | 위험 기반 4인 팀 구성 | fsd-architect, ui-builder, a11y-verifier, code-reviewer | 재작성에서 실제로 깨지는 자리에만 대응 |
