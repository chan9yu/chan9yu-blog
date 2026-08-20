# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

v1.3.0을 준비하는 정비 작업이다. 사이트 동작은 바뀌지 않았다.

### Added

- 개발 가이드를 `CONTRIBUTING.md`로 분리했다. 환경 설정과 명령어, 코드 규약, Git 워크플로우, 콘텐츠 작성법을 담았다.
- 도구에 매이지 않는 규칙 본문을 `.agents/`에 두고 `.claude/`에서 링크로 읽는 구조를 도입했다.
- `AGENTS.md`를 만들고 `CLAUDE.md`를 그리로 가는 링크로 바꿨다.

### Changed

- 문서를 성격별로 나눴다. 만드는 것은 `docs/product/`, 보이는 것은 `docs/design/`, 굴리는 것은 `docs/operations/`, 생성 도구에 넣는 것은 `docs/prompts/`에 둔다.
- Node.js를 24로, pnpm을 11로 올렸다.
- 커밋 메시지 템플릿에서 이모지를 뺐다.

### Removed

- 에이전트 15개와 스킬 15종, 규칙 17개로 구성했던 기존 하네스를 걷어냈다. v1.3.0에서 다시 세운다.
- Playwright 설정과 e2e 스펙 5종을 지웠다. v1.3.0 착수 전에 되살린다.

### Fixed

- `contents` 서브모듈이 ESLint와 Prettier 검사 대상에 들어가 커밋이 막히던 문제를 고쳤다.
- lefthook이 없는 경로(`scripts/commit-msg.js`)를 부르던 것을 고쳤다.

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

[Unreleased]: https://github.com/chan9yu/dev-blog/compare/v1.2.0...HEAD
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
