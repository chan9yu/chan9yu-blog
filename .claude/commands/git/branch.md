---
description: 새 브랜치를 생성하고 전환해주세요.
---

# Branch

작업 단위에 맞는 feature 브랜치를 만들어 전환한다.

## 절차

1. `git status`로 워킹트리 상태 확인. 미커밋 변경이 있으면 커밋할지 스태시할지 사용자에게 먼저 확인한다
2. 분기 기준 확인. `develop`에서 분기한다. 다른 브랜치에 있으면 `git switch develop` 후 `git pull origin develop`으로 원격 최신 상태를 받는다
3. 브랜치 이름 결정. 인자로 받았으면 그대로 쓰고, 없으면 현재 작업 맥락에서 제안하고 확인받는다. 고치는 일이면 `fix/{name}`을 쓴다
4. `git switch -c feature/{name}`으로 생성하고 전환
5. `git branch --show-current`로 결과 확인

## 규칙

`.agents/rules/git-workflow.md`의 브랜치 전략을 따른다.
