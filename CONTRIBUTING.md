# 개발 가이드

이 저장소에서 코드를 고치거나 글을 추가할 때 필요한 내용을 모았습니다. 프로젝트 소개와 기술 스택은 [README](./README.md)를 보세요.

## 요구 환경

| 항목    | 버전 | 비고                                  |
| ------- | ---- | ------------------------------------- |
| Node.js | 24.x | 현재 LTS. `.nvmrc`에 정확한 패치 고정 |
| pnpm    | 11.x | `packageManager` 필드가 버전을 결정   |

`nvm`을 쓴다면 `.nvmrc`가 버전을 잡아줍니다.

```bash
nvm use
```

pnpm은 corepack으로 받는 편이 편합니다. `package.json`의 `packageManager` 필드를 읽어 정확한 버전을 씁니다.

```bash
corepack enable
```

## 시작하기

콘텐츠는 별도 저장소를 서브모듈로 붙입니다. `--recurse-submodules` 없이 클론하면 글이 없는 상태로 빌드가 실패합니다.

```bash
git clone --recurse-submodules https://github.com/chan9yu/dev-blog.git
cd dev-blog
pnpm install
pnpm dev
```

개발 서버는 `http://localhost:3100`에서 열립니다. Next.js 기본값인 3000이 아닙니다.

이미 클론해 둔 저장소에 서브모듈만 채우려면 다음을 실행합니다.

```bash
git submodule update --init --recursive
```

## 명령어

| 명령어               | 설명                                   |
| -------------------- | -------------------------------------- |
| `pnpm dev`           | 개발 서버 (포트 3100)                  |
| `pnpm build`         | 프로덕션 빌드                          |
| `pnpm start`         | 빌드 결과 실행                         |
| `pnpm type:check`    | 타입 검사                              |
| `pnpm lint`          | ESLint                                 |
| `pnpm format`        | Prettier로 포매팅                      |
| `pnpm test`          | Vitest 단위 테스트와 통합 테스트       |
| `pnpm test:watch`    | Vitest 감시 모드                       |
| `pnpm test:coverage` | 커버리지 리포트                        |
| `pnpm test:e2e`      | Playwright 브라우저 테스트             |
| `pnpm validate:seo`  | 빌드 없이 frontmatter SEO 규칙만 검사  |
| `pnpm link:agents`   | `.agents/` 본문을 도구 디렉토리에 링크 |

## 프로젝트 구조

Next.js 라우팅은 루트 `app/`이 맡고 라우트 파일은 `src/`의 구현을 재노출만 합니다. 루트 `pages/`는 README 하나만 두는 폴더입니다. 지우면 Next.js가 `src/pages`를 Pages Router로 잡아 빌드가 멈추므로 그대로 둡니다.

`src/`는 FSD(Feature-Sliced Design) 여섯 레이어로 나뉩니다.

```
app/             Next.js App Router. src/의 구현을 재노출만 한다
pages/           README 하나만 둔다. 라우팅하지 않는다
src/
├── app/         providers, styles, api-routes 구현, 루트 UI
├── pages/       home, posts, post, tags, tag, series, series-detail, about
├── widgets/     header, footer, mobile-menu, post-list, toc, mdx-content
├── features/    search, views, comments, theme, lightbox
├── entities/    post, tag, series
└── shared/      assets, config, lib, seo, test, ui

contents/        MDX 콘텐츠 (Git 서브모듈, 저장소 루트)
docs/            문서 (product, design, operations, prompts)
scripts/         빌드 전 검사와 이미지 복사, 커밋 템플릿
```

지켜야 할 규칙은 세 가지입니다.

1. 위 레이어가 아래 레이어만 참조합니다. 반대 방향 참조는 eslint의 no-restricted-imports가 막습니다.
2. 슬라이스 밖에서는 public API(`index.ts`)로만 가져옵니다. 서버 전용 수출은 `index.server.ts`로 분리합니다.
3. entities끼리는 import 대신 구조적 타입으로 경계를 지킵니다.

배럴 파일에는 re-export만 두고 타입이나 상수, 함수를 정의하지 않습니다.

## AI 협업 설정

저장소 루트의 `.agents/`와 `.claude/`는 AI 코딩 도구가 읽는 파일입니다. 사람이 쓰는 코드는 여기 없습니다.

```
.agents/         규칙과 스킬 본문. 도구에 매이지 않는 형식
.claude/         Claude Code용. rules와 skills는 .agents/로 가는 링크
AGENTS.md        늘 지켜야 하는 것. CLAUDE.md가 이 파일로 가는 링크
```

본문은 `.agents/`에 한 벌만 둡니다. 도구 디렉토리에는 링크만 두어 도구가 늘어도 고칠 곳이 한 군데로 남습니다. `.claude/rules/`나 `.claude/skills/`에 실제 파일을 만들면 링크 스크립트가 오류를 내고 멈춥니다.

규칙이나 스킬을 더했으면 링크를 새로 겁니다. `pnpm install` 때도 자동으로 돕니다.

```bash
pnpm link:agents
```

## 코드 규약

- 식별자는 영어로, 주석과 커밋 메시지, 문서는 한국어로 씁니다.
- 주석은 기본적으로 쓰지 않습니다. 코드가 무엇을 하는지는 이름과 타입으로 드러내고, 코드만 봐서는 알 수 없는 제약이나 회귀를 막는 이유가 있을 때만 남깁니다.
- UI 컴포넌트는 직접 만듭니다. shadcn/ui와 Radix를 쓰지 않습니다. 컴포넌트 목록은 [DESIGN.md](./docs/design/DESIGN.md)에 정리돼 있습니다.
- 아이콘은 lucide-react로 통일합니다. 브랜드 마크처럼 lucide에 없는 것만 `src/shared/assets/icons/`에 SVG로 둡니다.
- 실패를 감추는 코드를 넣지 않습니다. try/catch로 빈 값을 돌려주거나 임시 플래그, 의미 없는 setTimeout으로 우회하는 대신 원인을 고칩니다.

