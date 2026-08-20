---
name: fsd-layout
description: FSD 2.0 레이어에 파일을 배치하는 규칙. 새 파일을 어느 레이어와 슬라이스에 둘지 정할 때, import 방향이 규칙을 지키는지 볼 때, 한 디렉토리가 여러 레이어로 쪼개져야 하는지 판단할 때 쓴다. "어디에 둬야 해", "entities인가 features인가", "레이어 위반", "슬라이스 나누기", "import 방향" 같은 표현에 트리거한다. Next.js App Router와 함께 쓸 때의 이름 충돌 처리도 포함한다.
---

# FSD 2.0 배치 규칙

파일이 놓일 자리를 정하고 경계가 무너지지 않게 지킨다.

## 레이어

여섯을 쓴다. 위에서 아래로 참조하고 반대는 금지다.

| 레이어     | 무엇이 사는가                      | 이 프로젝트의 예                    |
| ---------- | ---------------------------------- | ----------------------------------- |
| `_app`     | 초기화, 프로바이더, 전역 스타일    | ThemeProvider, LightboxProvider     |
| `_pages`   | 라우트 하나에 대응하는 화면 조립   | 홈, 포스트 상세, 태그 허브          |
| `widgets`  | 여러 조각을 묶은 화면 한 덩어리    | Header, Footer, 목차, 포스트 목록   |
| `features` | 사용자가 하는 동작                 | 검색, 조회수, 테마 전환, 라이트박스 |
| `entities` | 도메인 개념과 그 데이터, 기본 표시 | 포스트, 태그, 시리즈                |
| `shared`   | 도메인을 모르는 것                 | Button, cn(), 토큰, 날짜 포맷       |

FSD 명세에는 `processes`도 있지만 폐기됐다. 쓰지 않는다.

## Next.js와 이름이 겹칠 때

FSD의 `app`과 `pages`는 Next.js의 특별 폴더와 이름이 같다. 밑줄을 붙여 `_app`과 `_pages`로 둔다. FSD 공식 문서가 안내하는 방식이다.

Next의 `src/app`에는 라우팅 파일만 두고 구현을 재노출한다.

```tsx
// src/app/posts/[slug]/page.tsx
export { PostDetailPage as default, generateMetadata } from "@/_pages/post-detail";
```

라우트 핸들러도 같다.

```tsx
// src/app/api/views/route.ts
export { getViews as GET, incrementViews as POST } from "@/_app/api-routes";
```

## 판단하는 법

**"누가 아는가"를 묻는다.** 포스트라는 개념을 아는가. 그러면 entities 위다. 아무것도 모르고 어디서나 쓰이는가. 그러면 shared다.

**동작인가 개념인가.** 검색은 사용자가 하는 동작이라 features다. 포스트는 개념이라 entities다. 검색 결과에 포스트 카드가 나오면 features가 entities를 참조하는 것이고, 방향이 맞다.

**한 덩어리인가 조각인가.** 포스트 카드 하나는 entities의 표시 조각이다. 카드를 모아 무한 스크롤과 뷰 토글을 붙인 목록은 widgets다.

**애매하면 아래에 둔다.** 올리는 것은 나중에 쉽고 내리는 것은 어렵다. 참조하는 쪽이 둘 이상 생기면 그때 올린다.

## 슬라이스와 세그먼트

레이어 안은 슬라이스로 나눈다. 슬라이스는 도메인 단위다. `entities/post`, `features/search`처럼 만든다.

`_app`과 `shared`는 슬라이스가 없다. 레이어이면서 슬라이스 하나라 안에서 서로 참조해도 된다.

슬라이스 안은 세그먼트 넷으로 나눈다.

| 세그먼트 | 무엇을 담는가                    |
| -------- | -------------------------------- |
| `ui`     | 컴포넌트                         |
| `model`  | 상태, 타입, 도메인 로직          |
| `api`    | 바깥과 주고받는 것               |
| `lib`    | 이 슬라이스 안에서만 쓰는 도우미 |

다른 이름을 만들지 않는다. 넷으로 안 나뉘면 슬라이스를 잘못 잡은 것이다.

## 참조 규칙

**아래로만 간다.** widgets는 features를 쓸 수 있고 features는 widgets를 쓸 수 없다.

**같은 레이어의 다른 슬라이스를 직접 쓰지 않는다.** `features/search`가 `features/views`를 가져다 쓰면 위반이다. 공통이 필요하면 아래로 내린다.

**슬라이스 밖으로는 `index.ts`만 노출한다.** 안쪽 파일을 직접 가져가지 않는다. 배럴에는 재노출만 두고 타입이나 상수를 정의하지 않는다.

## 이 프로젝트의 대응

현재 3계층에서 옮길 때의 대응이다.

| 지금                                                        | 갈 곳                             |
| ----------------------------------------------------------- | --------------------------------- |
| `features/posts`의 데이터 접근과 카드                       | `entities/post`                   |
| `features/tags`, `features/series`의 데이터와 칩            | `entities/tag`, `entities/series` |
| `features/search`, `views`, `theme`, `lightbox`, `comments` | `features/*` 그대로               |
| `PostList`, `Toc`, `Header`, `Footer`, `Sidebar`            | `widgets/*`                       |
| `src/app`의 페이지 구현                                     | `_pages/*`                        |
| `shared/*`                                                  | `shared/*` 그대로                 |

`features/posts`가 가장 크게 쪼개진다. 파일 31개가 entities와 features, widgets 셋으로 흩어진다.

## 위반을 찾는 법

import 문을 보고 방향을 확인한다. 아래 셋이 위반이다.

- 아래 레이어가 위 레이어를 가져온다
- 같은 레이어의 다른 슬라이스를 가져온다
- 슬라이스의 `index.ts`를 거치지 않고 안쪽을 가져온다

`eslint-plugin-boundaries`나 `no-restricted-imports`로 CI에서 막을 수 있다. 사람 눈보다 정확하다.

## 배치 결정을 낼 때

표로 낸다. 근거 칸을 비우지 않는다.

| 대상 | 레이어 | 슬라이스 | 세그먼트 | 근거 |
| ---- | ------ | -------- | -------- | ---- |

"둘 다 가능하다"로 끝내지 않는다. 하나를 고르고 이유를 댄다. 나중에 뒤집더라도 그때 이유를 대면 된다.
