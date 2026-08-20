## 변경 사항

<!-- 주요 변경 내용을 bullet point로 정리 -->

-

## 관련 문서

<!-- 해당 항목만 남기고 나머지는 삭제 -->

- 제품: `docs/product/PRD.md` 범위 또는 성공 기준
- 기능 명세: `docs/product/SPEC.md` 기능 또는 기술 결정
- 로드맵: `docs/product/ROADMAP.md` 작업 순서 또는 하지 않기로 한 것
- 디자인 방향: `docs/design/DESIGN.md` 토큰 또는 디자인 시스템
- 화면 명세: `docs/design/DESIGN-SPEC.md` 화면 또는 공통 컴포넌트
- 운영: `docs/operations/RUNBOOK.md` 배포와 장애 대응
- 검색 유입: `docs/operations/SEO.md` 코드 밖 SEO 작업

공개 계약이나 동작 규칙을 바꿨다면 해당 문서를 이 PR에서 함께 고친다.

## 검증

<!-- type:check와 Vitest는 CI가 자동으로 돌린다 (.github/workflows/ci.yaml). 아래는 CI가 보지 않는 것들 -->

- [ ] `pnpm lint` 통과
- [ ] `pnpm format:check` 통과
- [ ] `pnpm build:strict` 성공 (frontmatter SEO 게이트 포함)
- [ ] 개발 서버에서 동작 확인

UI를 건드렸다면 아래도 확인한다.

- [ ] 라이트와 다크 양쪽 확인
- [ ] 모바일 세로, 태블릿, PC 폭에서 배치 확인
- [ ] 키보드만으로 조작 가능하고 포커스 표시가 보인다

## 머지 방법

**merge commit 또는 rebase merge로 머지해 주세요. squash는 쓰지 않습니다.**

squash로 압축하면 `main`이 `develop`의 조상 관계를 잃어 다음 PR마다 충돌이 반복됩니다. 커밋 단위 이력도 함께 사라집니다.