## 커밋 전 확인

커밋하기 전에 네 가지를 통과시킵니다. 타입 검사가 가장 빠르고 lint가 가장 느리므로 이 순서가 실패를 빨리 드러냅니다.

```bash
pnpm type:check
pnpm test
pnpm build
pnpm lint
```

하나라도 실패하면 커밋하지 않습니다. 테스트를 건너뛰거나 lint 규칙을 끄는 방식으로 통과시키지 않습니다. 그것은 통과가 아니라 검사를 치운 것입니다.

`pnpm install`을 하면 lefthook이 훅을 겁니다. 커밋할 때 ESLint와 Prettier 검사가 돌고, 푸시할 때 타입 검사가 돕니다. 검사는 바뀐 파일만이 아니라 저장소 전체를 봅니다. 다른 데서 넘어온 오류로 커밋이 막히면 그쪽을 먼저 고쳐야 합니다.

한 파일에 스테이징된 변경과 스테이징되지 않은 변경이 섞여 있으면(`git status --short`에서 `MM`) 훅이 고친 내용이 유실될 수 있으니 커밋 전에 정리하세요.

## Git 워크플로우

`main`은 프로덕션 릴리스 전용이고 기본 통합 브랜치는 `develop`입니다. 기본 브랜치에 직접 커밋하지 않습니다.

작업은 `develop`에서 딴 브랜치 위에서 합니다. 리모트 최신 상태에서 시작해야 나중에 충돌이 쌓이지 않습니다.

```bash
git checkout develop
git pull origin develop
git checkout -b feature/{슬러그}
```

### 커밋 메시지

`<type>: <요약>` 형식을 씁니다. 괄호로 감싼 scope는 쓰지 않습니다.

type은 `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore` 중에서 고릅니다.

```
feat: 검색 모달에 최근 포스트 추천 추가
```

본문에는 무엇을 바꿨는지가 아니라 왜 바꿨는지를 적습니다. 무엇을 바꿨는지는 diff에 이미 있습니다. 한 커밋은 하나의 작업만 담고, 각 커밋에서 빌드와 테스트가 통과해야 합니다. 리팩토링과 기능 추가는 섞지 않습니다.

### Pull Request

PR의 base는 `develop`입니다. `develop`을 `main`으로 올릴 때는 PR을 만들기 전에 `origin/main`을 `develop`에 먼저 merge해서 충돌을 해소합니다. 이 순서를 건너뛰면 PR마다 충돌을 만나게 됩니다.

머지는 merge commit이나 rebase merge로 합니다. **squash merge는 쓰지 않습니다.** squash로 압축하면 `main`이 `develop`의 커밋 이력을 잃어 다음 PR에서 충돌이 폭증하고, `git blame`으로 변경 의도를 추적할 수 없게 됩니다.

`--force` 푸시는 하지 않습니다. 리베이스가 필요하면 `--force-with-lease`만 씁니다.

## 콘텐츠 작성

글은 `contents/posts/{slug}/index.mdx`에 둡니다. 이미지 같은 첨부 파일은 같은 디렉토리의 `images/` 아래에 둡니다.

frontmatter의 `title`과 `description`, `slug`, `date`는 반드시 있어야 합니다.

```yaml
---
title: "제목" # 60자 이내
description: "검색 결과에 그대로 노출되는 설명" # 120자에서 160자
slug: "post-slug" # 영문 소문자와 숫자, 하이픈만. 디렉토리명과 같아야 한다
date: "2026-08-20"
updated: "2026-08-21" # 선택
tags: ["react", "리액트"] # 선택
series: "시리즈-이름" # 선택
seriesOrder: 2 # series를 쓰면 반드시 함께
thumbnail: "/posts/post-slug/images/thumbnail.png" # 선택
private: false # true면 공개 목록에서 제외
---
```

`title` 길이와 `description` 길이, `slug` 형식, `slug`와 디렉토리명 일치는 빌드 단계에서 검사합니다. 어긋나면 `pnpm build`가 실패합니다. 빌드 없이 확인하려면 `pnpm validate:seo`를 쓰세요. `description`을 120자 아래로 쓰면 검색 엔진이 본문에서 아무 문장이나 뽑아 쓰고, 160자를 넘기면 뒤가 잘립니다.

`series`와 `seriesOrder`는 둘 다 있거나 둘 다 없어야 합니다. 하나만 있으면 스키마 검증에서 걸립니다.

태그와 시리즈 이름에는 한글을 써도 됩니다. 다만 공백은 하이픈으로 바꾸고 특수문자는 넣지 않습니다. 메신저나 SNS에서 링크가 중간에 끊기는 것을 막기 위해서입니다. 포스트 slug에는 한글을 쓰지 않습니다.

본문은 `##`부터 시작합니다. `#`은 frontmatter의 `title`이 씁니다. 코드블록에는 언어를 반드시 표시하고, 이미지에는 대체 텍스트를 넣습니다.

## 환경 변수

조회수 기능을 로컬에서 켜려면 `.env.local`에 다음을 넣습니다.

```
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

없어도 빌드와 렌더는 정상 동작하고 조회수만 0으로 표시됩니다. 조회수를 확인할 일이 없다면 설정하지 않아도 됩니다.
