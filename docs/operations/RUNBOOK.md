# 운영 안내서

배포하거나 무언가 깨졌을 때 읽는다. 기능이 어떻게 동작하는지는 product/SPEC.md가 맡는다.

## 배포 파이프라인

Vercel이 프로덕션과 미리보기를 모두 만든다. 도메인은 `chan9yu.dev`다. 이 값이 `src/shared/config/site.ts`에 있고 canonical과 OG, sitemap이 전부 여기서 나온다.

www와 http 주소는 Vercel 도메인 설정이 `https://chan9yu.dev`로 308 리다이렉트한다. 저장소 코드에는 없는 설정이라 프로젝트를 새로 만들거나 도메인을 옮길 때 대시보드에서 함께 옮겨야 한다.

빌드는 세 단계로 이어진다.

1. `pnpm install:vercel`이 `.gitmodules`의 주소를 토큰이 붙은 형태로 바꿔 contents 서브모듈을 받고 의존성을 설치한다
2. `prebuild`가 frontmatter의 SEO 규칙을 검사하고 콘텐츠 이미지를 `public/`으로 복사한다
3. `pnpm build:vercel`이 `STRICT_FRONTMATTER=1`로 Next.js 빌드를 돌린다
4. 빌드가 성공하면 `scripts/notify-indexnow.mjs`가 최근 7일 안에 발행하거나 고친 공개 글을 IndexNow로 알린다

IndexNow는 네이버와 빙이 받는다. 구글은 지원하지 않으므로 구글 색인은 sitemap과 서치 콘솔이 맡는다. 알림은 색인의 보조 수단이라 실패해도 종료 코드가 0이고 배포가 멈추지 않는다. 네이버가 안 받아도 sitemap을 보고 크롤러가 찾아온다. 성공과 실패 모두 `[indexnow]` 접두사를 달고 빌드 로그에 남으므로 색인이 안 걸리는 것 같으면 그 줄부터 본다.

한계가 하나 있다. 알림을 보내는 시점이 빌드 성공 직후라 배포가 실제로 프로덕션에 붙기 전이다. 검색 엔진이 곧바로 크롤링하면 아직 이전 배포를 볼 수 있다. 다시 올 때 새 내용을 받으므로 그냥 두지만, 새 글 URL이 한동안 404였다면 이 순서를 의심한다.

`VERCEL_ENV`가 `production`이 아니면 알림을 건너뛴다. 미리보기 배포와 로컬 실행이 여기 해당한다. 대상 URL을 세는 것까지는 그대로 하므로 `node scripts/notify-indexnow.mjs`로 무엇이 나갈지 미리 볼 수 있다.

`STRICT_FRONTMATTER`가 켜져 있어 frontmatter를 어긴 글이 하나라도 있으면 배포가 실패한다. 로컬 `pnpm build`는 경고만 내고 그 글을 건너뛰므로, 발행 전 확인은 `pnpm build:strict`로 한다.

## 환경변수

