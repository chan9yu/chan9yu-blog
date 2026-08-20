---
description: 새 브랜치를 생성하고 전환해주세요.
---

# Branch

작업 단위에 맞는 feature 브랜치를 만들어 전환한다.

## 절차

1. `git status`로 워킹트리 상태 확인. 미커밋 변경이 있으면 커밋할지 스태시할지 사용자에게 먼저 확인한다
2. 분기 기준 확인. 원칙적으로 `main`에서 분기한다. 다른 브랜치에 있으면 `git switch main` 후 진행
3. 브랜치 이름 결정. 인자로 받았으면 그대로 쓰고, 없으면 현재 작업 맥락에서 제안하고 확인받는다
4. `git switch -c feature/{name}`으로 생성하고 전환
5. `git branch --show-current`로 결과 확인

## 규칙

`.agents/rules/git-workflow.md`의 브랜치 전략을 따른다.
