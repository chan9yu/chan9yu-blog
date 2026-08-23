export const dynamic = "force-static";
export const dynamicParams = false;

export {
	generateBadgeRedirectParams as generateStaticParams,
	redirectToRecentPost as GET
} from "@/app/api-routes/badge-redirect";
