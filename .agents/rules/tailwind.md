---
description: X-[value] 임의값을 쓰지 않는다. 값은 토큰과 @utility에서 온다. 어긋난 값을 옮기는 네 갈래
---

# Tailwind 클래스

## 규칙

**`X-[value]` 형태의 임의값을 쓰지 않는다.** `p-[18px]`과 `text-[13px]`, `max-w-[600px]`, `grid-cols-[minmax(0,1fr)_auto]`이 전부 해당한다.

값은 토큰이나 유틸리티에서 온다. 클래스 안에 직접 박지 않는다.

## 이 규칙이 생긴 이유

2026-08-24에 저장소 전체에서 임의값 116건을 걷어냈다. 그 과정에서 임의값이 만든 결함 셋이 드러났다.

**같은 값이 두 이름으로 갈렸다.** `max-w-prose`는 Tailwind 내장 `65ch`인데 저장소 토큰 `--container-prose`는 `44rem`이다. 이름이 같아 보이지만 다른 값이다. About 페이지에 `max-w-prose`를 쓸 뻔했고 그러면 704px이 552px로 줄었다.

**형제 페이지가 1px씩 어긋났다.** `/posts`의 h1만 `text-[26px]`이고 `/series`와 `/tags`, 두 상세 페이지는 `text-2xl`(25px)이었다. 의도해서 만드는 차이가 아니다.

**타입 스케일이 반픽셀 격자에 있어 어떤 정수도 맞지 않았다.** 토큰이 11.5, 12.5, 13.5, 14.5, 15.5px인데 코드에 박힌 값은 11, 12, 13, 14, 15px이었다. 같은 계단이 0.5px 어긋난 채로 둘 존재했다. 토큰을 쓰려 해도 맞지 않으니 계속 임의값이 생겼다.

임의값은 이런 어긋남을 브라켓 안에 숨긴다. 이름이 붙으면 중복과 표류가 목록에서 보인다.

## 대신 하는 것

순서대로 본다.

**1. 기존 토큰에 같은 값이 있는지 본다.** `src/app/styles/tokens.css`와 `globals.css`의 `@theme inline`이 정본이다. Tailwind 기본 토큰도 저장소가 덮어쓰지 않은 것은 살아 있다. `--tracking-tight`가 `-0.025em`이고 `--leading-relaxed`가 `1.625`인 식이다.

**2. 두 곳 이상에서 쓰는 값이면 토큰을 만든다.** 색과 반경, 그림자, 간격, 자간, 줄 높이, 글자 크기가 여기 해당한다. `tokens.css`에 값을 두고 `globals.css`의 `@theme inline`에서 별칭을 건다.

**3. Tailwind 네임스페이스로 표현할 수 없으면 `@utility`를 만든다.** grid 템플릿과 뷰포트 단위 최대 높이, transition 속성 목록이 그렇다. `globals.css` 아래쪽에 모여 있다.

```css
@utility grid-tag-rail {
	grid-template-columns: var(--rail-tags) minmax(0, 1fr);
}
```

**4. 한 번만 쓰는 값이면 인접 토큰으로 맞춘다.** 한 곳에서만 쓰는 토큰은 이름 붙인 임의값일 뿐이다. 차이가 눈에 띌 만하면 그 사실을 적어 사용자 판단을 받는다.

## 글자 크기의 함정

`--text-*` 토큰은 짝이 되는 `--text-*--line-height`가 있으면 `line-height`도 함께 낸다.

```css
.text-sm {
	font-size: 0.84375rem;
	line-height: var(--tw-leading, var(--text-sm--line-height));
}
.text-13 {
	font-size: 0.8125rem;
}
```

저장소가 `--text-sm` 값만 덮어썼고 `--text-sm--line-height`는 Tailwind 기본값이 그대로 살아 있다. 그래서 `text-[13px]`을 `text-sm`으로 바꾸면 크기만 바뀌는 것이 아니라 없던 줄 높이가 새로 걸린다.

줄 높이를 건드리지 않고 크기만 주려면 짝 없는 토큰을 만든다. `--text-13`처럼 `--line-height` 동반 값을 두지 않으면 Tailwind가 `line-height` 선언을 생략한다.

바꾸기 전에 그 요소에 `leading-*`이 함께 있는지 본다. 있으면 `--tw-leading`이 이기므로 어느 토큰을 써도 줄 높이는 안 바뀐다.

## 남아 있는 문제

**글자 크기 계단이 둘이다.** 이름 있는 계단(`text-chip` 11.5px에서 `text-base` 15.5px)과 정수 계단(`text-11`에서 `text-17`)이 0.5px 어긋난 채 공존한다. 이름 있는 계단이 정수 계단보다 서너 배 많이 쓰인다. 정확한 수는 확인하는 법 절의 계단 세기 명령으로 그때그때 센다.

하나로 합치려면 둘 중 하나를 골라야 한다. 이름 있는 계단을 정수로 내리면 그것을 쓰는 자리가 전부 0.5px 작아진다. 정수 계단을 올리면 그쪽이 전부 커지고, 그중 줄 높이 동반 값 없는 토큰을 쓰던 자리에 줄 높이가 새로 걸린다.

새 코드는 이름 있는 계단을 쓴다. 정수 계단은 2026-08-24 이전에 정해진 값을 그대로 옮긴 것이다.

## 확인하는 법

남아 있는 임의값을 찾는다.

```bash
grep -rnoE "(^|[\" ])[a-z-]+-\[[^]]+\]" src --include="*.tsx" --include="*.ts"
```

걸리는 것이 없어야 한다. 걸리면 위 네 갈래 중 하나로 옮긴다.

두 글자 크기 계단이 각각 몇 곳에서 쓰이는지 센다. 앞이 이름 있는 계단, 뒤가 정수 계단이다.

```bash
grep -rhoE "(^|[^a-zA-Z0-9-])text-(chip|xs|sm|subtitle|base)([^a-zA-Z0-9-]|$)" src --include='*.tsx' --include='*.ts' | wc -l
grep -rhoE "(^|[^a-zA-Z0-9-])text-1[1-7]([^a-zA-Z0-9-]|$)" src --include='*.tsx' --include='*.ts' | wc -l
```
