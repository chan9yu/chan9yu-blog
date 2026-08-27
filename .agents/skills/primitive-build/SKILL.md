---
name: primitive-build
description: UI 프리미티브를 라이브러리 없이 직접 만드는 절차. 새 프리미티브를 만들 때와 Button, Dialog, Drawer 같은 기존 프리미티브를 고칠 때 쓴다. "프리미티브 구현", "Dialog 직접 만들어", "컴포넌트 새로 만들어", "포커스 트랩", "variant 만들기" 같은 표현에 트리거한다. 대화상자를 만들 때 빠뜨리기 쉬운 것과 토큰 사용 규칙을 포함한다.
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

Radix 같은 라이브러리가 대신하던 것이 일곱이다. 화면으로는 티가 나지 않으므로 만들 때마다 이 목록을 지난다.

이 저장소의 Dialog는 네이티브 `dialog` 요소와 `showModal()`을 쓴다. 포커스 진입과 ESC, 뒤 배경 감추기는 브라우저가 대신한다. 새 대화상자 계열은 Dialog를 기반으로 얹어 이 목록을 다시 구현하지 않는다.

**1. 열릴 때 포커스를 안으로 옮긴다.** 안에 포커스 받을 것이 있으면 첫 번째로, 없으면 대화상자 자체에 `tabIndex={-1}`을 주고 거기로 보낸다.

**2. Tab이 밖으로 새지 않게 한다.** 마지막에서 Tab을 누르면 처음으로, 처음에서 Shift+Tab을 누르면 마지막으로 돌아간다. 이 순환은 한 곳에만 구현한다. 지금은 Dialog가 담당하고 Drawer는 Dialog를 그대로 써서 함께 얻는다.

**3. 닫을 때 열었던 곳으로 돌아간다.** 열기 직전 `document.activeElement`를 붙들고 있다가 닫을 때 그리로 포커스를 되돌린다. 이걸 빠뜨리면 닫은 뒤 Tab이 페이지 맨 처음부터 시작한다.

**4. 역할과 이름을 붙인다.** `role="dialog"`와 `aria-modal="true"`를 주고 제목 요소의 id를 `aria-labelledby`로 잇는다. 네이티브 `dialog` 요소를 `showModal()`로 열면 역할과 모달 의미는 브라우저가 준다. 제목이 보이지 않는 대화상자면 `sr-only`로 넣는다.

**5. ESC로 닫는다.** 여러 겹이 열려 있으면 맨 위 하나만 닫힌다. 전역 리스너를 쓰면 전부 닫히므로 열린 순서를 스택으로 들고 있어야 한다.

**6. 뒤 배경 스크롤을 잠근다.** 지금은 Dialog가 열릴 때 `html`에 `data-modal-open`을 달고 `src/app/styles/dialog.css`가 `overflow: hidden`을 건다. 잠글 때 스크롤바가 사라지며 화면이 가로로 튀면 사라질 폭만큼 보정한다.

**7. 뒤 배경을 보조 기술에서 감춘다.** 열린 동안 바깥 형제 요소에 `aria-hidden="true"`를 주거나 대화상자에 `inert`를 쓴다. 이걸 빠뜨리면 스크린 리더가 뒤 내용을 계속 읽는다.

**바깥 클릭으로 닫을 때 주의할 것.** 안에서 시작한 드래그가 밖에서 끝나면 닫히면 안 된다. `mousedown`이 어디서 시작했는지 기억하고 `mouseup`에서 판단한다. `click`만 보면 텍스트를 끌어 선택하다가 대화상자가 닫힌다.

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
