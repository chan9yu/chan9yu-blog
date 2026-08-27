# 기존 Next.js 프로젝트의 FSD 전환

> 원천: fsd.how의 점진 도입 가이드와 v2.0에서 v2.1로의 마이그레이션 가이드. 절차의 단계 구분과 순서는 공식 가이드를 따르고, Next.js 특화 단계는 이 스킬의 통합 문서에서 가져왔다.

## 원칙

- **각 단계가 끝날 때마다 빌드와 테스트가 통과해야 한다.** 전환 브랜치를 오래 살려 두면 본 개발과의 충돌이 쌓인다. 단계 단위로 머지한다.
- **규칙 위반을 허용하는 중간 상태를 두려워하지 않는다.** 공식 절차 자체가 "일단 배치하고 위반은 나중에 하나씩 해소"다. 다만 위반 목록을 도구로 관측 가능하게 유지한다.
- **구조 이동과 로직 변경을 한 커밋에 섞지 않는다.** 파일 이동 커밋은 이동만 담아야 리뷰와 되돌리기가 가능하다.

## 절차

### 0단계: 준비

1. 페이지(라우트) 목록을 도출한다. 페이지 하나가 `src/_pages/`의 슬라이스 하나가 된다.
2. `@/` alias가 `src/`를 가리키는지 확인한다(tsconfig `paths`).
3. Steiger를 설치하고 강제 없이 돌려 본다. 현재 구조가 FSD에서 얼마나 떨어져 있는지 위반 수로 파악한다.

```bash
npm i -D --save-exact steiger @feature-sliced/steiger-plugin
npx steiger src
```

### 1단계: 라우팅과 구현 분리

루트 `app/`(또는 `pages/`)을 라우팅 전용으로 얇게 만든다.

1. `src/_pages/{slice}/ui/`를 만들고 페이지 구현을 옮긴다.
2. 라우트 파일은 한 줄 re-export만 남긴다. `metadata`, `generateMetadata`, `generateStaticParams`도 슬라이스로 옮겨 함께 re-export한다.
3. 이름 충돌 규칙을 지킨다. FSD 레이어는 `_app`, `_pages`다. `src/pages`라는 경로를 만들면 빌드가 깨진다(상세는 `nextjs-integration.md`).

이 단계에서 페이지 구현 안의 import가 어수선해도 그대로 둔다. 페이지 단위로 진행할 수 있어 병행 개발과의 충돌이 가장 적은 단계다.

### 2단계: shared와 _app 정리

기술 역할 폴더를 FSD 자리로 옮긴다. 흔한 대응은 다음과 같다.

| 기존 폴더                        | FSD 자리                                                                   |
| -------------------------------- | -------------------------------------------------------------------------- |
| `components/ui/` (디자인 시스템) | `shared/ui/` (컴포넌트 단위 index)                                         |
| `components/` (도메인 컴포넌트)  | 쓰이는 페이지의 `_pages/{slice}/ui/`. 여러 페이지가 쓰면 3단계에서 widgets |
| `hooks/` (범용)                  | `shared/lib/`의 주제별 폴더 (예: `shared/lib/use-media-query/`)            |
| `hooks/` (도메인)                | 그 도메인을 소유한 슬라이스의 `model` 또는 `lib` 세그먼트                  |
| `utils/`, `helpers/`             | 주제별로 `shared/lib/`. 도메인 로직이면 해당 슬라이스의 `model`            |
| `lib/api/`, `services/`          | `shared/api/` (client, endpoints). 페이지 전용 요청은 그 슬라이스의 `api`  |
| `lib/db/`, DB 쿼리               | `shared/db/`                                                               |
| `store/` (전역)                  | `src/_app/store/`                                                          |
| `constants/`, `config/`          | `shared/config/`. 라우트 경로 상수는 `shared/routes/`                      |
| `types/` (백엔드 응답)           | `shared/api/`의 요청 함수 옆                                               |
| `types/` (도메인)                | 해당 슬라이스의 `model`. 배치 기준은 `core-concepts.md`의 타입 배치 표     |
| `styles/` (전역)                 | `src/_app/styles/`                                                         |
| `providers/`, `contexts/` (전역) | `src/_app/providers/`                                                      |
| `middleware.ts`                  | 루트에 유지. Next.js 16이면 `proxy.ts`로 codemod                           |

`components`, `hooks`, `utils`라는 이름 자체는 남기지 않는다. 목적이 드러나는 세그먼트 이름으로 바꾼다.

### 3단계: 남은 UI를 _pages와 widgets로 분배

- 헤더, 푸터처럼 모든 페이지에 나오는 블록: 단순하면 `shared/ui`, 아래 레이어 코드가 필요하면 `widgets`.
- 특정 페이지 전용 블록: 그 페이지 슬라이스 안으로.
- 이 단계까지 FSD 규칙 위반이 남아 있어도 된다. 배치를 먼저 끝낸다.

### 4단계: import 위반 해소와 하향 추출

Steiger 위반 목록을 보며 하나씩 정리한다.

- 크로스 임포트는 `antipatterns.md`의 전략 A부터 D로 푼다.
- 여러 페이지가 같은 로직을 중복해서 쓰고 있으면 그때 features나 entities로 내린다. 중복이 두 곳뿐이고 안정적이면 중복인 채로 둬도 된다. Pages-First가 기본값이다.
- 서버 전용 수출이 클라이언트 그래프로 새는 슬라이스는 `index.server.ts`를 분리한다.

### 5단계: 강제와 회귀 차단

- Steiger와 ESLint 경계 규칙을 CI에 붙인다(`tooling.md`).
- 위반이 아직 남아 있으면 아래의 점진 강제를 쓴다.

## 점진 강제 (위반 래칫)

한 번에 위반 0을 만들 수 없는 규모라면, 남은 위반 지점을 설정의 ignores나 규칙별 off 블록으로 명시해 두고 새 위반만 차단한다.

```ts
// steiger.config.ts
import { defineConfig } from "steiger";
import fsd from "@feature-sliced/steiger-plugin";

export default defineConfig([
	...fsd.configs.recommended,
	{
		// 전환 전 레거시. 줄어들기만 해야 하는 목록이다
		ignores: ["./src/widgets/legacy-dashboard/**"]
	}
]);
```

이 목록은 늘어나면 안 되고 줄어들기만 해야 한다. 항목을 지울 때마다 커밋해 두면 전환 진행이 이력으로 남는다.

## v2.0에서 v2.1로

이미 FSD v2.0인 프로젝트의 이동이다. breaking change가 없어 v2.0 프로젝트는 그대로 유효한 v2.1 프로젝트이고, 마이그레이션은 선택이다. 옮길 가치는 응집도에 있다.

1. Steiger를 돌린다. `insignificant-slice`가 한 페이지에서만 쓰이는 entity와 feature를 알려 준다. 그 페이지 슬라이스로 병합한다.
2. `excessive-slicing`이 경고하는 레이어는 슬라이스를 통합하거나 슬라이스 그룹으로 정리한다.
3. 임시방편으로 흩어져 있던 크로스 임포트를 `@x` 표기로 표준화한다(entities 한정).
4. processes 레이어가 남아 있으면 features나 app으로 옮긴다.
