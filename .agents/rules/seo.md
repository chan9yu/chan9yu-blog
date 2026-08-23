---
description: 메타데이터와 JSON-LD, RSS, OG 이미지를 코드에서 다룰 때 지키는 규약. 운영 절차는 docs/operations/SEO.md가 맡는다
---

# SEO 규약

코드를 고칠 때 지키는 규약이다. 서치 콘솔 같은 운영 절차는 `docs/operations/SEO.md`가 맡는다.

## 메타데이터

**모든 페이지의 metadata는 `src/shared/seo`의 `buildMetadata`로 만든다.** title과 description, canonical, OG, twitter 카드(summary_large_image)를 한 번에 만든다. Metadata 객체를 손으로 조립하지 않는다. image를 주지 않으면 `/og?title=` 이미지가 자동으로 붙는다.

루트 layout의 `rootMetadata`(`src/app/ui/RootLayout.tsx`)가 metadataBase와 title template(`%s | chan9yu`)을 댄다. 페이지는 상대 path만 적으면 canonical과 OG url이 절대 URL로 완성된다.

없는 slug는 `NOT_FOUND_METADATA`(noindex, nofollow)를 돌려준다. private 글은 `buildMetadata`의 noIndex 옵션으로 noindex 처리한다.

### 재노출 사슬을 끊지 않는다

페이지 구현은 `src/pages` 슬라이스에 있고 `app/`의 라우트 파일은 한 줄 재노출이다. metadata(또는 generateMetadata)는 세 곳을 전부 지나야 head에 실린다.

1. 슬라이스의 ui 파일이 `export const metadata` 또는 `generateMetadata`를 내보낸다
2. 슬라이스의 `index.ts` 배럴이 그것을 다시 내보낸다
3. `app/`의 라우트 파일이 배럴에서 다시 내보낸다

한 곳이라도 빠지면 그 페이지는 루트 기본 title로 배포된다. 타입 검사와 빌드는 그대로 통과한다. export가 세 곳을 지나는지는 `src/app/__tests__/metadata-reexport.test.ts`가 검사하므로 재노출 누락은 CI에서 잡힌다. 다만 이 테스트는 export 존재만 보므로, 페이지를 추가하거나 옮기면 dev 서버(포트 3100)나 빌드 산출물에서 해당 라우트를 실제로 렌더해 head의 title과 canonical, og:title이 그 페이지의 값인지 확인한다.

## JSON-LD 4종

배치는 이렇다. 빌더는 `src/shared/seo/json-ld.ts`에 있고 `JsonLdScript`로 렌더한다.

| @type          | 어디에                           | 빌더                   |
| -------------- | -------------------------------- | ---------------------- |
| WebSite        | 루트 layout이라 전 페이지        | buildWebSiteJsonLd     |
| BlogPosting    | 글 상세                          | buildBlogPostingJsonLd |
| BreadcrumbList | 글 상세와 태그 상세, 시리즈 상세 | buildBreadcrumbJsonLd  |
| Person         | About                            | buildPersonJsonLd      |

private 글은 BlogPosting과 BreadcrumbList를 생략한다. 라우트를 옮기거나 새로 만들 때 이 배치가 유지되는지 렌더 결과의 `script[type="application/ld+json"]`으로 확인한다.

## RSS

`src/app/api-routes/rss-feed.ts`의 `RSS_ITEM_LIMIT`이 50이다. 공개 글 최신 50편만 RSS 2.0 XML로 내보낸다. `app/rss/route.ts`는 `force-static`이고 응답에 `s-maxage=3600` 캐시를 건다. 편수를 문서에 적을 일이 있으면 이 상수를 다시 보고 적는다.

## /og 이미지

`app/og/route.ts`는 `force-dynamic`이고 **런타임은 Node.js다.** runtime 지정이 없는 데다 폰트를 `node:fs`의 readFileSync로 `src/shared/assets/fonts`에서 읽는다. edge 런타임으로 바꾸면 폰트 로딩이 깨진다.

- 폰트는 Pretendard Regular(400)와 Bold(700) 2종이다. `src/shared/config/fonts.ts`가 모듈 로드 시점에 읽는다
- 1200x630 이미지를 만들고 title은 80자, tag는 32자에서 자른다
- thumbnail 파라미터가 있으면 302로 원본에 넘긴다. 루트 상대 경로이거나 요청 호스트 또는 `siteMetadata.url` 호스트의 http(s) URL일 때만이다. 다른 호스트는 무시하고 기본 이미지를 그린다

## frontmatter 게이트

모든 빌드의 prebuild가 `scripts/validate-seo.mjs`를 돌린다. 위반이 하나라도 있으면 빌드가 멈춘다.

| 항목        | 기준                                                        |
| ----------- | ----------------------------------------------------------- |
| title       | 필수, 60자 이하                                             |
| description | 필수, 120자 이상 160자 이하                                 |
| slug        | 필수, 영문 소문자와 숫자, 하이픈만, 디렉토리명과 일치       |
| series 참조 | `contents/series/{이름}.md`가 있고 title과 description 필수 |

`pnpm build:strict`(배포 `build:vercel`과 같은 조건)는 여기에 `STRICT_FRONTMATTER=1`을 더한다. `getAllPosts`가 frontmatter 파싱에 실패한 글을 건너뛰지 않고 던져서 빌드를 멈춘다. 일반 빌드에서는 경고 로그를 남기고 건너뛴다.

기준 숫자를 바꾸려면 스크립트와 이 문서를 함께 고친다. 스크립트의 실패 메시지가 이 문서를 가리킨다.
