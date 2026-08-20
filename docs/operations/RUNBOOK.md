# 운영 안내서

배포하거나 무언가 깨졌을 때 읽는다. 기능이 어떻게 동작하는지는 product/SPEC.md가 맡는다.

## 배포 파이프라인

Vercel이 프로덕션과 미리보기를 모두 만든다. 도메인은 `chan9yu.dev`다. 이 값이 `src/shared/config/site.ts`에 있고 canonical과 OG, sitemap이 전부 여기서 나온다.

빌드는 세 단계로 이어진다.

1. `pnpm install:vercel`이 `.gitmodules`의 주소를 토큰이 붙은 형태로 바꿔 contents 서브모듈을 받고 의존성을 설치한다
2. `prebuild`가 frontmatter의 SEO 규칙을 검사하고 콘텐츠 이미지를 `public/`으로 복사한다
3. `pnpm build:vercel`이 `STRICT_FRONTMATTER=1`로 Next.js 빌드를 돌린다

`STRICT_FRONTMATTER`가 켜져 있어 frontmatter를 어긴 글이 하나라도 있으면 배포가 실패한다. 로컬 `pnpm build`는 경고만 내고 그 글을 건너뛰므로, 발행 전 확인은 `pnpm build:strict`로 한다.

## 환경변수

| 키                                     | 없을 때 벌어지는 일                           |
| -------------------------------------- | --------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                 | 절대 URL이 어긋나 OG와 sitemap이 깨진다       |
| `GITHUB_REPO_CLONE_TOKEN`              | 서브모듈을 받지 못해 빌드가 멈춘다            |
| `NEXT_PUBLIC_GISCUS_REPO`와 나머지 3종 | 댓글 자리에 안내 문구만 뜬다                  |
| `KV_REST_API_URL`, `KV_REST_API_TOKEN` | 조회수가 0으로 보이고 인기 글이 최신순이 된다 |

giscus 관련 키는 `_REPO`와 `_REPO_ID`, `_CATEGORY`, `_CATEGORY_ID` 넷이고 하나라도 빠지면 댓글이 뜨지 않는다.

토큰은 권한을 최소로 발급한다. 서브모듈 토큰은 읽기 전용이면 충분하다.

## 릴리스 절차

통합 브랜치는 `develop`이고 `main`은 릴리스 전용이다.

1. `develop`에서 `git fetch origin main`으로 받아온 뒤 `git merge origin/main`으로 충돌을 미리 푼다. 이 단계를 건너뛰면 PR 생성 시점에 충돌이 뜬다
2. `gh pr create --base main --head develop`로 PR을 만든다
3. **merge commit 또는 rebase merge로 머지한다. squash는 쓰지 않는다.** squash로 압축하면 `main`이 `develop`의 조상 관계를 잃어 다음 PR마다 충돌이 반복된다
4. 머지 후 `v1.2.3` 형식의 주석 있는 태그를 push한다. `.github/workflows/release.yaml`이 CHANGELOG에서 해당 절을 뽑아 GitHub Release를 만들고 프로덕션을 다시 배포한다

커밋과 PR, 태그 push는 사용자가 그때그때 요청할 때만 한다.

## 릴리스 전 검증

### 성능

측정은 배포된 미리보기 URL에서 한다. 로컬 개발 서버는 최적화가 꺼져 있어 값이 의미 없다.

| 지표 | 기준       | 재는 곳                            |
| ---- | ---------- | ---------------------------------- |
| LCP  | 2.5초 미만 | PageSpeed Insights 모바일          |
| INP  | 200ms 미만 | PageSpeed Insights, Speed Insights |
| CLS  | 0.1 미만   | PageSpeed Insights                 |

최소한 홈과 포스트 상세, 포스트 목록 세 경로를 잰다. 포스트 상세는 이미지가 많은 글로 고른다.

자주 나오는 회귀 신호는 셋이다. 목록 첫 카드에 `priority`가 빠지면 LCP가 늘어나고, 이미지에 크기를 예약하지 않으면 CLS가 튀고, 무거운 컴포넌트를 정적으로 가져오면 INP가 나빠진다.

### 기능

배포 후 확인한다.

- 최근 글이 홈과 목록, RSS, sitemap에 나오는가
- 조회수가 숫자로 뜨는가. 대시가 보이면 KV 설정을 본다
- 댓글이 붙는가. 안내 문구가 보이면 giscus 키를 본다
- 새 글의 OG 카드가 공유 미리보기에서 제대로 렌더되는가

## 장애 복구

### 서브모듈을 받지 못해 빌드가 실패할 때

토큰 만료가 가장 흔한 원인이다. GitHub에서 토큰을 다시 발급해 Vercel 환경변수에 넣고 다시 배포한다. 로컬에서는 `git submodule sync`와 `git submodule update --remote --recursive`로 같은 상황을 재현할 수 있다.

토큰은 만료일이 있으므로 미리 달력에 적어둔다.

### 조회수가 안 보일 때

KV가 없거나 실패해도 페이지는 정상 동작하도록 설계되어 있다. 숫자 대신 대시가 뜨고 인기 글이 최신순으로 바뀔 뿐이다. 급하지 않으므로 KV 상태를 확인한 뒤 고친다.

### 페이지가 열리지 않을 때

빌드 로그와 런타임 로그를 먼저 본다. 런타임에서 콘텐츠 파일을 읽으려다 실패하는 종류의 오류라면 v1.1.1과 같은 유형이다. 그때의 교훈은 오류를 감싸 빈 값을 돌려주지 말라는 것이다. 빈 값을 돌려주면 검색 색인이 조용히 비어버린다. 콘텐츠를 런타임에 읽는 코드가 새로 들어왔는지 찾아 빌드 타임으로 옮긴다.

되돌려야 하면 Vercel 대시보드에서 직전 배포를 프로덕션으로 승격한다. 코드를 되돌리는 것보다 빠르다.