| 키                                                                                                                        | 없을 때 벌어지는 일                                               |
| ------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                                                                                                    | 절대 URL이 어긋나 OG와 sitemap이 깨진다                           |
| `GITHUB_REPO_CLONE_TOKEN`                                                                                                 | 서브모듈을 받지 못해 빌드가 멈춘다                                |
| `NEXT_PUBLIC_GISCUS_REPO`와 `NEXT_PUBLIC_GISCUS_REPO_ID`, `NEXT_PUBLIC_GISCUS_CATEGORY`, `NEXT_PUBLIC_GISCUS_CATEGORY_ID` | 넷 중 하나라도 빠지면 댓글 자리에 안내 문구만 뜬다                |
| `UPSTASH_REDIS_REST_URL`과 `UPSTASH_REDIS_REST_TOKEN`                                                                     | 둘 중 하나만 있어도 조회수가 0으로 보이고 인기 글이 최신순이 된다 |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`과 `NEXT_PUBLIC_NAVER_SITE_VERIFICATION`                                            | 검색 엔진 소유 확인 meta가 나가지 않는다                          |

소유 확인 키 둘은 검색 엔진 등록에만 쓰이고 없어도 사이트 동작은 그대로다. 값을 받는 곳과 등록 절차는 operations/SEO.md에 있다.

토큰은 권한을 최소로 발급한다. 서브모듈 토큰은 읽기 전용이면 충분하다.

## IndexNow 키

키는 환경변수가 아니라 저장소에 있다. `public/6bac183b5f6519f851dec941bff4131bc5e72a4ecc691a83491f0e39b4a18182.txt`이고 파일 내용은 파일 이름과 같은 64자 문자열 하나다. 검색 엔진이 이 주소를 열어 우리가 도메인 주인인지 확인한다.

키를 바꾸려면 `openssl rand -hex 32`로 새 키를 만들어 같은 이름 규칙의 파일을 `public/`에 두고, `scripts/notify-indexnow.mjs`의 `INDEXNOW_KEY` 상수를 같은 값으로 고친 뒤 이전 키 파일을 지운다. 스크립트가 상수와 파일 내용을 대조해 다르면 던지므로 한쪽만 고치면 미리보기 빌드에서 바로 걸린다.

## 릴리스 절차

통합 브랜치는 `develop`이고 `main`은 릴리스 전용이다.

1. `develop`에서 `git fetch origin main`으로 받아온 뒤 `git merge origin/main`으로 충돌을 미리 푼다. 이 단계를 건너뛰면 PR 생성 시점에 충돌이 뜬다
2. `gh pr create --base main --head develop`로 PR을 만든다
3. CI(`.github/workflows/ci.yaml`)가 초록인지 확인한다
4. **merge commit 또는 rebase merge로 머지한다. squash는 쓰지 않는다.** squash로 압축하면 `main`이 `develop`의 조상 관계를 잃어 다음 PR마다 충돌이 반복된다
5. 머지 후 `v1.2.3` 형식의 주석 있는 태그를 push한다. `.github/workflows/release.yaml`이 CHANGELOG에서 해당 절을 뽑아 GitHub Release를 만든다

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
- 조회수가 숫자로 뜨는가. 계속 0이면 Redis 설정을 보고 대시가 보이면 `/api/views` 응답을 본다
- 댓글이 붙는가. 안내 문구가 보이면 giscus 키를 본다
- 새 글의 OG 카드가 공유 미리보기에서 제대로 렌더되는가

## 장애 복구

### 서브모듈을 받지 못해 빌드가 실패할 때

토큰 만료가 가장 흔한 원인이다. GitHub에서 토큰을 다시 발급해 Vercel 환경변수에 넣고 다시 배포한다. 로컬에서는 `git submodule sync`와 `git submodule update --remote --recursive`로 같은 상황을 재현할 수 있다.

토큰은 만료일이 있으므로 미리 달력에 적어둔다.

### 조회수가 안 보일 때

조회수가 실패해도 페이지는 정상 동작하도록 설계되어 있다. Redis가 없거나 Redis 호출이 실패하면 조회수가 0으로 보이고 인기 글이 최신순이 된다. `/api/views` 요청 자체가 실패하면 숫자 대신 대시가 뜬다. 급하지 않으므로 Redis 상태와 함수 로그를 확인한 뒤 고친다.

### 페이지가 열리지 않을 때

빌드 로그와 런타임 로그를 먼저 본다. 런타임에서 콘텐츠 파일을 읽으려다 실패하는 종류의 오류라면 v1.1.1과 같은 유형이다. 그때의 교훈은 오류를 감싸 빈 값을 돌려주지 말라는 것이다. 빈 값을 돌려주면 검색 색인이 조용히 비어버린다. 콘텐츠를 런타임에 읽는 코드가 새로 들어왔는지 찾아 빌드 타임으로 옮긴다.

되돌려야 하면 Vercel 대시보드에서 직전 배포를 프로덕션으로 승격한다. 코드를 되돌리는 것보다 빠르다.
