# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.1] - 2026-08-27

### Fixed

- 발행 날짜가 읽는 사람의 시간대에 따라 하루 어긋나던 것을 고쳤다. 서버는 UTC로, 브라우저는 로컬 시간대로 그려서 UTC 15시 이후에 발행한 글 셋이 목록에서는 하루 뒤 날짜로 보이고 상세에서는 원래 날짜로 보였다. 날짜를 `Asia/Seoul`로 고정해 어디서 읽어도 저자가 발행한 날이 나온다.
- 위 불일치가 `/posts`에서 하이드레이션 오류(React #418)를 내던 것을 함께 없앴다. 서버가 보낸 목록을 React가 버리고 클라이언트에서 다시 그리고 있었다.

## [1.3.0] - 2026-08-27

v1.3.0 전면 재작성과 그 위의 기술 SEO 개선, 문서 정비다.

### Added

- 개발 가이드를 `CONTRIBUTING.md`로 분리했다. 환경 설정과 명령어, 코드 규약, Git 워크플로우, 콘텐츠 작성법을 담았다.
- 도구에 매이지 않는 규칙 본문을 `.agents/`에 두고 `.claude/`에서 링크로 읽는 구조를 도입했다.
- `AGENTS.md`를 만들고 `CLAUDE.md`를 그리로 가는 링크로 바꿨다.
- v1.3.0 재작성을 이끌 하네스를 세웠다. 에이전트 넷과 스킬 셋으로, 재작성에서 조용히 깨지는 자리(레이어 경계와 대화상자 접근성)를 만드는 사람과 보는 사람으로 갈랐다.
- 루트 metadata에 검색 엔진 소유 확인 meta(환경 변수)와 theme-color viewport, googleBot `max-image-preview:large`를 더했다.
- 브라우저에서만 드러나는 회귀를 막는 e2e 스펙을 갖췄다. 대화상자 접근성과 인쇄, 축소 모션, 정적 목록을 검사한다.
- 테스트 전략을 `.agents/rules/testing.md`에 규칙으로 못 박았다. 테스팅 트로피를 확정 전략으로 두고 층마다 소유하는 것과 지우는 기준을 적었다.
- 512px 안드로이드 아이콘을 만들어 manifest에 등록했다(설치 화면 조건 충족, maskable 포함). OG 카드와 뱃지에 심볼 마크를 넣었다.
- 프로덕션 배포가 최근 7일 안에 발행하거나 고친 글을 IndexNow(네이버와 빙)에 알린다. 실패해도 배포는 막지 않고 로그에 남긴다.
- 모든 응답에 보안 헤더 넷(nosniff, Referrer-Policy, X-Frame-Options, Permissions-Policy)을 건다.

### Changed

- 저장소를 FSD 6레이어로 전면 재작성했다. UI 프리미티브를 직접 구현해 shadcn/ui와 Radix 의존을 걷어냈고, 디자인 토큰 위에서 스타일을 다시 짰다.
- 조회수 저장을 Vercel KV에서 Upstash Redis로 옮겼다. `UPSTASH_` 접두사 환경 변수를 읽는다.
- 문서를 성격별로 나눴다. 만드는 것은 `docs/product/`, 보이는 것은 `docs/design/`, 굴리는 것은 `docs/operations/`, 생성 도구에 넣는 것은 `docs/prompts/`에 둔다.
- Node.js를 24로, pnpm을 11로 올렸다.
- 커밋 메시지 템플릿에서 이모지를 뺐다.
- 모든 페이지가 og:site_name과 og:locale, RSS 대체 링크를 낸다. Next.js의 얕은 metadata 병합으로 루트 값이 사라지던 것을 `buildMetadata`가 직접 내도록 바꿨다.
- 사이트맵에서 changefreq와 priority를 빼고 lastmod를 글 날짜에서 계산한다. 글이 한 편뿐인 태그는 사이트맵에서 빠지고 페이지는 noindex가 된다.
- RSS 저자 표기를 `dc:creator`로 바꿔 이메일을 내보내지 않는다.
- `/posts` 목록 전체가 초기 HTML에 실린다. useSearchParams가 목록을 클라이언트 렌더로 밀어내던 것을 URL 구독으로 바꿨다.
- 웹폰트를 2MB 단일 파일 preload에서 유니코드 범위 동적 서브셋으로 바꿨다. 홈 기준 폰트 전송량이 392KB로 준다.
- BlogPosting JSON-LD에 저자 URL과 dateModified, inLanguage를 더하고 About의 Person과 같은 `@id`로 이었다.

### Removed

- 에이전트 15개와 스킬 15종, 규칙 17개로 구성했던 기존 하네스를 걷어냈다.
- Playwright 설정과 e2e 스펙 5종을 지웠다.

### Fixed

- `contents` 서브모듈이 ESLint와 Prettier 검사 대상에 들어가 커밋이 막히던 문제를 고쳤다.
- lefthook이 없는 경로(`scripts/commit-msg.js`)를 부르던 것을 고쳤다.
- 테스트 스위트를 케이스 단위로 전수 판정해 단위와 컴포넌트를 323개에서 183개로, e2e 실행을 33개에서 17개로 줄였다. 커버리지는 0.35퍼센트포인트만 빠졌다.
- 세 동적 라우트를 `dynamicParams = false`로 닫아 알 수 없는 slug가 런타임에 contents/를 읽던 경로와 404 응답의 1년 CDN 캐시를 없앴다.
- 404 페이지가 홈의 canonical과 OG 카드를 달고 나가던 것을 닫았다.
- 태그 링크 href의 공백이 sitemap의 퍼센트 인코딩과 어긋나던 것을 통일했다.

## [1.2.0] - 2026-06-30

### Added

- GitHub 프로필 README에 최근 글 6개를 카드 이미지로 보여주는 뱃지를 추가했다. 새 글을 발행하면 README를 고치지 않아도 카드가 바뀐다.
- 카드를 누르면 해당 글로 바로 이동한다.
- 카드는 보는 사람의 라이트와 다크 테마를 따라간다.

## [1.1.8] - 2026-05-11

### Fixed

- 모바일에서 일부 표의 한글이 한 글자씩 끊겨 보이던 문제를 고쳤다. 표가 화면보다 넓으면 가로로 스크롤된다. ([#36](https://github.com/chan9yu/dev-blog/issues/36))

## [1.1.7] - 2026-05-07

### Added

- 이미지를 크게 본 상태에서 좌우로 넘기면 넘어가는 방향대로 슬라이드된다.

### Changed

- 글 목록의 기본 화면을 격자로 바꿨다. 목록형을 골라 둔 사람은 그대로 목록형으로 열린다.
- 버전 배지를 모바일에서는 숨기고 PC에서만 보여준다.

### Fixed

- 목록과 격자를 오갈 때 첫 카드만 어색하게 튀던 움직임을 고쳤다.
- 작은 이미지를 크게 보면 억지로 늘어나 뭉개지던 문제를 고쳤다. 이제 원래 크기를 지킨다.

## [1.1.6] - 2026-05-07

### Fixed

- 화면 왼쪽 아래 버전 배지가 스크롤을 따라 밀려 올라가던 문제를 고쳤다. 이제 늘 같은 자리에 떠 있다.

## [1.1.5] - 2026-05-05

### Added

- 새 글의 제목과 설명 길이, 주소 규칙을 빌드 단계에서 검사한다. 기준에 어긋난 글은 배포되지 않는다.

### Changed

- 포스트 11편의 검색 설명문을 다시 써서 검색 결과에서 문장이 잘리지 않는다.
- 글의 수정일이 검색 엔진과 sitemap, 공유 카드에서 모두 같은 값으로 나간다.

### Removed

- 효과가 확인되지 않은 SEO 실험 기능을 걷어냈다. llms.txt 라우트와 FAQ, HowTo 구조화 데이터 등이다.

## [1.1.4] - 2026-05-04

### Added

- Footer에 현재 배포된 버전을 표시한다. 누르면 그 버전의 릴리스 노트로 간다.

### Fixed

- 모든 글에서 댓글이 보이지 않던 문제를 고쳤다. 전에 달린 댓글도 다시 나온다. ([#30](https://github.com/chan9yu/dev-blog/issues/30))
- 헤더가 스크롤을 따라 밀려 올라가던 문제를 고쳤다. 이제 위에 붙어 있다.
- 글 목록의 보기 전환 버튼에서 화면이 잠깐 어긋나던 문제를 고쳤다.

## [1.1.3] - 2026-05-04

### Changed

- 스크린 리더 안내를 보강했다. 이미지 캡션과 검색 결과 개수, 댓글 불러오는 중 상태를 읽어준다.

### Fixed

- 조회수를 불러오지 못하고 오류가 나던 문제를 고쳤다. 조회수 저장소가 없는 환경에서는 0으로 보여준다.
- 글 목록을 새로 열 때 화면이 깜빡이며 어긋나던 문제를 고쳤다.

## [1.1.2] - 2026-05-04

### Fixed

- 배포 30분 뒤부터 모든 페이지가 로딩 화면에서 멈추던 문제를 근본 원인까지 고쳤다. 모든 페이지를 빌드 시점에 미리 만들어 두는 방식으로 되돌렸다.

## [1.1.1] - 2026-05-04

### Fixed

- 배포 후 모든 페이지가 로딩 화면에서 멈추던 문제에 1차 대응했다. 완전한 해결은 1.1.2다.

## [1.1.0] - 2026-05-04

첫 production 배포다.

### Added

- MDX로 쓴 글에 코드 하이라이팅과 자동 목차, 읽기 진행률, 이전과 다음 글 이동을 갖췄다.
- `Cmd/Ctrl+K`로 검색을 연다. 입력이 비어 있으면 인기 태그와 최근 글을 먼저 보여준다.
- 시리즈와 태그로 글을 모아 볼 수 있다. 태그와 시리즈 주소에 한글을 쓴다.
- 글마다 조회수를 센다.
- 글 아래에 GitHub 계정으로 남기는 댓글을 붙였다.
- 본문 이미지를 누르면 크게 볼 수 있다.
- 다크와 라이트 테마를 전환한다. 전환할 때 화면이 부드럽게 바뀌고 새로고침해도 깜빡이지 않는다.
- 모바일에서 메뉴를 서랍처럼 열고, 링크를 누르면 저절로 닫힌다.
- 검색 노출을 위해 페이지마다 메타데이터와 구조화 데이터를 넣고 sitemap과 RSS, robots.txt를 자동으로 만든다. 공유 카드 이미지도 글마다 자동 생성한다.
- 키보드만으로 전체를 쓸 수 있다. 본문 바로가기 링크와 초점 이동을 갖췄고 접근성 검사에서 심각한 문제가 없다.

[Unreleased]: https://github.com/chan9yu/dev-blog/compare/v1.3.1...HEAD
[1.3.1]: https://github.com/chan9yu/dev-blog/releases/tag/v1.3.1
[1.3.0]: https://github.com/chan9yu/dev-blog/releases/tag/v1.3.0
[1.2.0]: https://github.com/chan9yu/dev-blog/releases/tag/v1.2.0
[1.1.8]: https://github.com/chan9yu/dev-blog/releases/tag/v1.1.8
[1.1.7]: https://github.com/chan9yu/dev-blog/releases/tag/v1.1.7
[1.1.6]: https://github.com/chan9yu/dev-blog/releases/tag/v1.1.6
[1.1.5]: https://github.com/chan9yu/dev-blog/releases/tag/v1.1.5
[1.1.4]: https://github.com/chan9yu/dev-blog/releases/tag/v1.1.4
[1.1.3]: https://github.com/chan9yu/dev-blog/releases/tag/v1.1.3
[1.1.2]: https://github.com/chan9yu/dev-blog/releases/tag/v1.1.2
[1.1.1]: https://github.com/chan9yu/dev-blog/releases/tag/v1.1.1
[1.1.0]: https://github.com/chan9yu/dev-blog/releases/tag/v1.1.0
