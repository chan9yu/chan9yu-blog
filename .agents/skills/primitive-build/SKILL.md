---
name: primitive-build
description: `src/shared/ui`의 UI 프리미티브를 라이브러리 없이 직접 만드는 절차다. Button과 Dialog, Drawer 같은 도메인을 모르는 조각을 새로 만들거나 고칠 때 쓴다. "프리미티브 구현", "Dialog 직접 만들어", "variant 만들기", "토큰으로 컴포넌트" 같은 표현에 트리거한다. 토큰 사용 규칙과 대화상자에서 빠뜨리기 쉬운 것을 담는다. 기능 단위 작업의 진입점은 `main-harness`이고 이 스킬은 그 안에서 구현 단계에 쓰인다.
---

# 프리미티브 직접 구현

디자인 토큰 위에 UI 조각을 만든다. 남의 컴포넌트에 우리 토큰을 덮어씌우지 않고, 우리 토큰 위에 우리 컴포넌트를 올린다.

## 만들 것을 정하는 법

프리미티브 목록의 정본은 `docs/design/DESIGN.md`다. 여기는 만드는 법을 담는다.

쓰는 곳이 없는 프리미티브는 미리 만들지 않는다. 필요해질 때 만든다. 지금 `src/shared/ui/`에는 Button과 Dialog, Drawer가 이 절차로 서 있고, Drawer는 Dialog 위에 방향만 얹는다. 대화상자 계열이 새로 필요하면 처음부터 만들지 말고 Dialog를 기반으로 얹는다.

## 공통 규칙

**토큰만 쓴다.** 값을 직접 쓰지 않는다. `bg-[#4f46e5]`가 아니라 `bg-accent`다. 필요한 값이 없으면 토큰을 늘린다.

**바깥 여백을 갖지 않는다.** `margin`을 스스로 갖는 컴포넌트는 어디에 놓든 간격이 어긋난다. 배치는 쓰는 쪽이 정한다.

**`className`을 마지막에 병합한다.** `cn()`으로 합치되 넘어온 것이 이기게 둔다.

**props 타입을 따로 선언한다.** 인라인으로 쓰지 않는다. 바깥에서 추론이 필요하면 `ComponentProps<typeof X>`를 쓴다.

**배럴을 만들지 않는다.** `shared/ui/Button`처럼 직접 경로로 가져온다.

## variant 만들기

CVA를 쓰지 않는다. 매핑 객체와 `cn()`으로 충분하고 의존성이 하나 준다.

```tsx
const VARIANT = {
	solid: "bg-accent text-accent-foreground hover:bg-accent-hover",
	outline: "border border-border-default hover:bg-bg-subtle",
	ghost: "hover:bg-bg-subtle"
} as const;

const SIZE = {
	sm: "h-8 px-3 text-sm",
	md: "h-9 px-4 text-sm",
	lg: "h-10 px-6"
} as const;

type ButtonProps = ComponentProps<"button"> & {
	variant?: keyof typeof VARIANT;
	size?: keyof typeof SIZE;
};
```

`as const`를 붙여야 키가 리터럴 타입이 된다. 붙이지 않으면 `string`이 되어 오타가 통과한다.

## 대화상자를 만들 때

**Dialog를 기반으로 얹는다.** 이 저장소의 Dialog는 네이티브 `dialog` 요소와 `showModal()`을 쓰고, 포커스 순환과 복원, 스크롤 잠금을 이미 담당한다. Drawer가 그 예로 데이터 속성만 얹은 래퍼다. 처음부터 다시 만들면 아래 세 가지를 빠뜨린다.

**포커스 복원.** 열기 직전 `document.activeElement`를 붙들고 닫을 때 되돌린다. 빠뜨리면 닫은 뒤 Tab이 페이지 맨 처음부터 시작한다.

**Tab 순환.** 마지막에서 Tab이 처음으로, 처음에서 Shift+Tab이 마지막으로 간다. 한 곳에만 구현한다. 두 곳에 넣으면 서로 싸운다.

**바깥 클릭 판정.** 안에서 시작한 드래그가 밖에서 끝나면 닫히면 안 된다. `mousedown` 위치를 기억하고 `mouseup`에서 판단한다. `click`만 보면 텍스트를 끌어 선택하다가 닫힌다.

검증 항목 전체와 확인 방법은 `a11y-dialog-check` 스킬이 정본이다. 만들었으면 그리로 넘긴다.

## 모션

| 상황        | duration | easing                       |
| ----------- | -------- | ---------------------------- |
| 즉각 피드백 | 100ms    | `ease-out`                   |
| 등장        | 250ms    | `cubic-bezier(0, 0, 0, 1)`   |
| 퇴장        | 200ms    | `cubic-bezier(0.3, 0, 1, 1)` |
| 화면 전환   | 300ms    | `cubic-bezier(0.2, 0, 0, 1)` |

퇴장은 등장보다 짧게 잡는다. 사라지는 것은 다음 동작보다 주의를 덜 요구한다. 500ms를 넘기면 지체로 느낀다.

위치를 옮기는 효과에는 `motion-safe:`를 붙인다. 불투명도만 바뀌는 것은 모션 민감 사용자에게도 안전하다.

## 만들고 나서

대화상자 계열을 만들었으면 일곱 항목을 어떻게 처리했는지 적어 a11y-verifier에게 넘긴다. 스스로 합격을 매기지 않는다.

테스트로 증명한다. 눈으로 보면 일곱 중 여섯이 통과한 것처럼 보인다.
