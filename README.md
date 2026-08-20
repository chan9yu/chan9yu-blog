# chan9yu's dev blog

Next.js 16 App Router와 MDX로 만든 개인 개발 블로그입니다. 글은 Git 서브모듈로 따로 관리하고, 모든 페이지를 빌드 시점에 정적으로 만들어 둡니다.

[![Release](https://img.shields.io/github/v/release/chan9yu/dev-blog?logo=github&color=blue)](https://github.com/chan9yu/dev-blog/releases/latest)
[![Node.js](https://img.shields.io/badge/Node.js-24-green.svg)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-11-orange?logo=pnpm&logoColor=white)](https://pnpm.io)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

**[chan9yu.dev](https://chan9yu.dev)**

## Stack

| 영역       | 사용 기술                                                      |
| ---------- | -------------------------------------------------------------- |
| 프레임워크 | Next.js 16 App Router, Turbopack 빌드, React Compiler          |
| UI         | React 19, Tailwind CSS 4, shadcn/ui, next-themes, lucide-react |
| 언어       | TypeScript 6 strict                                            |
| 콘텐츠     | MDX, Shiki 코드 하이라이팅                                     |
| 검증       | Zod (frontmatter와 API 런타임 검증)                            |
| 테스트     | Vitest, React Testing Library, MSW                             |
| 런타임 API | Vercel KV (조회수)                                             |
| 품질 도구  | ESLint 9, Prettier 3, Lefthook 2                               |

## 구조

`app`과 `features`, `shared` 세 층으로 나누고 의존이 한 방향으로만 흐르게 했습니다. `app`은 라우팅과 조립을 맡고, `features`는 posts와 tags, series, search, views, comments, theme, lightbox, about 아홉 개 도메인을 담으며, `shared`는 어디서나 쓰는 것을 모읍니다. 각 feature는 `index.ts`로만 바깥과 연결합니다.

자세한 규칙과 디렉토리 구성은 [CONTRIBUTING.md](./CONTRIBUTING.md)에 있습니다.

## 설계 결정

**정적 생성 우선.** 콘텐츠 페이지를 빌드 시점에 모두 만들어 둡니다. 런타임 CMS와 서버 검색, 클라이언트 캐시는 넣지 않았습니다. 런타임에 도는 API는 조회수를 세는 `/api/views` 하나뿐입니다.

**조회수는 실패해도 페이지를 막지 않습니다.** 저장소가 없거나 장애가 나면 조회수를 0으로 보여주고 기록은 조용히 건너뜁니다.

**글은 별도 저장소에 둡니다.** `contents/`를 서브모듈로 분리해 소스 코드와 글의 커밋 이력이 섞이지 않습니다.

**주소 규칙은 영역마다 다릅니다.** 포스트 주소는 도구와 CDN 호환을 위해 영문만 씁니다. 태그와 시리즈는 한글을 허용하되 공백을 하이픈으로 바꿉니다.

**테스트는 통합 테스트 중심입니다.** Testing Trophy를 따라 통합 테스트 비중을 가장 크게 두고 TDD로 작성합니다.

## 문서

| 문서                                                  | 내용                            |
| ----------------------------------------------------- | ------------------------------- |
| [product/PRD.md](./docs/product/PRD.md)               | 무엇을 왜 만드는지, 범위와 목표 |
| [product/SPEC.md](./docs/product/SPEC.md)             | 기능이 정확히 어떻게 동작하는지 |
| [product/ROADMAP.md](./docs/product/ROADMAP.md)       | 릴리스 이력과 다음 작업 계획    |
| [design/DESIGN.md](./docs/design/DESIGN.md)           | 디자인 방향, 톤과 색            |
| [design/DESIGN-SPEC.md](./docs/design/DESIGN-SPEC.md) | 화면별 배치와 상태              |
| [operations/RUNBOOK.md](./docs/operations/RUNBOOK.md) | 배포 절차와 장애 대응           |
| [operations/SEO.md](./docs/operations/SEO.md)         | 코드 밖에서 하는 검색 유입 작업 |
| [CHANGELOG.md](./CHANGELOG.md)                        | 버전별 변경 내역                |

## 배포

Vercel에 자동으로 배포됩니다. `main`에 머지하면 프로덕션에 올라가고, `develop`으로 PR을 열면 Preview가 만들어집니다.

배포 빌드는 `pnpm build:vercel`로 돌고 결과물은 `.next/`에 나옵니다. 로컬에서 같은 조건으로 확인하려면 `pnpm build:strict`를 씁니다. 그냥 `pnpm build`는 frontmatter를 어긴 글을 건너뛰기만 합니다. 조회수를 쓰려면 `KV_REST_API_URL`과 `KV_REST_API_TOKEN`을 환경 변수로 넣습니다. 넣지 않아도 빌드와 렌더는 정상 동작합니다.

## 개발 참여

환경 설정과 명령어, 코드 규약, Git 워크플로우는 [CONTRIBUTING.md](./CONTRIBUTING.md)에 정리했습니다.

## License

MIT License. 자세한 내용은 [LICENSE](./LICENSE)를 참조하세요.
