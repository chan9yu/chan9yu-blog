---
description: 메타데이터와 JSON-LD, sitemap, RSS, OG 이미지를 코드에서 다룰 때 지키는 규약. 운영 절차는 docs/operations/SEO.md가 맡는다
---

# SEO 규약

코드를 고칠 때 지키는 규약이다. 서치 콘솔 같은 운영 절차는 `docs/operations/SEO.md`가 맡는다.

## 메타데이터

**모든 페이지의 metadata는 `src/shared/seo`의 `buildMetadata`로 만든다.** title과 description, canonical, OG, twitter 카드(summary_large_image)를 한 번에 만든다. Metadata 객체를 손으로 조립하지 않는다. image를 주지 않으면 `/og?title=` 이미지가 자동으로 붙는다.

헬퍼는 호출부가 주지 않아도 세 가지를 항상 낸다. `openGraph.siteName`(`siteMetadata.name`)과 `openGraph.locale`(`siteMetadata.locale`), 그리고 `alternates.types`의 RSS 링크(`application/rss+xml`, `/rss`)다. 페이지에서 이 셋을 다시 적지 않는다. Next.js의 metadata 병합은 필드 단위 얕은 덮어쓰기라, 페이지가 `openGraph`나 `alternates`를 주는 순간 루트 layout의 값이 통째로 사라진다. 루트에만 두면 실제 페이지 어디에도 안 실린다.

og:image 치수는 기본 이미지일 때만 적는다. `image`를 주지 않아 `/og`가 그리는 경우에만 `width` 1200과 `height` 630을 붙이고, 호출부가 `image`를 넘기면 크기를 모르므로 url과 alt만 낸다. 썸네일 크기를 추측해서 채우지 않는다.

루트 layout의 `rootMetadata`(`src/app/ui/RootLayout.tsx`)가 metadataBase와 title template(`%s | chan9yu`)을 댄다. 페이지는 상대 path만 적으면 canonical과 OG url이 절대 URL로 완성된다.

루트만 내는 것이 셋 더 있다. 페이지에서 다시 적지 않는다.

- `robots.googleBot`의 `max-image-preview: large`와 `max-snippet: -1`, `max-video-preview: -1`
- `verification`. `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`과 `NEXT_PUBLIC_NAVER_SITE_VERIFICATION`을 `trim()`해서 읽고, 값이 비어 있으면 그 키를 객체에 넣지 않는다. 값이 없는 채로 키만 넘기지 않으려는 것이다
- `rootViewport`의 `themeColor`. metadata가 아니라 `viewport` export이므로 `app/layout.tsx`가 `export { rootViewport as viewport }`로 따로 재노출한다. 이 재노출이 빠지면 `theme-color` meta가 사라진다

없는 slug는 `NOT_FOUND_METADATA`를 돌려준다. noindex와 nofollow에 더해 `alternates.canonical`과 `openGraph`, `twitter`를 전부 `null`로 닫는다. 이 셋을 비워 두면 루트 layout의 값이 상속돼 404 페이지가 홈의 canonical과 OG를 그대로 달고 나간다.

private 글은 `buildMetadata`의 `noIndex` 옵션으로 noindex 처리한다. 색인은 막되 링크는 따라가게 하려면 `follow`를 함께 켠다. 글이 `TAG_INDEX_MIN_POSTS`(2) 미만인 태그 상세가 이 조합을 쓴다. 색인할 만큼 쌓이지 않은 페이지지만 거기 걸린 글 링크는 크롤러가 따라가야 한다.

### 재노출 사슬을 끊지 않는다

페이지 구현은 `src/pages` 슬라이스에 있고 `app/`의 라우트 파일은 한 줄 재노출이다. metadata(또는 generateMetadata)는 세 곳을 전부 지나야 head에 실린다.

1. 슬라이스의 ui 파일이 `export const metadata` 또는 `generateMetadata`를 내보낸다
2. 슬라이스의 `index.ts` 배럴이 그것을 다시 내보낸다
3. `app/`의 라우트 파일이 배럴에서 다시 내보낸다

한 곳이라도 빠지면 그 페이지는 루트 기본 title로 배포된다. 타입 검사와 빌드는 그대로 통과한다. export가 세 곳을 지나는지는 `src/app/__tests__/metadata-reexport.test.ts`가 검사하므로 재노출 누락은 CI에서 잡힌다. 다만 이 테스트는 export 존재만 보므로, 페이지를 추가하거나 옮기면 dev 서버(포트 3100)나 빌드 산출물에서 해당 라우트를 실제로 렌더해 head의 title과 canonical, og:title이 그 페이지의 값인지 확인한다.

