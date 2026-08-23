#!/usr/bin/env bash
# Vercel은 private 서브모듈을 clone하지 못한다. 그 제약을 우회해 contents 서브모듈을 받는다.
# .gitmodules의 주소를 GITHUB_REPO_CLONE_TOKEN(fine-grained PAT, Contents Read 권한)이 붙은
# 형태로 바꿔 받은 뒤 원본을 복원한다. Vercel Install Command는 pnpm install:vercel을 쓴다.

set -Eeuo pipefail

# Vercel은 대시보드 환경 변수를 자동 주입하지만 로컬 bash는 아니라서 .env를 직접 읽는다
if [[ -f .env ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
  echo "[info] .env 로드 완료 (로컬 환경)"
fi

GITMODULES=".gitmodules"
FEXT=".bak"
GITMODULES_BACKUP="${GITMODULES}${FEXT}"

function cleanup {
  echo "Cleaning the runner..."
  rm -f "$GITMODULES" "$GITMODULES_BACKUP"
  git restore "$GITMODULES" 2>/dev/null || true
  echo "Done!"
}

trap cleanup EXIT

function submodule_workaround {
  if [ -z "${GITHUB_REPO_CLONE_TOKEN:-}" ]; then
    echo "[error] GITHUB_REPO_CLONE_TOKEN 환경 변수가 설정되지 않았습니다." >&2
    exit 1
  fi

  echo "Monkey patching .gitmodules..."
  sed -i"$FEXT" "s/git@github.com:/https:\/\/oauth2:${GITHUB_REPO_CLONE_TOKEN}@github.com\//" "$GITMODULES"
  sed -i"$FEXT" "s/https:\/\/github.com\//https:\/\/oauth2:${GITHUB_REPO_CLONE_TOKEN}@github.com\//" "$GITMODULES"
  echo "Done!"

  echo "Synchronising submodules' remote URL configuration..."
  git submodule sync
  echo "Done!"

  echo "Updating the registered submodules..."
  git submodule update --init --recursive --jobs "$(getconf _NPROCESSORS_ONLN)"
  echo "Done!"
}

submodule_workaround
echo "[success] Submodule clone 완료"
