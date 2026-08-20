---
description: 변경사항을 분석하여 커밋 컨벤션에 맞게 커밋을 생성해주세요.
---

# Commit

변경사항을 분석해 커밋 컨벤션에 맞는 커밋을 만든다.

## 절차

1. `git status`와 `git diff`로 변경사항 확인
2. 변경사항을 논리적 단위로 분리 (커밋 하나에 이슈 하나만)
3. 단위별로 커밋 생성
4. 커밋 후 `git status`로 결과 확인

## 커밋 메시지

`.agents/rules/git-workflow.md`의 커밋 규칙을 따른다.