**route segment config는 재노출하면 안 된다.** `dynamicParams` 같은 segment config는 Next.js가 라우트 파일 자체에서 정적으로 읽는 설정이다. 슬라이스에서 내보내고 배럴로 다시 내보냈더니 dev와 빌드가 "Next.js can't recognize the exported `dynamicParams` field in route. It mustn't be reexported" 오류로 거부했고 해당 라우트 셋이 전부 500이 났다(2026-08-26). metadata와 반대로 `app/`의 라우트 파일에 직접 적어야 한다.

```ts
// app/posts/[slug]/page.tsx
export const dynamicParams = false;

export { PostDetailPage as default, generateMetadata, generateStaticParams } from "@/pages/post";
```

지금 이 선언이 걸린 라우트는 다섯이다. 페이지 셋(`app/posts/[slug]`, `app/tags/[tag]`, `app/series/[slug]`)과 뱃지 라우트 둘(`app/badge/recent/[index]`, `app/badge/recent/[index]/[theme]`)이다. 전부 `generateStaticParams`가 낸 목록 밖의 파라미터를 정적 404로 돌려보내 런타임에 `contents/`를 읽을 자리를 없앤다. 글 상세의 `generateStaticParams`는 private 글까지 포함해 프리렌더한다. 빼면 private 글의 직접 URL 200 동작(SPEC의 경계 조건)이 404로 바뀐다. 페이지 셋의 선언이 빠졌는지는 `src/app/__tests__/metadata-reexport.test.ts`의 "동적 라우트의 dynamicParams"가 검사한다.

## JSON-LD 4종

배치는 이렇다. 빌더는 `src/shared/seo/json-ld.ts`에 있고 `JsonLdScript`로 렌더한다.

| @type          | 어디에                           | 빌더                   |
| -------------- | -------------------------------- | ---------------------- |
| WebSite        | 루트 layout이라 전 페이지        | buildWebSiteJsonLd     |
| BlogPosting    | 글 상세                          | buildBlogPostingJsonLd |
| BreadcrumbList | 글 상세와 태그 상세, 시리즈 상세 | buildBreadcrumbJsonLd  |
| Person         | About                            | buildPersonJsonLd      |

private 글은 BlogPosting과 BreadcrumbList를 생략한다. 라우트를 옮기거나 새로 만들 때 이 배치가 유지되는지 렌더 결과의 `script[type="application/ld+json"]`으로 확인한다.

BlogPosting의 author와 About의 Person은 같은 `@id`(`{siteUrl}/about#person`)로 이어져 하나의 저자 개체로 읽힌다. BreadcrumbList의 첫 항목 이름은 `siteMetadata.name`이다. 네이버가 "top"과 "홈" 같은 일반 단어를 쓰지 말라고 명시해서다.

### 넣지 않는 것

아래는 넣으면 손해이거나 이미 노출이 끊긴 것이다. 새로 만들지 않는다.

| 무엇                                         | 왜 넣지 않는가                                                      |
| -------------------------------------------- | ------------------------------------------------------------------- |
| WebSite의 `potentialAction`과 `SearchAction` | 구글이 2024-11-21에 사이트링크 검색창 노출을 전 세계에서 없앴다     |
| FAQPage                                      | 2026-05-07부터 구글 검색에 나오지 않고 2026-06-12에 문서도 내려갔다 |
| HowTo                                        | 데스크톱까지 노출이 끊겨 폐기됐다                                   |
| `llms.txt`                                   | 구글이 검색에서 쓰지 않는다고 명시했다. 순위와 무관하다             |

판단 근거는 2026-08-26 조사 기록에 있다. 이 넷을 다시 검토하려면 그때 근거가 뒤집혔는지부터 확인한다.

## sitemap

`src/app/api-routes/sitemap-entries.ts`가 낸다. 정적 페이지 다섯과 공개 글 전부, 시리즈 전부, 글이 `TAG_INDEX_MIN_POSTS`(2) 이상인 태그가 들어간다.

**`changefreq`와 `priority`를 넣지 않는다.** 구글과 빙이 둘 다 무시한다고 문서에 적었다. 넣으면 XML만 커진다.

