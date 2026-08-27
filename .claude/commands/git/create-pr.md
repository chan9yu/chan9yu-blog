---
description: 현재 브랜치의 변경사항으로 Pull Request를 생성해주세요.
---

# Create PR

현재 feature 브랜치의 변경사항으로 Pull Request를 만든다.

## 절차

1. `git status`와 `git log develop..HEAD --oneline`으로 브랜치의 변경과 커밋 목록 확인
2. 원격 저장소 확인 (`git remote -v`)
   - 원격이 없으면 PR을 만들 수 없다. 사용자에게 알리고 로컬 머지(`/git:merge`)를 안내한 뒤 종료
3. 현재 브랜치를 push (`git push -u origin HEAD`)
4. `gh pr create`로 PR 생성. base는 `develop`

`develop`을 `main`으로 올리는 릴리스 PR은 다르다. PR을 만들기 전에 `git fetch origin main`과 `git merge origin/main`으로 충돌을 먼저 해소한다. 이 순서를 건너뛰면 PR마다 충돌을 만난다.

## PR 작성 규칙

- 제목: 커밋 컨벤션과 같은 형식 (`<타입>: <제목>`, 한국어)
- 본문에 포함할 것
  - 변경 요약. 무엇을 왜 했는지
  - 관련 설계 문서가 있으면 링크
  - 검증 결과. `pnpm type:check`와 `pnpm test`, `pnpm build:strict`, `pnpm lint` 통과 여부
- PR 하나에 작업 단위 하나만 담는다. 무관한 변경이 섞였으면 PR 전에 분리한다
