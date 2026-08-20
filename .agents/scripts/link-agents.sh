#!/usr/bin/env bash
#
# link-agents — `.agents/` 본문을 도구별 어댑터 디렉터리에 심링크.
#
# 룰과 스킬 본문은 `.agents/` 에 한 벌만 둔다. 도구는 자기 디렉터리에서 링크로
# 같은 파일을 읽는다. 도구가 늘어도 고칠 본문이 한 곳에 남는다.
#
# - 스킬은 디렉터리 단위. `.agents/skills/{이름}/` 을 `.claude/skills/{이름}` 으로 링크
# - 룰은 파일 단위. `.agents/rules/{이름}.md` 를 `.claude/rules/{이름}.md` 로 링크
# - 링크가 가리키는 곳이 다르면 다시 만든다
# - `.agents/` 에서 사라진 항목의 링크는 지운다
#
# 새 도구를 붙일 때는 아래 TARGETS 에 디렉터리를 추가한다.
#
# Usage: bash .agents/scripts/link-agents.sh
#
# macOS bash 3.2 호환. associative array 를 쓰지 않는다.

set -euo pipefail

AGENTS_DIR="$(cd "$(dirname "$0")/.." && pwd)"
REPO_ROOT="$(cd "$AGENTS_DIR/.." && pwd)"

SKILL_TARGETS=".claude/skills"
RULE_TARGETS=".claude/rules"

# 어댑터 디렉터리에 링크가 아닌 것이 있으면 멈춘다. 이름이 겹치지 않아도 잡는다.
# 실재 파일을 여기 두면 Claude Code 는 읽지만 다른 도구는 못 읽어 본문이 갈라진다.
assert_links_only() {
	local target_dir="$1"
	local entry

	[ -d "$REPO_ROOT/$target_dir" ] || return 0

	for entry in "$REPO_ROOT/$target_dir"/*; do
		[ -e "$entry" ] || continue
		[ -L "$entry" ] && continue

		echo "ERROR: ${entry#"$REPO_ROOT"/} 가 심링크가 아닙니다." >&2
		echo "본문은 .agents/ 에 두고 $target_dir 에는 링크만 둡니다." >&2
		exit 1
	done
}

# 링크를 만든다. 이미 같은 곳을 가리키면 그대로 둔다.
ensure_link() {
	local link_path="$1"
	local link_target="$2"

	if [ -L "$link_path" ]; then
		if [ "$(readlink "$link_path")" = "$link_target" ]; then
			return 0
		fi
		rm "$link_path"
	fi

	ln -s "$link_target" "$link_path"
	echo "linked: ${link_path#"$REPO_ROOT"/} -> $link_target"
}

# `.agents/` 를 가리키는데 본문이 사라진 링크를 지운다.
prune_stale() {
	local target_dir="$1"
	local valid="$2"
	local link name

	[ -d "$REPO_ROOT/$target_dir" ] || return 0

	for link in "$REPO_ROOT/$target_dir"/*; do
		[ -L "$link" ] || continue

		case "$(readlink "$link")" in
			*"/.agents/"*) ;;
			*) continue ;;
		esac

		name="$(basename "$link")"
		case "$valid" in
			*" $name "*) continue ;;
		esac

		rm "$link"
		echo "pruned: $target_dir/$name"
	done
}

for target in $SKILL_TARGETS $RULE_TARGETS; do
	assert_links_only "$target"
done

# 스킬은 디렉터리 단위로 링크한다.
skill_names=" "
for skill_dir in "$AGENTS_DIR"/skills/*/; do
	[ -d "$skill_dir" ] || continue

	name="$(basename "$skill_dir")"
	skill_names="$skill_names$name "

	for target in $SKILL_TARGETS; do
		mkdir -p "$REPO_ROOT/$target"
		ensure_link "$REPO_ROOT/$target/$name" "../../.agents/skills/$name"
	done
done

# 룰은 파일 단위로 링크한다. `.agents/rules/` 밖의 문서는 룰이 아니라 대상이 아니다.
rule_names=" "
for rule_md in "$AGENTS_DIR"/rules/*.md; do
	[ -f "$rule_md" ] || continue

	name="$(basename "$rule_md")"
	rule_names="$rule_names$name "

	for target in $RULE_TARGETS; do
		mkdir -p "$REPO_ROOT/$target"
		ensure_link "$REPO_ROOT/$target/$name" "../../.agents/rules/$name"
	done
done

for target in $SKILL_TARGETS; do
	prune_stale "$target" "$skill_names"
done

for target in $RULE_TARGETS; do
	prune_stale "$target" "$rule_names"
done

skill_count="$(echo "$skill_names" | wc -w | tr -d ' ')"
rule_count="$(echo "$rule_names" | wc -w | tr -d ' ')"
echo "link-agents 완료. 룰 ${rule_count}개, 스킬 ${skill_count}개 동기화."