**`lastmod`는 글에서 계산한다.** 글 상세는 그 글의 `updated ?? date`이고, 시리즈와 태그는 묶인 글들 중 가장 최근 값이며, 홈과 `/posts`, `/series`, `/tags`는 전체 공개 글의 가장 최근 값이다. `new Date()`로 빌드 시각을 넣지 않는다. 모든 URL이 배포마다 갱신된 것처럼 보이면 구글이 값 자체를 신뢰하지 않는다.

**계산할 값이 없으면 `lastmod`를 생략한다.** `/about`이 그렇다. 글에서 유도되지 않는 페이지에 그럴듯한 날짜를 채우지 않는다.

글이 한 편뿐인 태그는 sitemap에서 빠지고 상세 페이지는 noindex에 follow로 남는다. 기준값을 바꾸려면 `src/entities/tag/model/tag.ts`의 `TAG_INDEX_MIN_POSTS` 하나만 고친다. sitemap과 태그 상세가 같은 상수를 본다.

## RSS

`src/app/api-routes/rss-feed.ts`의 `RSS_ITEM_LIMIT`이 50이다. 공개 글 최신 50편만 RSS 2.0 XML로 내보낸다. `app/rss/route.ts`는 `force-static`이고 응답에 `s-maxage=3600` 캐시를 건다. 편수를 문서에 적을 일이 있으면 이 상수를 다시 보고 적는다.

저자는 `dc:creator`에 이름만 적는다. RSS 2.0의 `<author>`는 이메일 주소를 요구하는 필드라 그대로 쓰면 피드에 이메일이 공개된다. `dc` 네임스페이스는 채널 여는 태그에 이미 선언돼 있다.

`lastBuildDate`는 실어 보낸 글들의 `updated ?? date` 중 가장 최근 값이다. 새 글이 없으면 값도 그대로여야 하므로 응답 시각을 넣지 않는다.

## /og 이미지

`app/og/route.ts`는 `force-dynamic`이고 **런타임은 Node.js다.** runtime 지정이 없는 데다 폰트를 `node:fs`의 readFileSync로 `src/shared/assets/fonts`에서 읽는다. edge 런타임으로 바꾸면 폰트 로딩이 깨진다.

- 폰트는 Pretendard Regular(400)와 Bold(700) 2종이다. `src/shared/config/fonts.ts`가 모듈 로드 시점에 읽는다
- 1200x630 이미지를 만들고 title은 80자, tag는 32자에서 자른다
- thumbnail 파라미터가 있으면 302로 원본에 넘긴다. 루트 상대 경로이거나 요청 호스트 또는 `siteMetadata.url` 호스트의 http(s) URL일 때만이다. 다른 호스트는 무시하고 기본 이미지를 그린다
- 응답에 `public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800`을 건다. 302로 넘기는 경우도 같은 헤더를 쓴다. `force-dynamic`이라 CDN이 캐시하지 않으면 SNS 크롤러가 올 때마다 Satori가 새로 그린다

## frontmatter 게이트

모든 빌드의 prebuild가 `scripts/validate-seo.mjs`를 돌린다. 위반이 하나라도 있으면 빌드가 멈춘다.

| 항목        | 기준                                                        |
| ----------- | ----------------------------------------------------------- |
| title       | 필수, 60자 이하                                             |
| description | 필수, 120자 이상 160자 이하                                 |
| slug        | 필수, 영문 소문자와 숫자, 하이픈만, 디렉토리명과 일치       |
| series 참조 | `contents/series/{이름}.md`가 있고 title과 description 필수 |

`pnpm build:strict`(배포 `build:vercel`과 같은 조건)는 여기에 `STRICT_FRONTMATTER=1`을 더한다. `getAllPosts`가 frontmatter 파싱에 실패한 글을 건너뛰지 않고 던져서 빌드를 멈춘다. 일반 빌드에서는 경고 로그를 남기고 건너뛴다.

기준 숫자를 바꾸려면 스크립트와 이 문서에 더해 `CONTRIBUTING.md`의 frontmatter 예시와 `docs/operations/SEO.md`의 코드가 이미 하는 것 절까지 함께 고친다. 스크립트의 실패 메시지가 이 문서를 가리킨다.

title 60자는 frontmatter 기준이고 렌더된 `<title>`에는 ` | chan9yu` 10자가 더 붙는다. 접미사를 포함하면 60자를 넘는 글이 이미 있어(2026-08-26 기준 6편) 기준을 조이려면 그 글들의 제목 수정이 먼저다.
